-- Veritabanını oluştur (eğer yoksa)
CREATE DATABASE egitim_yonetim;

-- Veritabanına bağlan
\c egitim_yonetim;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Veritabanı kullanıcısına izinler ver
GRANT ALL PRIVILEGES ON DATABASE egitim_yonetim TO postgres;