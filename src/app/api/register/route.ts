import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // 1. Validación de campos
    if (!email || !password || !name) {
      return new NextResponse("Faltan campos requeridos", { status: 400 });
    }

    // 2. Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("El usuario con este correo ya existe", { status: 409 });
    }

    // 3. Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Crear el nuevo usuario en la base de datos
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Al registrar, podemos asumir que el email está verificado o usar un proceso de verificación
        emailVerified: new Date(), 
        attempts: 0,
      },
      select: {
          id: true,
          name: true,
          email: true,
      }
    });

    return NextResponse.json(newUser, { status: 201 });
    
  } catch (error) {
    console.error("Error en el registro:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}