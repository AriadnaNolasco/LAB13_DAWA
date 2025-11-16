import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

// ----------------------------------------------------
// Opciones de Autenticación
// ----------------------------------------------------
// Tipamos el objeto authOptions con AuthOptions
export const authOptions: AuthOptions = {
    // 1. Adaptador de Prisma para sesiones y OAuth
    adapter: PrismaAdapter(prisma),

    // 2. Estrategia JWT (Ahora tipado correctamente)
    session: {
        strategy: "jwt",
    },

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // 1. Buscar usuario en la base de datos
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error("Invalid email or password.");
                }

                // 2. Bloqueo por intentos fallidos (Bloquear por 5 minutos)
                const FIVE_MINUTES = 5 * 60 * 1000;
                // Nota: lockedUntil es DateTime, por eso usamos .getTime()
                if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
                    throw new Error("Cuenta bloqueada por demasiados intentos. Intente más tarde.");
                }

                // 3. Comparar contraseña con bcrypt
                const isMatch = await bcrypt.compare(credentials.password, user.password);

                if (isMatch) {
                    // Éxito: Resetear intentos
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { attempts: 0, lockedUntil: null },
                    });

                    // Retornar el objeto de usuario (ajustado para ser compatible con NextAuth)
                    return { id: user.id, name: user.name, email: user.email };
                } else {
                    // Fracaso: Incrementar intentos y bloquear
                    const MAX_ATTEMPTS = 3;
                    const nextAttempts = user.attempts + 1;

                    if (nextAttempts >= MAX_ATTEMPTS) {
                        await prisma.user.update({
                            where: { id: user.id },
                            data: {
                                attempts: nextAttempts,
                                lockedUntil: new Date(Date.now() + FIVE_MINUTES)
                            },
                        });
                        throw new Error("Invalid email or password. Your account has been temporarily locked.");
                    } else {
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { attempts: nextAttempts },
                        });
                        throw new Error("Invalid email or password.");
                    }
                }
            },
        }),
    ],
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }