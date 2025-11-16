'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUserPlus } from 'react-icons/fa';

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // El error de la API (409 o 400)
                setError(data.message || 'Error al registrar el usuario.');
            } else {
                alert('Registro exitoso. Inicie sesión.');
                router.push('/signIn');
            }
        } catch (err) {
            setError('Ocurrió un error de red o de servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">
                    Crear Cuenta
                </h1>

                {error && <div className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <input
                        type="text"
                        placeholder="Nombre Completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                        <FaUserPlus />
                        {loading ? 'Registrando...' : 'Registrar'}
                    </button>
                </form>
                
                <p className="text-sm text-center">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/signIn" className="text-blue-500 hover:underline">
                        Inicia Sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}