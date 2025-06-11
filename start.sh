#!/bin/bash

echo "🚀 YEDT Eğitim Yönetim Sistemi başlatılıyor..."

# .env dosyasının varlığını kontrol et
if [ ! -f .env ]; then
    echo "📝 .env dosyası bulunamadı, örnek dosyadan kopyalanıyor..."
    cp .env.example .env
    echo "⚠️  Lütfen .env dosyasını ihtiyaçlarınıza göre düzenleyin!"
fi

# Docker Compose ile servisleri başlat
echo "🐳 Docker servisleri başlatılıyor..."
docker-compose up -d

echo "⏳ Servislerin hazır olması bekleniyor..."
sleep 30

echo "✅ Tüm servisler başlatıldı!"
echo ""
echo "📍 Erişim Bilgileri:"
echo "   🎯 Admin Panel: http://localhost:3001"
echo "   👥 Öğrenci Portal: http://localhost:3000"
echo "   🔧 API: http://localhost:5000"
echo "   🗄️  PgAdmin: http://localhost:5050 (admin@yedt.com / admin123)"
echo ""
echo "📊 Servislerin durumunu kontrol etmek için: docker-compose ps"
echo "📋 Logları görmek için: docker-compose logs -f"
