/**
 * AUTH SERVİSİ TESTLERİ
 * 
 * Bu dosya authService fonksiyonlarını test eder.
 * 
 * TEST AÇIKLAMALARI:
 * - describe(): Test gruplarını tanımlar
 * - it() veya test(): Tekil test senaryosu tanımlar
 * - expect(): Beklenen sonucu doğrular (assertion)
 * - jest.fn(): Mock fonksiyon oluşturur
 * - beforeEach(): Her test öncesi çalışır
 * - mockResolvedValue(): Fonksiyonun başarılı dönüşünü simüle eder
 * - mockRejectedValue(): Fonksiyonun hata durumunu simüle eder
 */

// Axios instance'ı mock'la — gerçek HTTP isteği göndermesin
jest.mock("@/services/axiosInstance", () => ({
    axiosInstance: {
        post: jest.fn(),
        get: jest.fn(),
        patch: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    },
}));

// Mock'lanmış axios instance'ı import et
import { axiosInstance } from "@/services/axiosInstance";
import { authService } from "@/services/auth/auth.service";
import type { AuthUser, LoginDto, RegisterDto, VerifyEmailDto } from "@/types/auth";

// Her test öncesi mock'ları sıfırla
beforeEach(() => {
    jest.clearAllMocks();
});

// Test grubu: authService
describe("authService", () => {

    // ==================== LOGIN TESTLERİ ====================
    describe("login", () => {
        // Test senaryosu 1: Başarılı login
        it("başarılı login olduğunda kullanıcı verisini dönmeli", async () => {
            // Arrange (Hazırlık): Mock verileri tanımla
            const mockUser: AuthUser = {
                id: "user-1",
                email: "test@example.com",
                displayName: "Test User",
                role: "MEMBER",
            };
            const mockResponse = { user: mockUser, accessToken: "fake-jwt-token" };
            const loginPayload: LoginDto = {
                email: "test@example.com",
                password: "password123",
            };

            // axiosInstance.post çağrıldığında mockResponse döndürsün
            (axiosInstance.post as jest.Mock).mockResolvedValue({
                data: mockResponse,
            });

            // Act (Eylem): Test edilecek fonksiyonu çağır
            const result = await authService.login(loginPayload);

            // Assert (Doğrulama): Sonuçları kontrol et
            expect(result).toEqual(mockResponse);

            // axiosInstance.post doğru endpoint ve parametrelerle çağrılmış mı?
            expect(axiosInstance.post).toHaveBeenCalledWith(
                "/auth/login",
                { email: "test@example.com", password: "password123" }, // rememberMe API'ye gönderilmez
            );
        });

        // Test senaryosu 2: rememberMe flag'i ile login
        it("rememberMe true olduğunda, API payload'dan çıkarılmalı", async () => {
            // Arrange
            const mockUser: AuthUser = {
                id: "user-1",
                email: "test@example.com",
                displayName: "Test User",
                role: "MEMBER",
            };
            const loginPayload: LoginDto = {
                email: "test@example.com",
                password: "password123",
                rememberMe: true, // Bu flag API'ye gönderilmemeli
            };

            (axiosInstance.post as jest.Mock).mockResolvedValue({
                data: { user: mockUser, accessToken: "token" },
            });

            // Act
            await authService.login(loginPayload);

            // Assert
            expect(axiosInstance.post).toHaveBeenCalledWith(
                "/auth/login",
                { email: "test@example.com", password: "password123" }, // rememberMe excluded!
            );
        });

        // Test senaryosu 3: Login hatası
        it("başarısız login olduğunda hata fırlatmalı", async () => {
            // Arrange
            const mockError = new Error("Invalid credentials");
            const loginPayload: LoginDto = {
                email: "wrong@example.com",
                password: "wrongpassword",
            };

            (axiosInstance.post as jest.Mock).mockRejectedValue(mockError);

            // Act & Assert
            await expect(authService.login(loginPayload)).rejects.toThrow(
                "Invalid credentials",
            );
        });
    });

    // ==================== REGISTER TESTLERİ ====================
    describe("register", () => {
        it("başarılı kayıt olduğunda kullanıcı ve mesaj dönmeli", async () => {
            // Arrange
            const mockUser: AuthUser = {
                id: "new-user-1",
                email: "new@example.com",
                displayName: "New User",
                role: "MEMBER",
            };
            const mockResponse = {
                user: mockUser,
                message: "Kayıt başarılı! Doğrulama kodu e-posta adresinize gönderildi.",
            };
            const registerPayload: RegisterDto = {
                email: "new@example.com",
                displayName: "New User",
                password: "securePassword123",
            };

            (axiosInstance.post as jest.Mock).mockResolvedValue({
                data: mockResponse,
            });

            // Act
            const result = await authService.register(registerPayload);

            // Assert
            expect(result).toEqual(mockResponse);
            expect(axiosInstance.post).toHaveBeenCalledWith(
                "/auth/register",
                registerPayload,
            );
        });

        it("kayıt hatası olduğunda hata fırlatmalı", async () => {
            // Arrange
            const mockError = new Error("Email already exists");
            const registerPayload: RegisterDto = {
                email: "existing@example.com",
                displayName: "Existing User",
                password: "password123",
            };

            (axiosInstance.post as jest.Mock).mockRejectedValue(mockError);

            // Act & Assert
            await expect(authService.register(registerPayload)).rejects.toThrow(
                "Email already exists",
            );
        });
    });

    // ==================== GET SESSION TESTLERİ ====================
    describe("getSession", () => {
        it("aktif oturum olduğunda kullanıcı bilgisini dönmeli", async () => {
            // Arrange
            const mockUser: AuthUser = {
                id: "user-1",
                email: "test@example.com",
                displayName: "Test User",
                role: "ADMIN",
            };

            (axiosInstance.get as jest.Mock).mockResolvedValue({
                data: mockUser,
            });

            // Act
            const result = await authService.getSession();

            // Assert
            expect(result).toEqual(mockUser);
            expect(axiosInstance.get).toHaveBeenCalledWith("/auth/me", {
                headers: {
                    "x-silent-error": "true", // Sessiz hata header'ı gönderilmeli
                },
            });
        });

        it("oturum yoksa hata fırlatmalı", async () => {
            // Arrange
            const mockError = new Error("Unauthorized");
            (axiosInstance.get as jest.Mock).mockRejectedValue(mockError);

            // Act & Assert
            await expect(authService.getSession()).rejects.toThrow("Unauthorized");
        });
    });

    // ==================== LOGOUT TESTLERİ ====================
    describe("logout", () => {
        it("başarılı çıkış yapmalı", async () => {
            // Arrange
            (axiosInstance.post as jest.Mock).mockResolvedValue({ data: {} });

            // Act
            await authService.logout();

            // Assert
            expect(axiosInstance.post).toHaveBeenCalledWith("/auth/logout");
        });

        it("çıkış sırasında hata oluşursa hata fırlatmalı", async () => {
            // Arrange
            const mockError = new Error("Logout failed");
            (axiosInstance.post as jest.Mock).mockRejectedValue(mockError);

            // Act & Assert
            await expect(authService.logout()).rejects.toThrow("Logout failed");
        });
    });

    // ==================== EMAIL DOĞRULAMA TESTLERİ ====================
    describe("verifyEmail", () => {
        it("doğru doğrulama kodu ile email doğrulanmalı", async () => {
            // Arrange
            const mockResponse = {
                message: "E-posta başarıyla doğrulandı!",
                user: {
                    id: "user-1",
                    email: "test@example.com",
                    displayName: "Test User",
                    role: "MEMBER" as const,
                },
                accessToken: "verified-jwt-token",
            };
            const verifyPayload: VerifyEmailDto = {
                email: "test@example.com",
                code: "123456",
            };

            (axiosInstance.post as jest.Mock).mockResolvedValue({
                data: mockResponse,
            });

            // Act
            const result = await authService.verifyEmail(verifyPayload);

            // Assert
            expect(result).toEqual(mockResponse);
            expect(axiosInstance.post).toHaveBeenCalledWith(
                "/auth/verify-email",
                verifyPayload,
            );
        });

        it("yanlış doğrulama kodu ile hata dönmeli", async () => {
            // Arrange
            const mockError = new Error("Geçersiz doğrulama kodu");
            const verifyPayload: VerifyEmailDto = {
                email: "test@example.com",
                code: "000000", // Yanlış kod
            };

            (axiosInstance.post as jest.Mock).mockRejectedValue(mockError);

            // Act & Assert
            await expect(authService.verifyEmail(verifyPayload)).rejects.toThrow(
                "Geçersiz doğrulama kodu",
            );
        });
    });
});