import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { genericOAuth, admin } from "better-auth/plugins"
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
const plugins: any[] = [admin()]

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
          overrideUserInfo: true,
          mapProfileToUser: async (profile: any) => {
            const rawGroups: string[] = Array.isArray(profile?.groups)
              ? profile.groups
              : typeof profile?.groups === "string"
              ? [profile.groups]
              : []

            const configuredAdminGroups = (
              cleanEnv(process.env.OIDC_ADMIN_GROUPS) ||
              "Truthordare admins,truthordare admin,authentik Admins,Grafana Admins"
            )
              .split(",")
              .map((g) => cleanEnv(g))
              .filter(Boolean)

            const adminEmails = (cleanEnv(process.env.ADMIN_EMAILS) || "")
              .split(",")
              .map((e) => cleanEnv(e).toLowerCase())
              .filter(Boolean)

            const userEmail = (profile?.email || "").toLowerCase()

            const isGroupAdmin = rawGroups.some((g) =>
              configuredAdminGroups.some((cg) => cg.toLowerCase() === String(g).toLowerCase())
            )
            const isEmailAdmin = adminEmails.includes(userEmail)

            const isAdmin = isGroupAdmin || isEmailAdmin

            return {
              role: isAdmin ? "admin" : "user",
            }
          },
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
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const adminEmails = (cleanEnv(process.env.ADMIN_EMAILS) || "")
            .split(",")
            .map((e) => cleanEnv(e).toLowerCase())
            .filter(Boolean)

          if (adminEmails.includes((user.email || "").toLowerCase())) {
            return {
              data: {
                ...user,
                role: "admin",
              },
            }
          }
        },
      },
    },
  },
  plugins,
})
