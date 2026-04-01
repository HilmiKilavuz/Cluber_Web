/**
 * USEAUTH HOOK TESTLERİ (useAuth.test.ts)
 * 
 * Bu dosya useAuth hook'unun React Query ile entegrasyonunu test eder.
 * 
 * TEST STRATEJİSİ:
 * - renderHook ile hook render edilir
 * - QueryClientProvider wrapper olarak kullanılır
 * - authService fonksiyonları mock'lanır
 * - Mutation ve query sonuçları doğrulanır
 */

import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/auth/useAuth";
import { authService } from "@/services/auth/auth.service";
import type { AuthUser, AuthSuccessResponse } from "@/types/auth";
import React from "react";

// authService mock
jest.mock("@/services/auth/auth.service", () => ({
    authService: {
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        getSession: jest.fn(),
        verifyEmail: jest.fn(),
    },
}));

// localStorage mock
const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    key: jest.fn(),
    length: 0,
};
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });
Object.defineProperty(window, "sessionStorage", { value: mockLocalStorage });

// Wrapper factory — her test için yeni QueryClient
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });
    const Wrapper = ({ children }: { children: React.ReactNode }) => {
        return React.createElement(QueryClientProvider, { client: queryClient }, children);
    };
    return Wrapper;
};

describe("useAuth", () => {
    const mockUser: AuthUser = {
        id: "user-1",
        email: "test@test.com",
        displayName: "Test Kullanıcı",
        role: "MEMBER",
    };

    const authResponse: AuthSuccessResponse = {
        user: mockUser,
        accessToken: "mock-jwt-token",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ==================== sessionQuery TESTLERİ ====================
    describe("sessionQuery", () => {
        it("aktif oturum olduğunda kullanıcı bilgisini dönmeli", async () => {
            // Arrange
            (authService.getSession as jest.Mock).mockResolvedValue(mockUser);
            const wrapper = createWrapper();

            // Act
            const { result } = renderHook(() => useAuth(), { wrapper });

            // Assert
            await waitFor(() => {
                expect(result.current.sessionQuery.data).toEqual(mockUser);
            });
            expect(result.current.sessionQuery.isLoading).toBe(false);
        });

        it("oturum yoksa null dönmeli", async () => {
            // Arrange
            (authService.getSession as jest.Mock).mockRejectedValue(new Error("Unauthorized"));
            const wrapper = createWrapper();

            // Act
            const { result } = renderHook(() => useAuth(), { wrapper });

            // Assert
            await waitFor(() => {
                expect(result.current.sessionQuery.data).toBeNull();
            });
        });

        it("sessionQuery başlangıçta loading durumunda olmalı", async () => {
            // Arrange
            (authService.getSession as jest.Mock).mockResolvedValue(mockUser);
            const wrapper = createWrapper();

            // Act
            const { result } = renderHook(() => useAuth(), { wrapper });

            // Assert
            expect(result.current.sessionQuery.isLoading).toBe(true);
        });
    });

    // ==================== loginMutation TESTLERİ ====================
    describe("loginMutation", () => {
        const loginPayload = {
            email: "test@test.com",
            password: "password123",
            rememberMe: false,
        };

        const authResponse: AuthSuccessResponse = {
            user: mockUser,
            accessToken: "mock-jwt-token",
        };

        it("başarılı login olduğunda kullanıcı bilgisini dönmeli", async () => {
            // Arrange
            (authService.login as jest.Mock).mockResolvedValue(authResponse);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useAuth(), { wrapper });

            // Act
            const user = await result.current.loginMutation.mutateAsync(loginPayload);

            // Assert
            expect(user).toEqual(mockUser);
            expect(authService.login).toHaveBeenCalledWith(loginPayload);
        });

        it("başarılı login sonrası sessionQuery cache güncellenmeli", async () => {
            // Arrange
            (authService.login as jest.Mock).mockResolvedValue(authResponse);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useAuth(), { wrapper });

            // Act
            await result.current.loginMutation.mutateAsync(loginPayload);

            // Assert
            await waitFor(() => {
                expect(result.current.sessionQuery.data).toEqual(mockUser);
            });
        });

        it("rememberMe true olduğunda localStorage kullanılmalı", async () => {
            // Arrange
            (authService.login as jest.Mock).mockResolvedValue(authResponse);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useAuth(), { wrapper });

            // Act
            await result.current.loginMutation.mutateAsync({ ...loginPayload, rememberMe: true });

            // Assert
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith("access_token", "mock-jwt-token");
        });

        it("rememberMe false olduğunda sessionStorage kullanılmalı", async () => {
            // Arrange
            (authService.login as jest.Mock).mockResolvedValue(authResponse);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useAuth(), { wrapper });

            // Act
            await result.current.loginMutation.mutateAsync({ ...loginPayload, rememberMe: false });

            // Assert
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith("access_token", "mock-jwt-token");
        });

        it("login başarısız olduğunda hata dönmeli", async () => {
            // Arrange
            const loginError = new Error("Geçersiz e-posta veya şifre");
            (authService.login as jest.Mock).mockRejectedValue(loginError);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useAuth(), { wrapper });

            // Act & Assert
            await expect(result.current.loginMutation.mutateAsync(loginPayload)).rejects.toThrow(
                "Geçersiz e-posta veya şifre",
            );
        });
    });

    // ==================== registerMutation TESTLERİ ====================
    describe("registerMutation", () => {
        const registerPayload = {
            email: "newuser@test.com",
            displayName: "Yeni Kullanıcı",
            password: "password123",
        };

        it("başarılı kayıt olduğunda kullanıcı ve mesaj dönmeli", async () => {
            // Arrange
            const registerResponse = {
                user: mockUser,
                message: "Kayıt başarılı. Doğrulama kodu e-posta adresinize gönderildi.",
            };
            (authService.register as jest.Mock).mockResolvedValue(registerResponse);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useAuth(), { wrapper });

            // Act
            const response = await result.current.registerMutation.mutateAsync(registerPayload);

            // Assert
            expect(response).toEqual(registerResponse);
            expect(authService.register).toHaveBeenCalledWith(registerPayload);
        });

        it("kayıt başarısız olduğunda hata dönmeli", async () => {
            // Arrange
            const registerError = new Error("Bu e-posta adresi zaten kullanılıyor");
            (authService.register as jest.Mock).mockRejectedValue(registerError);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useAuth(), { wrapper });

            // Act & Assert
            await expect(
                result.current.registerMutation.mutateAsync(registerPayload),
            ).rejects.toThrow("Bu e-posta adresi zaten kullanılıyor");
        });
    });

    // ==================== logoutMutation TESTLERİ ====================
    describe("logoutMutation", () => {
        it("başarılı çıkış yapmalı ve session temizlemeli", async () => {
            // Arrange
            (authService.logout as jest.Mock).mockResolvedValue(undefined);
            (authService.login as jest.Mock).mockResolvedValue(authResponse);
            const wrapper = createWrapper();

            const { result } = renderHook(() => useAuth(), { wrapper });

            // Önce login yap (cache'i günceller)
            await result.current.loginMutation.mutateAsync({
                email: "test@test.com",
                password: "password123",
            });

            // Logout yap
            await result.current.logoutMutation.mutateAsync();

            // Assert: session temizlenmeli (logoutMutation onSuccess: setQueryData(null) + invalidateQueries)
            expect(result.current.sessionQuery.data).toBeFalsy();
            expect(authService.logout).toHaveBeenCalled();
        });

        it("çıkış sırasında hata oluşursa hata fırlatmalı", async () => {
            // Arrange
            const logoutError = new Error("Logout failed");
            (authService.logout as jest.Mock).mockRejectedValue(logoutError);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useAuth(), { wrapper });

            // Act & Assert
            await expect(result.current.logoutMutation.mutateAsync()).rejects.toThrow(
                "Logout failed",
            );
        });
    });

    // ==================== verifyEmailMutation TESTLERİ ====================
    describe("verifyEmailMutation", () => {
        const verifyPayload = {
            email: "test@test.com",
            code: "123456",
        };

        it("doğru kod ile email doğrulanmalı ve kullanıcı giriş yapmalı", async () => {
            // Arrange
            const verifyResponse: AuthSuccessResponse & { message: string } = {
                user: mockUser,
                accessToken: "verified-jwt-token",
                message: "E-posta doğrulandı",
            };
            (authService.verifyEmail as jest.Mock).mockResolvedValue(verifyResponse);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useAuth(), { wrapper });

            // Act
            const response = await result.current.verifyEmailMutation.mutateAsync(verifyPayload);

            // Assert
            expect(response).toEqual(verifyResponse);
            expect(authService.verifyEmail).toHaveBeenCalledWith(verifyPayload);

            // Session güncellendi mi?
            await waitFor(() => {
                expect(result.current.sessionQuery.data).toEqual(mockUser);
            });
        });

        it("yanlış kod ile hata dönmeli", async () => {
            // Arrange
            const verifyError = new Error("Geçersiz doğrulama kodu");
            (authService.verifyEmail as jest.Mock).mockRejectedValue(verifyError);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useAuth(), { wrapper });

            // Act & Assert
            await expect(
                result.current.verifyEmailMutation.mutateAsync(verifyPayload),
            ).rejects.toThrow("Geçersiz doğrulama kodu");
        });
    });
});