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
  </p>
</div>

---

## Projenin Amacı

**Cluber Web**, üniversite öğrencileri ve topluluk üyelerinin kulupleri dijital ortamda yönetmelerini sağlayan kapsamlı bir web uygulamasıdır. Platform, geleneksel kulüp faaliyetlerini modernize ederek kullanıcıların kesintisiz ve hızlı bir deneyim yaşamasını hedeflemektedir.

### Temel Hedefler

- Kullanıcıların **kulüp oluşturabilmesi**, katılabilmesi ve yönetebilmesi
- Kulüp içinde **gerçek zamanlı sohbet** (Socket.IO) yapılabilmesi
- Kulüplere bağlı **etkinlikler** oluşturulabilmesi ve RSVP (Katılım Durumu) takibi yapılabilmesi
- **JWT tabanlı kimlik doğrulama** ile güvenli oturum yönetimi sağlanması
- Uygulamanın **Türkçe arayüz** ile sunulması

---

## Özellikler

| Özellik | Açıklama |
|---------|----------|
| Kulüp Keşfi | Çeşitli ilgi alanlarına hitap eden kulupleri bulma, filtreleme ve katılma |
| Kulüp Yönetimi | Kendi kulupleri oluşturma, üye ve etkinlik süreçlerini yönetme |
| Gerçek Zamanlı İletişim | Kulüp bazlı entegre chat odalarında anlık mesajlaşma |
| Etkinlik Yönetimi | Geçmiş ve gelecek etkinliklerin takibi, RSVP sistemi |
| Otomatik Hatırlatma | Etkinlik başlangıcına 24 saat kalan katılımcılara e-posta |

---

## Teknoloji Stack'i

| Katman | Teknoloji |
|--------|-----------|
| Framework | **Next.js 16** (App Router, `"use client"`) |
| Programlama Dili | **TypeScript 5**, **React 19** |
| Stil | **Tailwind CSS v4** (PostCSS entegrasyonu) |
| İkonset | **Lucide React** |
| HTTP İstemcisi | **Axios** (`axiosInstance` wrapper) |
| Sunucu Durum Yönetimi | **@tanstack/react-query v5** |
| Form Yönetimi | **react-hook-form** + **Zod** (validation) |
| Gerçek Zamanlı | **Socket.IO Client v4** |
| Toast Bildirimleri | **Sonner** |
| Tarih İşleme | **date-fns** |
| Port | **3001** (`next dev -p 3001`) |

---

## Klasör Yapısı

```
Cluber_Web/
├── middleware.ts                    # Route koruması (JWT cookie kontrolü)
├── next.config.ts                   # Next.js konfigürasyonu
├── package.json                     # Proje bağımlılıkları
├── postcss.config.mjs               # PostCSS konfigürasyonu
├── tsconfig.json                    # TypeScript konfigürasyonu
│
└── src/
    ├── app/                         # Next.js App Router sayfaları
    │   ├── layout.tsx               # Root layout (Providers sarmalayıcı)
    │   ├── providers.tsx            # QueryClientProvider + Toaster
    │   ├── globals.css              # Tailwind temel stilleri
    │   ├── page.tsx                 # Ana sayfa (Landing Page)
    │   ├── login/                   # Giriş sayfası
    │   ├── register/                # Kayıt sayfası
    │   ├── profile/                  # Kullanıcı profili
    │   ├── clubs/                   # Kulüp listesi ve oluşturma
    │   │   ├── page.tsx             # Kulüp keşif sayfası
    │   │   ├── create/              # Kulüp oluşturma formu
    │   │   └── [id]/                # Kulüp detay sayfası
    │   │       ├── page.tsx         # Kulüp detayları
    │   │       ├── chat/            # Kulüp sohbet odası
    │   │       ├── events/          # Kulüp etkinlikleri
    │   │       ├── members/         # Kulüp üyeleri
    │   │       └── settings/        # Kulüp ayarları
    │   └── events/
    │       └── create/             # Etkinlik oluşturma
    │
    ├── components/                  # Yeniden kullanılabilir UI bileşenleri
    │   ├── auth/                    # AuthFormShell, LoginForm, RegisterForm
    │   ├── clubs/                   # ClubCard, ClubForm
    │   ├── events/                  # EventCard, EventForm, ParticipantsModal
    │   ├── chat/                    # ChatWindow, MessageItem
    │   ├── layout/                  # Header (navigasyon + dark mode)
    │   └── profile/                 # ProfileComponents
    │
    ├── hooks/                       # Custom React hooks
    │   ├── auth/                    # useAuth (oturum, login, register, logout)
    │   ├── clubs/                   # useClubs (CRUD + join/leave)
    │   ├── events/                  # useEvents (CRUD)
    │   ├── chat/                    # useSocket (Socket.IO bağlantı)
    │   └── users/                   # useUser
    │
    ├── services/                    # API çağrı katmanı
    │   ├── axiosInstance.ts         # Axios yapılandırması
    │   ├── auth/                    # Auth servisleri
    │   ├── clubs/                   # Kulüp servisleri
    │   ├── events/                  # Etkinlik servisleri
    │   ├── chat/                    # Chat servisleri
    │   └── users/                   # Kullanıcı servisleri
    │
    ├── types/                       # TypeScript arayüz tanımları
    │   ├── auth.ts                   # AuthUser, LoginDto, RegisterDto
    │   ├── club.ts                   # Club, ClubMember, CreateClubDto
    │   ├── event.ts                  # Event, EventParticipant, RSVPStatus
    │   ├── chat.ts                   # Message, ChatRoom, Socket events
    │   └── api.ts                    # Genel API hata tipi
    │
    ├── lib/                         # Yardımcı araçlar
    │   ├── api/                     # handleApiError
    │   ├── auth/                    # Auth yardımcıları
    │   ├── constants/               # Ortam değişkenleri (env.ts)
    │   ├── socket/                  # Socket.IO bağlantı (socket.ts)
    │   └── utils/                   # Genel utility fonksiyonlar
    │
    └── store/                       # Global durum yönetimi
        └── ui.store.ts               # Zustand store (UI durumu)
```

