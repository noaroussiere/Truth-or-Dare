import dotenv from "dotenv"
import { expand } from "dotenv-expand"
import { PrismaClient } from "@prisma/client"

const myEnv = dotenv.config()
expand(myEnv)

const prisma = new PrismaClient()

const initialChallenges = [
  { type: "veritee", value: "What is your biggest fear?", username: "system" },
  { type: "action", value: "Do 10 push-ups.", username: "system" },
  { type: "veritee", value: "What is your biggest dream?", username: "system" },
  { type: "action", value: "Sing a song in front of everyone.", username: "system" },
  { type: "veritee", value: "What is your biggest regret?", username: "system" },
  { type: "action", value: "Imitate an animal of your choice for 30 seconds.", username: "system" },
  { type: "veritee", value: "What is the craziest thing you have ever done?", username: "system" },
  { type: "action", value: "Send an embarrassing message to the last person you texted.", username: "system" },
  { type: "veritee", value: "What secret have you never told anyone?", username: "system" },
  { type: "action", value: "Wear your clothes backwards for a day.", username: "system" },
  { type: "veritee", value: "What is your greatest talent?", username: "system" },
  { type: "action", value: "Dress up as your favorite superhero for a day.", username: "system" },
  { type: "veritee", value: "What is your favorite book?", username: "system" },
  { type: "action", value: "Share an interesting fact about yourself.", username: "system" },
  { type: "veritee", value: "What are three words that describe you?", username: "system" },
  { type: "action", value: "Do a dance for 30 seconds.", username: "system" },
  { type: "veritee", value: "What is your favorite movie?", username: "system" },
  { type: "action", value: "Tell a joke that makes everyone laugh.", username: "system" },
]

async function main() {
  console.log("Seeding database...")
  const count = await prisma.challenge.count()
  if (count === 0) {
    await prisma.challenge.createMany({
      data: initialChallenges,
    })
    console.log(`Seeded ${initialChallenges.length} challenges successfully.`)
  } else {
    console.log(`Database already contains ${count} challenges, skipping seed.`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
