# YEDT Eğitim Yönetim Sistemi - PowerShell Başlangıç Scripti
param(
    [switch]$Production,
    [switch]$Clean,
    [switch]$Logs,
    [switch]$Status,
    [switch]$Stop
)

Write-Host "🚀 YEDT Eğitim Yönetim Sistemi" -ForegroundColor Green

function Test-DockerInstalled {
    try {
        $dockerVersion = docker --version
        Write-Host "✅ Docker bulundu: $dockerVersion" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Docker bulunamadı! Lütfen Docker Desktop'ı yükleyin." -ForegroundColor Red
        Write-Host "İndirme linki: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
        return $false
    }
}

function Test-DockerRunning {
    try {
        docker info | Out-Null
        Write-Host "✅ Docker çalışıyor" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Docker çalışmıyor! Lütfen Docker Desktop'ı başlatın." -ForegroundColor Red
        return $false
    }
}

function Show-ServiceStatus {
    Write-Host "`n📊 Servis Durumu:" -ForegroundColor Cyan
    docker-compose ps
}

function Show-Logs {
    Write-Host "`n📋 Servis Logları:" -ForegroundColor Cyan
    docker-compose logs -f
}

function Stop-Services {
    Write-Host "`n🛑 Servisler durduruluyor..." -ForegroundColor Yellow
    docker-compose down
    Write-Host "✅ Tüm servisler durduruldu" -ForegroundColor Green
}

function Clean-Docker {
    Write-Host "`n🧹 Docker temizleme başlatılıyor..." -ForegroundColor Yellow
    docker-compose down -v
    docker system prune -f
    Write-Host "✅ Docker temizlendi" -ForegroundColor Green
}

function Start-Development {
    Write-Host "`n🔧 Geliştirme ortamı başlatılıyor..." -ForegroundColor Cyan
    
    # .env dosyasını kontrol et
    if (-Not (Test-Path ".env")) {
        if (Test-Path ".env.example") {
            Write-Host "📝 .env dosyası bulunamadı, örnek dosyadan kopyalanıyor..." -ForegroundColor Yellow
            Copy-Item ".env.example" ".env"
            Write-Host "⚠️  Lütfen .env dosyasını ihtiyaçlarınıza göre düzenleyin!" -ForegroundColor Yellow
        }
        else {
            Write-Host "❌ .env.example dosyası bulunamadı!" -ForegroundColor Red
            return
        }
    }

    # Docker Compose ile servisleri başlat
    Write-Host "🐳 Docker servisleri başlatılıyor..." -ForegroundColor Cyan
    docker-compose up -d

    Write-Host "⏳ Servislerin hazır olması bekleniyor..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30

    Write-Host "`n✅ Tüm servisler başlatıldı!" -ForegroundColor Green    Write-Host "📍 Erişim Bilgileri:" -ForegroundColor Cyan
    Write-Host "   🎯 Admin Panel: http://localhost:3000" -ForegroundColor White
    Write-Host "   👥 Öğrenci Portal: http://localhost:3002" -ForegroundColor White
    Write-Host "   🔧 API: http://localhost:5000" -ForegroundColor White
    Write-Host "   🗄️  PgAdmin: http://localhost:5050 (admin@yedt.com / admin123)" -ForegroundColor White
}

function Start-Production {
    Write-Host "`n🚀 Üretim ortamı başlatılıyor..." -ForegroundColor Cyan
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
    Write-Host "✅ Üretim ortamı başlatıldı!" -ForegroundColor Green
}

# Ana mantık
if (-Not (Test-DockerInstalled)) {
    exit 1
}

if (-Not (Test-DockerRunning)) {
    exit 1
}

if ($Status) {
    Show-ServiceStatus
    exit 0
}

if ($Logs) {
    Show-Logs
    exit 0
}

if ($Stop) {
    Stop-Services
    exit 0
}

if ($Clean) {
    Clean-Docker
    exit 0
}

if ($Production) {
    Start-Production
}
else {
    Start-Development
}

Write-Host "`n🔗 Yararlı Komutlar:" -ForegroundColor Cyan
Write-Host "   📊 Durum: .\start.ps1 -Status" -ForegroundColor White
Write-Host "   📋 Loglar: .\start.ps1 -Logs" -ForegroundColor White
Write-Host "   🛑 Durdur: .\start.ps1 -Stop" -ForegroundColor White
Write-Host "   🧹 Temizle: .\start.ps1 -Clean" -ForegroundColor White
Write-Host "   🚀 Üretim: .\start.ps1 -Production" -ForegroundColor White
