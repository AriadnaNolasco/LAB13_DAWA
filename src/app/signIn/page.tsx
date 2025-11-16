"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.error) {
      if (res.error === "account_blocked") {
        setError("Cuenta bloqueada temporalmente por intentos fallidos. Intenta más tarde.");
      } else {
        setError("Credenciales inválidas.");
      }
    } else {
      // redirect to dashboard
      window.location.href = "/dashboard";
    }
  }

  return (
    <main>
      <h1>Sign in</h1>
      <form onSubmit={submit}>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit">Sign in</button>
      </form>

      <button onClick={()=>signIn("google")}>Sign in with Google</button>
      <button onClick={()=>signIn("github")}>Sign in with GitHub</button>

      {error && <p style={{color:"red"}}>{error}</p>}
    </main>
  );
}
