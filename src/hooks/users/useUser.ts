import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, type UpdateProfileDto } from "@/services/users/user.service";
import { toast } from "sonner";

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateProfileDto) => userService.updateMe(payload),
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: ["session"] });
            toast.success("Profil güncellendi!");
        },
        onError: () => {
            toast.error("Profil güncellenirken bir hata oluştu.");
        },
    });
};
