/**
 * KULÜP SERVİSİ TESTLERİ (club.service.test.ts)
 * 
 * Bu dosya clubService fonksiyonlarını test eder.
 * 
 * TEST YAPISI AÇIKLAMASI:
 * ┌─────────────────────────────────────────────────────┐
 * │  describe("groupName")  → Test grubu tanımlar      │
 * │  it("test senaryosu")   → Tek bir test durumu       │
 * │  expect(sonuc).toBe()   → Sonucu doğrular            │
 * │  jest.fn()              → Sahte (mock) fonksiyon    │
 * └─────────────────────────────────────────────────────┘
 * 
 * Her test "Arrange → Act → Assert" (Hazırla → Uygula → Doğrula)
 * desenini takip eder.
 */

// axiosInstance'ı mock'la — gerçek HTTP isteği yapılmasın
jest.mock("@/services/axiosInstance", () => ({
    axiosInstance: {
        get: jest.fn(),
        post: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
    },
}));

import { axiosInstance } from "@/services/axiosInstance";
import { clubService } from "@/services/clubs/club.service";
import type { Club, ClubMember, CreateClubDto, UpdateClubDto } from "@/types/club";

// Her test öncesi mock'ları temizle
beforeEach(() => {
    jest.clearAllMocks();
});

// ==================== MOCK VERİLER ====================
const mockClub: Club = {
    id: "club-1",
    name: "Yazılım Kulübü",
    description: "Yazılım öğrenmek isteyenler için",
    slug: "yazilim-kulubu",
    category: "Teknoloji",
    avatarUrl: "https://example.com/avatar.png",
    bannerUrl: "https://example.com/banner.png",
    creatorId: "user-1",
    creator: {
        id: "user-1",
        email: "creator@example.com",
        displayName: "Club Creator",
        role: "ADMIN",
    },
    _count: { memberships: 25 },
    memberships: [],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
};

const mockMember: ClubMember = {
    id: "member-1",
    clubId: "club-1",
    userId: "user-2",
    role: "MEMBER",
    joinedAt: "2024-01-10T00:00:00Z",
    user: {
        id: "user-2",
        email: "member@example.com",
        displayName: "Club Member",
        role: "MEMBER",
    },
};

