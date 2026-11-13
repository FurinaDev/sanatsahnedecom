import { ArtDiscipline, EnsembleType, Instrument, MusicGenre } from '../types';

export const ART_DISCIPLINES: (ArtDiscipline | 'Tümü')[] = [
  'Tümü',
  'Müzik',
  'Görsel Sanatlar & Sergi',
  'Heykel & Enstalasyon',
  'Sahne & Tiyatro',
  'Edebiyat & Söyleşi',
  'Bileşik Sanatlar',
];

export const DISCIPLINE_SPECIALTIES: Record<Exclude<ArtDiscipline, 'Müzik'>, string[]> = {
  'Görsel Sanatlar & Sergi': [
    'Yağlıboya & Tuval',
    'Baskı Resim',
    'Canlı Resim Performansı',
    'Kürasyon',
    'Fotoğraf & Video Art',
  ],
  'Heykel & Enstalasyon': [
    'Bronz & Taş Heykel',
    'Kinetik Enstalasyon',
    'Kamusal Alan Sanatı',
    'Açılış Performansı',
  ],
  'Sahne & Tiyatro': [
    'Fiziksel Tiyatro',
    'Okuma Tiyatrosu',
    'Çağdaş Dans',
    'Monolog & Tek Kişilik Oyun',
  ],
  'Edebiyat & Söyleşi': [
    'Şiir Dinletisi',
    'Yazar Söyleşisi',
    'Dramaturji',
    'İnteraktif Edebiyat Atölyesi',
  ],
  'Bileşik Sanatlar': [
    'Görsel-İşitsel (AV)',
    'Kürasyon',
    'Ses Enstalasyonu',
    'Multimedya Sahne',
    'Enstalasyon',
  ],
};

export const MUSIC_GENRES: (MusicGenre | 'Tümü')[] = [
  'Tümü',
  'Klasik Müzik',
  'Caz Müzik',
  'Oda Müziği',
  'Pop',
  'Rock',
  'Türk Sanat Müziği',
  'Türk Halk Müziği',
  'Dünya Müziği',
];

export const MUSIC_INSTRUMENTS: (Instrument | 'Tümü')[] = [
  'Tümü',
  'Piyano',
  'Keman',
  'Viyolonsel (Çello)',
  'Viyola',
  'Kontrbas',
  'Klarnet',
  'Flüt',
  'Trompet',
  'Trombon',
  'Saksafon',
  'Akustik Gitar',
  'Klasik Gitar',
  'Bas Gitar',
  'Davul',
  'Perküsyon',
  'Vokal',
  'Arp',
  'Kanun',
  'Ud',
  'Ney',
];

export const LISTING_ENSEMBLES: (EnsembleType | 'Tümü')[] = [
  'Tümü',
  'Solo',
  'Duo',
  'Trio',
  'Quartet',
  'Quintet',
  'Chamber Ensemble',
  'Orkestra',
  'Sanat Kolektifi',
  'Tiyatro & Performans Ekibi',
];

export const CITY_LIST = [
  'Tümü',
  'İstanbul',
  'Ankara',
  'İzmir',
  'Antalya',
  'Bursa',
  'Muğla',
  'Eskişehir',
];

export function resolveDiscipline(d?: ArtDiscipline): ArtDiscipline {
  return d || 'Müzik';
}
