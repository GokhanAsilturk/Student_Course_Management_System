# Öğrenci ve Ders Yönetimi Uygulaması - Geliştirme Yol Haritası
Backend: Node.js + Express.js
Frontend: React.js + Context API + Material UI
Veritabanı: PostgreSQL
API Dokümantasyonu: Swagger/OpenAPI
Test Framework: Jest + Supertest

## Genel Kurulum ve Hazırlık
- Proje gereksinimlerini analiz etme
- Teknik seçimleri belirleme
- GitHub repository oluşturma
- Proje yapısını düzenleme
- Docker ve Docker Compose konfigürasyonu

## Backend (Node.js + Express.js)

### Temel Kurulum
- Express.js projesini oluşturma
- PostgreSQL bağlantısı kurma
- Proje yapısını düzenleme (routes, controllers, models, middlewares)
- Swagger/OpenAPI entegrasyonu

### Veritabanı Modellerinin Oluşturulması
- User modeli (admin ve öğrenci rolleri için)
- Öğrenci modeli
- Ders modeli
- Öğrenci-Ders ilişki modeli

### Kimlik Doğrulama ve Yetkilendirme
- JWT entegrasyonu
- Login/Logout fonksiyonları
- Rol tabanlı yetkilendirme middleware'i
- Kullanıcı oturum yönetimi

### API Endpoint'leri
- Auth endpoint'leri (login, logout, register)
- Öğrenci CRUD endpoint'leri
- Ders CRUD endpoint'leri
- Öğrenci-ders eşleştirme endpoint'leri
- Listeleme ve arama endpoint'leri
- Pagination desteği

### Testler
- Unit testleri (kısmen)
- Integration testleri (kısmen)
- Authentication testleri (kısmen)
- Yetkilendirme testleri

## Frontend (React.js)

### Temel Kurulum
- React projesini oluşturma
- Material UI entegrasyonu
- Context API ile state management yapısı kurma
- Routing yapısı (React Router)

### Kimlik Doğrulama Arayüzleri
- Login sayfası
- Logout fonksiyonu
- Protected route yapısı
- Rol tabanlı erişim kontrolü

### Admin Paneli Arayüzleri
- Dashboard tasarımı
- Öğrenci yönetimi sayfaları (liste, ekle, düzenle, sil)
- Ders yönetimi sayfaları (liste, ekle, düzenle, sil)
- Öğrenci-ders eşleştirme sayfası

### Öğrenci Arayüzleri
- Öğrenci profil sayfası
- Kayıtlı dersler listesi
- Ders kayıt sayfası
- Ders kaydı silme fonksiyonu

### Ortak Komponentler
- Sayfalama (pagination) komponenti
- Modal/popup komponentleri
- Form komponentleri
- Tablo komponentleri
- Bildirim (notification) komponentleri

## Docker ve Deployment
- Backend Dockerfile
- Frontend Dockerfile
- Docker Compose konfigürasyonu
- Veritabanı kurulumu ve migrasyonları
- Lokal geliştirme ortamı talimatları

## Dokümantasyon
- README dosyası
- API dokümantasyonu (Swagger ile)
- Kurulum talimatları
- Proje yapısı açıklaması
- Örnek kullanım senaryoları

## Proje Tamamlama
- Kod kalitesi gözden geçirme
- Güvenlik kontrolü
- Performans optimizasyonu
- Son testler
- Teslim
