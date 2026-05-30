import { axiosInstance } from "@/services/axiosInstance";

export interface ClubInsight {
    id: string;
    name: string;
    category: string;
}

export interface ProfileInsightResult {
    character: string;
    interests: string[];
    suggestions: string[];
    recommendedClubs: ClubInsight[];
}

const AI_BASE_PATH = "/ai";

export const aiService = {
    /**
     * Calls the backend to generate a profile insight for the current user.
     * Backend analyzes joined clubs and returns character analysis + club recommendations.
     */
    getProfileInsight: async (): Promise<ProfileInsightResult> => {
        const response = await axiosInstance.post<ProfileInsightResult>(
            `${AI_BASE_PATH}/profile-insight`,
            {},
            {
                // LLM can take up to 60s on backend; allow 90s total here
                timeout: 90000,
                // Suppress the global error toast — AIInsightCard shows its own error UI
                headers: { "x-silent-error": "true" },
            },
        );
        return response.data;
    },
};
