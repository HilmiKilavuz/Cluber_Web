import { axiosInstance } from "@/services/axiosInstance";
import type {
    Club,
    ClubFilters,
    CreateClubDto,
    UpdateClubDto,
} from "@/types/club";

const CLUBS_BASE_PATH = "/clubs";

export const clubService = {
    getClubs: async (filters?: ClubFilters): Promise<Club[]> => {
        const response = await axiosInstance.get<Club[]>(CLUBS_BASE_PATH, {
            params: filters,
        });
        return Array.isArray(response.data) ? response.data : [];

    },

    getClubById: async (id: string): Promise<Club> => {
        const response = await axiosInstance.get<Club>(`${CLUBS_BASE_PATH}/${id}`);
        return response.data;
    },

    getClubBySlug: async (slug: string): Promise<Club> => {
        const response = await axiosInstance.get<Club>(`${CLUBS_BASE_PATH}/slug/${slug}`);
        return response.data;
    },

    createClub: async (payload: CreateClubDto): Promise<Club> => {
        const response = await axiosInstance.post<Club>(CLUBS_BASE_PATH, payload);
        return response.data;
    },

    updateClub: async (id: string, payload: UpdateClubDto): Promise<Club> => {
        const response = await axiosInstance.patch<Club>(
            `${CLUBS_BASE_PATH}/${id}`,
            payload,
        );
        return response.data;
    },

    deleteClub: async (id: string): Promise<void> => {
        await axiosInstance.delete(`${CLUBS_BASE_PATH}/${id}`);
    },

    joinClub: async (clubId: string): Promise<void> => {
        await axiosInstance.post(`${CLUBS_BASE_PATH}/${clubId}/join`);
    },

    leaveClub: async (clubId: string): Promise<void> => {
        await axiosInstance.post(`${CLUBS_BASE_PATH}/${clubId}/leave`);
    },

    getJoinedClubs: async (): Promise<Club[]> => {
        const response = await axiosInstance.get<Club[]>(`${CLUBS_BASE_PATH}/my/joined`);
        return Array.isArray(response.data) ? response.data : [];
    },
};

