import { withAuth, NextRequestWithAuth } from "next-auth/middleware"; // <-- Importar NextRequestWithAuth
import { NextResponse } from "next/server";

// Nota: Next.js espera que la exportación por defecto sea una función de middleware.

// Función de middleware que se ejecuta si el usuario está autorizado.
// 1. Tipamos explícitamente 'req' como NextRequestWithAuth
function middleware(req: NextRequestWithAuth) { 
    
    // Si no se necesita lógica de redirección, devolvemos explícitamente NextResponse.next()
    // Si llegamos a este punto, el usuario ya está autenticado.
    return NextResponse.next();
}

// 1. Exportamos withAuth, pasando la función (middleware) y las opciones (callbacks).
export default withAuth(
  middleware,
  {
    // Opciones de configuración para withAuth
    callbacks: {
      // Si hay token (está logueado), devuelve true para permitir el acceso.
      authorized: ({ token }) => !!token,
    },
    // El 'matcher' se define abajo en el 'config' exportado por Next.js.
  }
);

// 2. Exportamos 'config' separadamente para que Next.js compile y aplique el middleware a estas rutas.
export const config = {
    matcher: ["/dashboard", "/profile"],
};