import { MOCK_USERS, DEFAULT_USER } from "@/mocks/users";
import type { User } from "@/types/accessControl";

let activeCurrentUser: User = DEFAULT_USER;

export async function getUsers(): Promise<User[]> {
  return Promise.resolve(MOCK_USERS);
}

export async function getUserById(userId: string): Promise<User | null> {
  const user = MOCK_USERS.find((u) => u.id === userId) || null;
  return Promise.resolve(user);
}

export function getCurrentUserSync(): User {
  return activeCurrentUser;
}

export async function getCurrentUser(): Promise<User> {
  return Promise.resolve(activeCurrentUser);
}

export function setCurrentUserSync(userId: string): User {
  const found = MOCK_USERS.find((u) => u.id === userId);
  if (found) {
    activeCurrentUser = found;
  }
  return activeCurrentUser;
}

export async function setCurrentUser(userId: string): Promise<User> {
  return Promise.resolve(setCurrentUserSync(userId));
}
