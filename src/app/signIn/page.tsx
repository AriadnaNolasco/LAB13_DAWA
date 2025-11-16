'use client'

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Función de utilería para manejar la redirección exitosa
    const onSignInSuccess = (result: any) => {
        if (result?.ok && !result?.error) {
            router.push('/dashboard');
        }
    }

    const handleGoogleSignIn = async () => {
        const result = await signIn('google', {
            callbackUrl: '/dashboard',
            redirect: false
        });

        if (result?.ok) {
            router.push('/dashboard');
        }
    };

    const handleGithubSignIn = async () => {
        const result = await signIn('github', {
            callbackUrl: '/dashboard',
            redirect: false
        });
        if (result?.ok) {
            router.push('/dashboard');
        }
    };

    // Manejar inicio de sesión con Credenciales
    const handleCredentialsSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError(result.error);
        } else {
            onSignInSuccess(result);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">
                    Sign In
                </h1>
                {error && <div className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

                {/* Formulario de Credenciales */}
                <form onSubmit={handleCredentialsSignIn} className="space-y-4 mb-6">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    >
                        Login
                    </button>
                </form>

                <div className="text-center mb-4">-- OR --</div>

                {/* Botones de Proveedores Sociales */}
                <div className="space-y-3">
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-red-600 transition flex items-center justify-center gap-2"
                    >
                        <FaGoogle />
                        Continue with Google
                    </button>
                    <button
                        onClick={handleGithubSignIn} // Nuevo botón para GitHub
                        className="w-full bg-gray-700 text-white py-2 px-4 rounded hover:bg-black transition flex items-center justify-center gap-2"
                    >
                        <FaGithub />
                        Continue with GitHub
                    </button>
                </div>
            </div>
            <p className="mt-4 text-sm text-center">
                ¿No tienes una cuenta?{' '}
                <Link href="/signUp" className="text-blue-500 hover:underline font-semibold">
                    Regístrate
                </Link>
            </p>
        </div>
    );
}