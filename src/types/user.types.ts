import type { User } from "@prisma/client";

export type UserProfile = Pick<
  User,
  "id" | "name" | "email" | "image" | "role" | "isBlocked" | "isApproved" | "createdAt"
>;
