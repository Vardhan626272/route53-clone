import { apiClient } from "@/lib/api-client";
import type { LoginResponse, User } from "@/lib/types";

export async function login(username: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", {
    username,
    password,
  });
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>("/auth/me");
  return data;
}
