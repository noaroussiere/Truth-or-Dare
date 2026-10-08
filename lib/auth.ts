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
          getUserInfo: async (tokens: any) => {
            let idTokenClaims: any = {}
            if (tokens?.idToken) {
              try {
                const parts = tokens.idToken.split(".")
                if (parts.length >= 2) {
                  const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
                  const jsonStr = Buffer.from(base64, "base64").toString("utf-8")
                  idTokenClaims = JSON.parse(jsonStr)
                }
              } catch (e) {
                console.error("[OIDC SSO LOG] Error decoding ID Token in getUserInfo:", e)
              }
            }

            let userInfo: any = {}
            if (userInfoUrl && tokens?.accessToken) {
              try {
                const res = await fetch(userInfoUrl, {
                  headers: {
                    Authorization: `Bearer ${tokens.accessToken}`,
                  },
                })
                if (res.ok) {
                  userInfo = await res.json()
                }
              } catch (e) {
                console.error("[OIDC SSO LOG] Error fetching userInfoUrl:", e)
              }
            }

            const rawGroups =
              idTokenClaims.groups ||
              userInfo.groups ||
              idTokenClaims["http://schemas.xmlsoap.org/claims/Group"] ||
              userInfo["http://schemas.xmlsoap.org/claims/Group"] ||
              []

            const extractedGroups = Array.isArray(rawGroups) ? rawGroups : typeof rawGroups === "string" ? [rawGroups] : []

            console.log("[OIDC SSO LOG] --- Incoming SSO Login ---")
            console.log("[OIDC SSO LOG] ID Token Claims:", idTokenClaims)
            console.log("[OIDC SSO LOG] UserInfo Response:", userInfo)
            console.log("[OIDC SSO LOG] Extracted Groups:", extractedGroups)

            return {
              ...userInfo,
              ...idTokenClaims,
              groups: extractedGroups,
            }
          },
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

            console.log("[OIDC SSO LOG] Email:", userEmail)
            console.log("[OIDC SSO LOG] Configured Admin Groups:", configuredAdminGroups)
            console.log("[OIDC SSO LOG] Is Group Admin?:", isGroupAdmin)
            console.log("[OIDC SSO LOG] Assigned Role:", isAdmin ? "admin" : "user")

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
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
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
