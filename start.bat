@echo off
echo 🚀 YEDT Eğitim Yönetim Sistemi başlatılıyor...

REM .env dosyasının varlığını kontrol et
if not exist .env (
    echo 📝 .env dosyası bulunamadı, örnek dosyadan kopyalanıyor...
    copy .env.example .env
    echo ⚠️  Lütfen .env dosyasını ihtiyaçlarınıza göre düzenleyin!
)

REM Docker Compose ile servisleri başlat
echo 🐳 Docker servisleri başlatılıyor...
docker-compose up -d

echo ⏳ Servislerin hazır olması bekleniyor...
timeout /t 30 /nobreak >nul

echo ✅ Tüm servisler başlatıldı!
echo.
echo 📍 Erişim Bilgileri:
echo    🎯 Admin Panel: http://localhost:3000
echo    👥 Öğrenci Portal: http://localhost:3002
echo    🔧 API: http://localhost:5000
echo    🗄️  PgAdmin: http://localhost:5050 (admin@yedt.com / admin123)
echo.
echo 📊 Servislerin durumunu kontrol etmek için: docker-compose ps
echo 📋 Logları görmek için: docker-compose logs -f

pause
