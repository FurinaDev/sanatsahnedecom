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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#16274e] dark:text-slate-200 hover:text-[#f25922] dark:hover:text-[#f25922] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Geri Dön</span>
        </button>

        <div className="text-xs font-sans tabular-nums text-[#475569] dark:text-slate-300 bg-white dark:bg-[#13213e] border border-[#e2e8f0] dark:border-[#1e335a] px-3 py-1 rounded-lg shadow-xs">
          /isletme/{business.slug}
        </div>
      </div>

      <div className="bg-white dark:bg-[#13213e] rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] overflow-hidden shadow-xs">
        <div className="h-48 sm:h-64 bg-[#0f1c38] relative">
          {business.coverUrl && (
            <img
              src={business.coverUrl}
              alt={business.businessName}
              className="w-full h-full object-cover opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/85 via-[#0f172a]/25 to-transparent" />
        </div>

        <div className="px-5 sm:px-8 pb-8 pt-4 relative bg-white dark:bg-[#13213e]">
          <div className="flex items-end justify-between -mt-16 sm:-mt-20 mb-4">
            <div className="relative shrink-0">
              <img
                src={business.logoUrl}
                alt={business.businessName}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white dark:border-[#13213e] shadow-xl bg-[#f8fafc] dark:bg-[#0f1c38]"
              />
              {business.isVerified && (
                <div className="absolute bottom-1 right-1 bg-emerald-700 text-white p-1.5 rounded-lg shadow-md border-2 border-white dark:border-[#13213e]" title="Doğrulanmış İşletme">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
            <div className="space-y-1">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0f172a] dark:text-white tracking-[-0.02em]">
                {business.businessName}
              </h1>
              <div className="text-sm font-semibold text-[#f25922]">{business.businessType}</div>
              <div className="flex items-center gap-2 text-xs text-[#475569] dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-[#64748b] dark:text-slate-400 shrink-0" />
                <span>{business.address || `${business.city}, ${business.district}`}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center sm:text-right bg-[#f8fafc] dark:bg-[#0f1c38] p-4 rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] self-stretch sm:self-start lg:self-auto tabular-nums">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] dark:text-slate-400">Puan</div>
                <div className="flex items-center justify-center sm:justify-end gap-1 font-display font-extrabold text-[#0f172a] dark:text-white text-lg">
                  <Star className="w-4 h-4 text-[#f25922] fill-[#f25922]" />
                  <span>{business.ratingAvg.toFixed(2)}</span>
                </div>
                <div className="text-[11px] text-[#64748b] dark:text-slate-400">{business.ratingCount} Değerlendirme</div>
              </div>

              <div className="border-l border-[#e2e8f0] dark:border-[#1e335a] pl-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] dark:text-slate-400">Etkinlikler</div>
                <div className="font-display font-extrabold text-[#0f172a] dark:text-white text-lg">{business.completedBookingsCount}</div>
                <div className="text-[11px] text-[#64748b] dark:text-slate-400">Tamamlanan</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-3">
            <h2 className="font-display text-base font-bold text-[#0f172a] dark:text-white">İşletme Hakkında</h2>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-300 leading-relaxed">{business.description}</p>
          </div>

          <div className="bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-4">
            <h2 className="font-display text-base font-bold text-[#0f172a] dark:text-white">
              Yayındaki Etkinlik İlanları ({businessListings.length})
            </h2>

            {businessListings.length === 0 ? (
              <p className="text-xs text-[#475569] dark:text-slate-300">Şu anda aktif bir ilan bulunmuyor.</p>
            ) : (
              <div className="space-y-3">
                {businessListings.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => onSelectListing(l.id)}
                    className="w-full text-left p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#0f1c38] hover:bg-[#f1f3ff] dark:hover:bg-[#1a2c54] border border-[#e2e8f0] dark:border-[#1e335a] cursor-pointer flex items-center justify-between gap-4 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="font-display text-xs font-bold text-[#0f172a] dark:text-white truncate">{l.title}</div>
                      <div className="text-[11px] text-[#475569] dark:text-slate-300 flex flex-wrap items-center gap-2 tabular-nums">
                        <span>{l.targetEnsembleType}</span>
                        <span aria-hidden="true">·</span>
                        <span>{l.eventDate} ({l.durationMins} dk)</span>
                      </div>
                    </div>

                    <div className="text-right tabular-nums shrink-0">
                      <div className="font-display text-xs font-extrabold text-[#16274e] dark:text-white">
                        {formatCurrencyTRY(l.budgetAmount)}
                      </div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">Net Hakediş</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#13213e] p-6 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-4">
            <h3 className="font-display text-sm font-bold text-[#0f172a] dark:text-white">Kurumsal Güvence</h3>
            <div className="space-y-3 text-xs text-[#475569] dark:text-slate-300">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Vergi & Oda Kaydı Doğrulanmış</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Zamanında Ödeme Sicili Kusursuz</span>
              </div>
              <div className="text-[11px] text-[#64748b] dark:text-slate-400 pt-2 border-t border-[#e2e8f0] dark:border-[#1e335a]">
                Resmî vergi levhası ve ticaret sicil belgeleri KVKK kapsamında gizlenmiş olup, platform yönetimi tarafından incelenmiştir.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
