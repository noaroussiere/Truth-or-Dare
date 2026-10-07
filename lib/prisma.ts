import dotenv from "dotenv"
import { expand } from "dotenv-expand"
import { PrismaClient } from "@prisma/client"

// Ensure environment variables are loaded and expanded
const myEnv = dotenv.config()
expand(myEnv)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
