import "server-only";
import { cookies } from "next/headers";
import { decrypt } from "./session";
import { prisma } from "./prisma";

export async function getUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return null;
  }

  const payload = await decrypt(session);

  if (!payload || !payload.userId) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
}
