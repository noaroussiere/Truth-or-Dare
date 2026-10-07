import { NextResponse } from "next/server"

export async function GET() {
  const enabled =
    process.env.OIDC_ENABLED === "true" ||
    process.env.NEXT_PUBLIC_OIDC_ENABLED === "true" ||
    Boolean(process.env.OIDC_CLIENT_ID)

  const providerName =
    process.env.OIDC_PROVIDER_NAME ||
    process.env.NEXT_PUBLIC_OIDC_PROVIDER_NAME ||
    "OIDC / SSO"

  const providerId =
    process.env.OIDC_PROVIDER_ID ||
    process.env.NEXT_PUBLIC_OIDC_PROVIDER_ID ||
    "oidc"

  return NextResponse.json({
    enabled,
    providerName,
    providerId,
  })
}
