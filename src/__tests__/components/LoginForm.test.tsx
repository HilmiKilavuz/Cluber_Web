/**
 * LOGIN FORM BİLEŞEN TESTLERİ (LoginForm.test.tsx)
 * 
 * Bu dosya LoginForm bileşeninin UI davranışlarını test eder.
 * 
 * BİLEŞEN TESTİ NEDİR?
 * ┌─────────────────────────────────────────────────────┐
 * │ Bileşen testi, React bileşenlerinin doğru render    │
 * │ edilip edilmediğini ve kullanıcı etkileşimlerine    │
 * │ doğru tepki verip vermediğini kontrol eder.         │
 * │                                                     │
 * │ render()        → Bileşeni ekrana çizer             │
 * │ screen.getBy    → Ekrandan element bulur            │
 * │ userEvent       → Kullanıcı davranışını taklit eder │
 * │                 (tıklama, yazma vb.)                │
 * └─────────────────────────────────────────────────────┘
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/auth/LoginForm";

// Next.js Link bileşenini	mock'la
// Next.js 16'da Link internal olarak IntersectionObserver kullanıyor
jest.mock("next/link", () => {
    return ({ children, ...props }: any) => {
        return <a {...props}>{children}</a>;
    };
});

// Next.js useRouter mock'u
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

// useAuth hook'unu mock'la
jest.mock("@/hooks/auth/useAuth", () => ({
    useAuth: () => ({
        loginMutation: {
            mutateAsync: jest.fn(),
            mutate: jest.fn(),
            isPending: false,
            isError: false,
            error: null,
        },
    }),
}));

// Import after mocking
import { useAuth } from "@/hooks/auth/useAuth";

describe("LoginForm", () => {

    // ==================== RENDER TESTLERİ ====================
    describe("Render", () => {
        it("form elemanları doğru render edilmeli", () => {
            // Arrange & Act
            render(<LoginForm />);

            // Assert
            // getByRole: Erişilebilirlik rolü ile element bulur
            // getByLabelText: label text'i ile input bulur
            expect(screen.getByLabelText(/e-posta/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/şifre/i)).toBeInTheDocument();
            expect(screen.getByRole("button", { name: /giriş yap/i })).toBeInTheDocument();
        });

        it("Kayıt ol linki render edilmeli", () => {
            // Arrange & Act
            render(<LoginForm />);

            // Assert
            expect(screen.getByRole("link", { name: /kayıt ol/i })).toBeInTheDocument();
        });

        it("Beni Hatırla checkbox'ı render edilmeli", () => {
            // Arrange & Act
            render(<LoginForm />);

            // Assert
            expect(screen.getByRole("checkbox", { name: /beni hatırla/i })).toBeInTheDocument();
        });
    });

    // ==================== VALIDASYON TESTLERİ ====================
    describe("Form Validasyonu", () => {
        it("email alanı boş olduğunda hata göstermeli", async () => {
            // Arrange
            render(<LoginForm />);
            const user = userEvent.setup();

            // Act: Submit butonuna tıkla (boş form)
            await user.click(screen.getByRole("button", { name: /giriş yap/i }));

            // Assert: Hata mesajını kontrol et
            await waitFor(() => {
                expect(screen.getByText(/geçerli bir e-posta/i)).toBeInTheDocument();
            });
        });

        it("email geçersiz formatta olduğunda hata göstermeli", async () => {
            // Arrange
            render(<LoginForm />);
            const user = userEvent.setup();

            // Act: Geçersiz email yaz
            const emailInput = screen.getByLabelText(/e-posta/i);
            await user.type(emailInput, "invalidemail");
            await user.click(screen.getByRole("button", { name: /giriş yap/i }));

            // Assert
            await waitFor(() => {
                expect(screen.getByText(/geçerli bir e-posta/i)).toBeInTheDocument();
            });
        });

        it("şifre 6 karakterden az olduğunda hata göstermeli", async () => {
            // Arrange
            render(<LoginForm />);
            const user = userEvent.setup();

            // Act: Kısa şifre yaz
            const passwordInput = screen.getByLabelText(/şifre/i);
            await user.type(passwordInput, "12345");
            await user.click(screen.getByRole("button", { name: /giriş yap/i }));

            // Assert
            await waitFor(() => {
                expect(screen.getByText(/en az 6 karakter/i)).toBeInTheDocument();
            });
        });

        it("geçerli bilgilerle hata olmamalı", async () => {
            // Arrange
            const mockLogin = jest.fn().mockResolvedValue({});
            jest.spyOn(require("@/hooks/auth/useAuth"), "useAuth").mockReturnValue({
                loginMutation: {
                    mutateAsync: mockLogin,
                    mutate: jest.fn(),
                    isPending: false,
                    isError: false,
                    error: null,
                },
            });

            render(<LoginForm />);
            const user = userEvent.setup();

            // Act: Geçerli bilgiler yaz
            await user.type(screen.getByLabelText(/e-posta/i), "test@example.com");
            await user.type(screen.getByLabelText(/şifre/i), "password123");
            await user.click(screen.getByRole("button", { name: /giriş yap/i }));

            // Assert
            await waitFor(() => {
                expect(mockLogin).toHaveBeenCalledWith({
                    email: "test@example.com",
                    password: "password123",
                    rememberMe: false,
                });
            });
        });
    });

    // ==================== KULLANICI ETKİLEŞİM TESTLERİ ====================
    describe("Kullanıcı Etkileşimi", () => {
        it("Kayıt ol linkine tıklandığında yönlendirme yapılmalı", async () => {
            // Arrange
            render(<LoginForm />);
            const user = userEvent.setup();

            // Act
            await user.click(screen.getByRole("link", { name: /kayıt ol/i }));

            // Assert: Link href'i kontrol edilir
            expect(screen.getByRole("link", { name: /kayıt ol/i })).toHaveAttribute("href", "/register");
        });

        it("submit butonu disabled olduğunda tıklanamamalı", async () => {
            // Arrange
            jest.spyOn(require("@/hooks/auth/useAuth"), "useAuth").mockReturnValue({
                loginMutation: {
                    mutateAsync: jest.fn(),
                    mutate: jest.fn(),
                    isPending: true, // Loading durumunda
                    isError: false,
                    error: null,
                },
            });

            render(<LoginForm />);

            // Assert: Buton disabled olmalı
            expect(screen.getByRole("button", { name: /giriş yapılıyor/i })).toBeDisabled();
        });
    });

    // ==================== HATA DURUMU TESTLERİ ====================
    describe("Hata Durumları", () => {
        it("login başarısız olduğunda hata mesajı gösterilmeli", async () => {
            // Arrange
            const mutationError = new Error("Geçersiz e-posta veya şifre");
            jest.spyOn(require("@/hooks/auth/useAuth"), "useAuth").mockReturnValue({
                loginMutation: {
                    mutateAsync: jest.fn(),
                    mutate: jest.fn(),
                    isPending: false,
                    isError: true,
                    error: mutationError,
                },
            });

            render(<LoginForm />);

            // Assert: Hata mesajı görünmeli
            expect(screen.getByText(/geçersiz e-posta veya şifre/i)).toBeInTheDocument();
        });
    });
});