import { axiosInstance } from "@/services/axiosInstance";
import type { AuthUser } from "@/types/auth";

export interface UpdateProfileDto {
    username?: string;
    bio?: string;
    avatarUrl?: string;
}

export const userService = {
    getMe: async (): Promise<AuthUser> => {
        const response = await axiosInstance.get<AuthUser>("/users/me");
        return response.data;
    },

    updateMe: async (payload: UpdateProfileDto): Promise<AuthUser> => {
        const response = await axiosInstance.patch<AuthUser>("/users/me", payload);
        return response.data;
    },
};
