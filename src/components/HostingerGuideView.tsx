import React, { useState } from 'react';
import {
  Server,
  Database,
  CheckCircle2,
  Copy,
  Check,
  FileCode,
  Download,
  Terminal,
  ExternalLink,
} from 'lucide-react';

export const HostingerGuideView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const sampleEnv = `# Hostinger / VPS .env Konfigürasyonu
PORT=3000
NODE_ENV=production
APP_URL="https://cagdaskultur.com"

# MySQL Veritabanı Bağlantısı (Hostinger cPanel / hPanel)
DB_HOST="localhost"
DB_USER="u123456789_sahne"
DB_PASS="GuvenliSifre123!"
DB_NAME="u123456789_sahnesanat"
`;

  const copyEnv = () => {
    navigator.clipboard.writeText(sampleEnv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left space-y-10">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
          <Server className="w-4 h-4" />
          <span>Altyapı ve Canlıya Alma Rehberi</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 mt-1">
          Hostinger & MySQL Kurulum Talimatları
        </h1>
        <p className="text-sm text-stone-600 mt-2 max-w-3xl leading-relaxed">
          Platformumuz, hiçbir harici kilitli bulut servisine bağımlı kalmadan; Hostinger Node.js Application Manager, cPanel, hPanel veya standart herhangi bir Linux/VPS sunucusunda MySQL 8.0+ / MariaDB ile sorunsuz çalışacak mimaride hazırlanmıştır.
        </p>
      </div>

      {/* 4 Steps Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: MySQL Setup */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-800" />
            <span>Hostinger'da MySQL Veritabanı Oluşturma</span>
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Hostinger hPanel panelinize giriş yapıp <strong>Veritabanları (Databases) &gt; MySQL Veritabanları</strong> sekmesine gidin. Yeni bir veritabanı adı, kullanıcı adı ve şifresi oluşturun.
          </p>
        </div>

        {/* Step 2: Import schema.sql */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-amber-800" />
            <span>phpMyAdmin ile schema.sql Yükleme</span>
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            phpMyAdmin'e girip yeni açtığınız veritabanını seçin. <strong>İçe Aktar (Import)</strong> butonuna tıklayarak projenin kök dizininde yer alan <code className="bg-stone-100 px-1 rounded">db/schema.sql</code> dosyasını seçip yükleyin. 24 tablonun tamamı ilişkileriyle oluşturulur.
          </p>
        </div>

        {/* Step 3: Node.js Setup */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-amber-800" />
            <span>Node.js Uygulamasını Başlatma</span>
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Hostinger hPanel'de <strong>Node.js</strong> bölümüne gidin.
            Node sürümü olarak <strong>v20+</strong> veya <strong>v22 LTS</strong> seçin.
            Application Root dizinini <code className="bg-stone-100 px-1 rounded">/public_html</code> olarak belirleyin.
            Başlangıç komutu: <code className="bg-stone-100 px-1 rounded">npm start</code>.
          </p>
        </div>

        {/* Step 4: Environment Variables */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold text-sm">
            4
          </div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-800" />
            <span>Ortam Değişkenleri (.env) Tanımlama</span>
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Dosya yöneticisinde projenin kök dizininde bir <code className="bg-stone-100 px-1 rounded">.env</code> dosyası oluşturup aşağıdaki MySQL bağlantı bilgilerini yapıştırın.
          </p>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <FileCode className="w-4 h-4" />
            <span>.env Örnek Konfigürasyonu</span>
          </div>
          <button
            onClick={copyEnv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
          </button>
        </div>
        <pre className="text-xs font-mono text-stone-300 overflow-x-auto p-4 bg-stone-950 rounded-2xl border border-stone-800">
          {sampleEnv}
        </pre>
      </div>

      {/* SQL Download / Location info */}
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-3xl space-y-2">
        <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-800" />
          <span>SQL Şeması Projede Hazır</span>
        </h3>
        <p className="text-xs text-amber-900 leading-relaxed">
          Hazırladığımız <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200">db/schema.sql</code> dosyası MySQL 8.0, InnoDB, utf8mb4 karakter seti ve ilişkisel foreign key kısıtlamalarıyla birebir uyumludur. Bu projeyi GitHub'a aktarıp Hostinger'a çektiğinizde başka hiçbir şema yazmanıza gerek kalmaz.
        </p>
      </div>
    </div>
  );
};
