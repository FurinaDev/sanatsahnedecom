-- =========================================================================
-- SAHNESANAT - KÜLTÜR VE SANAT HİZMET PAZARYERİ PLATFORMU
-- MySQL 8.0+ / MariaDB & Hostinger Uyumlu İlişkisel Veritabanı Şeması
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS contracts;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS ensemble_members;
DROP TABLE IF EXISTS ensembles;
DROP TABLE IF EXISTS individual_profiles;
DROP TABLE IF EXISTS business_profiles;
DROP TABLE IF EXISTS verification_requests;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS platform_settings;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. KULLANICILAR (USERS)
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    avatar_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'pending', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. KULLANICI ROLLERİ (USER_ROLES - RBAC)
CREATE TABLE user_roles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    role ENUM('artist', 'ensemble_leader', 'business_owner', 'business_member', 'admin') NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. BİREYSEL SANATÇI PROFİLLERİ (INDIVIDUAL_PROFILES)
CREATE TABLE individual_profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    stage_name VARCHAR(150),
    title VARCHAR(200) NOT NULL,
    bio_short VARCHAR(300),
    bio_long TEXT,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    primary_instrument VARCHAR(100) NOT NULL,
    instruments JSON,
    genres JSON,
    education VARCHAR(255),
    experience_years INT DEFAULT 0,
    repertoire JSON,
    video_urls JSON,
    audio_samples JSON,
    cv_url VARCHAR(500),
    avatar_url VARCHAR(500),
    cover_url VARCHAR(500),
    website VARCHAR(255),
    social_links JSON,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status ENUM('pending', 'approved', 'rejected', 'revision_needed') DEFAULT 'pending',
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    rating_count INT DEFAULT 0,
    completed_jobs_count INT DEFAULT 0,
    cancellation_rate DECIMAL(4,1) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. ENSEMBLE (MÜZİK TOPLULUKLARI)
CREATE TABLE ensembles (
    id VARCHAR(64) PRIMARY KEY,
    leader_user_id VARCHAR(64) NOT NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    ensemble_type VARCHAR(50) NOT NULL,
    bio TEXT,
    founded_year INT,
    city VARCHAR(100) NOT NULL,
    genres JSON,
    repertoire JSON,
    video_urls JSON,
    avatar_url VARCHAR(500),
    cover_url VARCHAR(500),
    website VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status ENUM('pending', 'approved', 'rejected', 'revision_needed') DEFAULT 'pending',
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    rating_count INT DEFAULT 0,
    completed_jobs_count INT DEFAULT 0,
    cancellation_rate DECIMAL(4,1) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leader_user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. ENSEMBLE ÜYELERİ (ENSEMBLE_MEMBERS)
CREATE TABLE ensemble_members (
    id VARCHAR(64) PRIMARY KEY,
    ensemble_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64),
    name VARCHAR(150) NOT NULL,
    instrument VARCHAR(100) NOT NULL,
    role_title VARCHAR(150) NOT NULL,
    joined_year INT,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ensemble_id) REFERENCES ensembles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. İŞLETMELER VE KURUMSAL İŞVERENLER (BUSINESS_PROFILES)
CREATE TABLE business_profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE,
    business_name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    business_type VARCHAR(100) NOT NULL,
    description TEXT,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    address TEXT,
    website VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    tax_number VARCHAR(50),
    tax_office VARCHAR(100),
    official_title VARCHAR(255),
    logo_url VARCHAR(500),
    cover_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status ENUM('pending', 'approved', 'rejected', 'revision_needed') DEFAULT 'pending',
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    rating_count INT DEFAULT 0,
    completed_bookings_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. İLANLAR (LISTINGS - SABİT BÜTÇELİ İŞLER)
