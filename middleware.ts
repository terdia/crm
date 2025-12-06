import { auth } from '@/auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnLoginPage = req.nextUrl.pathname.startsWith('/login')
  const isOnRegisterPage = req.nextUrl.pathname.startsWith('/register')
  const isOnApiAuth = req.nextUrl.pathname.startsWith('/api/auth')

  // Allow auth API routes
  if (isOnApiAuth) {
    return
  }

  // Redirect logged-in users away from login/register pages
  if (isLoggedIn && (isOnLoginPage || isOnRegisterPage)) {
    return Response.redirect(new URL('/', req.nextUrl))
  }

  // Redirect non-logged-in users to login
  if (!isLoggedIn && !isOnLoginPage && !isOnRegisterPage) {
    return Response.redirect(new URL('/login', req.nextUrl))
  }
})

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
