import bcrypt from "bcryptjs";
import { connectToDatabase } from "../db/mongoose";
import { User } from "../models/User";

async function main() {
  await connectToDatabase();
  const email = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "admin123";
  const existing = await User.findOne({ email });
  if (existing) {
    // eslint-disable-next-line no-console
    console.log("Admin user already exists:", email);
    process.exit(0);
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ email, passwordHash, role: "admin" });
  // eslint-disable-next-line no-console
  console.log("Created admin user:", email);
  process.exit(0);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
