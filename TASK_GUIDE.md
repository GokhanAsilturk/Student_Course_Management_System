# YEDT Eğitim Yönetim Sistemi - Görev Kılavuzu

## Hızlı Başlangıç

### Windows PowerShell (Önerilen)
```powershell
# Geliştirme ortamını başlat
.\start.ps1

# Üretim ortamını başlat
.\start.ps1 -Production

# Servis durumunu kontrol et
.\start.ps1 -Status

# Logları görüntüle
.\start.ps1 -Logs

# Servisleri durdur
.\start.ps1 -Stop

# Docker temizliği
.\start.ps1 -Clean
```

### Windows Batch
```cmd
# Basit başlangıç
start.bat
```

### Manuel Docker Compose
```bash
# Geliştirme
docker-compose up -d

# Üretim
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Durdur
docker-compose down

# Temizle
docker-compose down -v
```

## Servis Portları

| Servis | Port | URL |
|--------|------|-----|
| Admin Panel | 3000 | http://localhost:3000 |
| Öğrenci Portal | 3002 | http://localhost:3002 |
| Backend API | 5000 | http://localhost:5000 |
| PostgreSQL | 5432 | localhost:5432 |
| PgAdmin | 5050 | http://localhost:5050 |

## Default Kullanıcılar

### PgAdmin
- E-posta: admin@yedt.com
- Şifre: admin123

### Sistem Admin (Seed verilerinden)
- Username: admin
- Şifre: admin123

## Veritabanı İşlemleri

```powershell
# Veritabanını sıfırla
docker-compose exec backend npm run db:reset

# Seed verilerini yükle
docker-compose exec backend npm run seed

# PostgreSQL shell
docker-compose exec postgres psql -U postgres -d egitim_yonetim
```

## Geliştirme

### Hot Reload
Tüm servisler geliştirme modunda hot-reload destekler:
- Backend: TypeScript değişikliklerinde otomatik restart
- Frontend: React bileşenlerinde otomatik refresh

### Yeni Paket Ekleme
```powershell
# Backend
docker-compose exec backend npm install paket-adi
docker-compose restart backend

# Frontend Admin
docker-compose exec frontend-admin npm install paket-adi
docker-compose restart frontend-admin

# Frontend Client
docker-compose exec frontend-client npm install paket-adi
docker-compose restart frontend-client
```

## Sorun Giderme

### Port Çakışması
```powershell
# Kullanılan portları kontrol et
netstat -ano | findstr :3000
netstat -ano | findstr :5000
netstat -ano | findstr :3002
netstat -ano | findstr :5432
```

### Container Logları
```powershell
# Tüm loglar
docker-compose logs -f

# Belirli servis
docker-compose logs -f backend
docker-compose logs -f frontend-admin
docker-compose logs -f frontend-client
```

### Performans İzleme
```powershell
# Resource kullanımı
docker stats

# Disk kullanımı
docker system df
```

## Backup ve Restore

### Veritabanı Backup
```powershell
docker-compose exec postgres pg_dump -U postgres egitim_yonetim > backup.sql
```

### Veritabanı Restore
```powershell
Get-Content backup.sql | docker-compose exec -T postgres psql -U postgres egitim_yonetim
```