describe("clubService", () => {

    // ==================== getClubs TESTLERİ ====================
    describe("getClubs", () => {
        it("filtresiz tüm kulüpleri getirmeli", async () => {
            // Arrange: Veriyi hazırla
            const mockResponse = {
                data: [mockClub],
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
            };
            (axiosInstance.get as jest.Mock).mockResolvedValue({ data: mockResponse });

            // Act: Fonksiyonu çalıştır
            const result = await clubService.getClubs();

            // Assert: Sonucu doğrula
            expect(result).toEqual(mockResponse);
            expect(axiosInstance.get).toHaveBeenCalledWith("/clubs", { params: undefined });
        });

        it("filtrelerle kulüpleri getirmeli", async () => {
            // Arrange
            const filters = { category: "Teknoloji", search: "yazılım", page: 1, limit: 5 };
            const mockResponse = {
                data: [mockClub],
                total: 1,
                page: 1,
                limit: 5,
                totalPages: 1,
            };
            (axiosInstance.get as jest.Mock).mockResolvedValue({ data: mockResponse });

            // Act
            const result = await clubService.getClubs(filters);

            // Assert
            expect(result).toEqual(mockResponse);
            expect(axiosInstance.get).toHaveBeenCalledWith("/clubs", { params: filters });
        });

        it("hata durumunda hata fırlatmalı", async () => {
            // Arrange
            const mockError = new Error("Network error");
            (axiosInstance.get as jest.Mock).mockRejectedValue(mockError);

            // Act & Assert
            await expect(clubService.getClubs()).rejects.toThrow("Network error");
        });
    });

    // ==================== getClubById TESTLERİ ====================
    describe("getClubById", () => {
        it("geçerli ID ile kulübü getirmeli", async () => {
            // Arrange
            (axiosInstance.get as jest.Mock).mockResolvedValue({ data: mockClub });

            // Act
            const result = await clubService.getClubById("club-1");

            // Assert
            expect(result).toEqual(mockClub);
            expect(axiosInstance.get).toHaveBeenCalledWith("/clubs/club-1");
        });

        it("geçersiz ID ile hata dönmeli", async () => {
            // Arrange
            const mockError = new Error("Kulüp bulunamadı");
            (axiosInstance.get as jest.Mock).mockRejectedValue(mockError);

            // Act & Assert
            await expect(clubService.getClubById("invalid-id")).rejects.toThrow("Kulüp bulunamadı");
        });
    });

    // ==================== getClubBySlug TESTLERİ ====================
    describe("getClubBySlug", () => {
        it("geçerli slug ile kulübü getirmeli", async () => {
            // Arrange
            (axiosInstance.get as jest.Mock).mockResolvedValue({ data: mockClub });

            // Act
            const result = await clubService.getClubBySlug("yazilim-kulubu");

            // Assert
            expect(result).toEqual(mockClub);
            expect(axiosInstance.get).toHaveBeenCalledWith("/clubs/slug/yazilim-kulubu");
        });
    });

    // ==================== createClub TESTLERİ ====================
    describe("createClub", () => {
        it("yeni kulüp oluşturmalı", async () => {
            // Arrange
            const createPayload: CreateClubDto = {
                name: "Yeni Kulüp",
                description: "Yeni açıklama",
                category: "Spor",
            };
            const newClub = { ...mockClub, ...createPayload, id: "new-club-1" };
            (axiosInstance.post as jest.Mock).mockResolvedValue({ data: newClub });

            // Act
            const result = await clubService.createClub(createPayload);

            // Assert
            expect(result).toEqual(newClub);
            expect(axiosInstance.post).toHaveBeenCalledWith("/clubs", createPayload);
        });

        it("oluşturma hatası durumunda hata fırlatmalı", async () => {
            // Arrange
            const mockError = new Error("Bu isimde bir kulüp zaten var");
            const createPayload: CreateClubDto = {
                name: "Mevcut Kulüp",
                description: "Açıklama",
                category: "Teknoloji",
            };
            (axiosInstance.post as jest.Mock).mockRejectedValue(mockError);

            // Act & Assert
            await expect(clubService.createClub(createPayload)).rejects.toThrow(
                "Bu isimde bir kulüp zaten var"
            );
        });
    });

    // ==================== updateClub TESTLERİ ====================
    describe("updateClub", () => {
        it("kulüp bilgilerini güncellemeli", async () => {
            // Arrange
            const updatePayload: UpdateClubDto = {
                name: "Güncellenmiş Kulüp",
                description: "Güncellenmiş açıklama",
            };
            const updatedClub = { ...mockClub, ...updatePayload };
            (axiosInstance.patch as jest.Mock).mockResolvedValue({ data: updatedClub });

            // Act
            const result = await clubService.updateClub("club-1", updatePayload);

            // Assert
            expect(result).toEqual(updatedClub);
            expect(axiosInstance.patch).toHaveBeenCalledWith("/clubs/club-1", updatePayload);
        });
    });

    // ==================== deleteClub TESTLERİ ====================
    describe("deleteClub", () => {
        it("kulübü silmeli", async () => {
            // Arrange
            (axiosInstance.delete as jest.Mock).mockResolvedValue({});

            // Act
            await clubService.deleteClub("club-1");

            // Assert
            expect(axiosInstance.delete).toHaveBeenCalledWith("/clubs/club-1");
        });

        it("silme hatası durumunda hata fırlatmalı", async () => {
            // Arrange
            const mockError = new Error("Kulüp silinemedi");
            (axiosInstance.delete as jest.Mock).mockRejectedValue(mockError);

            // Act & Assert
            await expect(clubService.deleteClub("club-1")).rejects.toThrow("Kulüp silinemedi");
        });
    });

    // ==================== joinClub / leaveClub TESTLERİ ====================
    describe("joinClub", () => {
        it("kulübe katılma isteği göndermeli", async () => {
            // Arrange
            (axiosInstance.post as jest.Mock).mockResolvedValue({});

            // Act
            await clubService.joinClub("club-1");

            // Assert
            expect(axiosInstance.post).toHaveBeenCalledWith("/clubs/club-1/join");
        });
    });

    describe("leaveClub", () => {
        it("kulüpten ayrılma isteği göndermeli", async () => {
            // Arrange
            (axiosInstance.post as jest.Mock).mockResolvedValue({});

            // Act
            await clubService.leaveClub("club-1");

            // Assert
            expect(axiosInstance.post).toHaveBeenCalledWith("/clubs/club-1/leave");
        });
    });

    // ==================== getJoinedClubs TESTLERİ ====================
    describe("getJoinedClubs", () => {
        it("katılınan kulüpleri getirmeli", async () => {
            // Arrange
            (axiosInstance.get as jest.Mock).mockResolvedValue({ data: [mockClub] });

            // Act
            const result = await clubService.getJoinedClubs();

            // Assert
            expect(result).toEqual([mockClub]);
            expect(axiosInstance.get).toHaveBeenCalledWith("/clubs/my/joined");
        });

        it("katılınan kulüp yoksa boş dizi dönmeli", async () => {
            // Arrange
            (axiosInstance.get as jest.Mock).mockResolvedValue({ data: [] });

            // Act
            const result = await clubService.getJoinedClubs();

            // Assert
            expect(result).toEqual([]);
        });
    });

    // ==================== getClubMembers TESTLERİ ====================
    describe("getClubMembers", () => {
        it("kulüp üyelerini getirmeli", async () => {
            // Arrange
            (axiosInstance.get as jest.Mock).mockResolvedValue({ data: [mockMember] });

            // Act
            const result = await clubService.getClubMembers("club-1");

            // Assert
            expect(result).toEqual([mockMember]);
            expect(axiosInstance.get).toHaveBeenCalledWith("/clubs/club-1/members");
        });
    });

    // ==================== removeMember TESTLERİ ====================
    describe("removeMember", () => {
        it("üyeyi kulüpten çıkarmalı", async () => {
            // Arrange
            (axiosInstance.delete as jest.Mock).mockResolvedValue({});

            // Act
            await clubService.removeMember("club-1", "user-2");

            // Assert
            expect(axiosInstance.delete).toHaveBeenCalledWith("/clubs/club-1/members/user-2");
        });
    });
});