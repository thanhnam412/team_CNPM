import * as dotenv from "dotenv";
dotenv.config();

import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import * as crypto from "crypto";

import { DB } from "./src/database/types";

// Setup Kysely exactly like DatabaseModule does
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Error: Missing DATABASE_URL environment variable.");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const dialect = new PostgresDialect({ pool });
const db = new Kysely<DB>({ dialect });

const firstNames = [
  "John",
  "Jane",
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Eve",
  "Frank",
  "Grace",
  "Heidi",
  "Ivan",
  "Judy",
  "Mallory",
  "Victor",
  "Peggy",
  "Trent",
  "Walter",
  "Arthur",
  "Beryl",
  "Cybil",
  "Nam",
  "Hung",
  "Hoa",
  "Lan",
  "Tuan",
  "Minh",
  "Thanh",
  "Trang",
  "Son",
  "Hai",
];
const lastNames = [
  "Smith",
  "Doe",
  "Johnson",
  "Brown",
  "Williams",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Nguyen",
  "Tran",
  "Le",
  "Pham",
];
const titles = [
  "Senior Frontend Developer",
  "Backend Engineer",
  "Full Stack Ninja",
  "UI/UX Designer",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager",
  "QA Engineer",
  "Mobile iOS Developer",
  "Blockchain Expert",
  "React Native Developer",
  "System Architect",
];
const skillsList = [
  ["React", "TypeScript", "TailwindCSS", "Next.js"],
  ["Node.js", "NestJS", "PostgreSQL", "Docker"],
  ["Figma", "UI Design", "Prototyping", "UX Research"],
  ["Python", "Django", "Machine Learning", "Data Analysis"],
  ["AWS", "Docker", "Kubernetes", "CI/CD"],
  ["Swift", "iOS", "React Native", "Mobile"],
  ["Vue.js", "Nuxt.js", "JavaScript", "CSS"],
  ["Go", "Microservices", "gRPC", "Redis"],
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomRate() {
  return Math.floor(Math.random() * 80) + 20; // 20 to 99 USD
}

async function main() {
  console.log("Seeding 100 expert users via Kysely...");
  let count = 0;

  for (let i = 0; i < 100; i++) {
    const fn = randomItem(firstNames);
    const ln = randomItem(lastNames);
    const name = `${fn} ${ln}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}.${Math.random().toString(36).substring(7)}@example.com`;
    const title = randomItem(titles);
    const skills = randomItem(skillsList);
    const rate = randomRate().toString();
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(" ", "")}`;
    const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0 to 5.0
    const now = new Date();

    try {
      const userId = crypto.randomUUID();

      await db.transaction().execute(async (trx) => {
        // Create User
        await trx
          .insertInto("users")
          .values({
            id: userId,
            googleId: crypto.randomUUID(),
            email,
            name,
            avatar,
            currentRole: "EXPERT",
            location: "Global",
            online: false,
            updatedAt: now,
            createdAt: now,
          })
          .execute();

        // Create Expert Profile
        await trx
          .insertInto("expert_profiles")
          .values({
            id: crypto.randomUUID(),
            userId: userId,
            title,
            bio: `Hi! I am a passionate ${title} with ${Math.floor(Math.random() * 10) + 1} years of experience. Let's work together!`,
            skills: JSON.stringify(skills),
            hourlyRate: rate,
            experienceYears: Math.floor(Math.random() * 10) + 1,
            rating,
            portfolioUrl: null,
            status: "ACTIVE",
            updatedAt: now,
            createdAt: now,
          })
          .execute();

        // Create Wallet
        await trx
          .insertInto("wallets")
          .values({
            id: crypto.randomUUID(),
            userId: userId,
            balance: "0",
            escrowBalance: "0",
            currency: "USD",
            status: "ACTIVE",
            updatedAt: now,
            createdAt: now,
          })
          .execute();
      });

      count++;
      process.stdout.write(`\rCreated user ${count}/100...`);
    } catch (error) {
      console.error(`\nFailed to create user ${name}:`, error);
    }
  }

  console.log("\n Seeding completed! Created", count, "experts.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
