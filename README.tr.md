# Chess Coach — Eğitici Satranç Platformu (400–2420+ Elo)

🌍 **Language / Язык / Dil**: [English](README.md) | [Русский](README.ru.md) | [Türkçe](README.tr.md)

**React 18, TypeScript, Tailwind CSS, Chessground ve Stockfish 16 WASM** teknolojileriyle geliştirilmiş çapraz platform eğitici satranç uygulaması (**Web, Windows Masaüstü ve Android**).

---

## 🌟 Temel Özellikler

### 1. 15 Uyarlanabilir Zorluk Seviyesi (400 — 2420+ Elo)
* **Başlangıç Seviyesi (Seviyeler 1–5, 400–1000 Elo)**: `MultiPV 3–5` tabanlı olasılıksal hamle seçimi, hafif hatalar ve öğretici oyun dinamikleri.
* **Kulüp Oyuncuları (Seviyeler 6–10, 1150–1750 Elo)**: Stockfish `UCI_LimitStrength` ve kalibre edilmiş `UCI_Elo` parametreleriyle dengeli oyun.
* **Ustalar (Seviyeler 11–15, 1900–2420+ Elo)**: 20+ derinliğe kadar tam hesaplama gücü, yüksek taktik keskinlik ve konumsal cezalandırma.

### 2. İnteraktif Satranç Koçu
* **İki Kademeli Kılavuz İpucu**:
  1. *İpucu (Nudge)*: İlgili taşı ve odaklanılması gereken taktik alanı vurgular.
  2. *Çözüm (Solution)*: Motorun önerdiği en iyi hamleyi yeşil ok ile doğrudan tahtada gösterir.
* **Tehdit Radarı (Isı Haritası)**: Tehdit altındaki kareleri, düşman baskısını ve korumasız taşları anlık olarak renklendirir.
* **Hata Kalkanı (Blunder Shield)**: Taş kaybına veya kötü konuma yol açacak hamleleri motor değerlendirmesiyle algılar, uyarı sesi çalar ve hamleyi geri alabilmeniz için bot yanıtını geciktirir.
* **ECO Açılış Sınıflandırıcısı**: Oynanan açılış varyasyonlarını gerçek zamanlı olarak tanır ve eğitici açıklamalar sunar.

### 3. Oyun Sonu Derin Analiz ve Hata Antrenmanı
* Oyunun her hamlesi için retrospektif motor analizi ve Santipiyon Kaybı ($\Delta$ cp) hesaplaması.
* Hamle kalitesi değerlendirmesi: Mükemmel (`!!`), En İyi (`!`), Kitap (`book`), İsabetsiz (`?!`), Hata (`?`), Büyük Hata (`??`).
* Oyuncu ve bot isabet oranı analizi (%0–100 Doğruluk).
* İnteraktif üstünlük grafiği (Advantage Curve) ile istenen hamleye tek tıkla geçiş.
* **Hata Antrenmanı (Mistake Drill)**: Oyunda yapılan hatalı konumları yeniden çözerek pratik yapma modu.

