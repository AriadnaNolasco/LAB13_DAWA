"use client";
import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg("Registro exitoso. Ahora inicia sesión.");
    } else {
      setMsg(data.error || "Error en el registro.");
    }
  }

  return (
    <main>
      <h1>Sign up</h1>
      <form onSubmit={submit}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
      {msg && <p>{msg}</p>}
    </main>
  );
}