---

## Kimlik Doğrulama Akışı

```
Kullanıcı Girişi/Kayıt
        ↓
authService.login() → POST /auth/login
        ↓
accessToken alınır → localStorage'a kaydedilir
        ↓
axiosInstance her istekte Authorization: Bearer <token> ekler
        ↓
authService.getSession() → GET /auth/me (silent error)
        ↓
useAuth hook → React Query cache güncellenir
        ↓
middleware.ts → Cookie tabanlı koruma
        ↓
Korumalı rotalar: /clubs/create, /clubs/[id]/settings
```

> **Önemli:** `accessToken` hem `localStorage`'a hem (backend tarafından) HTTP-only cookie'ye yazılabilir. Middleware cookie'yi kontrol eder, axios interceptor ise `localStorage`'ı kullanır.

---

## Gerçek Zamanlı Sohbet (Socket.IO)

- `lib/socket/socket.ts` → `getSocket(token)` ile bağlantı kurulur
- `useSocket(clubId)` hook'u:
  - `connect` → sunucuya bağlanır, `join` eventi gönderir
  - `joined` eventi → geçmiş mesajları (`history`) yükler
  - `message` eventi → anlık mesajları state'e ekler
  - `sendMessage(content)` → `sendMessage` eventi emit eder
  - `exception` eventi → `sonner` ile hata toast'ı gösterir

---

## Tamamlanan Özellikler

| No | Özellik | Durum |
|----|---------|-------|
| 1 | Landing Page (Hero, özellikler, stats, CTA, footer) | ✅ |
| 2 | Kayıt & Giriş sayfaları (react-hook-form + zod validation) | ✅ |
| 3 | JWT kimlik doğrulama akışı (localStorage + cookie) | ✅ |
| 4 | Route koruması (middleware.ts) | ✅ |
| 5 | Kulüp listesi sayfası (filtreleme desteği) | ✅ |
| 6 | Kulüp detay sayfası (üye bilgisi, banner, avatar, katıl/ayrıl) | ✅ |
| 7 | Kulüp oluşturma formu (`/clubs/create`) | ✅ |
| 8 | Gerçek zamanlı sohbet (Socket.IO entegrasyonu) | ✅ |
| 9 | Tüm servis katmanı (auth, clubs, events, chat) | ✅ |
| 10 | Tüm React Query hook'ları (auth, clubs, events) | ✅ |
| 11 | Dark mode desteği (Tailwind dark:) | ✅ |
| 12 | Global Header bileşeni | ✅ |
| 13 | Profil sayfası (temel) | ✅ |
| 14 | Kulüp Etkinlikleri sayfası (`/clubs/[id]/events`) | ✅ |
| 15 | Üye listesi sayfası (`/clubs/[id]/members`) | ✅ |
| 16 | Kulüp ayarları sayfası (`/clubs/[id]/settings`) | ✅ |
| 17 | Etkinlik oluşturma sayfası (`/events/create`) | ✅ |
| 18 | Zustand store (UI durumu) | ✅ |
| 19 | RSVP / Etkinlik katılım (ParticipantsModal) | ✅ |
| 20 | Profil düzenleme | ✅ |
| 21 | E-posta Doğrulama (6 haneli kod) | ✅ |
| 22 | Cron Job (Event Reminder - 24 saat kala) | ✅ |
| 23 | Arama & Filtreleme (debounce + URL senkronizasyonu) | ✅ |

