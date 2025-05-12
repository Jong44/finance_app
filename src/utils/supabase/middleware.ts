import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // Create a response object that we can modify
    let supabaseResponse = NextResponse.next({
        request: {
        headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
        cookies: {
            getAll() {
            return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => {
                    // Directly set cookies on the response object
                    supabaseResponse.cookies.set(name, value, options);
                });
                // Return the modified response
                return;
            },
            // get(name) {
            //     return request.cookies.get(name)?.value
            // },
            // set(name, value, options) {
            // // This is needed for production deployments
            //     supabaseResponse.cookies.set({
            //         name,
            //         value,
            //         ...options,
            //     })
            // },
            // remove(name, options) {
            //     supabaseResponse.cookies.set({
            //         name,
            //         value: '',
            //         ...options,
            //     })
            // },
        },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected routes pattern
    const protectedRoutes = [
        '/dashboard',
        '/invoice',
        '/api/invoices',
        '/expense',
        '/api/expenses',
    ]

    // Check if the current path matches any protected route
    const isProtectedRoute = protectedRoutes.some(route => 
        request.nextUrl.pathname.startsWith(route)
    )

    // If accessing a protected route without authentication, redirect to login
    if (isProtectedRoute && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}