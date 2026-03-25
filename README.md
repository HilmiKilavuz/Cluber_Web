<div align="center">
  <img src="https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=Cluber" alt="Cluber Logo" width="120" height="120">
  <br/>
  <h1>Cluber Web</h1>
  <p><strong>Universite ve Topluluk Kuluplerini Dijitallastiran Modern Yonetim Platformu</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Socket.io-v4-010101?style=flat&logo=socket.io&logoColor=white" alt="Socket.io" />
  </p>
</div>

---

**Cluber**, universite ogrencileri ve topluluk uyelerinin kulup olusturabilecegi, kuluplere katilabilecegi, etkinlikler duzenleyebilecegi ve uyeleriyle gercek zamanli olarak etkilesimde bulunabilecegi kapsamli bir web platformudur. Bu depo, Cluber platformunun **on yuz (Frontend)** kismini barindirmakta olup en guncel web teknolojileri kullanilarak gelistirilmistir. Uygulama tamamen Turkce dil destegi ile sunulmaktadir.

---

## Projenin Amaci ve Temel Islevler

Cluber, topluluk yonetimi sureclerini dijital ortama tasiyarak geleneksel kulup faaliyetlerini modernize etmeyi hedeflemektedir. Platform, kullanici deneyimini on planda tutarak kesintisiz ve hizli bir arayuz sunmaktadir.

### Temel Ozellikler

| Modul | Aciklama |
|-------|----------|
| **Kulup Keşfi ve Katilim** | Cesitli ilgi alanlarina hitap eden kulupleri bulma, filtreleme ve dogrudan katilma imkani |
| **Kulup Yonetimi** | Kullanicilarin kendi kuluplerint olusturmasi, uye ve etkinlik sureclerini yonetmesi |
| **Gercek Zamanli Iletisim** | Kulup bazli entegre chat odalarinda anlik mesajlasma (Socket.IO) |
| **Etkinlik Yonetim** | Gecmis ve gelecek etkinliklerin takibi, RSVP sistemi ile katilim takibi |
| **Otomatik Hatirlatici** | Etkinlik baslangicina 24 saat kalan katilimcilara otomatik e-posta hatirlaticilari |

---

## Teknoloji Yigini

Cluber Web, performans ve olceklenebilirlik onceligi ile gelistirilmektedir. Asagidaki tablo projenin kullandigi temel teknolojileri ve kutuphaneleri ozetlemektedir:

| Kategori | Teknoloji | Versiyon |
|----------|-----------|----------|
| Framework | Next.js | 16 (App Router) |
| Programlama Dili | TypeScript | 5 |
| UI Kutuphanesi | React | 19 |
| Stil Cesitlemesi | Tailwind CSS | v4 |
| Sunucu Durum Yonetimi | @tanstack/react-query | v5 |
| HTTP Istemci | Axios | - |
| Gercek Zamanli Haberlesme | Socket.IO Client | v4 |
| Form Yonetimi | React Hook Form | - |
| Veri Dogrulama | Zod | - |
| Ikon Kutuphanesi | Lucide React | - |
| Toast Bildirimleri | Sonner | - |
| Tarih Isleme | date-fns | - |
| Global Durum Yonetimi | Zustand | - |

---

## Mimari ve Klasor Yapisi

Proje dosyalari islevsel olarak ayrilmis ve moduler bir yapi izlenerek `src/` dizini altinda organize edilmistir. Asagidaki diyagram projenin klasor hierarsisini gostermektedir:

