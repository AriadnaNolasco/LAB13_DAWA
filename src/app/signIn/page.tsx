'use client'

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useState } from 'react';
import Link from 'next/link'; // Asegúrate de importar Link

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

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
        // Fondo oscuro y centrado como en la Imagen 2
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            {/* Contenedor de la tarjeta de login - bg-gray-800 y bordes redondeados como en la Imagen 2 */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-96">
                <h1 className="text-3xl font-bold mb-8 text-center">
                    Sign In
                </h1>
                {error && <div className="p-3 mb-4 text-sm text-red-300 bg-red-800 rounded-lg">{error}</div>}

                {/* Botones de Proveedores Sociales - Primero como en la Imagen 2 */}
                <div className="space-y-3 mb-6">
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full bg-white text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-3 text-lg font-semibold"
                    >
                        <FaGoogle className="text-xl" />
                        Sign in with Google
                    </button>
                    <button
                        onClick={handleGithubSignIn}
                        className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-3 text-lg font-semibold"
                    >
                        <FaGithub className="text-xl" />
                        Sign in with GitHub
                    </button>
                </div>

                {/* Separador "or" */}
                <div className="text-center text-gray-500 mb-6 font-semibold uppercase">
                    or
                </div>

                {/* Formulario de Credenciales - Ajustado para coincidir con la Imagen 2 */}
                <form onSubmit={handleCredentialsSignIn} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg mt-6"
                    >
                        Login
                    </button>
                </form>
            </div>

            {/* Enlace de Registro - Mantenemos el estilo de la Imagen 1 pero con colores oscuros */}
            <p className="absolute bottom-8 text-sm text-gray-400 text-center">
                ¿No tienes una cuenta?{' '}
                <Link href="/signUp" className="text-blue-400 hover:underline font-semibold">
                    Regístrate
                </Link>
            </p>
        </div>
    );
}