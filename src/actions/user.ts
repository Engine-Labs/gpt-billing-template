import prisma from "../prisma";

export async function createUser(clerkId: string): Promise<void> {
  const existingUser = await prisma.user.findFirst({
    where: {
      clerk_id: clerkId,
    },
  });

  if (existingUser) {
    console.log(`User ${clerkId} already exists`);
    return;
  }

  await prisma.user.create({
    data: {
      clerk_id: clerkId,
    },
  });
}
