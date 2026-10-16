const { execSync } = require("child_process");

const dbUrl = process.env.DATABASE_URL || "";
const isPostgres =
  dbUrl.startsWith("postgres://") ||
  dbUrl.startsWith("postgresql://") ||
  process.env.PRISMA_SCHEMA === "postgresql";

const schema = isPostgres
  ? "prisma/schema.postgresql.prisma"
  : "prisma/schema.prisma";

console.log(
  `[Inklara Prisma Generator] Target Provider: ${isPostgres ? "PostgreSQL" : "SQLite"} (${schema})`
);

try {
  execSync(`npx prisma generate --schema=${schema}`, { stdio: "inherit" });
} catch (err) {
  console.error(`[Inklara Prisma Generator] Error generating Prisma client for ${schema}:`, err);
  process.exit(1);
}
