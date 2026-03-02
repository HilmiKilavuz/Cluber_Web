import { axiosInstance } from "@/services/axiosInstance";
import { Message } from "@/types/chat";

const CHAT_BASE_PATH = "/chat";

export const chatService = {
    getMessages: async (clubId: string): Promise<Message[]> => {
        const response = await axiosInstance.get<Message[]>(`${CHAT_BASE_PATH}/${clubId}`);
        return response.data;
    },
};
