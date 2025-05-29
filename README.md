# YEDT Eğitim Yönetim Sistemi

Tam kapsamlı eğitim yönetim sistemi - Backend API, Admin Panel ve Öğrenci Portal'ı içerir.

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Docker Desktop (Windows/Mac) veya Docker Engine + Docker Compose (Linux)
- Git

### Kurulum

1. Projeyi klonlayın:
```bash
git clone <repo-url>
cd yedt_case
```

2. Uygulamayı başlatın:

**Windows:**
```cmd
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**Manuel başlatma:**
```bash
docker-compose up -d
```

### 📍 Erişim Bilgileri

- 🎯 **Admin Panel**: http://localhost:3000
- 👥 **Öğrenci Portal**: http://localhost:3002  
- 🔧 **API**: http://localhost:5000
- 🗄️ **PgAdmin**: http://localhost:5050
  - E-posta: admin@yedt.com
  - Şifre: admin123

## 🛠️ Komutlar

```bash
# Geliştirme ortamını başlat
npm run dev

# Üretim ortamını başlat  
npm run prod

# Servisleri durdur
npm run stop

# Logları görüntüle
npm run logs

# Belirli servis logları
npm run backend:logs
npm run frontend:admin:logs
npm run frontend:client:logs

# Veritabanı işlemleri
npm run db:reset
npm run db:seed

# Temizlik (tüm volume'ları sil)
npm run clean
```

## 📁 Proje Yapısı

```
yedt_case/
├── backend/                 # Node.js API
├── frontend/
│   ├── admin/              # React Admin Panel
│   └── client/             # React Öğrenci Portal
├── docker-compose.yml       # Ana Docker konfigürasyonu
├── docker-compose.prod.yml  # Üretim konfigürasyonu
├── .env                     # Ortam değişkenleri
├── start.sh                 # Linux/Mac başlangıç script'i
├── start.bat                # Windows başlangıç script'i
└── README.md
```

## 🔧 Geliştirme

Her servis kendi Docker konteynerinde çalışır ve hot-reload destekler. Kod değişiklikleri otomatik olarak yansıtılır.

## 🚀 Üretim

Üretim ortamı için:

```bash
npm run prod
```

Bu komut, optimize edilmiş production build'leri oluşturur ve Nginx ile serve eder.

## 📚 Dokümantasyon

- [Backend API Dokümantasyonu](backend/README.md)
- [Docker Kılavuzu](backend/docker-readme.md)

## 🌟 Özellikler

- 🔐 JWT tabanlı kimlik doğrulama
- 👥 Kullanıcı yönetimi (Admin, Öğrenci)
- 📚 Kurs yönetimi
- 📊 Kayıt takibi
- 🎯 Admin paneli
- 📱 Öğrenci portalı
- 🐳 Docker ile kolay dağıtım
- 🔄 Hot-reload desteği

## 🏗️ Teknolojiler

**Backend:**
- Node.js + Express
- TypeScript
- PostgreSQL
- Sequelize ORM
- JWT Authentication

**Frontend:**
- React + TypeScript
- Material-UI
- React Router
- Axios

**DevOps:**
- Docker & Docker Compose
- Nginx
- PostgreSQL
