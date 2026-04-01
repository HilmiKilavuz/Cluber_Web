/**
 * USECLUBS HOOK TESTLERİ (useClubs.test.ts)
 * 
 * Bu dosya useClubs hook'larının React Query ile entegrasyonunu test eder.
 * 
 * TEST STRATEJİSİ:
 * - renderHook ile hook render edilir
 * - QueryClientProvider wrapper olarak kullanılır
 * - clubService fonksiyonları mock'lanır
 * - Query ve mutation sonuçları doğrulanır
 */

import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    useClubs,
    useClub,
    useClubBySlug,
    useCreateClub,
    useUpdateClub,
    useDeleteClub,
    useJoinClub,
    useLeaveClub,
    useJoinedClubs,
    useClubMembers,
    useRemoveMember,
} from "@/hooks/clubs/useClubs";
import { clubService } from "@/services/clubs/club.service";
import type { Club, ClubMember, CreateClubDto } from "@/types/club";
import type { PaginatedResponse } from "@/types/api";
import React from "react";

// clubService mock
jest.mock("@/services/clubs/club.service", () => ({
    clubService: {
        getClubs: jest.fn(),
        getClubById: jest.fn(),
        getClubBySlug: jest.fn(),
        createClub: jest.fn(),
        updateClub: jest.fn(),
        deleteClub: jest.fn(),
        joinClub: jest.fn(),
        leaveClub: jest.fn(),
        getJoinedClubs: jest.fn(),
        getClubMembers: jest.fn(),
        removeMember: jest.fn(),
    },
}));

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

