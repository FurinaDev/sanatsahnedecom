import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Instrument, MusicGenre, EducationItem, ExperienceItem, MediaItem } from '../types';
import {
  ChevronLeft,
  Camera,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  GraduationCap,
  Briefcase,
  Music,
  Video,
  FileText,
  MapPin,
  ExternalLink,
  UploadCloud,
  Image as ImageIcon,
  X,
} from 'lucide-react';

export const ProfileEditView: React.FC = () => {
  const { artists, currentUser, selectedEntityId, updateArtistProfile, navigateTo } = useApp();

  const currentArtist =
    artists.find((a) => a.userId === currentUser.id || a.id === selectedEntityId) || artists[0];

  // Local editable form state
  const [fullName, setFullName] = useState(currentArtist.fullName);
  const [stageName, setStageName] = useState(currentArtist.stageName || '');
  const [title, setTitle] = useState(currentArtist.title);
  const [city, setCity] = useState(currentArtist.city);
  const [district, setDistrict] = useState(currentArtist.district);
  const [experienceYears, setExperienceYears] = useState(currentArtist.experienceYears);
  const [avatarUrl, setAvatarUrl] = useState(currentArtist.avatarUrl);
  const [coverUrl, setCoverUrl] = useState(currentArtist.coverUrl || '');
  const [bioShort, setBioShort] = useState(currentArtist.bioShort);
  const [bioLong, setBioLong] = useState(currentArtist.bioLong);

  // Selected instruments
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>(
    currentArtist.instruments || [currentArtist.primaryInstrument]
  );
  const [selectedGenres, setSelectedGenres] = useState<MusicGenre[]>(currentArtist.genres || []);

  // Education list
  const [educations, setEducations] = useState<EducationItem[]>(
    currentArtist.educations || [
      {
        id: 'edu_1',
        school: 'Mimar Sinan Güzel Sanatlar Üniversitesi Devlet Konservatuvarı',
        degree: 'Lisans',
        field: 'Piyano Ana Sanat Dalı',
        yearStart: '2012',
        yearEnd: '2016',
      },
    ]
  );

  // Experience list
  const [experiences, setExperiences] = useState<ExperienceItem[]>(
    currentArtist.experiences || [
      {
        id: 'exp_1',
        role: 'Solist & Eşlikçi Piyanist',
        organization: 'İstanbul Devlet Senfoni Orkestrası & Oda Müziği',
        year: '2016 - Günümüz',
        description: 'Sezon konserleri, festival resitalleri ve özel kurumsal etkinlikler.',
      },
    ]
  );

  // Repertoire list
  const [repertoire, setRepertoire] = useState<string[]>(
    currentArtist.repertoire || [
      'Chopin: Nocturne No. 20 in C-sharp minor',
      'Debussy: Clair de Lune',
      'Bill Evans: Waltz for Debby (Caz Aranjmanı)',
    ]
  );
  const [newRepertoirePiece, setNewRepertoirePiece] = useState('');

  // Media items
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(
    currentArtist.mediaItems || [
      {
        id: 'med_1',
        title: 'Chopin Nocturne Op. 9 No. 2 Resitali',
        url: 'https://youtube.com/watch?v=demo1',
        type: 'video',
      },
      {
        id: 'med_2',
        title: 'Akustik Caz Trio Kaydı (Borusan)',
        url: 'https://soundcloud.com/demo2',
        type: 'audio',
      },
    ]
  );

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [avatarDragging, setAvatarDragging] = useState(false);
  const [coverDragging, setCoverDragging] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);

  const processFile = (file: File, setter: (dataUrl: string) => void) => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setter(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const ALL_INSTRUMENTS: Instrument[] = [
    'Piyano',
    'Keman',
    'Viyola',
    'Viyolonsel (Çello)',
    'Kontrbas',
    'Flüt',
    'Klarnet',
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

  const ALL_GENRES: MusicGenre[] = [
    'Klasik Müzik',
    'Caz Müzik',
    'Oda Müziği',
    'Pop',
    'Rock',
    'Türk Sanat Müziği',
    'Türk Halk Müziği',
    'Dünya Müziği',
  ];

  const toggleInstrument = (inst: Instrument) => {
    if (selectedInstruments.includes(inst)) {
      if (selectedInstruments.length > 1) {
        setSelectedInstruments(selectedInstruments.filter((i) => i !== inst));
      }
    } else {
      setSelectedInstruments([...selectedInstruments, inst]);
    }
  };

  const toggleGenre = (genre: MusicGenre) => {
    if (selectedGenres.includes(genre)) {
      if (selectedGenres.length > 1) {
        setSelectedGenres(selectedGenres.filter((g) => g !== genre));
      }
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: `edu_${Date.now()}`,
      school: 'Konservatuvar / Müzik Akademisi',
      degree: 'Lisans / Yüksek Lisans',
      field: 'Ana Sanat Dalı',
      yearStart: '2018',
      yearEnd: '2022',
    };
    setEducations([...educations, newEdu]);
  };

  const handleRemoveEducation = (id: string) => {
    setEducations(educations.filter((e) => e.id !== id));
  };

  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp_${Date.now()}`,
      role: 'Sanatçı / İcracı',
      organization: 'Topluluk veya Kurum Adı',
      year: '2023 - 2026',
      description: 'Konserler, festivaller ve stüdyo kayıtları.',
    };
    setExperiences([...experiences, newExp]);
  };

  const handleRemoveExperience = (id: string) => {
    setExperiences(experiences.filter((e) => e.id !== id));
  };

  const handleAddRepertoire = () => {
    if (!newRepertoirePiece.trim()) return;
    setRepertoire([...repertoire, newRepertoirePiece.trim()]);
    setNewRepertoirePiece('');
  };

  const handleRemoveRepertoire = (idx: number) => {
    setRepertoire(repertoire.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateArtistProfile({
      fullName,
      stageName,
      title,
      city,
      district,
      experienceYears: Number(experienceYears),
      avatarUrl,
      coverUrl,
      bioShort,
      bioLong,
      primaryInstrument: selectedInstruments[0] || currentArtist.primaryInstrument,
      instruments: selectedInstruments,
      genres: selectedGenres,
      educations,
      experiences,
      repertoire,
      mediaItems,
      education: educations[0] ? `${educations[0].school} (${educations[0].degree})` : currentArtist.education,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      navigateTo('artist_profile', currentArtist.id);
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-left">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigateTo('artist_profile', currentArtist.id)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#475569] dark:text-slate-300 hover:text-[#16274e] dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Profile Geri Dön</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Değişiklikler Kaydedildi!</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#16274e] hover:bg-[#111d38] dark:bg-[#f25922] dark:hover:bg-[#d94b18] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Profili Kaydet ve Yayınla</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Banner and Avatar section with Drag & Drop / File Selector */}
        <div className="bg-white dark:bg-[#13213e] rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] overflow-hidden shadow-xs">
          {/* Cover Photo Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setCoverDragging(true);
            }}
            onDragLeave={() => setCoverDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setCoverDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) processFile(file, setCoverUrl);
            }}
            className={`relative h-48 sm:h-60 bg-[#16274e] transition-colors ${
              coverDragging ? 'ring-4 ring-[#f25922] ring-inset bg-[#111d38]' : ''
            }`}
          >
            {coverUrl ? (
              <img
                src={coverUrl}
                alt="Kapak Görseli"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 text-xs gap-2 p-4 text-center">
                <ImageIcon className="w-8 h-8 text-slate-400" />
                <span>Kapak fotoğrafınızı buraya sürükleyip bırakın veya bilgisayardan seçin</span>
              </div>
            )}
            <div className="absolute inset-0 bg-[#0c0e12]/30 pointer-events-none" />

            {/* Cover Action Buttons */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <label className="cursor-pointer bg-white/95 dark:bg-[#13213e]/95 hover:bg-white dark:hover:bg-[#13213e] text-[#0f172a] dark:text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 transition-colors">
                <UploadCloud className="w-4 h-4 text-[#f25922]" />
                <span>Bilgisayardan Kapak Seç</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) processFile(file, setCoverUrl);
                  }}
                  className="hidden"
                />
              </label>

              {coverUrl && (
                <button
                  type="button"
                  onClick={() => setCoverUrl('')}
                  className="bg-[#16274e]/90 hover:bg-[#16274e] text-white p-1.5 rounded-xl shadow-md transition-colors"
                  title="Kapak Fotoğrafını Kaldır"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Avatar & Photo Management */}
          <div className="px-5 sm:px-6 pb-6 pt-3">
            {/* Top row with elevated Avatar */}
            <div className="flex flex-wrap items-end justify-between gap-3 -mt-16 sm:-mt-20 mb-4">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-white dark:border-[#13213e] shadow-xl bg-[#f8fafc] dark:bg-[#0f1c38] shrink-0">
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              </div>

              <label className="cursor-pointer bg-[#16274e] hover:bg-[#111d38] dark:bg-[#0f1c38] dark:border dark:border-[#1e335a] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition-colors">
                <UploadCloud className="w-4 h-4 text-[#f25922]" />
                <span>Yeni Profil Fotoğrafı Yükle</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) processFile(file, setAvatarUrl);
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Avatar Drag-and-Drop Uploader Box */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setAvatarDragging(true);
              }}
              onDragLeave={() => setAvatarDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setAvatarDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) processFile(file, setAvatarUrl);
              }}
              className={`border-2 border-dashed rounded-2xl p-4 transition-colors flex flex-col sm:flex-row items-center justify-between gap-4 ${
                avatarDragging
                  ? 'border-[#f25922] bg-[#f25922]/10'
                  : 'border-[#cbd5e1] dark:border-[#1e335a] hover:border-[#16274e] dark:hover:border-[#f25922] bg-[#f8fafc] dark:bg-[#0f1c38]'
              }`}
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#13213e] border border-[#e2e8f0] dark:border-[#1e335a] flex items-center justify-center shrink-0 text-[#f25922] shadow-2xs">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0f172a] dark:text-white">
                    Profil Fotoğrafı Sürükle veya Seç
                  </div>
                  <div className="text-[11px] text-[#64748b] dark:text-slate-400">
                    Bilgisayarınızdan bir görsel seçin veya buraya bırakın (PNG, JPG, WEBP — Maks. 10MB)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <label className="cursor-pointer bg-white dark:bg-[#13213e] hover:bg-slate-100 dark:hover:bg-[#1e335a] text-[#0f172a] dark:text-slate-200 border border-[#e2e8f0] dark:border-[#1e335a] text-xs font-semibold px-4 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors">
                  <UploadCloud className="w-4 h-4 text-[#64748b] dark:text-slate-400" />
                  <span>Dosya Seç</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) processFile(file, setAvatarUrl);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Optional URL Toggle */}
            <div className="pt-2 text-left">
              <button
                type="button"
                onClick={() => setShowManualUrl(!showManualUrl)}
                className="text-[11px] font-semibold text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white underline transition-colors"
              >
                {showManualUrl ? 'Manuel URL alanlarını gizle' : 'Alternatif: Web bağlantısı (URL) ile girmek için tıklayın'}
              </button>

              {showManualUrl && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#f8fafc] dark:bg-[#0f1c38] rounded-xl border border-[#e2e8f0] dark:border-[#1e335a]">
                  <div>
                    <label className="block text-[11px] font-bold text-[#475569] dark:text-slate-300 mb-1">
                      Profil Fotoğrafı URL
                    </label>
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#e2e8f0] dark:border-[#1e335a] bg-white dark:bg-[#13213e] text-[#0f172a] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#475569] dark:text-slate-300 mb-1">
                      Kapak Fotoğrafı URL
                    </label>
                    <input
                      type="url"
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#e2e8f0] dark:border-[#1e335a] bg-white dark:bg-[#13213e] text-[#0f172a] dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* General Details */}
        <div className="bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#0f172a] dark:text-white pb-2 border-b border-[#e2e8f0] dark:border-[#1e335a]">
            Temel Kimlik ve Konum Bilgileri
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#475569] dark:text-slate-300 mb-1">Ad Soyad</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-white focus:ring-2 focus:ring-[#f25922] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] dark:text-slate-300 mb-1">Sahne Adı (Varsa)</label>
              <input
                type="text"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                placeholder="Örn: Efe Jazz"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-white focus:ring-2 focus:ring-[#f25922] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#475569] dark:text-slate-300 mb-1">
                Mesleki Ünvan / Sahne Başlığı
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Konser Piyanisti & Akustik Caz İcracısı"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-white focus:ring-2 focus:ring-[#f25922] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] dark:text-slate-300 mb-1">Şehir</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-white focus:ring-2 focus:ring-[#f25922] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] dark:text-slate-300 mb-1">İlçe</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-white focus:ring-2 focus:ring-[#f25922] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] dark:text-slate-300 mb-1">
                Sahne Deneyimi (Yıl)
              </label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-white focus:ring-2 focus:ring-[#f25922] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-[#475569] dark:text-slate-300 mb-1">Kısa Tanıtım (Özet)</label>
            <textarea
              rows={2}
              value={bioShort}
              onChange={(e) => setBioShort(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-white focus:ring-2 focus:ring-[#f25922] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] dark:text-slate-300 mb-1">
              Detaylı Biyografi & Sanat Geçmişi
            </label>
            <textarea
              rows={4}
              value={bioLong}
              onChange={(e) => setBioLong(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-white focus:ring-2 focus:ring-[#f25922] focus:outline-none"
            />
          </div>
        </div>

        {/* Instruments and Genres */}
        <div className="bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#0f172a] dark:text-white pb-2 border-b border-[#e2e8f0] dark:border-[#1e335a]">
            Enstrümanlar ve Müzik Türleri
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#475569] dark:text-slate-300 mb-2">
              Çaldığınız Enstrümanlar (Çoklu Seçim)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_INSTRUMENTS.map((inst) => {
                const isSelected = selectedInstruments.includes(inst);
                return (
                  <button
                    key={inst}
                    type="button"
                    onClick={() => toggleInstrument(inst)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-[#16274e] dark:bg-[#f25922] text-white border-[#16274e] dark:border-[#f25922]'
                        : 'bg-[#f8fafc] dark:bg-[#0f1c38] text-[#475569] dark:text-slate-300 border-[#e2e8f0] dark:border-[#1e335a] hover:bg-[#f1f3ff] dark:hover:bg-[#1e335a]'
                    }`}
                  >
                    {inst}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-[#0f172a] dark:text-slate-200 mb-2">
              İcra Ettiğiniz Müzik Türleri
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_GENRES.map((g) => {
                const isSelected = selectedGenres.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-[#f25922] text-white border-[#f25922]'
                        : 'bg-[#f8fafc] dark:bg-[#0f1c38] text-[#ad3300] dark:text-[#ff8a65] border-[#ffb59e] dark:border-[#f25922]/40 hover:bg-[#ffdbd0]/40 dark:hover:bg-[#f25922]/15'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Education (LinkedIn-style) */}
        <div className="bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0] dark:border-[#1e335a]">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#475569] dark:text-slate-300" />
              <h3 className="text-sm font-bold text-[#0f172a] dark:text-white">Eğitim ve Akreditasyon</h3>
            </div>
            <button
              type="button"
              onClick={handleAddEducation}
              className="text-xs font-semibold text-[#f25922] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Eğitim Ekle</span>
            </button>
          </div>

          <div className="space-y-3">
            {educations.map((edu, idx) => (
              <div key={edu.id} className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#475569] dark:text-slate-300">Eğitim #{idx + 1}</span>
                  {educations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(edu.id)}
                      className="text-[#64748b] hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#475569] dark:text-slate-300">Okul / Konservatuvar</label>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEducations(educations.map((item) => (item.id === edu.id ? { ...item, school: val } : item)));
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#e2e8f0] dark:border-[#1e335a] bg-white dark:bg-[#13213e] text-[#0f172a] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#475569] dark:text-slate-300">Derece / Bölüm</label>
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEducations(educations.map((item) => (item.id === edu.id ? { ...item, field: val } : item)));
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#e2e8f0] dark:border-[#1e335a] bg-white dark:bg-[#13213e] text-[#0f172a] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#475569] dark:text-slate-300">Başlangıç Yılı</label>
                    <input
                      type="text"
                      value={edu.yearStart}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEducations(educations.map((item) => (item.id === edu.id ? { ...item, yearStart: val } : item)));
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#e2e8f0] dark:border-[#1e335a] bg-white dark:bg-[#13213e] text-[#0f172a] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#475569] dark:text-slate-300">Mezuniyet Yılı</label>
                    <input
                      type="text"
                      value={edu.yearEnd}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEducations(educations.map((item) => (item.id === edu.id ? { ...item, yearEnd: val } : item)));
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#e2e8f0] dark:border-[#1e335a] bg-white dark:bg-[#13213e] text-[#0f172a] dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience (LinkedIn-style) */}
        <div className="bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0] dark:border-[#1e335a]">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#475569] dark:text-slate-300" />
              <h3 className="text-sm font-bold text-[#0f172a] dark:text-white">Sahne & Orkestra Deneyimleri</h3>
            </div>
            <button
              type="button"
              onClick={handleAddExperience}
              className="text-xs font-semibold text-[#f25922] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Deneyim Ekle</span>
            </button>
          </div>

          <div className="space-y-3">
            {experiences.map((exp, idx) => (
              <div key={exp.id} className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#475569] dark:text-slate-300">Pozisyon #{idx + 1}</span>
                  {experiences.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(exp.id)}
                      className="text-[#64748b] hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#475569] dark:text-slate-300">Görev / Rol</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const val = e.target.value;
                        setExperiences(experiences.map((item) => (item.id === exp.id ? { ...item, role: val } : item)));
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#e2e8f0] dark:border-[#1e335a] bg-white dark:bg-[#13213e] text-[#0f172a] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#475569] dark:text-slate-300">Kurum / Topluluk</label>
                    <input
                      type="text"
                      value={exp.organization}
                      onChange={(e) => {
                        const val = e.target.value;
                        setExperiences(experiences.map((item) => (item.id === exp.id ? { ...item, organization: val } : item)));
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#e2e8f0] dark:border-[#1e335a] bg-white dark:bg-[#13213e] text-[#0f172a] dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-[#475569] dark:text-slate-300">Tarih Aralığı</label>
                    <input
                      type="text"
                      value={exp.year}
                      onChange={(e) => {
                        const val = e.target.value;
                        setExperiences(experiences.map((item) => (item.id === exp.id ? { ...item, year: val } : item)));
                      }}
                      placeholder="Örn: 2020 - 2024"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#e2e8f0] dark:border-[#1e335a] bg-white dark:bg-[#13213e] text-[#0f172a] dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-[#475569] dark:text-slate-300">Açıklama</label>
                    <input
                      type="text"
                      value={exp.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setExperiences(experiences.map((item) => (item.id === exp.id ? { ...item, description: val } : item)));
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#e2e8f0] dark:border-[#1e335a] bg-white dark:bg-[#13213e] text-[#0f172a] dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Repertoire List */}
        <div className="bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e2e8f0] dark:border-[#1e335a]">
            <Music className="w-4 h-4 text-[#475569] dark:text-slate-300" />
            <h3 className="text-sm font-bold text-[#0f172a] dark:text-white">Repertuvar Listesi</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newRepertoirePiece}
              onChange={(e) => setNewRepertoirePiece(e.target.value)}
              placeholder="Yeni eser / beste ekle (Örn: Beethoven Sonata No. 14)"
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-white focus:ring-2 focus:ring-[#f25922] focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddRepertoire();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddRepertoire}
              className="px-4 py-2 bg-[#16274e] hover:bg-[#111d38] dark:bg-[#f25922] dark:hover:bg-[#d94b18] text-white rounded-xl text-xs font-bold transition-colors"
            >
              Ekle
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {repertoire.map((piece, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] text-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-[#0f172a] dark:text-slate-200 truncate">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f25922] shrink-0" />
                  <span className="truncate">{piece}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveRepertoire(idx)}
                  className="text-[#64748b] hover:text-rose-600 ml-2 transition-colors shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto justify-center px-6 py-3 bg-[#16274e] hover:bg-[#111d38] dark:bg-[#f25922] dark:hover:bg-[#d94b18] text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Tüm Değişiklikleri Kaydet ve Profile Dön</span>
          </button>
        </div>
      </div>
    </div>
  );
};
