"use client";

import { useMutation } from "@tanstack/react-query";
import { uploadService, type UploadResponse } from "@/services/upload/upload.service";

/**
 * React Query mutation hook for uploading a file to Cloudinary via the backend.
 *
 * Usage:
 *   const { mutateAsync: upload, isPending } = useUpload();
 *   const { url } = await upload(file);
 */
export const useUpload = () => {
    return useMutation<UploadResponse, Error, File>({
        mutationFn: (file: File) => uploadService.uploadFile(file),
    });
};
