# Docker Kurulumu - YEDT Eğitim Yönetim Sistemi

Bu dokümantasyon, YEDT Eğitim Yönetim Sistemi'nin Docker ile nasıl kurulacağını ve yönetileceğini açıklar.

## 📋 İçindekiler

- [Hızlı Başlangıç](#hızlı-başlangıç)
- [Servis Mimarisi](#servis-mimarisi)
- [Konfigürasyon](#konfigürasyon)
- [Komutlar](#komutlar)
- [Sorun Giderme](#sorun-giderme)

## 🚀 Hızlı Başlangıç

### Gereksinimler

- **Windows**: Docker Desktop for Windows
- **Mac**: Docker Desktop for Mac  
- **Linux**: Docker Engine + Docker Compose

### Kurulum Adımları

1. **Projeyi klonlayın:**
```bash
git clone <repo-url>
cd yedt_case
```

2. **Ortam değişkenlerini ayarlayın:**
```bash
# .env dosyası zaten hazır, gerekirse düzenleyin
cp .env.example .env  # (Eğer .env yoksa)
```

3. **Sistemi başlatın:**

**Windows:**
```cmd
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**Manuel:**
```bash
docker-compose up -d
```

## 🏗️ Servis Mimarisi

Sistem 5 ana servisten oluşur:

### 1. PostgreSQL Database (`postgres`)
- **Port**: 5432
- **Veritabanı**: egitim_yonetim
- **Kullanıcı**: postgres
- **Şifre**: postgres123

### 2. Backend API (`backend`)
- **Port**: 5000
- **Framework**: Node.js + Express + TypeScript
- **ORM**: Sequelize
- **Auth**: JWT

### 3. Admin Panel (`frontend-admin`)
- **Port**: 3001
- **Framework**: React + TypeScript
- **UI**: Material-UI

### 4. Client Portal (`frontend-client`)
- **Port**: 3000
- **Framework**: React + TypeScript
- **UI**: Material-UI

### 5. PgAdmin (`pgadmin`)
- **Port**: 5050
- **E-posta**: admin@yedt.com
- **Şifre**: admin123

## ⚙️ Konfigürasyon

### Ortam Değişkenleri (.env)

```env
# Veritabanı
POSTGRES_DB=egitim_yonetim
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# API
REACT_APP_API_URL=http://localhost:5000/api
```

### Docker Compose Profilleri

**Geliştirme:**
```bash
docker-compose up -d
```

**Üretim:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🛠️ Komutlar

### Temel Komutlar

```bash
# Tüm servisleri başlat
docker-compose up -d

# Servisleri durdur
docker-compose down

# Servisleri yeniden başlat
docker-compose restart

# Servis durumunu kontrol et
docker-compose ps

# Logları görüntüle
docker-compose logs -f

# Belirli servis logları
docker-compose logs -f backend
docker-compose logs -f frontend-admin
docker-compose logs -f frontend-client
```

### Veritabanı Komutları

```bash
# Veritabanını sıfırla
docker-compose exec backend npm run db:reset

# Seed verilerini yükle
docker-compose exec backend npm run seed

# PostgreSQL shell'e bağlan
docker-compose exec postgres psql -U postgres -d egitim_yonetim
```

### Temizlik Komutları

```bash
# Servisleri durdur ve volume'ları sil
docker-compose down -v

# Kullanılmayan Docker objeleri temizle
docker system prune -f

# Kullanılmayan volume'ları sil
docker volume prune -f

# Kullanılmayan image'ları sil
docker image prune -f
```

## 🔧 Geliştirme

### Hot Reload

Tüm servisler geliştirme modunda hot-reload destekler:

- **Backend**: TypeScript dosyalarında değişiklik yapıldığında otomatik restart
- **Frontend**: React bileşenlerinde değişiklik yapıldığında otomatik refresh

### Kod Değişiklikleri

```bash
# Backend değişikliklerini görmek için
docker-compose logs -f backend

# Frontend değişikliklerini görmek için
docker-compose logs -f frontend-admin
docker-compose logs -f frontend-client
```

### Yeni Paket Ekleme

**Backend:**
```bash
# Konteyner içine gir
docker-compose exec backend sh

# Paket ekle
npm install paket-adi

# Konteynerı yeniden başlat
docker-compose restart backend
```

**Frontend:**
```bash
# Admin panel için
docker-compose exec frontend-admin sh
npm install paket-adi
docker-compose restart frontend-admin

# Client portal için
docker-compose exec frontend-client sh
npm install paket-adi
docker-compose restart frontend-client
```

## 🚀 Üretim Dağıtımı

### Üretim Ortamı

```bash
# Üretim ortamını başlat
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# SSL sertifikalarını ayarla (nginx klasörü)
mkdir -p nginx/ssl
# SSL sertifikalarınızı nginx/ssl/ klasörüne koyun
```

### Nginx Reverse Proxy

Üretim ortamında Nginx reverse proxy kullanılır:

- **Port 80**: HTTP trafiği
- **Port 443**: HTTPS trafiği (SSL ile)

### Backup

```bash
# Veritabanı backup
docker-compose exec postgres pg_dump -U postgres egitim_yonetim > backup.sql

# Volume backup
docker run --rm -v yedt_case_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_data.tar.gz -C /data .
```

### Restore

```bash
# Veritabanı restore
docker-compose exec -T postgres psql -U postgres egitim_yonetim < backup.sql

# Volume restore
docker run --rm -v yedt_case_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_data.tar.gz -C /data
```

## 🔍 Sorun Giderme

### Yaygın Sorunlar

**1. Port Çakışması**
```bash
# Kullanılan portları kontrol et
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001
netstat -tulpn | grep :3002
netstat -tulpn | grep :5432

# Çakışan servisleri durdur veya portları değiştir
```

**2. Veritabanı Bağlantı Hatası**
```bash
# PostgreSQL servisini kontrol et
docker-compose ps postgres

# PostgreSQL loglarını kontrol et
docker-compose logs postgres

# Veritabanı sağlık kontrolü
docker-compose exec postgres pg_isready -U postgres
```

**3. Frontend Build Hatası**
```bash
# Node modules cache temizle
docker-compose down
docker-compose build --no-cache frontend-admin
docker-compose build --no-cache frontend-client
docker-compose up -d
```

**4. Backend API Hatası**
```bash
# Backend loglarını kontrol et
docker-compose logs -f backend

# Backend container'ına bağlan
docker-compose exec backend sh

# Dependencies kontrol et
npm ls
```

### Log Analizi

```bash
# Tüm servislerin logları
docker-compose logs -f

# Son 100 satır log
docker-compose logs --tail=100

# Belirli zaman aralığı
docker-compose logs --since=2024-01-01T00:00:00Z

# JSON formatında loglar
docker-compose logs --json
```

### Performance İzleme

```bash
# Container resource kullanımı
docker stats

# Disk kullanımı
docker system df

# Network trafiği
docker-compose exec backend netstat -i
```

### Memory ve CPU Limitleri

Gerekirse `docker-compose.yml` dosyasında resource limitleri ayarlayın:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
```

## 📞 Destek

Sorun yaşadığınızda:

1. Bu dokümandaki sorun giderme adımlarını takip edin
2. GitHub Issues bölümünde benzer sorunları arayın
3. Yeni issue açın ve aşağıdaki bilgileri ekleyin:
   - İşletim sistemi
   - Docker versionu
   - Hata logları
   - Yapılan adımlar