CREATE TABLE listings (
    id VARCHAR(64) PRIMARY KEY,
    business_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    genres JSON,
    target_ensemble_type VARCHAR(50),
    required_instruments JSON,
    performer_count INT DEFAULT 1,
    duration_mins INT NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    application_deadline DATE NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    venue_name VARCHAR(200) NOT NULL,
    is_outdoor BOOLEAN DEFAULT FALSE,
    repertoire_expectation TEXT,
    dress_code VARCHAR(150),
    sound_system_provided BOOLEAN DEFAULT FALSE,
    transportation_provided BOOLEAN DEFAULT FALSE,
    accommodation_provided BOOLEAN DEFAULT FALSE,
    budget_amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'TRY',
    status ENUM('active', 'assigned', 'completed', 'cancelled') DEFAULT 'active',
    is_replacement BOOLEAN DEFAULT FALSE,
    original_listing_id VARCHAR(64),
    urgent_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES business_profiles(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. BAŞVURULAR (APPLICATIONS - TEKLİFSİZ, PROFİL VE REPERTUAR ODAKLI)
CREATE TABLE applications (
    id VARCHAR(64) PRIMARY KEY,
    listing_id VARCHAR(64) NOT NULL,
    applicant_type ENUM('individual', 'ensemble') NOT NULL,
    applicant_id VARCHAR(64) NOT NULL,
    applicant_user_id VARCHAR(64) NOT NULL,
    message TEXT NOT NULL,
    participating_members JSON,
    status ENUM('submitted', 'shortlisted', 'selected', 'rejected', 'withdrawn') DEFAULT 'submitted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. REZERVASYONLAR (BOOKINGS)
CREATE TABLE bookings (
    id VARCHAR(64) PRIMARY KEY,
    listing_id VARCHAR(64) NOT NULL,
    application_id VARCHAR(64) NOT NULL,
    business_id VARCHAR(64) NOT NULL,
    performer_type ENUM('individual', 'ensemble') NOT NULL,
    performer_id VARCHAR(64) NOT NULL,
    net_payout_amount DECIMAL(12,2) NOT NULL,
    commission_amount DECIMAL(12,2) NOT NULL,
    gross_amount DECIMAL(12,2) NOT NULL,
    commission_model ENUM('A_EMPLOYER_PAYS', 'B_ARTIST_DEDUCTS') NOT NULL,
    commission_rate DECIMAL(4,2) NOT NULL DEFAULT 10.00,
    status ENUM('agreement_pending', 'payment_pending', 'confirmed', 'performer_completed', 'employer_completed', 'completed', 'cancelled', 'in_dispute') DEFAULT 'agreement_pending',
    contract_terms_accepted_by_performer BOOLEAN DEFAULT FALSE,
    contract_terms_accepted_by_employer BOOLEAN DEFAULT FALSE,
    payment_status ENUM('unpaid', 'held_sandbox', 'released', 'refunded') DEFAULT 'unpaid',
    cancellation_reason TEXT,
    cancelled_by_role ENUM('performer', 'employer', 'admin'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE RESTRICT,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE RESTRICT,
    FOREIGN KEY (business_id) REFERENCES business_profiles(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. SÖZLEŞMELER (CONTRACTS)
CREATE TABLE contracts (
    id VARCHAR(64) PRIMARY KEY,
    booking_id VARCHAR(64) NOT NULL UNIQUE,
    terms_text LONGTEXT NOT NULL,
    version VARCHAR(20) DEFAULT '1.0',
    employer_accepted_at TIMESTAMP NULL,
    performer_accepted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. ÖDEME KAYITLARI (PAYMENTS)
CREATE TABLE payments (
    id VARCHAR(64) PRIMARY KEY,
    booking_id VARCHAR(64) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'sandbox_card',
    transaction_ref VARCHAR(100) NOT NULL UNIQUE,
    amount_paid DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'TRY',
    status ENUM('held', 'paid_out', 'refunded') DEFAULT 'held',
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. ÇİFT TARAFLI DEĞERLENDİRMELER (REVIEWS)
CREATE TABLE reviews (
    id VARCHAR(64) PRIMARY KEY,
    booking_id VARCHAR(64) NOT NULL,
    reviewer_id VARCHAR(64) NOT NULL,
    reviewer_role ENUM('employer', 'performer') NOT NULL,
    target_id VARCHAR(64) NOT NULL,
    score_overall TINYINT NOT NULL CHECK (score_overall BETWEEN 1 AND 5),
    score_communication TINYINT NOT NULL CHECK (score_communication BETWEEN 1 AND 5),
    score_professionalism TINYINT NOT NULL CHECK (score_professionalism BETWEEN 1 AND 5),
    score_quality TINYINT NOT NULL CHECK (score_quality BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. DOĞRULAMA VE AKREDİTASYON TALEPLERİ (VERIFICATION_REQUESTS)
CREATE TABLE verification_requests (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    entity_name VARCHAR(200) NOT NULL,
    account_type ENUM('artist', 'ensemble', 'business') NOT NULL,
    documents JSON,
    portfolio_url VARCHAR(500),
    video_url VARCHAR(500),
    status ENUM('pending', 'approved', 'rejected', 'revision_needed') DEFAULT 'pending',
    admin_note TEXT,
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. AUDIT LOGLARI (AUDIT_LOGS)
CREATE TABLE audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(64) NOT NULL,
    details JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. PLATFORM AYARLARI (PLATFORM_SETTINGS)
CREATE TABLE platform_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
