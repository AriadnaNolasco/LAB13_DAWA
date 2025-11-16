import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";

interface MockUser {
    id: string;
    name: string;
    email: string;
    password: string; 
    attempts: number;
    lockedUntil: number | null; // Corregido el tipo
}

const users: MockUser[] = [
  {
    id: "1",
    name: "User Test",
    email: "test@example.com",
    password: bcrypt.hashSync("password123", 10), // Contraseña cifrada con bcrypt
    attempts: 0,
    lockedUntil: null,
  },
  // Aquí se podrían agregar más usuarios
];


export const authOptions = {
    // Configure one on mone authentication providens
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
                // Lógica de autenticación:
                const user = users.find(u => u.email === credentials?.email);

                if (!user) {
                    return null;
                }

                // Bloqueo por intentos fallidos
                if (user.lockedUntil && user.lockedUntil > Date.now()) {
                    throw new Error("Cuenta bloqueada por intentos fallidos.");
                }

                const isMatch = await bcrypt.compare(credentials!.password, user.password);

                if (isMatch) {
                    // Éxito: Resetear intentos fallidos
                    user.attempts = 0;
                    user.lockedUntil = null;
                    // Retornar el objeto de usuario (sin la contraseña)
                    return { id: user.id, name: user.name, email: user.email };
                } else {
                    // Fracaso: Incrementar intentos y bloquear si es necesario
                    user.attempts += 1;
                    const MAX_ATTEMPTS = 3;
                    if (user.attempts >= MAX_ATTEMPTS) {
                        user.lockedUntil = Date.now() + 60 * 1000; // Bloquear por 60 segundos
                    }
                    throw new Error("Invalid email or password.");
                }
            },
        }),
    ],
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }