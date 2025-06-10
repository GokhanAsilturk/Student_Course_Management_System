# YEDT Eğitim Yönetim Sistemi

Tam kapsamlı eğitim yönetim sistemi - Backend API, Admin Panel ve Öğrenci Portal'ı içerir.

## 🎯 Proje Durumu

**Tamamlanma Oranı: %85**

- ✅ **Backend API**: %95 tamamlandı (25+ endpoint, JWT auth, CRUD operations)
- ✅ **Admin Panel**: %80 tamamlandı (Dashboard, authentication, UI framework)
- ✅ **Öğrenci Portal**: %75 tamamlandı (Student interface, course enrollment)
- ✅ **Docker Setup**: %100 tamamlandı (Multi-container environment)
- ✅ **Dokümantasyon**: %90 tamamlandı (Swagger API docs, README files)

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Docker Desktop (Windows/Mac)
- Git

### Kurulum

1. Projeyi klonlayın:
```bash
git clone <repo-url>
cd yedt_case
```

2. Uygulamayı başlatın:

**Windows cmd:**
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

### Proje raporu için:
PROJECT_REPORT.md dosyasını inceleyin.

### 📍 Erişim Bilgileri

- 🎯 **Admin Panel**: http://localhost:3001
  - Demo: username: `admin`, password: `admin123`
- 👥 **Öğrenci Portal**: http://localhost:3000 
  - Demo: username: `gokhanasilturk`, password: `Student123!`
- 🔧 **API Docs**: http://localhost:5000/api-docs (Swagger UI)
- 🗄️ **PgAdmin**: http://localhost:5050
  - E-posta: admin@yedt.com, Şifre: admin123

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

Sıfırlama scriptlerini kullanmak için aşağıdaki komutları kullanabilirsiniz:

- **Backend Tüm tabloları sıfırlamak için:**
```bash
cd backend ; npm run reset:all
```
- **Belirli bir tabloyu sıfırlamak için:**
```bash
cd backend ; npm run reset:student    # Öğrenci tablosunu sıfırlar
cd backend ; npm run reset:course     # Kurs tablosunu sıfırlar
cd backend ; npm run reset:enrollment # Kayıt tablosunu sıfırlar
cd backend ; npm run reset:user       # Kullanıcı tablosunu sıfırlar
```

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
