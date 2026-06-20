import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const pathname = req.nextUrl.pathname

  const publicPaths = ["/", "/login"]

  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  if (!token) {
    const url = new URL("/login", req.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  const role = token.role

  // ADMIN puede entrar a todo
  if (role === "ADMIN") {
    return NextResponse.next()
  }

  // COMPANY_ADMIN puede entrar a su zona de dashboard
  if (role === "COMPANY_ADMIN") {
    const allowedCompanyAdminPaths = [
      "/dashboard/company",
      "/dashboard/employees",
      "/dashboard/employee",
      "/dashboard/departments",
      "/dashboard/vacations",
      "/dashboard/activity",
      "/dashboard/incidents",
    ]

    const isAllowed = allowedCompanyAdminPaths.some((path) =>
      pathname.startsWith(path)
    )

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/dashboard/company", req.url))
    }

    return NextResponse.next()
  }

  // USER solo puede entrar a /dashboard
  if (role === "USER") {
    const allowedUserPaths = ["/dashboard"]

    const isAllowed = allowedUserPaths.some((path) => pathname === path)

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  }

  return NextResponse.redirect(new URL("/login", req.url))
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}