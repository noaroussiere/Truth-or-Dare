import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { genericOAuth } from "better-auth/plugins"
import { prisma } from "@/lib/prisma"

// Collect trusted origins to prevent "Invalid origin" errors
const configuredTrustedOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean)

const defaultTrustedOrigins = [
  process.env.BETTER_AUTH_URL || "http://localhost:3000",
  "http://localhost:3000",
  "http://localhost:80",
  "http://localhost",
  "http://127.0.0.1:3000",
  "http://127.0.0.1",
]

const trustedOrigins = Array.from(new Set([...defaultTrustedOrigins, ...configuredTrustedOrigins]))

// Configure optional OIDC / Generic OAuth plugin
const plugins = []

if (process.env.OIDC_ENABLED === "true" || process.env.OIDC_CLIENT_ID) {
  const providerId = process.env.OIDC_PROVIDER_ID || "oidc"
  const discoveryUrl = process.env.OIDC_DISCOVERY_URL
  const authorizationUrl = process.env.OIDC_AUTHORIZATION_URL
  const tokenUrl = process.env.OIDC_TOKEN_URL
  const userInfoUrl = process.env.OIDC_USER_INFO_URL
  const scopes = (process.env.OIDC_SCOPES || "openid,profile,email")
    .split(",")
    .map((s) => s.trim())

  plugins.push(
    genericOAuth({
      config: [
        {
          providerId,
          name: process.env.OIDC_PROVIDER_NAME || "OIDC / SSO",
          clientId: process.env.OIDC_CLIENT_ID || "",
          clientSecret: process.env.OIDC_CLIENT_SECRET || "",
          ...(discoveryUrl ? { discoveryUrl } : {}),
          ...(authorizationUrl ? { authorizationUrl } : {}),
          ...(tokenUrl ? { tokenUrl } : {}),
          ...(userInfoUrl ? { userInfoUrl } : {}),
          ...(process.env.OIDC_ISSUER ? { issuer: process.env.OIDC_ISSUER } : {}),
          redirectURI: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/callback/${providerId}`,
          scopes,
          pkce: true,
        },
      ],
    })
  )
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "super-secret-key-change-in-production-1234567890",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins,
})
