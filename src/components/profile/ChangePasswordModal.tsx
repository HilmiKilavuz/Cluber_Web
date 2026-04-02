"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth/useAuth";
import {
    changePasswordSchema,
    type ChangePasswordFormValues,
} from "@/lib/auth/authSchemas";
import { PasswordStrengthIndicator } from "@/components/ui/PasswordStrengthIndicator";

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const { changePasswordMutation } = useAuth();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    const newPasswordValue = watch("newPassword");

    if (!isOpen) return null;

    const onSubmit = async (values: ChangePasswordFormValues) => {
        try {
            await changePasswordMutation.mutateAsync({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            });
            toast.success("Şifreniz başarıyla değiştirildi!");
            reset();
            onClose();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Şifre değiştirilemedi. Mevcut şifrenizi kontrol edin.";
            toast.error(errorMessage);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className="mx-4 w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        Şifre Değiştir
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                    {/* Current Password */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Mevcut Şifre
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                {...register("currentPassword")}
                                autoComplete="current-password"
                                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 pr-10 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-400"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <p className="text-xs text-red-500">{errors.currentPassword.message}</p>
                        )}
                    </div>

                    {/* New Password */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Yeni Şifre
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                {...register("newPassword")}
                                autoComplete="new-password"
                                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 pr-10 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-400"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-xs text-red-500">{errors.newPassword.message}</p>
                        )}
                        <PasswordStrengthIndicator password={newPasswordValue} />
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Yeni Şifre Tekrar
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirmNewPassword")}
                                autoComplete="new-password"
                                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 pr-10 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-400"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.confirmNewPassword && (
                            <p className="text-xs text-red-500">{errors.confirmNewPassword.message}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting || changePasswordMutation.isPending}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2.5 text-sm font-bold text-white transition-all hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
                        >
                            {isSubmitting || changePasswordMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : null}
                            {isSubmitting || changePasswordMutation.isPending ? "Değiştiriliyor..." : "Şifre Değiştir"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                            disabled={isSubmitting || changePasswordMutation.isPending}
                            className="rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                            İptal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}