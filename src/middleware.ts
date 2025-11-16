import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Nota: Next.js espera que la exportación por defecto sea una función de middleware.

// Función de middleware que se ejecuta si el usuario está autorizado.
// TIPADO: Definimos que devuelve explícitamente un NextResponse.
function middleware(req: NextRequestWithAuth): NextResponse { 
    
    // Si no se necesita lógica de redirección, devolvemos explícitamente NextResponse.next()
    // Esto satisface el chequeo de sobrecarga de TypeScript.
    return NextResponse.next();
}

// 1. Exportamos withAuth, pasando la función (middleware) y las opciones (callbacks).
// Nota: La función 'middleware' es el primer argumento, las opciones son el segundo.
export default withAuth(
  middleware,
  {
    // Opciones de configuración para withAuth
    callbacks: {
      // Si hay token (está logueado), devuelve true para permitir el acceso.
      authorized: ({ token }) => !!token,
    },
    // El 'matcher' se define separadamente.
  }
);

// 2. Exportamos 'config' separadamente (sin cambios, ya es correcto para la compilación).
export const config = {
    matcher: ["/dashboard", "/profile"],
};