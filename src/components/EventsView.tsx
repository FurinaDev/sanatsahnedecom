import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EventAnnouncement, EventCategory, MusicGenre } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  PlusCircle,
  CheckCircle2,
  ExternalLink,
  Download,
  CalendarPlus,
  Filter,
  Search,
  Tag,
  ArrowRight,
  ChevronLeft,
  DollarSign,
  Sparkles,
} from 'lucide-react';

const CATEGORIES: (EventCategory | 'Tümü')[] = [
  'Tümü',
  'Müzik & Konser',
  'Sergi & Galeri',
  'Atölye & Masterclass',
  'Tiyatro & Sahne',
  'Festival',
  'Diğer',
];

const CITIES = ['Tümü', 'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Eskişehir'];

export const EventsView: React.FC = () => {
  const { events, addEventAnnouncement } = useApp();

  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'Tümü'>('Tümü');
  const [selectedCity, setSelectedCity] = useState<string>('Tümü');
  const [pricingFilter, setPricingFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for New Event Announcement (In-page, no popup)
  const [formData, setFormData] = useState({
    title: '',
    category: 'Müzik & Konser' as EventCategory,
    organizerName: '',
    organizerContact: '',
    venueName: '',
    city: 'İstanbul',
    district: '',
    eventDate: '',
    startTime: '20:00',
    endTime: '21:30',
    genres: ['Klasik Müzik'] as MusicGenre[],
    performers: '',
    ticketPrice: 0,
    isFree: false,
    ticketUrl: '',
    description: '',
    posterUrl: '',
  });

  const [submitFeedback, setSubmitFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = e.title.toLowerCase().includes(q);
        const matchVenue = e.venueName.toLowerCase().includes(q);
        const matchPerformer = e.performers.toLowerCase().includes(q);
        if (!matchTitle && !matchVenue && !matchPerformer) return false;
      }

      // Category
      if (selectedCategory !== 'Tümü' && e.category !== selectedCategory) {
        return false;
      }

      // City
      if (selectedCity !== 'Tümü' && e.city !== selectedCity) {
        return false;
      }

      // Pricing
      if (pricingFilter === 'free' && !e.isFree && e.ticketPrice > 0) {
        return false;
      }
      if (pricingFilter === 'paid' && (e.isFree || e.ticketPrice === 0)) {
        return false;
      }

      return true;
    });
  }, [events, searchQuery, selectedCategory, selectedCity, pricingFilter]);

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.venueName.trim() || !formData.eventDate) {
      setSubmitFeedback({
        success: false,
        message: 'Lütfen etkinlik başlığı, mekân ve tarih bilgilerini eksiksiz doldurunuz.',
      });
      return;
    }

    const defaultPoster = formData.posterUrl.trim()
      ? formData.posterUrl
      : 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80';

    const res = addEventAnnouncement({
      title: formData.title,
      category: formData.category,
      organizerName: formData.organizerName || 'Bağımsız Sanatçı / İnisiyatif',
      organizerContact: formData.organizerContact,
      venueName: formData.venueName,
      city: formData.city,
      district: formData.district,
      eventDate: formData.eventDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      genres: formData.genres,
      performers: formData.performers || 'Belirtilmedi',
      ticketPrice: formData.isFree ? 0 : Number(formData.ticketPrice),
      isFree: formData.isFree,
      ticketUrl: formData.ticketUrl,
      description: formData.description,
      posterUrl: defaultPoster,
    });

    if (res.success) {
      setSubmitFeedback({
        success: true,
        message: 'Etkinlik duyurunuz başarıyla oluşturuldu ve moderatör onay kuyruğuna iletildi.',
      });
      setTimeout(() => {
        setActiveTab('list');
        setSubmitFeedback(null);
      }, 1500);
    }
  };

  // Google Calendar URL Generator
  const generateGoogleCalendarUrl = (item: EventAnnouncement) => {
    const title = encodeURIComponent(item.title);
    const details = encodeURIComponent(
      `${item.description}\n\nİcracılar: ${item.performers}\nMekân: ${item.venueName}, ${item.city}\nDüzenleyen: ${item.organizerName}`
    );
    const location = encodeURIComponent(`${item.venueName}, ${item.city}`);

    const cleanDate = item.eventDate.replace(/-/g, '');
    const startHour = item.startTime ? item.startTime.replace(/:/g, '') : '2000';
    const endHour = item.endTime ? item.endTime.replace(/:/g, '') : '2200';
    const dates = `${cleanDate}T${startHour}00/${cleanDate}T${endHour}00`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  // Download .ics File (Apple, Outlook, Native Calendar)
  const downloadIcsFile = (item: EventAnnouncement) => {
    const cleanDate = item.eventDate.replace(/-/g, '');
    const startHour = item.startTime ? item.startTime.replace(/:/g, '') : '2000';
    const endHour = item.endTime ? item.endTime.replace(/:/g, '') : '2200';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SanatSahnede//Etkinlik Takvimi//TR',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${item.title}`,
      `DESCRIPTION:${item.description.replace(/\n/g, '\\n')} - İcracı: ${item.performers}`,
      `LOCATION:${item.venueName}, ${item.city}`,
      `DTSTART:${cleanDate}T${startHour}00`,
      `DTEND:${cleanDate}T${endHour}00`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Top Banner & Tab Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
            Kültür & Sanat Etkinlikleri
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Konserler, sergiler ve atölyeler; takviminize tek tıkla ekleyin veya kendi etkinliğinizi paylaşın.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'create' ? (
            <button
              onClick={() => setActiveTab('list')}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Etkinlik Listesine Dön</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('create')}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-stone-900 hover:bg-stone-800 text-white transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Etkinlik Duyurusu Paylaş</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'create' ? (
        /* In-page Event Creation Form (NO POPUP) */
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-5">
          <div>
            <h2 className="text-base font-bold text-stone-900">Yeni Etkinlik Duyurusu Yayınla</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Konser, sergi veya atölye duyurunuz moderatör onayından geçtikten sonra herkese açık takvimde listelenecektir.
            </p>
          </div>

          {submitFeedback && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                submitFeedback.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{submitFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Etkinlik Kategorisi</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-stone-900"
              >
                {CATEGORIES.filter((c) => c !== 'Tümü').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Etkinlik Başlığı</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Örn: Akustik Trio Bahar Resitali"
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Mekân / Salon Adı</label>
                <input
                  type="text"
                  required
                  value={formData.venueName}
                  onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                  placeholder="Örn: Pera Tarihi Konser Salonu"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Şehir</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-stone-900"
                >
                  {CITIES.filter((c) => c !== 'Tümü').map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Tarih</label>
                <input
                  type="date"
                  required
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Başlangıç Saati</label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Sanatçılar / İcracılar</label>
              <input
                type="text"
                value={formData.performers}
                onChange={(e) => setFormData({ ...formData, performers: e.target.value })}
                placeholder="Örn: Efe Özkan & İstanbul String Trio"
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900"
              />
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                <input
                  type="checkbox"
                  checked={formData.isFree}
                  onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                  className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                />
                <span>Ücretsiz Katılım</span>
              </label>

              {!formData.isFree && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-stone-600">Bilet Fiyatı (₺):</span>
                  <input
                    type="number"
                    value={formData.ticketPrice}
                    onChange={(e) => setFormData({ ...formData, ticketPrice: Number(e.target.value) })}
                    className="w-24 px-2 py-1 text-xs rounded-lg border border-stone-200"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Açıklama & Program</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Eserler, konsept veya katılım şartları hakkında detaylar..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-2xs"
              >
                Onaya Gönder
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Event List with Left Filter Sidebar + Compact Cards */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Filter Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filtrele</span>
                </div>
                {(selectedCategory !== 'Tümü' || selectedCity !== 'Tümü' || pricingFilter !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('Tümü');
                      setSelectedCity('Tümü');
                      setPricingFilter('all');
                      setSearchQuery('');
                    }}
                    className="text-[11px] text-[#0a66c2] hover:underline"
                  >
                    Temizle
                  </button>
                )}
              </div>

              {/* Search input */}
              <div>
                <label className="text-[11px] font-semibold text-stone-600 mb-1 block">Arama</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Etkinlik veya icracı ara..."
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-stone-900"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-[11px] font-semibold text-stone-600 mb-1.5 block">Kategori</label>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        selectedCategory === cat
                          ? 'bg-stone-900 text-white font-bold'
                          : 'text-stone-700 hover:bg-stone-100 font-medium'
                      }`}
                    >
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* City Filter */}
              <div>
                <label className="text-[11px] font-semibold text-stone-600 mb-1.5 block">Şehir</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pricing Filter */}
              <div>
                <label className="text-[11px] font-semibold text-stone-600 mb-1.5 block">Ücret Durumu</label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => setPricingFilter('all')}
                    className={`py-1.5 text-center rounded-lg text-xs font-semibold border transition-colors ${
                      pricingFilter === 'all'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    Tümü
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricingFilter('free')}
                    className={`py-1.5 text-center rounded-lg text-xs font-semibold border transition-colors ${
                      pricingFilter === 'free'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    Ücretsiz
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricingFilter('paid')}
                    className={`py-1.5 text-center rounded-lg text-xs font-semibold border transition-colors ${
                      pricingFilter === 'paid'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    Ücretli
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Compact Event Cards */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-3">
            {filteredEvents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 text-xs">
                Seçilen filtrelere uygun etkinlik bulunamadı. Lütfen filtrelerinizi sıfırlayınız.
              </div>
            ) : (
              filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white rounded-2xl border border-stone-200 hover:border-stone-300 p-4 shadow-2xs transition-all hover:shadow-xs flex flex-col sm:flex-row gap-4"
                >
                  {/* Poster Thumbnail */}
                  <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-stone-100 shrink-0 relative">
                    <img
                      src={evt.posterUrl}
                      alt={evt.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {evt.category || 'Müzik & Konser'}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                    <div>
                      {/* Date & Location Line */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500 mb-1">
                        <span className="flex items-center gap-1 font-semibold text-stone-800">
                          <Calendar className="w-3.5 h-3.5 text-stone-600" />
                          <span>{evt.eventDate} ({evt.startTime})</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-stone-600">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>{evt.venueName}, {evt.city}</span>
                        </span>
                        <span>·</span>
                        {evt.isFree || evt.ticketPrice === 0 ? (
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                            Ücretsiz
                          </span>
                        ) : (
                          <span className="text-stone-800 font-bold bg-stone-100 px-2 py-0.5 rounded-md">
                            {evt.ticketPrice} ₺
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                        {evt.title}
                      </h3>

                      <div className="text-xs text-stone-600 mt-1 line-clamp-1">
                        <span className="font-semibold text-stone-800">İcracılar: </span>
                        <span>{evt.performers}</span>
                      </div>

                      <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>

                    {/* Actions: Add to Calendar, .ics, ticket */}
                    <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <a
                          href={generateGoogleCalendarUrl(evt)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-700 font-medium transition-colors flex items-center gap-1 text-[11px]"
                        >
                          <CalendarPlus className="w-3.5 h-3.5 text-stone-600" />
                          <span>Google Takvim</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => downloadIcsFile(evt)}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-700 font-medium transition-colors flex items-center gap-1 text-[11px]"
                          title="Apple / Outlook Takvimine İndir (.ics)"
                        >
                          <Download className="w-3.5 h-3.5 text-stone-600" />
                          <span>.ICS İndir</span>
                        </button>
                      </div>

                      {evt.ticketUrl && (
                        <a
                          href={evt.ticketUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold transition-colors flex items-center gap-1 text-[11px]"
                        >
                          <span>Bilet Al</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </main>
        </div>
      )}
    </div>
  );
};
