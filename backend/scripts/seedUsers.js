// scripts/seedUsers.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/users.js";

dotenv.config();

const users = [
  {
    name: "Operator One",
    email: "operator@example.com",
    password: "operator123",
    role: "operator"
  },
  {
    name: "Dr. Faculty A",
    email: "faculty.a@example.com",
    password: "faculty123",
    role: "faculty",
    school: "SCOPE"
  },
  {
    name: "Dr. Faculty B",
    email: "faculty.b@example.com",
    password: "faculty123",
    role: "faculty",
    school: "SMEC"
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`Skipping ${u.email} (exists)`);
        continue;
      }
      const hashed = await bcrypt.hash(u.password, 10);
      const created = await User.create({ ...u, password: hashed });
      console.log(`Created: ${created.email} / ${u.password}`);
    }

    console.log("Seed complete");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
