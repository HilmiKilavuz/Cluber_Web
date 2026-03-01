# 🚀 ClubHub Frontend - AI Agent Talimat Dosyası

Bu dosya, projenin web frontend geliştirme sürecinde AI agent (Cursor, Windsurf, Copilot vb.) için temel rehber ve kural setidir. Yeni bir sohbet penceresinde bile bu dosya referans alınarak nerede kalındığı, sıradaki işler ve mimari standartlar net şekilde takip edilmelidir.

---

## 📝 Proje Özeti

**Amaç:** Kullanıcıların ilgi alanlarına göre kulüpler oluşturabildiği, kulüplere katılabildiği, kulüp içinde gerçek zamanlı sohbet edebildiği ve etkinlik düzenleyebildiği dinamik bir topluluk platformu geliştirmek.

- **Platformlar:** Web (öncelik), Mobile (ileride), Backend (tamamlanmış temel işlemler).
- **Frontend Odak:** Next.js ile ölçeklenebilir, modern, responsive ve dark mode uyumlu bir arayüz.
- **Backend Durumu:** NestJS tabanlı REST API + WebSocket altyapısı mevcut; frontend tarafı bu sisteme entegre edilecek.

---

## 🛠️ Teknik Yığın (Tech Stack)

- **Frontend Framework:** Next.js 14+ (App Router)
- **Dil:** TypeScript (**Strict Mode**)
- **Backend:** NestJS (Mevcut REST API & WebSocket)
- **Styling:** Tailwind CSS + Shadcn/UI
- **State Management:**
  - Server State: `@tanstack/react-query`
  - Global UI State: `Zustand` (sadece gerekli olduğunda)
- **Form Management:** `react-hook-form` + `zod`
- **HTTP/Realtime:** `axios` (interceptors dahil) + `socket.io-client`
- **Kalite Araçları:** ESLint + Prettier

---

## 🏗️ Mimari ve Klasör Yapısı

Tüm frontend dosyaları `/src` altında aşağıdaki hiyerarşiye uygun oluşturulmalıdır:

```text
/src
  /app          # Page ve Layout dosyaları (App Router)
  /components   # UI (Shadcn), shared ve module-based bileşenler
  /services     # API servisleri (axios instance, endpoint çağrıları)
  /hooks        # Custom hook'lar (useAuth, useSocket, useClubs vb.)
  /store        # Zustand store dosyaları
  /types        # TypeScript type/interface tanımları (API response dahil)
  /lib          # utils, constants, socket config, helper fonksiyonlar
  /assets       # ikonlar, görseller, statik dosyalar
```

Ek kural:
- Feature bazlı büyüme için `/components`, `/hooks`, `/services` içinde domain odaklı alt klasörler kullanılmalı (ör. `clubs`, `events`, `chat`, `auth`).

---

## 🧱 Core Development Instructions

### 1) Kod Standartları & SOLID
- SOLID prensiplerine sadık kal.
- Özellikle **Single Responsibility Principle** uygula (bileşenleri küçük ve tek sorumluluklu tut).
- Asla `any` kullanma.
- API’den gelen tüm veriler için type/interface tanımla.
- Fonksiyonlar tek iş yapmalı, isimler açıklayıcı olmalı.
- Kod tekrarını azaltmak için reusable component/hook yaklaşımı kullan.

### 2) TypeScript ve Validasyon
- `strict` TypeScript zorunlu.
- Formlar `react-hook-form` + `zod` ile şema tabanlı doğrulanmalı.
- Backend DTO beklentileriyle uyumlu payload üret.

### 3) Backend Entegrasyonu (NestJS Connection)
- Tüm HTTP istekleri `src/services/axiosInstance.ts` üzerinden geçmeli.
- Interceptor ile:
  - auth bilgisi otomatik eklenmeli,
  - global hata yönetimi çalışmalı.
- Auth token yönetimi proje güvenlik tercihine göre cookie veya localStorage ile yapılmalı; mevcut backend yapısı JWT + HttpOnly cookie ile uyumlu ilerlemeye öncelik ver.
- 401/403/500 gibi hatalar merkezi olarak yakalanmalı ve kullanıcıya toast/sonner ile anlaşılır mesaj verilmeli.