---

## API Endpoint'leri

| Grup | Endpoint | Metod | Açıklama |
|------|----------|-------|----------|
| **Auth** | `/auth/login` | POST | Giriş yap |
| | `/auth/register` | POST | Kayıt ol |
| | `/auth/me` | GET | Mevcut oturumu getir |
| | `/auth/logout` | POST | Çıkış yap |
| **Clubs** | `/clubs` | GET | Tüm kulupleri listele |
| | `/clubs` | POST | Kulüp oluştur |
| | `/clubs/:id` | GET | ID ile kulüp getir |
| | `/clubs/slug/:slug` | GET | Slug ile kulüp getir |
| | `/clubs/:id` | PATCH | Kulüp güncelle |
| | `/clubs/:id` | DELETE | Kulüp sil |
| | `/clubs/:id/join` | POST | Kulübe katıl |
| | `/clubs/:id/leave` | POST | Kulüpten ayrıl |
| | `/clubs/my/joined` | GET | Üye olunan kulupleri getir |
| **Events** | CRUD | - | Etkinlik işlemleri |
| **Chat** | Socket.IO | WS | Gerçek zamanlı mesajlaşma |
| **Users** | `/users/me` | PATCH | Profili güncelle |

---

## Kullanıcı Rolleri

| Rol Türü | Roller |
|----------|--------|
| Sistem Rolleri (AuthUser.role) | `ADMIN` \| `MODERATOR` \| `MEMBER` |
| Kulüp Üye Rolleri (ClubMember.role) | `OWNER` \| `ADMIN` \| `MODERATOR` \| `MEMBER` |

- **OWNER**: Kulübü oluşturan kişi. Kulüp ayarlarına erişimi vardır.
- **ADMIN / MODERATOR**: Yönetim yetkileri (tam detay backend'e bağlı).
- **MEMBER**: Normal üye.

---

## Yapılacaklar

| Özellik | Açıklama |
|----------|----------|
| Admin Paneli | ADMIN rolündeki yöneticilere özel moderasyon ekranları |
| Medya Yükleme | Avatar ve kulüp banner dosya yükleme (Cloudinary/S3) |
| Pagination | Kulüp, etkinlik ve mesaj listelerinde sayfalama |
| Medya Paylaşımı | Sohbet ortamında görsel ve doküman paylaşımı |
| Test Altyapısı | Birim ve entegrasyon testleri |

---

## Projeyi Yerel Ortamda Çalıştırmak

### Ön Koşullar

- **Node.js** versiyon 20.x veya daha güncel
- **npm** paket yöneticisi
- **Docker** (Backend, PostgreSQL ve Redis için)

### Kurulum Adımları

**1. Projeyi Klonlayın:**

```bash
git clone https://github.com/HilmiKilavuz/Cluber_Web.git
cd Cluber_Web
```

**2. Bağımlılıkları Yükleyin:**

```bash
npm install
```

**3. Ortam Değişkenlerini Yapılandırın:**

Proje ana dizininde `.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**4. Backend'i Başlatın (Docker):**

```bash
docker-compose -f docker-compose.dev.yml up -d
```

**5. Frontend'i Başlatın:**

```bash
npm run dev
```

Uygulama **http://localhost:3001** adresinde hizmet verecektir.

---

## Geliştirme Komutları

```bash
# Geliştirme sunucusu başlat (port 3001)
npm run dev

# Production build
npm run build

# Production başlat
npm start

# Lint
npm run lint
```

---

<div align="center">
  <sub>Cluber Web - Ekip Çalışması, Topluluk İletişimi ve Moderasyon İçin Geliştirildi.</sub>
  <br/>
  <sub>Copyright 2024-2026 Cluber Team. Tüm hakları saklıdır.</sub>
</div>
