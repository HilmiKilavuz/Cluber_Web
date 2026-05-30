<div align="center">
  <img src="https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=Cluber" alt="Cluber Logo" width="120" height="120">
  <br/>
  <h1>Cluber Web</h1>
  <p><strong>Üniversite ve Topluluk Kulüplerini Dijital Ortamda Yönetmek İçin Geliştirilmiş Modern Web Platformu</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Socket.io-v4-010101?style=flat&logo=socket.io&logoColor=white" alt="Socket.io" />
    <img src="https://img.shields.io/badge/Test%20Coverage-111%20Tests-brightgreen?style=flat" alt="Test Coverage" />
  </p>
</div>

---

## 📋 İçindekiler

1. [Projenin Amacı](#-projenin-amacı)
2. [Temel Özellikler](#-temel-özellikler)
3. [Mimari Genel Bakış](#-mimari-genel-bakış)
4. [Teknoloji Stack'i](#-teknoloji-stacki)
5. [Veri Akışı](#-veri-akışı)
6. [Klasör Yapısı](#-klasör-yapısı)
7. [Kimlik Doğrulama](#-kimlik-doğrulama-akışı)
8. [Gerçek Zamanlı Sohbet](#-gerçek-zamanlı-sohbet-socketio)
9. [Test Altyapısı](#-test-altyapısı)
10. [API Endpoint'leri](#-api-endpointleri)
11. [Kullanıcı Rolleri](#-kullanıcı-rolleri)
12. [Kurulum ve Çalıştırma](#-kurulum-ve-çalıştırma)
13. [Geliştirme Komutları](#-geliştirme-komutları)
14. [Ortam Değişkenleri](#-ortam-değişkenleri)

---

## 🎯 Projenin Amacı

**Cluber Web**, üniversite öğrencileri ve topluluk üyelerinin kulüpleri dijital ortamda yönetmelerini sağlayan kapsamlı bir web uygulamasıdır. Platform, geleneksel kulüp faaliyetlerini modernize ederek kullanıcıların kesintisiz ve hızlı bir deneyim yaşamasını hedeflemektedir.

### Temel Hedefler

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cluber Web - Temel Hedefler                   │
├─────────────────────────────────────────────────────────────────┤
│  🏢 Kulüp Yönetimi   │ Kulüp oluşturma, keşfetme, katılma       │
│  💬 Gerçek Zamanlı   │ Socket.IO ile anlık mesajlaşma           │
│  📅 Etkinlik Sistemi │ Oluşturma, RSVP, hatırlatıcı e-posta    │
│  🔐 Güvenlik         │ JWT tabanlı kimlik doğrulama              │
│  🇹🇷 Türkçe Arayüz   │ Tam Türkçe kullanıcı deneyimi            │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Temel Özellikler

| Özellik | Açıklama | Teknoloji |
|---------|----------|-----------|
| 🏢 **Kulüp Keşfi** | Çeşitli ilgi alanlarına hitap eden kulüpleri bulma, filtreleme ve katılma | React Query + Pagination |
| 📋 **Kulüp Yönetimi** | Kulüp oluşturma, düzenleme, üye yönetimi, admin paneli | CRUD API + React Query |
| 💬 **Gerçek Zamanlı İletişim** | Kulüp bazlı entegre chat odalarında anlık mesajlaşma | Socket.IO Client v4 |
| 🤖 **Yapay Zeka Destekli Profil Analizi** | Kullanıcının kulüplerine göre karakter yorumu ve akıllı kulüp önerileri | OpenRouter AI + React Query |
| 📅 **Etkinlik Yönetimi** | Geçmiş ve gelecek etkinliklerin takibi, RSVP sistemi | Form + Date-fns |
| 📧 **Otomatik Hatırlatma** | Etkinlik başlangıcına 24 saat kalan katılımcılara e-posta | Backend Cron Job |
| ✉️ **E-posta Doğrulama** | Kayıt sonrası 6 haneli doğrulama kodu | Nodemailer |
| 🌙 **Dark Mode** | Karanlık/aydınlık tema desteği | Tailwind CSS dark: |
| 📱 **Responsive Tasarım** | Mobil uyumlu arayüz | Tailwind CSS v4 |

---

## 🏗️ Mimari Genel Bakış

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Cluber Web - Sistem Mimarisi                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐          ┌─────────────────┐                          │
│  │   Cluber_Web    │   HTTP   │ Cluber_Backend   │                          │
│  │   (Frontend)    │◄────────►│   (Backend)      │                          │
│  │  Next.js 16     │   REST   │  NestJS + Prisma │                          │
│  │  Port: 3001     │          │  Port: 3000      │                          │
│  └────────┬────────┘          └────────┬────────┘                          │
│           │                            │                                    │
│           │                            │                                    │
│  ┌────────▼────────┐          ┌────────▼────────┐                          │
│  │  Socket.IO WS   │◄────────►│  Socket.IO Server│                         │
│  │  (Real-time)    │   WS     │  (Gateway)       │                          │
│  └─────────────────┘          └─────────────────┘                          │
│                                    │                                        │
│                          ┌─────────▼─────────┐                              │
│                          │   PostgreSQL DB    │                              │
│                          │   (Docker)         │                              │
│                          └───────────────────┘                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Katmanlı Mimatri

```
┌──────────────────────────────────────────────────────────────┐
│                     Frontend Katmanları                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  📄 Sayfalar (Pages)                                   │  │
│  │  app/login, app/clubs, app/events                      │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────────┐  │
│  │  🧩 Bileşenler (Components)                             │  │
│  │  LoginForm, ClubCard, ChatWindow, EventForm            │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────────┐  │
│  │  ⚓ Custom Hooks                                         │  │
│  │  useAuth, useClubs, useEvents, useSocket               │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────────┐  │
│  │  🔧 Servis Katmanı (Services)                           │  │
│  │  authService, clubService, eventService                │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────────┐  │
│  │  🌐 HTTP/WebSocket Katmanı                              │  │
│  │  axiosInstance + Socket.IO Client                      │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Teknoloji Stack'i

### Frontend Teknolojileri

| Katman | Teknoloji | Versiyon | Açıklama |
|--------|-----------|----------|----------|
| **Framework** | Next.js | 16.x | App Router, SSR/CSR desteği |
| **UI Kütüphanesi** | React | 19.x | Bileşen tabanlı arayüz |
| **Dil** | TypeScript | 5.x | Tip güvenliği |
| **Stil** | Tailwind CSS | v4 | Utility-first CSS framework |
| **İkonlar** | Lucide React | Latest | Modern ikon seti |
| **Form** | react-hook-form | Latest | Performanslı form yönetimi |
| **Validasyon** | Zod | Latest | Schema-based validation |
| **State Yönetimi** | React Query | v5 | Server state management |
| **Global State** | Zustand | Latest | Lightweight store |
| **HTTP** | Axios | Latest | API istemcisi |
| **WebSocket** | Socket.IO Client | v4 | Real-time iletişim |
| **Toast** | Sonner | Latest | Bildirim sistemi |
| **Tarih** | date-fns | Latest | Tarih işlemleri |

### Test Teknolojileri

| Teknoloji | Açıklama |
|-----------|----------|
| **Jest** | Test framework (birim testleri) |
| **Testing Library** | React bileşen ve hook testleri |
| **Playwright** | E2E (uçtan uca) testleri |

### Backend Teknolojileri

| Teknoloji | Açıklama |
|-----------|----------|
| **NestJS** | Backend framework |
| **Prisma** | ORM (Type-güvenli veritabanı erişimi) |
| **PostgreSQL** | Ana veritabanı |
| **Redis** | Cache + Queue |
| **Socket.IO** | Real-time gateway |
| **JWT** | Kimlik doğrulama |
| **Nodemailer** | E-posta gönderimi |
| **Cloudinary** | Medya depolama |

---

## 🔄 Veri Akışı

### Auth Akışı

```
┌──────────┐     Login     ┌───────────┐     Token     ┌──────────┐
│          │ ────────────► │           │ ────────────► │          │
│  Client  │               │  Backend  │               │   JWT    │
│          │ ◄──────────── │           │ ◄──────────── │  Verify  │
└────┬─────┘   Response    └─────┬─────┘   Token       └──────────┘
     │                            │
     │  Store Token               │  Store in DB
     ▼                            ▼
┌──────────┐               ┌───────────┐
│ LocalSt. │               │ PostgreSQL│
└──────────┘               └───────────┘
```

### Sohbet Akışı

```
┌──────────┐    Connect    ┌───────────┐     Join     ┌──────────┐
│          │ ────────────► │           │ ────────────► │          │
│  Client  │               │ Socket.IO  │               │  Room    │
│  Socket  │ ◄──────────── │  Server   │ ◄──────────── │  (Club)  │
└────┬─────┘   History     └─────┬─────┘   Messages    └──────────┘
     │                            │
     │  Emit Message              │  Broadcast
     ▼                            ▼
┌──────────┐               ┌───────────┐
│  UI'da   │               │  Other    │
│  Göster  │               │  Clients  │
└──────────┘               └───────────┘
```

### Etkinlik RSVP Akışı

```
┌──────────┐   RSVP       ┌───────────┐  Güncelle    ┌──────────┐
│          │ ────────────► │           │ ────────────► │          │
│  Client  │               │  Backend  │               │PostgreSQL│
│          │ ◄──────────── │           │ ◄──────────── │          │
└──────────┘  Success      └─────┬─────┘   Updated     └──────────┘
                                 │
                                 │  24h Cron
                                 │  Reminder
                                 ▼
                          ┌───────────┐
                          │ Nodemailer│
                          │ E-posta   │
                          └───────────┘
```

---

## 📁 Klasör Yapısı

```
Cluber_Web/
├── middleware.ts                    # JWT cookie kontrolü ile route koruması
├── next.config.ts                   # Next.js konfigürasyonu
├── package.json                     # Bağımlılıklar ve script'ler
├── playwright.config.ts             # Playwright E2E yapılandırması
├── jest.config.ts                   # Jest test yapılandırması
├── jest.setup.ts                    # Jest mock'ları ve setup
├── postcss.config.mjs               # PostCSS yapılandırması
├── tsconfig.json                    # TypeScript yapılandırması
│
├── e2e/                             # 🎭 E2E Testleri (Playwright)
│   ├── auth.spec.ts                 # Auth akış testleri
│   ├── clubs.spec.ts                # Kulüp akış testleri
│   └── events.spec.ts               # Etkinlik akış testleri
│
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx               # Root layout (Providers)
│   │   ├── providers.tsx            # QueryClient + Toaster
│   │   ├── globals.css              # Tailwind base
│   │   ├── page.tsx                 # Landing Page
│   │   ├── login/page.tsx           # Giriş sayfası
│   │   ├── register/page.tsx        # Kayıt sayfası
│   │   ├── profile/page.tsx         # Profil sayfası
│   │   ├── clubs/
│   │   │   ├── page.tsx             # Kulüp listesi
│   │   │   ├── create/page.tsx      # Kulüp oluşturma
│   │   │   └── [id]/
│   │   │       ├── page.tsx         # Kulüp detay
│   │   │       ├── chat/page.tsx    # Sohbet odası
│   │   │       ├── events/page.tsx  # Kulüp etkinlikleri
│   │   │       ├── members/page.tsx # Üye listesi
│   │   │       ├── settings/page.tsx # Kulüp ayarları
│   │   │       └── admin/page.tsx   # Admin paneli
│   │   └── events/
│   │       └── create/page.tsx      # Etkinlik oluşturma
│   │
│   ├── components/                  # UI Bileşenleri
│   │   ├── auth/                    # LoginForm, RegisterForm, AuthShell
│   │   ├── clubs/                   # ClubCard, ClubForm
│   │   ├── events/                  # EventCard, EventForm, ParticipantsModal
│   │   ├── chat/                    # ChatWindow, MessageItem
│   │   ├── layout/                  # Header (nav + dark mode)
│   │   ├── profile/                 # ProfileComponents
│   │   └── ui/                      # ImageUpload vb.
│   │
│   ├── hooks/                       # Custom React Hooks
│   │   ├── auth/useAuth.ts          # session, login, register, logout
│   │   ├── clubs/useClubs.ts        # CRUD + join/leave/members
│   │   ├── events/useEvents.ts      # CRUD + RSVP
│   │   ├── chat/useSocket.ts        # Socket.IO bağlantı + mesaj
│   │   └── upload/useUpload.ts      # Dosya yükleme hook'u
│   │
│   ├── services/                    # API Servisleri
│   │   ├── axiosInstance.ts         # Axios (JWT + error handling)
│   │   ├── auth/                    # login, register, logout, verifyEmail
│   │   ├── clubs/                   # getClubs, createClub, joinClub...
│   │   ├── events/                  # CRUD events, RSVP
│   │   ├── chat/                    # getMessages (HTTP history)
│   │   ├── users/                   # getUser, updateUser
│   │   └── upload/                  # uploadFile
│   │
│   ├── types/                       # TypeScript Tanımları
│   │   ├── auth.ts                  # AuthUser, LoginDto, RegisterDto
│   │   ├── club.ts                  # Club, ClubMember, DTOs
│   │   ├── event.ts                 # Event, EventParticipant, RSVPStatus
│   │   ├── chat.ts                  # Message, ChatRoom, Socket events
│   │   └── api.ts                   # PaginatedResponse, ApiError
│   │
│   ├── lib/                         # Yardımcı Modüller
│   │   ├── api/                     # handleApiError, error mapping
│   │   ├── auth/                    # Auth utilities
│   │   ├── constants/env.ts         # Env değişkenleri wrapper
│   │   ├── socket/socket.ts         # Socket.IO factory (getSocket)
│   │   └── utils/                   # Utility fonksiyonlar
│   │
│   └── store/                       # Zustand Store
│       └── ui.store.ts              # UI state yönetimi
│
└── public/                          # Statik dosyalar
```

---

## 🔐 Kimlik Doğrulama Akışı

```
┌─────────────┐
│  Kullanıcı  │
│  Login/Reg  │
└──────┬──────┘
       │ POST /auth/login
       ▼
┌──────────────┐        ┌─────────────────┐
│   Backend    │───►   │   PostgreSQL     │
│  Authenticate│        │   (Verify)       │
└──────┬───────┘        └─────────────────┘
       │
       │ accessToken + user
       ▼
┌────────────────────────────────────────────┐
│                  Client                     │
├────────────────────────────────────────────┤
│  1. localStorage → accessToken saklama     │
│  2. Cookie (HTTP-only) → middleware kontrol│
│  3. GET /auth/me → oturum doğrulama         │
│  4. React Query cache → global state        │
└────────────────────────────────────────────┘
       │
       │ Her istekte: Authorization: Bearer <token>
       ▼
┌────────────────────────────────────────────┐
│           Korumalı Rotalar                  │
│  /clubs/create, /events/create, /chat      │
│  middleware.ts → JWT cookie kontrolü        │
└────────────────────────────────────────────┘
```

### Token Yönetimi

| Konum | Amaç | Erişim |
|-------|------|--------|
| `localStorage` | API çağrılarında Authorization header | JavaScript (axios interceptor) |
| HTTP-only Cookie | Route koruması | Server (middleware.ts) |
| `sessionStorage` | Geçici oturum verisi | JavaScript |

---

## 💬 Gerçek Zamanlı Sohbet (Socket.IO)

### Bağlantı Mimarisi

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Socket.IO Akışı                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────┐  connect(token)  ┌──────────────┐                     │
│  │ Client  │ ───────────────► │ Socket.IO    │                     │
│  │ useSock  │                  │   Server     │                     │
│  └────┬────┘                  └──────┬───────┘                     │
│       │                              │                              │
│       │ emit("chat:join-room")       │                              │
│       │ ──────────────────────────► │                              │
│       │                              │ emit("joined", history)      │
│       │ ◄────────────────────────── │                              │
│       │                              │                              │
│       │ emit("chat:send-message")    │                              │
│       │ ──────────────────────────► │ broadcast("chat:new-message") │
│       │                              │ ──────────────────────────► │
│       │ callback(id)                │                              │
│       │ ◄────────────────────────── │                              │
│       │                              │                              │
│  ┌────▼──────────────────────────────────────────────────────────┐ │
│  │  Events:                                                      │ │
│  │  Client → Server: join-room, send-message                    │ │
│  │  Server → Client: joined, new-message, exception             │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Socket Event'leri

| Yönde | Event | Payload | Açıklama |
|-------|-------|---------|----------|
| C → S | `chat:join-room` | `{ clubId }` | Odaya katıl |
| C → S | `chat:send-message` | `{ clubId, content }` | Mesaj gönder |
| S → C | `joined` | `{ clubId, messages[] }` | Geçmiş mesajlar |
| S → C | `chat:new-message` | `Message` | Yeni mesaj |
| S → C | `exception` | `{ message, statusCode }` | Hata |

---

## 🧪 Test Altyapısı

### Test Özeti

```
┌──────────────────────────────────────────────────────┐
│                 Test Dağılımı                        │
├──────────────────────────────────────────────────────┤
│                                                      │
│   Servis Testleri (Jest)  │  49 test │ ██████████   │
│   Hook Testleri (Jest)    │  46 test │ █████████    │
│   Component Testleri       │  10 test │ ██           │
│   E2E Testleri (Playwright)│   6 test │ █            │
│                                                      │
│   TOPLAM: 111 Test                                  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Test Dosyaları

#### Servis Testleri (49 test)

| Dosya | Test | Test Edilen Fonksiyonlar |
|-------|------|-------------------------|
| `auth.service.test.ts` | 12 | login, register, getSession, logout, verifyEmail |
| `club.service.test.ts` | 16 | getClubs, getClubById, createClub, updateClub, deleteClub, joinClub, leaveClub... |
| `event.service.test.ts` | 21 | getEvents, getEventById, createEvent, updateEvent, deleteEvent, RSVP (3 durum)... |

#### Hook Testleri (46 test)

| Dosya | Test | Test Edilen Hook'lar |
|-------|------|---------------------|
| `useAuth.test.ts` | 14 | sessionQuery, loginMutation, registerMutation, logoutMutation, verifyEmailMutation |
| `useClubs.test.ts` | 22 | useClubs, useClub, useClubBySlug, useCreateClub, useUpdateClub, useDeleteClub... |
| `useSocket.test.ts` | 10 | connect, sendMessage, new-message, exception, disconnect |

#### Bileşen Testleri (10 test)

| Dosya | Test | Test Edilen |
|-------|------|-------------|
| `LoginForm.test.tsx` | 10 | Render, validation, submit, error handling, navigation |

#### E2E Testleri (6 test)

| Dosya | Test | Senaryo |
|-------|------|---------|
| `auth.spec.ts` | 3 | Login form, validation errors, register navigation |
| `clubs.spec.ts` | 2 | Clubs page navigation, home page |
| `events.spec.ts` | 1 | Events page navigation |

### Test Komutları

```bash
# === JEST Birim Testleri ===
npm run test                   # Tüm birim testleri çalıştır
npm run test:watch             # Watch modu (değişikliklerde tekrar çalıştır)
npm run test:coverage          # Coverage raporu (HTML)
npm run test:verbose           # Detaylı çıktı

# Belirli test dosyası veya pattern
npm run test -- --testPathPatterns="services"     # Sadece servis testleri
npm run test -- --testPathPatterns="useAuth"      # Sadece useAuth hook testleri

# === Playwright E2E Testleri ===
npm run test:e2e               # Tüm E2E testleri (headless)
npm run test:e2e:ui            # Playwright UI modu (görsel)
npm run test:e2e:headed        # Tarayıcıyı göstererek çalıştır
```

### Mock Stratejisi

**Servis Testlerinde:**
```typescript
// axiosInstance tamamen mock'lanır
jest.mock("@/services/axiosInstance", () => ({
    axiosInstance: { post: jest.fn(), get: jest.fn(), ... },
}));
```

**Hook Testlerinde:**
```typescript
// Servisler mock'lanır, React Query wrapper kullanılır
jest.mock("@/services/clubs/club.service", () => ({
    clubService: { getClubs: jest.fn(), ... },
}));
```

**Bileşen Testlerinde:**
```typescript
// Next.js modülleri ve hook'lar mock'lanır
jest.mock("next/link", () => ({ children }) => <a>{children}</a>);
jest.mock("@/hooks/auth/useAuth", () => ({ useAuth: () => ({...}) }));
```

---

## 📡 API Endpoint'leri

### Auth

| Endpoint | Metod | Açıklama | Auth |
|----------|-------|----------|------|
| `/auth/login` | POST | Giriş yap | ❌ |
| `/auth/register` | POST | Kayıt ol | ❌ |
| `/auth/me` | GET | Mevcut oturumu getir | ✅ |
| `/auth/logout` | POST | Çıkış yap | ✅ |

### Clubs

| Endpoint | Metod | Açıklama | Auth |
|----------|-------|----------|------|
| `/clubs` | GET | Tüm kulüpleri listele (filtreleme, pagination) | ❌ |
| `/clubs/:id` | GET | ID ile kulüp getir | ❌ |
| `/clubs/slug/:slug` | GET | Slug ile kulüp getir | ❌ |
| `/clubs` | POST | Yeni kulüp oluştur | ✅ |
| `/clubs/:id` | PATCH | Kulüp güncelle | ✅ |
| `/clubs/:id` | DELETE | Kulüp sil | ✅ (OWNER) |
| `/clubs/:id/join` | POST | Kulübe katıl | ✅ |
| `/clubs/:id/leave` | POST | Kulüpten ayrıl | ✅ |
| `/clubs/my/joined` | GET | Üye olunan kulüpleri getir | ✅ |

### Events

| Endpoint | Metod | Açıklama | Auth |
|----------|-------|----------|------|
| `/events` | GET | Etkinlikleri listele (filtreleme) | ❌ |
| `/events/:id` | GET | Etkinlik detay | ❌ |
| `/events` | POST | Yeni etkinlik oluştur | ✅ |
| `/events/:id` | PATCH | Etkinlik güncelle | ✅ |
| `/events/:id` | DELETE | Etkinlik sil | ✅ |
| `/events/:id/rsvp` | POST | RSVP durumu güncelle | ✅ |

### Chat

| Tip | Açıklama |
|-----|----------|
| WebSocket | Socket.IO ile gerçek zamanlı mesajlaşma |
| HTTP `GET /chat/clubs/:id/messages` | Geçmiş mesajlar (sayfalama) |

### Users

| Endpoint | Metod | Açıklama | Auth |
|----------|-------|----------|------|
| `/users/me` | PATCH | Profil güncelle | ✅ |

---

## 👥 Kullanıcı Rolleri

### Sistem Rolleri

| Rol | Açıklama |
|-----|----------|
| `ADMIN` | Sistem yöneticisi - tüm kaynaklara erişim |
| `MODERATOR` | İçerik moderatörü - belirli yetkiler |
| `MEMBER` | Standart kullanıcı |

### Kulüp Üye Rolleri

| Rol | Yetkiler |
|-----|----------|
| `OWNER` | Kulüp silme, ayarlar, üye çıkarma, etkinlik yönetimi |
| `ADMIN` | Etkinlik oluşturma/düzenleme, üyelik onayı |
| `MODERATOR` | Mesaj moderasyonu, içerik denetimi |
| `MEMBER` | Katılım, mesaj gönderme, etkinliklere RSVP |

### Rol Hiyerarşisi

```
  ┌─────────┐
  │  OWNER  │  ← En yüksek yetki
  ├─────────┤
  │  ADMIN  │
  ├─────────┤
  │MODERATOR│
  ├─────────┤
  │ MEMBER  │  ← Temel yetki
  └─────────┘
```

---

## 🚀 Kurulum ve Çalıştırma

### Ön Koşullar

| Yazılım | Versiyon | Amaç |
|---------|----------|------|
| Node.js | 20.x+ | Frontend runtime |
| npm | Latest | Paket yöneticisi |
| Docker | Latest | Backend servisleri (PostgreSQL, Redis) |

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/HilmiKilavuz/Cluber_Web.git
cd Cluber_Web
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Ortam Değişkenlerini Yapılandırın

`.env.local` dosyası oluşturun:

```env
# Backend API URL'si
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Backend'i Başlatın (Docker)

```bash
# ../Cluber_Backend dizinine gidin
cd ../Cluber_Backend

# Docker servisleri başlat (PostgreSQL + Redis + API)
docker-compose -f docker-compose.dev.yml up -d
```

### 5. Frontend'i Başlatın

```bash
# Cluber_Web dizininde
npm run dev
```

🎉 Uygulama **http://localhost:3001** adresinde hizmet verir!

---

## ⚙️ Geliştirme Komutları

### Frontend

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu (port 3001, hot-reload) |
| `npm run build` | Production build |
| `npm start` | Production sunucu (önce build gerekir) |
| `npm run lint` | ESLint kontrolü |

### Test

| Komut | Açıklama |
|-------|----------|
| `npm run test` | Tüm Jest birim testleri |
| `npm run test:watch` | Watch modu |
| `npm run test:coverage` | Coverage raporu |
| `npm run test:e2e` | Playwright E2E testleri |
| `npm run test:e2e:ui` | Playwright UI modu |

### Backend

| Komut | Açıklama |
|-------|----------|
| `docker-compose -f docker-compose.dev.yml up -d` | Servisleri başlat |
| `docker-compose down` | Servisleri durdur |
| `docker-compose logs -f api` | API loglarını izle |

---

## 🔧 Ortam Değişkenleri

### Frontend (.env.local)

| Değişken | Açıklama | Örnek |
|----------|----------|-------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3000` |

### Backend (.env)

| Değişken | Açıklama | Örnek |
|----------|----------|-------|
| `DATABASE_URL` | PostgreSQL bağlantı dizesi | `postgresql://...` |
| `REDIS_URL` | Redis bağlantı URL'si | `redis://localhost:6379` |
| `JWT_SECRET` | JWT imzalama anahtarı | `your-secret` |
| `MAIL_HOST` | SMTP sunucusu | `smtp.gmail.com` |
| `MAIL_USER` | SMTP kullanıcı | `user@gmail.com` |
| `MAIL_PASS` | SMTP şifre | `app-password` |
| `CLOUDINARY_URL` | Cloudinary bağlantı | `cloudinary://...` |

---

## 📊 Proje Durumu

### Tamamlanan Özellikler (24/24)

✅ Landing Page  
✅ Kayıt & Giriş  
✅ JWT Kimlik Doğrulama  
✅ Route Koruması (middleware.ts)  
✅ Kulüp Listesi (filtreleme)  
✅ Kulüp Detay  
✅ Kulüp Oluşturma  
✅ Gerçek Zamanlı Sohbet (Socket.IO)  
✅ Servis Katmanı (auth, clubs, events, chat, users)  
✅ React Query Hooks  
✅ Dark Mode  
✅ Global Header  
✅ Profil Sayfası  
✅ Etkinlik Sayfası  
✅ Üye Listesi  
✅ Kulüp Ayarları  
✅ Etkinlik Oluşturma  
✅ Zustand Store  
✅ RSVP / Katılım  
✅ Profil Düzenleme  
✅ E-posta Doğrulama  
✅ Cron Job (Event Reminder)  
✅ Arama & Filtreleme  
✅ Yapay Zeka Destekli Profil Analizi (OpenRouter)  
✅ Test Altyapısı (111 test)  

### Yapılacaklar (İsteğe Bağlı)

| Özellik | Durum |
|---------|-------|
| Ek Bileşen Testleri (ClubCard, EventCard, ChatWindow) | 📋 Planlandı |
| Admin Paneli (Moderasyon ekranları) | 📋 Planlandı |
| Medya Paylaşımı (Sohbette görsel/doküman) | 📋 Planlandı |

---

<div align="center">
  <sub>Cluber Web - Ekip Çalışması, Topluluk İletişimi ve Moderasyon İçin Geliştirildi.</sub>
  <br/>
  <sub>Copyright 2024-2026 Cluber Team. Tüm hakları saklıdır.</sub>
</div>