### 4. Taktik Bulmaca Antrenörü (Tactical Puzzles)
* Özel olarak seçilmiş ve doğrulanmış taktik bulmacalar:
  * **At Çatalı** (Knight Fork)
  * **Son Yatay / Koridor Matı** (Back-Rank Mate)
  * **Mutlak Açmaz** (Absolute Pin)
  * **Boğmaca Matı** (Smothered Mate)
  * **Saptırma Matı** (Deflection)
  * **Açarak Şah** (Discovered Check)
  * **Şiş Saldırısı** (Skewer)
  * **Legall Matı** (Legall's Mate)
* Tüm bulmacalar `chess.js` kural motoruyla %100 yasal hamle ve doğru taktik tema doğrulamasına sahiptir.
* Galibiyet serisi (Streak), taktik reyting takibi ve kutlama animasyonları.

### 5. Tam Çok Dilli Destek
* Arayüz, bot profilleri, taktik açıklamalar ve koç эvristikleri **Türkçe**, **İngilizce** ve **Rusça** dillerine eksiksiz olarak yerelleştirilmiştir.

### 6. Oyuncu Profili ve Çevrimdışı İlerleme
* FIDE standartlarına uygun dinamik Elo reyting hesabı.
* 15 bot kilit açma ilerlemesi ve galibiyet istatistikleri.
* Reyting değişim grafiği.
* `LocalStorage` üzerinden %100 yerel ve gizli veri saklama.

---

## 🚀 Platformlar ve İndirme

* **Web Sürümü**: [Vercel Production](https://chess-coach-ochre-tau.vercel.app) üzerinde canlı yayında.
* **Android APK / AAB**: **Capacitor 8** ve yerleşik **Stockfish 16 WASM** ile güçlendirilmiş yerel mobil uygulama (**%100 çevrimdışı, internet bağlantısı gerekmez**).
* **Windows Masaüstü (.exe)**: **Electron** ile paketlenmiş NSIS yükleyicisi ve taşınabilir (portable) sürüm.
* **Otomatik GitHub Actions CI/CD**:
  - `main` dalına yapılan her commit, `.github/workflows/android-build.yml` iş akışını tetikler.
  - Android APK (`chess-coach-latest.apk`) ve Windows kurulum dosyası (`Chess Coach Setup.exe`) otomatik olarak derlenir.
  - Hazır kurulum paketleri her zaman [GitHub Releases](https://github.com/o1egkl/chess-coach/releases) sayfasında mevcuttur.

---

## 📱 Kurulum Kılavuzu

### Android
1. [GitHub Releases](https://github.com/o1egkl/chess-coach/releases) sayfasına gidin.
2. **Assets** bölümünden **`chess-coach-latest.apk`** dosyasını indirin.
3. Android cihazınızda dosyayı açın ve yüklemeyi onaylayın.
4. Tam motor desteğiyle çevrimdışı satranç deneyiminin tadını çıkarın!

### Windows Masaüstü
1. [GitHub Releases](https://github.com/o1egkl/chess-coach/releases) sayfasından **`Chess Coach Setup.exe`** dosyasını indirin.
2. Yükleyiciyi çalıştırın veya taşınabilir sürümü kullanın.
3. Chess Coach uygulamasını doğrudan masaüstünüzden başlatın.

---

## 🛠️ Yerel Geliştirme ve Derleme

### Gereksinimler
* Node.js $\ge 18$ (Node 22 önerilir)
* npm $\ge 9$
* Android Studio / JDK 17 (yalnızca yerel Android derlemesi için gereklidir)

### Başlangıç ve Çalıştırma

```bash
# Depoyu klonlayın
git clone https://github.com/o1egkl/chess-coach.git
cd chess-coach

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Bulmaca kuralları doğrulama testini çalıştırın
node scripts/validate_puzzles.cjs

# Web sürümünü derleyin
npm run build

# Electron masaüstü uygulamasını geliştirme modunda başlatın
npm run electron:dev

# Windows yükleyici ve taşınabilir ikiliyi derleyin
npm run electron:build

# Web varlıklarını Capacitor Android projesiyle senkronize edin
npx cap sync android
```

---

## 🏷️ Yeni Sürüm Yayınlama

Yeni bir sürüm etiketi oluşturup GitHub Actions üzerinden otomatik sürüm paketi yayınlamak için:

```bash
# Yama sürümü (örn. 1.0.0 -> 1.0.1)
npm run release:patch

# Küçük sürüm (örn. 1.0.0 -> 1.1.0)
npm run release:minor

# Büyük sürüm (örn. 1.0.0 -> 2.0.0)
npm run release:major
```

---

## 📂 Proje Yapısı

```text
chess-coach/
├── .github/workflows/        # Android ve Windows için otomatik CI/CD iş akışı
├── android/                  # Yerel Capacitor Android projesi
├── electron/                 # Electron ana işlem ve masaüstü giriş noktası
├── public/
│   ├── stockfish/            # Stockfish 16 WASM ve Web Worker betikleri
│   ├── chess-icon.svg        # Uygulama logosu
│   ├── manifest.json         # PWA yapılandırması
│   └── sw.js                 # Çevrimdışı Service Worker önbelleği
├── scripts/
│   └── validate_puzzles.cjs  # Bulmaca yasal hamle test paketi
├── src/
│   ├── components/           # Kullanıcı arayüzü bileşenleri (Tahta, Koç, Modallar)
│   ├── config/               # Bot seviyeleri, bulmacalar, açılış veritabanı
│   ├── context/              # LanguageContext ve tema durum yöneticisi
│   ├── engine/               # Stockfish denetleyicisi, koç эvristikleri, ses motoru
│   ├── i18n/                 # Yerelleştirme sözlükleri (TR, EN, RU)
│   ├── services/             # Depolama ve oyuncu profili servisi
│   ├── types/                # TypeScript tip tanımları
│   ├── App.tsx               # Kök uygulama görünümü ve durum yöneticisi
│   └── main.tsx              # React DOM giriş noktası
├── package.json
└── vite.config.ts
```

---

## 📄 Lisans

MIT Lisansı. Açık kaynaklı eğitim projesidir. Stockfish satranç motoru GPLv3 lisansına tabidir.
