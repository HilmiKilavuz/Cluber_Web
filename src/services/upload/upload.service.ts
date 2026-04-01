import { axiosInstance } from "@/services/axiosInstance";

export interface UploadResponse {
    url: string;
    publicId: string;
}

export const uploadService = {
    /**
     * Uploads a file to Cloudinary via the backend.
     * Backend accepts multipart/form-data with a "file" field.
     * Returns the Cloudinary CDN URL upon success.
     */
    uploadFile: async (file: File): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosInstance.post<UploadResponse>(
            "/upload",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    },
};
