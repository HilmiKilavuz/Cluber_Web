import '@testing-library/jest-dom';

// ========================================
// JEST SETUP DOSYASI
// ========================================
// Bu dosya her test çalışmadan önce otomatik yüklenir.
// İçindeki mock'lar ve yapılandırmalar tüm testleri etkiler.

// --- Window.matchMedia Mock ---
// Next.js ve bazı UI bileşenleri matchMedia kullanır, Jest ortamında bu yoktur.
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// --- localStorage Mock ---
// Jest jsdom ortamında localStorage düzgün çalışmayabilir.
const localStorageMock: Storage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// --- ResizeObserver Mock ---
// Bazı bileşenler ResizeObserver kullanır, Jest'te mock'lanmalı.
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// --- IntersectionObserver Mock ---
// Scroll ve lazy loading bileşenleri için gerekli.
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockImplementation(() => ({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
}));
global.IntersectionObserver = mockIntersectionObserver;

// --- Console Error Suppress ---
// Test sırasında beklenen hatalar console.error'ı kirletmesin.
// Gerçek hataları görmek için bu mock'u gerektiğinde devre dışı bırakabilirsiniz.
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
    // React Testing Library'nin bazı beklenen hatalarını bastır
    if (
        typeof args[0] === 'string' &&
        (args[0].includes('Warning: ReactDOM.render') ||
            args[0].includes('not wrapped in act') ||
            args[0].includes('An update to') ||
            args[0].includes('A suspended resource finished loading'))
    ) {
        return;
    }
    originalConsoleError(...args);
};

// Her test öncesi localStorage'ı temizle
beforeEach(() => {
    (window.localStorage.getItem as jest.Mock).mockClear();
    (window.localStorage.setItem as jest.Mock).mockClear();
    (window.localStorage.removeItem as jest.Mock).mockClear();
    (window.localStorage.clear as jest.Mock).mockClear();
});

// Her test sonrası temizlik
afterEach(() => {
    jest.clearAllMocks();
});