### 4) Gerçek Zamanlı Özellikler (Chat & Events)
- `socket.io-client`, NestJS Gateway ile uyumlu kullanılmalı.
- Socket bağlantısı bir custom hook (`useSocket`) veya context üzerinden yönetilmeli.
- Yeniden bağlanma, bağlantı kopması ve oda (room/club) değişimi senaryoları ele alınmalı.

### 5) UI/UX Prensipleri
- **Mobile-first** responsive geliştirme zorunlu.
- Her async işlemde loading/error/empty state olmalı.
- Shadcn/UI öncelikli kullanılmalı; ihtiyaç halinde custom component yazılmalı.
- Tasarım dili modern, temiz ve **dark mode uyumlu** olmalı.
- Erişilebilirlik (a11y): semantic HTML, keyboard navigation, uygun kontrast.

### 6) Performans ve Ölçeklenebilirlik
- Server/client component ayrımı bilinçli yapılmalı.
- Gereksiz re-render önlenmeli (`memo`, stable callbacks/selectors gerektiğinde).
- React Query cache ve invalidation kuralları net tanımlanmalı.
- Sayfa bazlı kod bölme ve lazy loading kullanılmalı.

---

## 🔐 Güvenlik Kuralları

- XSS riskine karşı kullanıcı içeriklerini güvenli render et.
- CSRF/CORS davranışları backend konfigürasyonu ile uyumlu olmalı.
- Rol bazlı erişim (Admin, Moderator, Member) UI seviyesinde de uygulanmalı.
- Route koruması middleware + sayfa içi guard yaklaşımıyla desteklenmeli.

---

## 🔗 Entegrasyon Notları

- Backend URL yalnızca `.env.local` içindeki `NEXT_PUBLIC_API_URL` değişkeninden okunmalı.
- Tüm endpoint tanımları merkezi service katmanında tutulmalı.
- Domain bazlı service önerisi:
  - `auth.service.ts`
  - `clubs.service.ts`
  - `memberships.service.ts`
  - `events.service.ts`
  - `chat.service.ts`
  - `users.service.ts`

---

## 📋 Mevcut Yapılacaklar (Roadmap)

1. [x] Axios instance ve interceptor yapılandırması.
2. [ ] Auth (Login/Register) sayfaları ve `useAuth` hook’unun oluşturulması.
3. [ ] Kulüp listeleme (Keşfet) ve kulüp detay sayfaları.
4. [ ] Kulüp oluşturma formu (Zod validasyonu ile).
5. [ ] Sohbet arayüzü ve Socket.io entegrasyonu.
6. [ ] Etkinlik takvimi ve katılım (RSVP) mantığı.

---

## ✅ Definition of Done (Frontend)

- Auth akışları çalışır durumda (login/register/logout/session).
- Kulüp keşfi, kulüp detay, katıl/ayrıl akışları çalışıyor.
- Kulüp oluşturma/düzenleme form validasyonları tamam.
- Kulüp içi gerçek zamanlı sohbet stabil çalışıyor.
- Etkinlik oluşturma/listeleme/katılım (RSVP) çalışıyor.
- Tüm kritik ekranlarda loading/error/empty state mevcut.
- Responsive + dark mode uyumu sağlandı.
- Temel testler (özellikle kritik kullanıcı akışları) eklendi.

---

## 🧭 Yeni Sohbet Penceresi İçin Hızlı Başlangıç

Yeni bir agent bu projeye başladığında aşağıdaki sırayı izlemeli:

1. Bu dosyadaki roadmap’te ilk tamamlanmamış maddeden başla.
2. Önce altyapıyı kur (`axios`, `query provider`, auth flow), sonra feature’lara geç.
3. Her feature sonrası:
   - API entegrasyonunu doğrula,
   - loading/error/empty state’leri tamamla,
   - route ve rol kontrollerini test et.
4. Yapılan işi roadmap üzerinde işaretle ve dosyayı güncel tut.

---

## 🌐 Dil Kuralları

- Kullanıcı ile iletişim dili: **Türkçe**.
- Kod içi yorumlar ve teknik inline açıklamalar: **İngilizce**.