```
Cluber_Web/
├── middleware.ts                    # Route korumasi (JWT cookie kontrolu)
├── next.config.ts                   # Next.js konfigurasyonu
├── package.json                     # Proje bagimliliklari
├── tsconfig.json                    # TypeScript konfigurasyonu
├── postcss.config.mjs               # PostCSS konfigurasyonu
│
└── src/
    ├── app/                         # Next.js App Router sayfalari
    │   ├── layout.tsx               # Root layout (Providers sarmalayici)
    │   ├── providers.tsx             # QueryClientProvider + Toaster
    │   ├── globals.css               # Tailwind temel stilleri
    │   ├── page.tsx                 # Ana sayfa (Landing Page)
    │   ├── login/                    # Giris sayfasi
    │   ├── register/                 # Kayit sayfasi
    │   ├── profile/                  # Kullanici profili
    │   ├── clubs/                    # Kulup listesi ve olusturma
    │   │   ├── page.tsx              # Kulup keşif sayfasi
    │   │   ├── create/               # Kulup olusturma formu
    │   │   └── [id]/                 # Kulup detay sayfasi
    │   │       ├── page.tsx          # Kulup detaylari
    │   │       ├── chat/             # Kulup sohbet odasi
    │   │       ├── events/           # Kulup etkinlikleri
    │   │       ├── members/          # Kulup uyeleri
    │   │       └── settings/         # Kulup ayarlari
    │   └── events/
    │       └── create/               # Etkinlik olusturma
    │
    ├── components/                   # Yeniden kullanilabilir UI bileşenleri
    │   ├── auth/                     # AuthFormShell, LoginForm, RegisterForm
    │   ├── clubs/                    # ClubCard, ClubForm
    │   ├── events/                   # EventCard, EventForm, ParticipantsModal
    │   ├── chat/                     # ChatWindow, MessageItem
    │   ├── layout/                   # Header (navigasyon + dark mode)
    │   └── profile/                  # ProfileComponents
    │
    ├── hooks/                        # Custom React hooks
    │   ├── auth/                      # useAuth (oturum, login, register, logout)
    │   ├── clubs/                     # useClubs (CRUD + join/leave)
    │   ├── events/                    # useEvents (CRUD)
    │   ├── chat/                      # useSocket (Socket.IO baglanti)
    │   └── users/                     # useUser
    │
    ├── services/                     # API cagri katmani
    │   ├── axiosInstance.ts           # Axios yapilandirmasi
    │   ├── auth/                      # Auth servisleri
    │   ├── clubs/                     # Kulup servisleri
    │   ├── events/                    # Etkinlik servisleri
    │   ├── chat/                      # Chat servisleri
    │   └── users/                     # Kullanici servisleri
    │
    ├── types/                        # TypeScript arayuz tanimlari
    │   ├── auth.ts                    # AuthUser, LoginDto, RegisterDto
    │   ├── club.ts                    # Club, ClubMember, CreateClubDto
    │   ├── event.ts                   # Event, EventParticipant, RSVPStatus
    │   ├── chat.ts                    # Message, ChatRoom, Socket events
    │   └── api.ts                     # Genel API hata tipi
    │
    ├── lib/                          # Yardimci araclar
    │   ├── api/                       # handleApiError
    │   ├── auth/                      # Auth yardimcilari
    │   ├── constants/                 # Ortam degiskenleri (env.ts)
    │   ├── socket/                    # Socket.IO baglanti (socket.ts)
    │   └── utils/                     # Genel utility fonksiyonlar
    │
    └── store/                        # Global durum yonetimi
        └── ui.store.ts                # Zustand store (UI durumu)
```

---

## Kimlik Dorsrulama Akisi

Cluber, güvenli bir oturum yonetimi saglamak icin JWT tabanli kimlik dogrulama sistemi kullanmaktadır. Sistem su adimlari izlemektedir:

```
Kullanici Girisi/Kayit
        ↓
authService.login() → POST /auth/login
        ↓
accessToken alinir → localStorage'a kaydedilir
        ↓
axiosInstance her istekte Authorization: Bearer <token> ekler
        ↓
authService.getSession() → GET /auth/me (silent error)
        ↓
useAuth hook → React Query cache guncellenir
        ↓
middleware.ts → Cookie tabanli koruma
        ↓
Korumali rotalar: /clubs/create, /clubs/[id]/settings
```

Sistem, `localStorage` uzerinden istemci tarafinda token yonetimi yaparken, backend tarafindan HTTP-only cookie de kullanilmaktadir. Middleware bu cookie'yi kontrol ederek route korumasi saglamaktadir.

---

## Tamamlanan Ozellikler

Asagidaki tablo proje kapsaminda tamamlanan ana ozellikleri ve islevleri gostermektedir:

| Ozellik | Durum | Aciklama |
|----------|-------|----------|
| Landing Page | Tamamlandi | Hero section, ozellik kartlari, istatistikler, CTA, footer |
| Kimlik Dogrulama | Tamamlandi | JWT tabanli giris/kayit akisi, react-hook-form + zod |
| Route Korumasi | Tamamlandi | middleware.ts ile cookie tabanli koruma |
| Kulup Listesi | Tamamlandi | Filtreleme desteği, URL parametre senkronizasyonu |
| Kulup Detay Sayfasi | Tamamlandi | Banner, avatar, katil/ayril butonlari, sekme navigasyonu |
| Kulup Olusturma | Tamamlandi | Olusturma formu ve validasyon |
| Gercek Zamanli Sohbet | Tamamlandi | Socket.IO entegrasyonu, anlik mesajlasma |
| Etkinlik Yonetimi | Tamamlandi | Olusturma, duzenleme, silme, RSVP sistemi |
| Uye Listesi | Tamamlandi | Kulup uyelerinin listelenmesi |
| Kulup Ayarlari | Tamamlandi | Kulup bilgilerinin duzenlenmesi |
| Profil Sayfasi | Tamamlandi | Kullanici profili goruntuleme ve duzenleme |
| E-posta Dogrulama | Tamamlandi | 6 haneli dogrulama kodu gonderimi (Nodemailer) |
| Etkinlik Hatirlatici | Tamamlandi | 24 saat kala otomatik e-posta gonderimi (Cron Job) |
| Dark Mode | Tamamlandi | Karanlik mod desteği (Tailwind dark:) |
| Arama ve Filtreleme | Tamamlandi | Debounce edilmis arama, URL senkronizasyonu |

