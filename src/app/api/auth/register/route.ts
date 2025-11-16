// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { hashPassword } from "../../../../../lib/auth";
import { createUser, findUserByEmail } from "../../../../../lib/users";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "user_exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    await createUser({ email, name, passwordHash });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
