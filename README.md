<div align="center">
  <img src="https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=Cluber" alt="Cluber Logo" width="120" height="120">
  <br/>
  <h1> Cluber Web</h1>
  <p><strong>Üniversite ve Topluluk Kulüplerini Dijitalleştiren Modern Yönetim Platformu</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Socket.io-v4-010101?style=flat&logo=socket.io&logoColor=white" alt="Socket.io" />
  </p>
</div>

---

**Cluber**, kullanıcıların topluluk kulüplerini dijital ortamda yönetebilmelerini, yeni kulüpler keşfedip katılabilmelerini ve kulüp üyeleriyle gerçek zamanlı etkileşimde bulunabilmelerini sağlayan modern bir web uygulamasıdır. 

Bu depo (repository), genel Cluber platformunun **Frontend (Önyüz)** kısmını oluşturur ve en güncel web teknolojileri kullanılarak donatılmıştır. Uygulama tamamen Türkçe dil desteği ile tasarlanmıştır.

---

##  Projenin Amacı ve Temel İşlevler
Kullanıcı deneyimini modern, kesintisiz ve hızlı bir arayüzle sunmayı hedefleyen Cluber'da şu ana senaryolar mevcuttur:
- **Keşfet & Katıl:** Çeşitli ilgi alanlarına hitap eden kulüpleri bulma ve doğrudan katılma.
- **Yönetim:** Kullanıcıların kendi kulüplerini oluşturup üye ve etkinlik süreçlerini yönetmesi.
- **Anlık İletişim:** Kulüp bazlı entegre chat odalarında gecikmesiz sohbet.
- **Etkinlik Takibi & Otomasyon:** Geçmiş/gelecek etkinliklerin takibi, RSVP sistemi ve otomatik e-posta hatırlatıcıları.

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

1. **Kimlik Doğrulama & Güvenlik:** 
   - JWT Tabanlı login/register akışı. 
   - `localStorage` ve `cookie` destekli Next.js Middleware route güvenliği.
   -  **E-posta Doğrulama:** Kayıt olan kullanıcılara gönderilen 6 haneli doğrulama kodu (Nodemailer).
2. **Genel Sayfalar:** Modern bir vitrin olan Ana Sayfa (Landing Page) ve kullanıcının kişisel alanını yansıtan Profil Sayfası.
3. **Kulüp Modülleri:** 
    -  **Gelişmiş Filtreleme:** SSPA mimarisine uygun ve URL parametreleriyle senkronize debounce arama fonksiyonları.
    - Tüm detayları (banner, üye bilgileri) barındıran Kulüp Detay Sayfası.
    - Yönetim için özel sayfalar (`/clubs/[id]/settings`, `/clubs/[id]/members`).
    - Kulüp Oluşturma akışı.
4. **Etkinlikler & Otomasyon:** 
    - Kulüp içi etkinliklerin planlandığı, kullanıcıların RSVP olarak dahil olabildiği özel arayüz.
    - *Akıllı Hatırlatıcılar (Cron Job):** Başlangıcına 24 saat kalmış etkinlikler için katılımcılara otomatik, görseli yüksek HTML bülten (E-posta) gönderimleri devreye alındı.
5. **Canlı Sohbet:** Socket.IO WebSocket alt yapısıyla desteklenen, anlık mesajlaşılan ve geçmiş mesaj okunan odalar.
6. **Tema ve Kullanıcı Arayüzü (UI):** Proje Tailwind v4 kullanılarak tasarlanmış, global `Header` eşliğinde "Dark Mode" seçeneği aktifleştirilmiştir.

---

##  Neler Yapılacak (Eksikler ve Gelecek Özellikler)
Projenin büyümesi adına sıradaki gelişim yol haritası (Roadmap):
- **Admin Paneli:** "Admin" rolündeki yöneticilere özel detaylı moderasyon ekranları.
- **Medya Entegrasyonu:** Gerçek kullanıcı fotoğraf (avatar) ve kulüp bannerlarının sisteme yüklenebilmesi (Cloudinary / S3).
- **Zustand Stabilizasyonu:** Tüm global state öğelerinin tam kapsamlı olarak Zustand (store) yapısına entegrasyonu.
- **Pagination (Sayfalama):** Veri hacmi arttığında kulüp, etkinlik ve mesaj listelerinde sonsuz kaydırma veya klasik alt sayfalama işlemleri.
- **Etkin Dosya Yönetimi:** Sohbet ortamında görsellerin veya dokümanların paylaşılabileceği upload (medya) altyapısı.

---

##  Projeyi Yerel Ortamda Çalıştırmak 

Projeyi bilgisayarında hatasız olarak ayağa kaldırabilmek için aşağıdaki yönergeleri uygulayınız:

### Ön Koşullar
- **[Node.js](https://nodejs.org/)** sürüm 20.x veya daha güncel.
- Projede paket yürütücüsü olarak **npm** gereklidir.
- Backend, Veritabanı (PostgreSQL) ve Redis sistemleri ayrı bir Docker Compose aracılığıyla çalışmaktadır.

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
    Ana dizindeki sistemde bir `.env.local` dosyası oluşturun. Next.js istemcisinin backend ile konuşabilmesi için temel API yolunu verin:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3000
    ```
4. **Projeyi Başlatma:**
    Ortam hazır. İzleyen komutla uygulamayı lokal ortamınızda hızlı bir şekilde başlatıp deneyimleyebilirsiniz.
    ```bash
    npm run dev
    ```
    İlgili işlem ardından Frontend sunucusu **[http://localhost:3001](http://localhost:3001)** üzerinde hizmet verecektir.

---
<div align="center">
  <sub>Cluber Web - Ekip Çalışması, Topluluk İletişimi ve Moderasyon İçin Geliştirildi. </sub>
</div>