---

## Yapilacaklar ve Gelecek Yol Haritasi

Projenin gelisimi surerken asagidaki ozellikler gelecek evrelerde planlanmaktadir:

| Ozellik | Oncelik | Aciklama |
|----------|---------|----------|
| Admin Paneli | Dusuk | ADMIN rolundeki yoneticilere ozel moderasyon ekranlari |
| Medya Yukleme | Orta | Avatar ve kulup banner dosya yukleme (Cloudinary/S3) |
| Sayfalama | Orta | Kulup, etkinlik ve mesaj listelerinde pagination |
| Medya Paylasimi | Dusuk | Sohbet ortaminda görsel ve dokuman paylasimi |
| Test Altyapisi | Dusuk | Birim ve entegrasyon testleri |

---

## Projeyi Yerel Ortamda Calistirmak

Projeyi yerel bilgisayarinizda calistirmak için asagidaki adimlari takip ediniz:

### On Kosullar

| Gereksinim | Aciklama |
|------------|----------|
| Node.js | Versiyon 20.x veya daha guncel |
| npm | Paket yoneticisi (npm ile birlikte gelir) |
| Docker | Backend, PostgreSQL ve Redis icin (docker-compose ile) |

### Kurulum Adimlari

**1. Projeyi Klonlayin:**

```bash
git clone https://github.com/HilmiKilavuz/Cluber_Web.git
cd Cluber_Web
```

**2. Bagimliliklari Yükleyin:**

```bash
npm install
```

**3. Ortam Degiskenlerini Yapilandirin:**

Proje ana dizininde `.env.local` dosyasi olusturun ve asagidaki degiskeni ekleyin:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**4. Backend'i Baslatin (Docker):**

```bash
cd ..  # Ana dizine gidin
docker-compose -f docker-compose.dev.yml up -d
```

**5. Frontend'i Baslatin:**

```bash
cd Cluber_Web
npm run dev
```

Uygulama **http://localhost:3001** adresinde hizmet verecektir.

---

## API Endpoint'leri

Asagidaki tablo backend API'nin temel endpoint'lerini ozetlemektedir:

| Grup | Endpoint | Metod | Aciklama |
|------|----------|-------|----------|
| **Auth** | /auth/login | POST | Giris yap |
| | /auth/register | POST | Kayit ol |
| | /auth/me | GET | Mevcut oturumu getir |
| | /auth/logout | POST | Cikis yap |
| **Clubs** | /clubs | GET | Tum kulupleri listele |
| | /clubs | POST | Kulup olustur |
| | /clubs/:id | GET | ID ile kulup getir |
| | /clubs/slug/:slug | GET | Slug ile kulup getir |
| | /clubs/:id | PATCH | Kulup guncelle |
| | /clubs/:id | DELETE | Kulup sil |
| | /clubs/:id/join | POST | Kulube katil |
| | /clubs/:id/leave | POST | Kulupten ayril |
| | /clubs/my/joined | GET | Uye olunan kulupleri getir |
| **Events** | /events | GET, POST, PATCH, DELETE | Etkinlik CRUD islemleri |
| **Users** | /users/me | PATCH | Profili guncelle |

---

## Katkida Bulunma

Bu projeye katkida bulunmak isterseniz, lutfen once Fork yapin, bir dal (branch) olusturun ve degisikliklerinizi commit edin. Pull request gondermeden once kodunuzun lint kurallarina uygun oldugundan emin olunuz.

---

<div align="center">
  <sub>Cluber Web - Ekip Calismasi, Topluluk Iletişimi ve Moderasyon Icin Gelistirildi.</sub>
  <br/>
  <sub>Copyright 2024-2026 Cluber Team. Tüm haklari saklidir.</sub>
</div>
