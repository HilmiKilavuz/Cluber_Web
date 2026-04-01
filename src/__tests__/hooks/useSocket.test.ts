/**
 * USESOCKET HOOK TESTLERİ (useSocket.test.ts)
 * 
 * Bu dosya useSocket hook'unun Socket.IO ile entegrasyonunu test eder.
 * 
 * TEST STRATEJİSİ:
 * - Socket.IO client tamamen mock'lanır
 * - Event emitter pattern taklit edilir
 * - Mesaj gönderme/alma senaryoları test edilir
 */

import { renderHook, waitFor, act } from "@testing-library/react";
import { useSocket } from "@/hooks/chat/useSocket";
import { getSocket } from "@/lib/socket/socket";
import { chatService } from "@/services/chat/chat.service";
import type { Message } from "@/types/chat";

// Mock dependencies
jest.mock("@/lib/socket/socket", () => ({
    getSocket: jest.fn(),
}));

jest.mock("@/services/chat/chat.service", () => ({
    chatService: {
        getMessages: jest.fn(),
    },
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

// Storage mock
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

// Mock Socket.IO with jest.fn for tracking
let mockSocket: {
    connected: boolean;
    on: jest.Mock;
    off: jest.Mock;
    emit: jest.Mock;
    disconnect: jest.Mock;
    _listeners: Record<string, Function[]>;
    _trigger: (event: string, ...args: unknown[]) => void;
};

const createMockSocket = () => {
    const _listeners: Record<string, Function[]> = {};
    mockSocket = {
        connected: true,
        on: jest.fn((event: string, callback: Function) => {
            if (!_listeners[event]) _listeners[event] = [];
            _listeners[event].push(callback);
        }),
        off: jest.fn((event: string) => {
            delete _listeners[event];
        }),
        emit: jest.fn((event: string, data: unknown, callback?: Function) => {
            if (callback) callback({ id: "msg-new" });
        }),
        disconnect: jest.fn(),
        _listeners,
        _trigger: (event: string, ...args: unknown[]) => {
            if (_listeners[event]) {
                _listeners[event].forEach((cb) => cb(...args));
            }
        },
    };
    return mockSocket;
};

// Helper to wait for socket connection
const waitForConnection = async (socket: ReturnType<typeof createMockSocket>) => {
    await act(async () => {
        // Trigger connect event manually (simulates real socket.io behavior)
        socket._trigger("connect");
    });
};

describe("useSocket", () => {
    const mockClubId = "club-1";
    const mockMessages: Message[] = [
        {
            id: "msg-1",
            content: "Merhaba!",
            userId: "user-1",
            user: { id: "user-1", email: "test@test.com", displayName: "Test", role: "MEMBER" },
            clubId: mockClubId,
            createdAt: "2026-01-01T00:00:00Z",
        },
        {
            id: "msg-2",
            content: "Selam!",
            userId: "user-2",
            user: { id: "user-2", email: "test2@test.com", displayName: "Test2", role: "MEMBER" },
            clubId: mockClubId,
            createdAt: "2026-01-01T00:01:00Z",
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockLocalStorage.getItem.mockReturnValue("mock-token");
    });

    it("token olduğunda bağlanmalı ve geçmiş mesajları yüklemeli", async () => {
        // Arrange
        const socket = createMockSocket();
        (getSocket as jest.Mock).mockReturnValue(socket);
        (chatService.getMessages as jest.Mock).mockResolvedValue(mockMessages);

        // Act
        const { result } = renderHook(() => useSocket(mockClubId));

        // Trigger connect event
        await waitForConnection(socket);

        // Assert
        await waitFor(() => {
            expect(result.current.isConnected).toBe(true);
        });
        expect(result.current.isConnecting).toBe(false);
        expect(chatService.getMessages).toHaveBeenCalledWith(mockClubId);
    });

    it("token olmadığında bağlanmamalı", async () => {
        // Arrange
        mockLocalStorage.getItem.mockReturnValue(null);

        // Act
        const { result } = renderHook(() => useSocket(mockClubId));

        // Assert
        expect(result.current.isConnected).toBe(false);
        expect(result.current.isConnecting).toBe(false);
        expect(getSocket).not.toHaveBeenCalled();
    });

    it("geçmiş mesajlar yüklenmeli ve ters çevrilmeli", async () => {
        // Arrange
        const socket = createMockSocket();
        (getSocket as jest.Mock).mockReturnValue(socket);
        (chatService.getMessages as jest.Mock).mockResolvedValue(mockMessages);

        // Act
        const { result } = renderHook(() => useSocket(mockClubId));

        // Trigger connect event
        await waitForConnection(socket);

        // Assert
        await waitFor(() => {
            expect(result.current.messages.length).toBe(2);
        });
        // Messages should be reversed (newest first)
        expect(result.current.messages[0].id).toBe("msg-2");
        expect(result.current.messages[1].id).toBe("msg-1");
    });

    it("yeni mesaj geldiğinde messages state'e eklenmeli", async () => {
        // Arrange
        const socket = createMockSocket();
        (getSocket as jest.Mock).mockReturnValue(socket);
        (chatService.getMessages as jest.Mock).mockResolvedValue([]);

        const { result } = renderHook(() => useSocket(mockClubId));

        // Trigger connect event
        await waitForConnection(socket);

        // Wait for connection
        await waitFor(() => {
            expect(result.current.isConnected).toBe(true);
        });

        // Simulate new message
        const newMessage: Message = {
            id: "msg-3",
            content: "Yeni mesaj!",
            userId: "user-3",
            user: { id: "user-3", email: "user3@test.com", displayName: "User3", role: "MEMBER" },
            clubId: mockClubId,
            createdAt: "2026-01-01T00:02:00Z",
        };

        await act(async () => {
            socket._trigger("chat:new-message", newMessage);
        });

        // Assert
        expect(result.current.messages.some((m) => m.id === "msg-3")).toBe(true);
    });

    it("aynı mesaj iki kez eklenmemeli", async () => {
        // Arrange
        const socket = createMockSocket();
        (getSocket as jest.Mock).mockReturnValue(socket);
        (chatService.getMessages as jest.Mock).mockResolvedValue([]);

        const { result } = renderHook(() => useSocket(mockClubId));

        // Trigger connect event
        await waitForConnection(socket);

        // Wait for connection
        await waitFor(() => {
            expect(result.current.isConnected).toBe(true);
        });

        const newMessage: Message = {
            id: "msg-duplicate",
            content: "Duplicate",
            userId: "user-1",
            user: { id: "user-1", email: "test@test.com", displayName: "Test", role: "MEMBER" },
            clubId: mockClubId,
            createdAt: "2026-01-01T00:00:00Z",
        };

        // Trigger twice
        await act(async () => {
            socket._trigger("chat:new-message", newMessage);
            socket._trigger("chat:new-message", newMessage);
        });

        // Assert
        const count = result.current.messages.filter((m) => m.id === "msg-duplicate").length;
        expect(count).toBeLessThanOrEqual(1);
    });

    it("mesaj gönderildiğinde emit çağrılmalı", async () => {
        // Arrange
        const socket = createMockSocket();
        (getSocket as jest.Mock).mockReturnValue(socket);
        (chatService.getMessages as jest.Mock).mockResolvedValue([]);

        const { result } = renderHook(() => useSocket(mockClubId));

        // Trigger connect event
        await waitForConnection(socket);

        // Wait for connection
        await waitFor(() => {
            expect(result.current.isConnected).toBe(true);
        });

        // Act
        await act(async () => {
            result.current.sendMessage("Test mesajı");
        });

        // Assert
        expect(socket.emit).toHaveBeenCalledWith(
            "chat:send-message",
            { clubId: mockClubId, content: "Test mesajı" },
            expect.any(Function),
        );
    });

    it("bağlantı yoksa mesaj gönderilememeli", async () => {
        // Arrange
        const socket = createMockSocket();
        socket.connected = false;
        (getSocket as jest.Mock).mockReturnValue(socket);
        (chatService.getMessages as jest.Mock).mockResolvedValue([]);

        const { result } = renderHook(() => useSocket(mockClubId));

        // Act
        await act(async () => {
            result.current.sendMessage("Test mesajı");
        });

        // Assert
        const { toast } = await import("sonner");
        expect(toast.error).toHaveBeenCalledWith("Bağlantı yok, mesaj gönderilemedi.");
    });

    it("socket exception durumunda hata toast gösterilmeli", async () => {
        // Arrange
        const socket = createMockSocket();
        (getSocket as jest.Mock).mockReturnValue(socket);
        (chatService.getMessages as jest.Mock).mockResolvedValue([]);

        const { result } = renderHook(() => useSocket(mockClubId));

        // Trigger connect event
        await waitForConnection(socket);

        // Wait for connection
        await waitFor(() => {
            expect(result.current.isConnected).toBe(true);
        });

        // Simulate exception
        await act(async () => {
            socket._trigger("exception", { message: "Bir hata oluştu" });
        });

        // Assert
        const { toast } = await import("sonner");
        expect(toast.error).toHaveBeenCalledWith("Bir hata oluştu");
    });

    it("disconnect durumunda isConnected false olmalı", async () => {
        // Arrange
        const socket = createMockSocket();
        (getSocket as jest.Mock).mockReturnValue(socket);
        (chatService.getMessages as jest.Mock).mockResolvedValue([]);

        const { result } = renderHook(() => useSocket(mockClubId));

        // Trigger connect event
        await waitForConnection(socket);

        // Wait for connection
        await waitFor(() => {
            expect(result.current.isConnected).toBe(true);
        });

        // Simulate disconnect
        await act(async () => {
            socket._trigger("disconnect", "io server disconnect");
        });

        // Assert
        expect(result.current.isConnected).toBe(false);
    });

    it("geçmiş mesaj yüklenemezse hata console'a yazılmalı", async () => {
        // Arrange
        const socket = createMockSocket();
        (getSocket as jest.Mock).mockReturnValue(socket);
        (chatService.getMessages as jest.Mock).mockRejectedValue(new Error("Network Error"));

        const consoleSpy = jest.spyOn(console, "error").mockImplementation();

        // Act
        renderHook(() => useSocket(mockClubId));

        // Trigger connect event
        await waitForConnection(socket);

        // Assert
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalled();
        });

        consoleSpy.mockRestore();
    });
});