/**
 * EVENT SERVİS TESTLERİ (event.service.test.ts)
 * 
 * Bu dosya event.service.ts içindeki fonksiyonları test eder.
 * 
 * TEST STRATEJİSİ:
 * - axiosInstance tamamen mock'lanır
 * - Her test için mockResolvedValue / mockRejectedValue kullanılır
 * - API çağrıları ve parametreleri doğrulanır
 */

import { eventService } from "@/services/events/event.service";
import { axiosInstance } from "@/services/axiosInstance";
import type {
    Event,
    EventParticipant,
    CreateEventDto,
    UpdateEventDto,
    RSVPStatus,
    EventFilters,
} from "@/types/event";
import type { PaginatedResponse } from "@/types/api";

// axiosInstance'ı mock'la
jest.mock("@/services/axiosInstance", () => ({
    axiosInstance: {
        get: jest.fn(),
        post: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
    },
}));

describe("eventService", () => {
    // Mock veriler
    const mockEvent: Event = {
        id: "evt-1",
        clubId: "club-1",
        creatorId: "user-1",
        title: "Teknoloji Konferansı 2026",
        description: "Yıllık teknoloji konferansı",
        date: "2026-06-15T10:00:00Z",
        location: "İstanbul Kongre Merkezi",
        imageUrl: "https://example.com/event.jpg",
        maxParticipants: 500,
        category: "Konferans",
        _count: { participants: 120 },
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-15T00:00:00Z",
    };

    const mockParticipants: EventParticipant[] = [
        {
            id: "p-1",
            userId: "user-1",
            eventId: "evt-1",
            status: "GOING",
            user: { id: "user-1", displayName: "Ahmet Yılmaz", avatarUrl: null },
            createdAt: "2026-01-10T00:00:00Z",
        },
        {
            id: "p-2",
            userId: "user-2",
            eventId: "evt-1",
            status: "INTERESTED",
            user: { id: "user-2", displayName: "Ayşe Demir", avatarUrl: null },
            createdAt: "2026-01-11T00:00:00Z",
        },
    ];

    const mockPaginatedEvents: PaginatedResponse<Event> = {
        data: [mockEvent],
        meta: {
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ==================== getEvents TESTLERİ ====================
    describe("getEvents", () => {
        it("filtresiz tüm etkinlikleri getirmeli", async () => {
            // Arrange
            (axiosInstance.get as jest.Mock).mockResolvedValue({ data: mockPaginatedEvents });

            // Act
            const result = await eventService.getEvents();

            // Assert
            expect(axiosInstance.get).toHaveBeenCalledWith("/events", { params: undefined });
            expect(result).toEqual(mockPaginatedEvents);
            expect(result.data).toHaveLength(1);
            expect(result.meta.total).toBe(1);
        });

        it("filtrelerle etkinlik aramalı", async () => {
            // Arrange
            const filters: EventFilters = {
                clubId: "club-1",
                date: "2026-06",
                search: "teknoloji",
                page: 2,
                limit: 20,
            };
            (axiosInstance.get as jest.Mock).mockResolvedValue({ data: mockPaginatedEvents });

            // Act
            const result = await eventService.getEvents(filters);

            // Assert
            expect(axiosInstance.get).toHaveBeenCalledWith("/events", { params: filters });
            expect(result).toEqual(mockPaginatedEvents);
        });

        it("boş sonuç döndüğünde empty array dönmeli", async () => {
            // Arrange
            const emptyResponse: PaginatedResponse<Event> = {
                data: [],
                meta: {
                    total: 0,
                    page: 1,
                    limit: 10,
                    totalPages: 0,
                },
            };
            (axiosInstance.get as jest.Mock).mockResolvedValue({ data: emptyResponse });

            // Act
            const result = await eventService.getEvents({ search: "bulunamayan" });

            // Assert
            expect(result.data).toEqual([]);
            expect(result.meta.total).toBe(0);
        });

        it("network hatası durumunda hata fırlatmalı", async () => {
            // Arrange
            const error = new Error("Network Error");
            (axiosInstance.get as jest.Mock).mockRejectedValue(error);

            // Act & Assert
            await expect(eventService.getEvents()).rejects.toThrow("Network Error");
        });
    });

    // ==================== getEventById TESTLERİ ====================
    describe("getEventById", () => {
        it("geçerli ID ile etkinlik getirmeli", async () => {
            // Arrange
            (axiosInstance.get as jest.Mock).mockResolvedValue({ data: mockEvent });

            // Act
            const result = await eventService.getEventById("evt-1");

            // Assert
            expect(axiosInstance.get).toHaveBeenCalledWith("/events/evt-1");
            expect(result).toEqual(mockEvent);
            expect(result.title).toBe("Teknoloji Konferansı 2026");
        });

        it("geçersiz ID ile 404 hatası almalı", async () => {
            // Arrange
            const notFoundError = new Error("Not Found");
            (axiosInstance.get as jest.Mock).mockRejectedValue(notFoundError);

            // Act & Assert
            await expect(eventService.getEventById("invalid-id")).rejects.toThrow("Not Found");
        });
    });

    // ==================== createEvent TESTLERİ ====================
    describe("createEvent", () => {
        const validPayload: CreateEventDto = {
            clubId: "club-1",
            title: "Yeni Etkinlik",
            description: "Etkinlik açıklaması",
            date: "2026-07-01T14:00:00Z",
            location: "Ankara",
        };

        it("geçerli veri ile etkinlik oluşturmalı", async () => {
            // Arrange
            const createdEvent: Event = { ...mockEvent, ...validPayload, id: "evt-new" };
            (axiosInstance.post as jest.Mock).mockResolvedValue({ data: createdEvent });

            // Act
            const result = await eventService.createEvent(validPayload);

            // Assert
            expect(axiosInstance.post).toHaveBeenCalledWith("/events", validPayload);
            expect(result).toEqual(createdEvent);
        });

        it("eksik veri ile oluşturulamamalı (tarih zorunlu)", async () => {
            // Arrange
            const invalidPayload = {
                clubId: "club-1",
                title: "Eksik Etkinlik",
            } as CreateEventDto;
            const validationError = new Error("Validation Error: date is required");
            (axiosInstance.post as jest.Mock).mockRejectedValue(validationError);

            // Act & Assert
            await expect(eventService.createEvent(invalidPayload)).rejects.toThrow(
                "Validation Error: date is required",
            );
        });

        it("duplicate etkinlik adı kabul edilmemeli", async () => {
            // Arrange
            const duplicatePayload: CreateEventDto = {
                clubId: "club-1",
                title: "Mevcut Etkinlik",
                date: "2026-07-01T14:00:00Z",
                location: "İstanbul",
            };
            const conflictError = new Error("Conflict: Event with this title already exists");
            (axiosInstance.post as jest.Mock).mockRejectedValue(conflictError);

            // Act & Assert
            await expect(eventService.createEvent(duplicatePayload)).rejects.toThrow(
                "Conflict: Event with this title already exists",
            );
        });

        it("tüm alanlarla etkinlik oluşturmalı", async () => {
            // Arrange
            const fullPayload: CreateEventDto = {
                clubId: "club-1",
                title: "Tam Etkinlik",
                description: "Detaylı açıklama",
                date: "2026-08-01T18:00:00Z",
                location: "İzmir",
                imageUrl: "https://example.com/image.png",
                maxParticipants: 100,
                category: "Workshop",
            };
            const createdEvent: Event = { ...mockEvent, ...fullPayload, id: "evt-full" };
            (axiosInstance.post as jest.Mock).mockResolvedValue({ data: createdEvent });

            // Act
            const result = await eventService.createEvent(fullPayload);

            // Assert
            expect(axiosInstance.post).toHaveBeenCalledWith("/events", fullPayload);
            expect(result.maxParticipants).toBe(100);
            expect(result.category).toBe("Workshop");
        });
    });

    // ==================== updateEvent TESTLERİ ====================
    describe("updateEvent", () => {
        it("etkinlik bilgilerini güncellemeli", async () => {
            // Arrange
            const updatePayload: UpdateEventDto = {
                title: "Güncellenmiş Etkinlik",
                location: "Yeni Lokasyon",
            };
            const updatedEvent: Event = { ...mockEvent, ...updatePayload };
            (axiosInstance.patch as jest.Mock).mockResolvedValue({ data: updatedEvent });

            // Act
            const result = await eventService.updateEvent("evt-1", updatePayload);

            // Assert
            expect(axiosInstance.patch).toHaveBeenCalledWith("/events/evt-1", updatePayload);
            expect(result.title).toBe("Güncellenmiş Etkinlik");
            expect(result.location).toBe("Yeni Lokasyon");
        });

        it("sadece bir alanı güncellemeli (partial update)", async () => {
            // Arrange
            const partialPayload: UpdateEventDto = { maxParticipants: 600 };
            const updatedEvent: Event = { ...mockEvent, maxParticipants: 600 };
            (axiosInstance.patch as jest.Mock).mockResolvedValue({ data: updatedEvent });

            // Act
            const result = await eventService.updateEvent("evt-1", partialPayload);

            // Assert
            expect(axiosInstance.patch).toHaveBeenCalledWith("/events/evt-1", partialPayload);
            expect(result.maxParticipants).toBe(600);
            expect(result.title).toBe(mockEvent.title); // Diğer alanlar değişmedi
        });
    });

    // ==================== deleteEvent TESTLERİ ====================
    describe("deleteEvent", () => {
        it("etkinliği silmeli", async () => {
            // Arrange
            (axiosInstance.delete as jest.Mock).mockResolvedValue({ data: undefined });

            // Act
            await eventService.deleteEvent("evt-1");

            // Assert
            expect(axiosInstance.delete).toHaveBeenCalledWith("/events/evt-1");
        });

        it("yetkisiz kullanıcı hata almalı", async () => {
            // Arrange
            const unauthorizedError = new Error("Unauthorized: Only creator can delete event");
            (axiosInstance.delete as jest.Mock).mockRejectedValue(unauthorizedError);

            // Act & Assert
            await expect(eventService.deleteEvent("evt-1")).rejects.toThrow(
                "Unauthorized: Only creator can delete event",
            );
        });

        it("bulunamayan etkinlik silinememeli", async () => {
            // Arrange
            const notFoundError = new Error("Not Found: Event does not exist");
            (axiosInstance.delete as jest.Mock).mockRejectedValue(notFoundError);

            // Act & Assert
            await expect(eventService.deleteEvent("non-existent")).rejects.toThrow(
                "Not Found: Event does not exist",
            );
        });
    });

    // ==================== rsvpEvent TESTLERİ ====================
    describe("rsvpEvent", () => {
        it("GOING durumu ile RSVP yapmalı", async () => {
            // Arrange
            (axiosInstance.post as jest.Mock).mockResolvedValue({ data: undefined });

            // Act
            await eventService.rsvpEvent("evt-1", "GOING");

            // Assert
            expect(axiosInstance.post).toHaveBeenCalledWith("/events/evt-1/rsvp", {
                status: "GOING",
            });
        });

        it("INTERESTED durumu ile RSVP yapmalı", async () => {
            // Arrange
            (axiosInstance.post as jest.Mock).mockResolvedValue({ data: undefined });

            // Act
            await eventService.rsvpEvent("evt-1", "INTERESTED");

            // Assert
            expect(axiosInstance.post).toHaveBeenCalledWith("/events/evt-1/rsvp", {
                status: "INTERESTED",
            });
        });

        it("NOT_GOING durumu ile RSVP yapmalı", async () => {
            // Arrange
            (axiosInstance.post as jest.Mock).mockResolvedValue({ data: undefined });

            // Act
            await eventService.rsvpEvent("evt-1", "NOT_GOING");

            // Assert
            expect(axiosInstance.post).toHaveBeenCalledWith("/events/evt-1/rsvp", {
                status: "NOT_GOING",
            });
        });

        it("katılım sınırı dolmuş etkinlikte hata vermeli", async () => {
            // Arrange
            const capacityError = new Error("Event has reached maximum participants");
            (axiosInstance.post as jest.Mock).mockRejectedValue(capacityError);

            // Act & Assert
            await expect(eventService.rsvpEvent("evt-1", "GOING")).rejects.toThrow(
                "Event has reached maximum participants",
            );
        });
    });

    // ==================== cancelRSVP TESTLERİ ====================
    describe("cancelRSVP", () => {
        it("RSVP iptal etmeli", async () => {
            // Arrange
            (axiosInstance.delete as jest.Mock).mockResolvedValue({ data: undefined });

            // Act
            await eventService.cancelRSVP("evt-1");

            // Assert
            expect(axiosInstance.delete).toHaveBeenCalledWith("/events/evt-1/rsvp");
        });

        it("RSVP kaydı yoksa hata vermeli", async () => {
            // Arrange
            const noRsvpError = new Error("No RSVP found for this event");
            (axiosInstance.delete as jest.Mock).mockRejectedValue(noRsvpError);

            // Act & Assert
            await expect(eventService.cancelRSVP("evt-1")).rejects.toThrow(
                "No RSVP found for this event",
            );
        });
    });
});