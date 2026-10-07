import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

function cleanEnv(val?: string): string {
  if (!val) return ""
  return val.replace(/^["']|["']$/g, "").trim()
}

export async function GET() {
  const oidcEnabled = cleanEnv(process.env.OIDC_ENABLED) || cleanEnv(process.env.NEXT_PUBLIC_OIDC_ENABLED)
  const oidcClientId = cleanEnv(process.env.OIDC_CLIENT_ID)

  const enabled = oidcEnabled === "true" || Boolean(oidcClientId)

  const providerName =
    cleanEnv(process.env.OIDC_PROVIDER_NAME) ||
    cleanEnv(process.env.NEXT_PUBLIC_OIDC_PROVIDER_NAME) ||
    "OIDC / SSO"

  const providerId =
    cleanEnv(process.env.OIDC_PROVIDER_ID) ||
    cleanEnv(process.env.NEXT_PUBLIC_OIDC_PROVIDER_ID) ||
    "oidc"

  return NextResponse.json(
    {
      enabled,
      providerName,
      providerId,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    }
  )
}
