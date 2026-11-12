import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Star,
  MapPin,
  Building,
  ChevronLeft,
  Calendar,
  ExternalLink,
  Phone,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrencyTRY } from '../utils/businessLogic';

interface Props {
  businessId?: string;
  onBack: () => void;
  onSelectListing: (listingId: string) => void;
}

export const BusinessProfileView: React.FC<Props> = ({
  businessId = 'biz_grand_bosphorus',
  onBack,
  onSelectListing,
}) => {
  const { businesses, listings } = useApp();
  const business = businesses.find((b) => b.id === businessId) || businesses[0];
  const businessListings = listings.filter((l) => l.businessId === business.id && l.status === 'active');

  return (
    <div className="space-y-6 text-left">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Geri Dön</span>
        </button>

        <div className="text-xs font-mono text-stone-400 bg-stone-100 px-2.5 py-1 rounded-md">
          /isletme/{business.slug}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="h-48 sm:h-64 bg-stone-900 relative">
          {business.coverUrl && (
            <img
              src={business.coverUrl}
              alt={business.businessName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-70"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
        </div>

        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <div className="relative">
                <img
                  src={business.logoUrl}
                  alt={business.businessName}
                  referrerPolicy="no-referrer"
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white shadow-xl bg-stone-100"
                />
                {business.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-emerald-700 text-white p-1.5 rounded-lg shadow-md" title="Doğrulanmış İşletme">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">{business.businessName}</h1>
                <div className="text-sm font-semibold text-amber-800">{business.businessType}</div>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{business.address || `${business.city}, ${business.district}`}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center sm:text-right bg-stone-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
              <div>
                <div className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Puan</div>
                <div className="flex items-center justify-center sm:justify-end gap-1 font-bold text-stone-900 text-lg">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{business.ratingAvg.toFixed(2)}</span>
                </div>
                <div className="text-[11px] text-stone-400">{business.ratingCount} Değerlendirme</div>
              </div>

              <div>
                <div className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Etkinlikler</div>
                <div className="font-bold text-stone-900 text-lg tabular-nums">{business.completedBookingsCount}</div>
                <div className="text-[11px] text-stone-400">Tamamlanan Rezervasyon</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-stone-900">İşletme Hakkında</h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{business.description}</p>
          </div>

          {/* Active Listings from this Business */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-stone-900">Yayındaki Etkinlik İlanları ({businessListings.length})</h2>

            {businessListings.length === 0 ? (
              <p className="text-xs text-stone-500">Şu anda aktif bir ilan bulunmuyor.</p>
            ) : (
              <div className="space-y-3">
                {businessListings.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => onSelectListing(l.id)}
                    className="p-4 rounded-2xl bg-stone-50 hover:bg-stone-100/80 border border-stone-100 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-stone-900">{l.title}</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-2">
                        <span>{l.targetEnsembleType}</span>
                        <span aria-hidden="true">·</span>
                        <span>{l.eventDate} ({l.durationMins} dk)</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-stone-900">{formatCurrencyTRY(l.budgetAmount)}</div>
                      <div className="text-[10px] text-emerald-700">Net Hakediş</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Trust info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Kurumsal Güvence</h3>
            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex items-center gap-2 text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Vergi & Oda Kaydı Doğrulanmış</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Zamanında Ödeme Sicili Kusursuz</span>
              </div>
              <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-100">
                Resmî vergi levhası ve ticaret sicil belgeleri KVKK kapsamında gizlenmiş olup, platform yönetimi tarafından incelenmiştir.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
