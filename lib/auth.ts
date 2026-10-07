import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { genericOAuth } from "better-auth/plugins"
import { prisma } from "@/lib/prisma"

function cleanEnv(val?: string): string {
  if (!val) return ""
  return val.replace(/^["']|["']$/g, "").trim()
}

const rawTrustedOrigins = cleanEnv(process.env.BETTER_AUTH_TRUSTED_ORIGINS)
const configuredTrustedOrigins = rawTrustedOrigins
  .split(",")
  .map((o) => cleanEnv(o))
  .filter(Boolean)

const baseUrl = cleanEnv(process.env.BETTER_AUTH_URL) || "http://localhost:3000"

const defaultTrustedOrigins = [
  baseUrl,
  "http://localhost:3000",
  "http://localhost:80",
  "http://localhost",
  "http://127.0.0.1:3000",
  "http://127.0.0.1",
]

const trustedOrigins = Array.from(new Set([...defaultTrustedOrigins, ...configuredTrustedOrigins]))

// Configure optional OIDC / Generic OAuth plugin
const plugins = []

const oidcEnabled = cleanEnv(process.env.OIDC_ENABLED) === "true"
const oidcClientId = cleanEnv(process.env.OIDC_CLIENT_ID)

if (oidcEnabled || oidcClientId) {
  const providerId = cleanEnv(process.env.OIDC_PROVIDER_ID) || "oidc"
  const discoveryUrl = cleanEnv(process.env.OIDC_DISCOVERY_URL)
  const authorizationUrl = cleanEnv(process.env.OIDC_AUTHORIZATION_URL)
  const tokenUrl = cleanEnv(process.env.OIDC_TOKEN_URL)
  const userInfoUrl = cleanEnv(process.env.OIDC_USER_INFO_URL)
  const issuer = cleanEnv(process.env.OIDC_ISSUER)
  const scopes = (cleanEnv(process.env.OIDC_SCOPES) || "openid,profile,email")
    .split(",")
    .map((s) => cleanEnv(s))
    .filter(Boolean)

  plugins.push(
    genericOAuth({
      config: [
        {
          providerId,
          name: cleanEnv(process.env.OIDC_PROVIDER_NAME) || "OIDC / SSO",
          clientId: oidcClientId,
          clientSecret: cleanEnv(process.env.OIDC_CLIENT_SECRET),
          ...(discoveryUrl ? { discoveryUrl } : {}),
          ...(authorizationUrl ? { authorizationUrl } : {}),
          ...(tokenUrl ? { tokenUrl } : {}),
          ...(userInfoUrl ? { userInfoUrl } : {}),
          ...(issuer ? { issuer } : {}),
          redirectURI: `${baseUrl}/api/auth/callback/${providerId}`,
          scopes,
          pkce: true,
        },
      ],
    })
  )
}

export const auth = betterAuth({
  secret: cleanEnv(process.env.BETTER_AUTH_SECRET) || "super-secret-key-change-in-production-1234567890",
  baseURL: baseUrl,
  trustedOrigins,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins,
})
