# Cluber Web 

**Cluber**, kullanıcıların topluluk kulüplerini dijital ortamda yönetebilmelerini, yeni kulüpler keşfedip katılabilmelerini ve kulüp üyeleriyle gerçek zamanlı etkileşimde bulunabilmelerini sağlayan modern bir web uygulamasıdır. 

Bu depo (repository), genel Cluber platformunun **Frontend (Önyüz)** kısmını oluşturur ve en güncel web teknolojileri kullanılarak donatılmıştır. Uygulama tamamen Türkçe dil desteği ile tasarlanmıştır.

---

##  Projenin Amacı ve Temel İşlevler
Kullanıcı deneyimini modern, kesintisiz ve hızlı bir arayüzle sunmayı hedefleyen Cluber'da şu ana senaryolar mevcuttur:
- **Keşfet & Katıl:** Çeşitli ilgi alanlarına hitap eden kulüpleri bulma ve doğrudan katılma.
- **Yönetim:** Kullanıcıların kendi kulüplerini oluşturup üye ve etkinlik süreçlerini yönetmesi.
- **Anlık İletişim:** Kulüp bazlı entegre chat odalarında gecikmesiz sohbet.
- **Etkinlik Takibi:** Geçmiş ve gelecek etkinliklerden anında haberdar olma (yakında).

---

##  Kullanılan Teknolojiler

Cluber Web, sağlam bir mimari ve performans önceliği ile geliştirilmektedir:

### Temel Stack
- **Framework & Dil:** [Next.js 16](https://nextjs.org/) (App Router mimarisi) & **TypeScript 5**, **React 19** (`"use client"` ağırlıklı etkileşim)
- **Stil Yönetimi (UI):** [Tailwind CSS v4](https://tailwindcss.com/) (Özel ayarlar ve "Dark Mode-first" yaklaşımıyla)
- **Sunucu & Cache Yönetimi:** [@tanstack/react-query v5](https://tanstack.com/query/latest)
- **HTTP İstemcisi:** [Axios](https://axios-http.com/) (Merkezi konfigürasyon, header/JWT proxy ayarlamaları vb.)

### Ek Araçlar ve Kütüphaneler
- **Gerçek Zamanlı İletişim:** [Socket.IO Client v4](https://socket.io/) (Kulüp içi anlık sohbet)
- **Form İşlemleri & Validasyon:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **İkonlar ve Bildirimler:** [Lucide React](https://lucide.dev/) & [Sonner](https://sonner.emilkowal.ski/) (Toast uyarıları)
- **State Yönetimi:** Zustand (Gelecekte entegre edilecek)
- **Tarih Formatlama:** date-fns

---

##  Geliştirme Yaklaşımı & Proje/Dosya Klasör Yapısı

Proje dosyaları işlevlerine göre ayrılarak modüler ve ölçeklenebilir bir biçimde `src/` altında toplanmıştır:

```text
Cluber_Web/
├── src/
│   ├── app/                    # Next.js App Router (Sayfalar ve Layout'lar)
│   │   ├── page.tsx            # Ana Sayfa (Landing Page)
│   │   ├── login/ & register/  # Kimlik doğrulama sayfaları
│   │   ├── profile/            # Profil sayfası
│   │   └── clubs/              # Kulüp listeleme, detay (/[id]), chat ve oluşturma (/create) yönergeleri
│   │
│   ├── components/             # Uygulama genelinde tekrar edebilir UI yapıları
│   │   ├── auth/               # Giriş & Kayıt Formları
│   │   ├── clubs/ & events/    # Kulüp & Etkinlik kartları ile form bileşenleri
│   │   ├── chat/               # Mesaj giriş ve listeleme arayüzleri
│   │   └── layout/             # Global Başlık (Header), Yönlendirme barları
│   │
│   ├── hooks/                  # Tekrar kullanılabilir özel (Custom) React hook'ları
│   │   └── auth/, clubs/, events/, chat/ (Socket dinleme ve API bağlamı)
│   │
│   ├── services/               # Saf Axios API Çağrıları (`club.service.ts`, `auth.service.ts` vb.)
│   ├── types/                  # TypeScript interface tanımlamaları (Models & DTO'lar)
│   └── lib/                    # Yardımcılar (Utils, Socket ayarları, Hata yönetimi vb.)
└── middleware.ts               # Next.js Middleware (Korumalı rootlar ve Token analizi için)
```

---

##  Neler Yapıldı (Tamamlanan Özellikler)
Projede aşağıdaki temel işlevlerin ve sayfaların tamamı geliştirilmiş ve çalışmaktadır:

1. **Kimlik Doğrulama:** JWT Tabanlı login/register akışı (react-hook-form + zod tabanlı validasyon). `localStorage` ve `cookie` destekli Next.js Middleware route güvenliği.
2. **Genel Sayfalar:** Modern bir vitrin olan Ana Sayfa (Landing Page) ve kullanıcının kişisel alanını yansıtan Profil Sayfası.
3. **Kulüp Modülleri:** 
    - Gelişmiş filtreleme sunan Kulüp Listesi.
    - Tüm detayları (banner, üye bilgileri) barındıran Kulüp Detay Sayfası.
    - Ayarlar ve yeni yetki entegreli sayfalar (`/clubs/[id]/settings`, `/clubs/[id]/members`).
    - Hızlı ve stabil form kontrolü ile desteklenen Kulüp Oluşturma adımı.
4. **Etkinlikler:** Kulüp içi etkinliklerin ekleneceği temel modüller. (`/clubs/[id]/events` rotasının önizleme kurulumu dahi tamamlanmıştır.)
5. **Canlı Sohbet:** Socket.IO WebSocket alt yapısıyla desteklenen, anlık olarak mesaj ve geçmiş okunabilen kulüp sohbet odaları.
6. **Tema ve Kullanıcı Arayüzü (UI):** Proje Tailwind v4 kullanılarak tasarlanmış, global `Header` eşliğinde "Dark Mode" seçeneği aktifleştirilmiştir.

---

##  Neler Yapılacak (Eksikler ve Gelecek Özellikler)
Proje şu yeteneklere doğru genişlemeye devam etmektedir:
- **Etkinlik Yönetimi (Tam Entegrasyon):** Ana etkinlik oluşturma sayfasının (`/events/create`) tam UI yönlendirmesi.
- **RSVP (Durum Bildirimi):** Bir olaya katılıp katılmama bilgisinin işlenmesi ve gösterilmesi.
- **Kapsamlı Global State:** `Zustand` ile global veri bağlarının `src/store/` üzerinde kurulması.
- **Profil Yönetimi ve Medya Entegrasyonu:** Gerçek kullanıcı fotoğraf (avatar), kulüp banner dosya yüklemelerinin yapılması ile detaylı kişisel/kulüp düzenleme alanlarının açılması.
- **Admin Aracı:** "Admin" rolündeki kullanıcılar için yetkili özel kontrol, listeleme ve yönetim UI paneli.
- **Listeleme Özellikleri:** Kulüp veya üyeler dolduğunda gerekecek "Pagination (Sayfalama)" işlemlerinin bağlanması.

---

## 🚀 Projeyi Yerel Ortamda Çalıştırmak 

Projeyi bilgisayarında hatasız olarak ayağa kaldırabilmek için aşağıdaki yönergeleri uygulayınız:

### Ön Koşullar
- **[Node.js](https://nodejs.org/)** sürüm 20.x veya daha güncel.
- Projede paket yürütücüsü olarak **npm** gereklidir.

### Kurulum Adımları
1. **Projeyi Klonlayarak Çekme:**
    ```bash
    git clone https://github.com/HilmiKilavuz/Cluber_Web.git
    cd Cluber_Web
    ```
2. **Kütüphaneleri ve Bağımlılıkları Yükleme:**
    ```bash
    npm install
    ```
3. **Çevre Değişkenleri (.env) Tanımlaması:**
    Ana dizindeki sistemde bir `.env.local` dosyası oluşturun. Next.js istemcisinin backend ile konuşabilmesi için temel API yolunu verin (Lokalde aşağıdaki şekilde):
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3001
    ```
4. **Projeyi Başlatma:**
    Ortam hazır. İzleyen komutla uygulamayı lokal ortamınızda hızlı bir şekilde başlatıp deneyimleyebilirsiniz.
    ```bash
    npm run dev
    ```
    İlgili işlem ardından Frontend sunucusu **[http://localhost:3001](http://localhost:3001)** üzerinde hizmet verecektir.

---
**Cluber Web** - Ekip Çalışması, Topluluk İletişimi ve Moderasyon İçin Geliştirildi.
