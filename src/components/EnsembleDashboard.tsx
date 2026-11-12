import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Instrument, EnsembleMember } from '../types';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Calendar,
  Music2,
  Trash2,
  Plus,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrencyTRY } from '../utils/businessLogic';

export const EnsembleDashboard: React.FC = () => {
  const { ensembles, bookings, applications } = useApp();
  const ensemble = ensembles[0];

  const [members, setMembers] = useState<EnsembleMember[]>(ensemble.members);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberInstrument, setNewMemberInstrument] = useState<Instrument>('Keman');
  const [newMemberRole, setNewMemberRole] = useState('Enstrüman İcracısı');
  const [showAddModal, setShowAddModal] = useState(false);

  const ensembleBookings = bookings.filter((b) => b.performerId === ensemble.id);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMem: EnsembleMember = {
      id: `mem_${Date.now()}`,
      name: newMemberName,
      instrument: newMemberInstrument,
      roleTitle: newMemberRole,
      joinedYear: new Date().getFullYear(),
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    };

    setMembers([...members, newMem]);
    setNewMemberName('');
    setShowAddModal(false);
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={ensemble.avatarUrl}
              alt={ensemble.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border border-stone-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{ensemble.name}</h1>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Doğrulanmış Topluluk
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Ensemble Yönetim Paneli · {ensemble.ensembleType} · {ensemble.city}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-sm flex items-center gap-2 shrink-0"
          >
            <UserPlus className="w-4 h-4 text-amber-400" />
            <span>Yeni Üye Davet Et</span>
          </button>
        </div>
      </div>

      {/* Grid: Members Roster & Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Member Management (Section 5.2 Requirement) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h2 className="text-base font-bold text-stone-900">Kadro ve Üye Yönetimi</h2>
            <span className="text-xs text-stone-500">{members.length} Aktif Sanatçı</span>
          </div>

          <div className="space-y-3">
            {members.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={m.avatarUrl}
                    alt={m.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-stone-900">{m.name}</div>
                    <div className="text-[11px] text-amber-800 font-medium">
                      {m.instrument} · {m.roleTitle}
                    </div>
                  </div>
                </div>

                {members.length > 2 && (
                  <button
                    onClick={() => handleRemoveMember(m.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                    title="Kadrodan Çıkar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Ensemble Bookings & Gigs */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-stone-900">Topluluk Rezervasyonları</h2>

          {ensembleBookings.length === 0 ? (
            <p className="text-xs text-stone-500">Henüz kesinleşmiş bir topluluk rezervasyonu bulunmuyor.</p>
          ) : (
            <div className="space-y-3">
              {ensembleBookings.map((b) => (
                <div key={b.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{b.listingTitle}</span>
                    <span className="font-bold text-emerald-800">{formatCurrencyTRY(b.netPayoutAmount)}</span>
                  </div>
                  <div className="text-stone-500">
                    {b.businessName} · {b.eventDate}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-left shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-stone-900">Ensemble Kadrosuna Üye Ekle</h3>
            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Ad Soyad</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Sanatçının adı ve soyadı"
                  className="w-full text-xs p-3 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Enstrüman</label>
                <select
                  value={newMemberInstrument}
                  onChange={(e) => setNewMemberInstrument(e.target.value as any)}
                  className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-white"
                >
                  <option value="Keman">Keman</option>
                  <option value="Viyola">Viyola</option>
                  <option value="Viyolonsel (Çello)">Viyolonsel (Çello)</option>
                  <option value="Kontrbas">Kontrbas</option>
                  <option value="Flüt">Flüt</option>
                  <option value="Klarnet">Klarnet</option>
                  <option value="Piyano">Piyano</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Rol / Başlık</label>
                <input
                  type="text"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="Örn: 2. Keman veya Konuk Sanatçı"
                  className="w-full text-xs p-3 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-stone-900 rounded-xl"
                >
                  Üyeyi Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