describe("useClubs Hooks", () => {
    // Mock veriler
    const mockClub: Club = {
        id: "club-1",
        name: "Yazılım Kulübü",
        description: "Yazılım geliştirme kulübü",
        slug: "yazilim-kulubu",
        category: "Teknoloji",
        creatorId: "user-1",
        _count: { memberships: 50 },
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-15T00:00:00Z",
    };

    const mockClubsPaginated: PaginatedResponse<Club> = {
        data: [mockClub],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
    };

    const mockMembers: ClubMember[] = [
        {
            id: "member-1",
            clubId: "club-1",
            userId: "user-1",
            role: "OWNER",
            joinedAt: "2026-01-01T00:00:00Z",
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ==================== useClubs TESTLERİ ====================
    describe("useClubs", () => {
        it("filtresiz tüm kulüpleri getirmeli", async () => {
            // Arrange
            (clubService.getClubs as jest.Mock).mockResolvedValue(mockClubsPaginated);
            const wrapper = createWrapper();

            // Act
            const { result } = renderHook(() => useClubs(), { wrapper });

            // Assert
            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });
            expect(result.current.data?.pages[0].data).toEqual([mockClub]);
        });

        it("filtrelerle kulüpleri getirmeli", async () => {
            // Arrange
            const filters = { category: "Teknoloji", search: "yazılım" };
            (clubService.getClubs as jest.Mock).mockResolvedValue(mockClubsPaginated);
            const wrapper = createWrapper();

            // Act
            const { result } = renderHook(() => useClubs(filters), { wrapper });

            // Assert
            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });
            expect(clubService.getClubs).toHaveBeenCalledWith(
                expect.objectContaining({ ...filters, page: 1 }),
            );
        });

        it("hata durumunda error state'i true olmalı", async () => {
            // Arrange
            (clubService.getClubs as jest.Mock).mockRejectedValue(new Error("Network Error"));
            const wrapper = createWrapper();

            // Act
            const { result } = renderHook(() => useClubs(), { wrapper });

            // Assert
            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });
        });
    });

    // ==================== useClub TESTLERİ ====================
    describe("useClub", () => {
        it("geçerli ID ile kulüp getirmeli", async () => {
            // Arrange
            (clubService.getClubById as jest.Mock).mockResolvedValue(mockClub);
            const wrapper = createWrapper();

            // Act
            const { result } = renderHook(() => useClub("club-1"), { wrapper });

            // Assert
            await waitFor(() => {
                expect(result.current.data).toEqual(mockClub);
            });
            expect(clubService.getClubById).toHaveBeenCalledWith("club-1");
        });

        it("geçersiz ID ile query disabled olmalı", async () => {
            // Arrange
            const wrapper = createWrapper();

            // Act
            const { result } = renderHook(() => useClub(""), { wrapper });

            // Assert
            expect(result.current.isLoading).toBe(false);
            expect(result.current.isFetching).toBe(false);
        });
    });

    // ==================== useClubBySlug TESTLERİ ====================
    describe("useClubBySlug", () => {
        it("geçerli slug ile kulüp getirmeli", async () => {
            // Arrange
            (clubService.getClubBySlug as jest.Mock).mockResolvedValue(mockClub);
            const wrapper = createWrapper();

            // Act
            const { result } = renderHook(() => useClubBySlug("yazilim-kulubu"), { wrapper });

            // Assert
            await waitFor(() => {
                expect(result.current.data).toEqual(mockClub);
            });
            expect(clubService.getClubBySlug).toHaveBeenCalledWith("yazilim-kulubu");
        });

        it("geçersiz slug ile query disabled olmalı", async () => {
            // Arrange
            const wrapper = createWrapper();

            // Act
            const { result } = renderHook(() => useClubBySlug(""), { wrapper });

            // Assert
            expect(result.current.isLoading).toBe(false);
        });
    });

    // ==================== useCreateClub TESTLERİ ====================
    describe("useCreateClub", () => {
        const createPayload: CreateClubDto = {
            name: "Yeni Kulüp",
            description: "Yeni kulüp açıklaması",
            category: "Spor",
        };

        it("başarılı kulüp oluşturmalı", async () => {
            // Arrange
            const createdClub: Club = { ...mockClub, ...createPayload, id: "club-new" };
            (clubService.createClub as jest.Mock).mockResolvedValue(createdClub);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useCreateClub(), { wrapper });

            // Act
            const club = await result.current.mutateAsync(createPayload);

            // Assert
            expect(club).toEqual(createdClub);
            expect(clubService.createClub).toHaveBeenCalledWith(createPayload);
        });

        it("oluşturma hatası durumunda hata fırlatmalı", async () => {
            // Arrange
            const createError = new Error("Kulüp oluşturulamadı");
            (clubService.createClub as jest.Mock).mockRejectedValue(createError);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useCreateClub(), { wrapper });

            // Act & Assert
            await expect(result.current.mutateAsync(createPayload)).rejects.toThrow(
                "Kulüp oluşturulamadı",
            );
        });
    });

    // ==================== useUpdateClub TESTLERİ ====================
    describe("useUpdateClub", () => {
        it("kulüp bilgilerini güncellemeli", async () => {
            // Arrange
            const updatePayload = { name: "Güncellenmiş Kulüp" };
            const updatedClub: Club = { ...mockClub, ...updatePayload };
            (clubService.updateClub as jest.Mock).mockResolvedValue(updatedClub);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useUpdateClub("club-1"), { wrapper });

            // Act
            const club = await result.current.mutateAsync(updatePayload);

            // Assert
            expect(club).toEqual(updatedClub);
            expect(clubService.updateClub).toHaveBeenCalledWith("club-1", updatePayload);
        });
    });

    // ==================== useDeleteClub TESTLERİ ====================
    describe("useDeleteClub", () => {
        it("kulübü silmeli", async () => {
            // Arrange
            (clubService.deleteClub as jest.Mock).mockResolvedValue(undefined);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useDeleteClub(), { wrapper });

            // Act
            await result.current.mutateAsync("club-1");

            // Assert
            expect(clubService.deleteClub).toHaveBeenCalledWith("club-1");
        });

        it("silme hatası durumunda hata fırlatmalı", async () => {
            // Arrange
            const deleteError = new Error("Silme yetkisi yok");
            (clubService.deleteClub as jest.Mock).mockRejectedValue(deleteError);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useDeleteClub(), { wrapper });

            // Act & Assert
            await expect(result.current.mutateAsync("club-1")).rejects.toThrow(
                "Silme yetkisi yok",
            );
        });
    });

    // ==================== useJoinClub TESTLERİ ====================
    describe("useJoinClub", () => {
        it("kulübe katılma isteği göndermeli", async () => {
            // Arrange
            (clubService.joinClub as jest.Mock).mockResolvedValue(undefined);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useJoinClub(), { wrapper });

            // Act
            await result.current.mutateAsync("club-1");

            // Assert
            expect(clubService.joinClub).toHaveBeenCalledWith("club-1");
        });

        it("katılma hatası durumunda hata fırlatmalı", async () => {
            // Arrange
            const joinError = new Error("Kulübe katılamadınız");
            (clubService.joinClub as jest.Mock).mockRejectedValue(joinError);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useJoinClub(), { wrapper });

            // Act & Assert
            await expect(result.current.mutateAsync("club-1")).rejects.toThrow(
                "Kulübe katılamadınız",
            );
        });
    });

    // ==================== useLeaveClub TESTLERİ ====================
    describe("useLeaveClub", () => {
        it("kulüpten ayrılma isteği göndermeli", async () => {
            // Arrange
            (clubService.leaveClub as jest.Mock).mockResolvedValue(undefined);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useLeaveClub(), { wrapper });

            // Act
            await result.current.mutateAsync("club-1");

            // Assert
            expect(clubService.leaveClub).toHaveBeenCalledWith("club-1");
        });

        it("ayrılma hatası durumunda hata fırlatmalı", async () => {
            // Arrange
            const leaveError = new Error("Kulüpten ayrılamadınız");
            (clubService.leaveClub as jest.Mock).mockRejectedValue(leaveError);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useLeaveClub(), { wrapper });

            // Act & Assert
            await expect(result.current.mutateAsync("club-1")).rejects.toThrow(
                "Kulüpten ayrılamadınız",
            );
        });
    });

    // ==================== useJoinedClubs TESTLERİ ====================
    describe("useJoinedClubs", () => {
        it("katılınan kulüpleri getirmeli", async () => {
            // Arrange
            (clubService.getJoinedClubs as jest.Mock).mockResolvedValue([mockClub]);
            const wrapper = createWrapper();

            // Act
            const { result } = renderHook(() => useJoinedClubs(), { wrapper });

            // Assert
            await waitFor(() => {
                expect(result.current.data).toEqual([mockClub]);
            });
        });

        it("katılınan kulüp yoksa boş dizi dönmeli", async () => {
            // Arrange
            (clubService.getJoinedClubs as jest.Mock).mockResolvedValue([]);
            const wrapper = createWrapper();

            // Act
            const { result } = renderHook(() => useJoinedClubs(), { wrapper });

            // Assert
            await waitFor(() => {
                expect(result.current.data).toEqual([]);
            });
        });
    });

    // ==================== useClubMembers TESTLERİ ====================
    describe("useClubMembers", () => {
        it("kulüp üyelerini getirmeli", async () => {
            // Arrange
            (clubService.getClubMembers as jest.Mock).mockResolvedValue(mockMembers);
            const wrapper = createWrapper();

            // Act
            const { result } = renderHook(() => useClubMembers("club-1"), { wrapper });

            // Assert
            await waitFor(() => {
                expect(result.current.data).toEqual(mockMembers);
            });
        });

        it("geçersiz clubId ile query disabled olmalı", async () => {
            // Arrange
            const wrapper = createWrapper();

            // Act
            const { result } = renderHook(() => useClubMembers(""), { wrapper });

            // Assert
            expect(result.current.isLoading).toBe(false);
        });
    });

    // ==================== useRemoveMember TESTLERİ ====================
    describe("useRemoveMember", () => {
        it("üyeyi kulüpten çıkarmalı", async () => {
            // Arrange
            (clubService.removeMember as jest.Mock).mockResolvedValue(undefined);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useRemoveMember("club-1"), { wrapper });

            // Act
            await result.current.mutateAsync("user-2");

            // Assert
            expect(clubService.removeMember).toHaveBeenCalledWith("club-1", "user-2");
        });

        it("üye çıkarma hatası durumunda hata fırlatmalı", async () => {
            // Arrange
            const removeError = new Error("Üye çıkarılamadı");
            (clubService.removeMember as jest.Mock).mockRejectedValue(removeError);
            const wrapper = createWrapper();
            const { result } = renderHook(() => useRemoveMember("club-1"), { wrapper });

            // Act & Assert
            await expect(result.current.mutateAsync("user-2")).rejects.toThrow(
                "Üye çıkarılamadı",
            );
        });
    });
});