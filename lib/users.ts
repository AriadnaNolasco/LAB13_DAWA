// lib/users.ts
import { prisma } from "./prisma";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(data: { email: string; name?: string | null; passwordHash: string }) {
  return prisma.user.create({
    data,
  });
}

// =======================
//   FAILED LOGIN CONTROL
// =======================

const MAX_ATTEMPTS = 5;
const BLOCK_MINUTES = 15;

export async function recordFailedLogin(email: string) {
  const now = new Date();
  const failed = await prisma.failedLogin.findFirst({
    where: { email },
  });

  if (!failed) {
    return prisma.failedLogin.create({
      data: { email, attempts: 1 },
    });
  }

  const newAttempts = failed.attempts + 1;

  let blockedUntil = failed.blockedUntil;
  if (newAttempts >= MAX_ATTEMPTS) {
    blockedUntil = new Date(now.getTime() + BLOCK_MINUTES * 60 * 1000);
  }

  return prisma.failedLogin.update({
    where: { id: failed.id },
    data: {
      attempts: newAttempts,
      blockedUntil,
    },
  });
}

export async function resetFailedLogins(email: string) {
  await prisma.failedLogin.deleteMany({
    where: { email },
  });
}

export async function isBlocked(email: string) {
  const failed = await prisma.failedLogin.findFirst({
    where: { email },
  });

  if (!failed) return false;

  if (failed.blockedUntil && failed.blockedUntil > new Date()) return true;

  if (failed.blockedUntil && failed.blockedUntil <= new Date()) {
    await resetFailedLogins(email);
    return false;
  }

  return false;
}
