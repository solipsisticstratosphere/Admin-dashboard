import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if admin user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "admin@email.com" },
    });

    if (!existingUser) {
      // Hash password
      const hashedPassword = await bcrypt.hash("admin123", 10);

      // Create admin user
      const newUser = await prisma.user.create({
        data: {
          email: "admin@email.com",
          password: hashedPassword,
          firstName: "Admin",
          lastName: "User",
        },
      });

      console.log("Admin user created successfully:", newUser.email);
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
