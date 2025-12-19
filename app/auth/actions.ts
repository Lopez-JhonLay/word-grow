"use server";

import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { loginSchema, signUpSchema } from "./schema";

export async function signup(formData: FormData) {
  const data = Object.fromEntries(formData);

  console.log(data);

  const result = signUpSchema.safeParse(data);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { fullName, email, password } = result.data;

  if (!fullName || !email || !password) {
    return { errors: { form: ["All fields are required"] } };
  }

  console.log("Signup data:", { fullName, email, password });

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return {
      errors: {
        email: ["User with this email already exists."],
      },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
    },
  });

  await createSession(user.id);

  return { success: true };
}

export async function login(formData: FormData) {
  const data = Object.fromEntries(formData);

  const result = loginSchema.safeParse(data);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return {
      errors: {
        email: ["Invalid email or password"],
      },
    };
  }

  await createSession(user.id);

  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
