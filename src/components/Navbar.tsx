import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RoleType } from '../types';
import {
  Users,
  Music2,
  Building2,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  LogIn,
  UserPlus,
  LogOut,
  Edit3,
  User as UserIcon,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    navigateTo,
    activeRole,
    switchRole,
    currentUser,
    isAuthenticated,
    setAuthModalMode,
    logout,
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roleLabels: Record<RoleType, { label: string; icon: React.ReactNode; desc: string }> = {
    business_owner: {
      label: 'İşletme / Mekân',
      icon: <Building2 className="w-4 h-4 text-amber-600" />,
      desc: 'Hilton Bosphorus & Mekânlar',
    },
    artist: {
      label: 'Bireysel Sanatçı',
      icon: <Music2 className="w-4 h-4 text-amber-600" />,
      desc: 'Efe Özkan (Piyanist)',
    },
    ensemble_leader: {
      label: 'Topluluk Lideri',
      icon: <Users className="w-4 h-4 text-amber-600" />,
      desc: 'Boğaziçi Oda Triosu',
    },
    admin: {
      label: 'Platform Yöneticisi',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
      desc: 'Sistem Yönetimi & Denetim',
    },
  };

  const getDashboardView = () => {
    switch (activeRole) {
      case 'business_owner':
        return 'business_dashboard';
      case 'artist':
        return 'artist_dashboard';
      case 'ensemble_leader':
        return 'ensemble_dashboard';
      case 'admin':
        return 'admin_panel';
      default:
        return 'business_dashboard';
    }
  };

  const navLinks = [
    { label: 'İlanlar', view: 'listings' as const, match: ['listings', 'listing_detail'] },
    { label: 'Sanatçılar', view: 'artists_directory' as const, match: ['artists_directory', 'artist_profile', 'profile_edit'] },
    { label: 'Topluluklar', view: 'ensembles_directory' as const, match: ['ensembles_directory', 'ensemble_profile'] },
    { label: 'İşletmeler', view: 'businesses_directory' as const, match: ['businesses_directory', 'business_profile'] },
    { label: 'Etkinlikler', view: 'events' as const, match: ['events', 'event_detail'] },
    { label: 'İletişim', view: 'contact' as const, match: ['contact'] },
  ];

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xs px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-3">
          {/* Brand Wordmark: Plain text 'sanatsahnede.com' (NO logo icon) */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center text-left group focus:outline-hidden shrink-0"
          >
            <span className="text-lg sm:text-xl font-black tracking-tight text-stone-950 group-hover:text-stone-700 transition-colors">
              sanatsahnede.com
            </span>
          </button>

          {/* Clean Rounded Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-stone-600 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60">
            {navLinks.map((item) => {
              const isActive = item.match.includes(activeView as any);
              return (
                <button
                  key={item.label}
                  onClick={() => navigateTo(item.view)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-white text-stone-950 font-bold shadow-xs border border-stone-200/80'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Auth & Role Controls */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Role Switcher Pill */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setRoleDropdownOpen(!roleDropdownOpen);
                      setUserMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 transition-colors"
                    title="Rol Değiştir"
                  >
                    {roleLabels[activeRole].icon}
                    <span className="hidden xl:inline">{roleLabels[activeRole].label}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                  </button>

                  {roleDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                      onClick={() => setRoleDropdownOpen(false)}
                    >
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Aktif Hesap Türünü Seçin
                      </div>
                      {(Object.keys(roleLabels) as RoleType[]).map((role) => (
                        <button
                          key={role}
                          onClick={() => switchRole(role)}
                          className={`w-full flex items-start gap-3 px-3 py-2 text-left text-xs transition-colors ${
                            activeRole === role ? 'bg-stone-100 font-semibold text-stone-950' : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div className="mt-0.5">{roleLabels[role].icon}</div>
                          <div>
                            <div>{roleLabels[role].label}</div>
                            <div className="text-[10px] text-stone-400 font-normal">{roleLabels[role].desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dashboard Button */}
                <button
                  onClick={() => navigateTo(getDashboardView())}
                  className="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-2xs"
                >
                  Panel
                </button>

                {/* User Avatar Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setUserMenuOpen(!userMenuOpen);
                      setRoleDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-stone-100 border border-transparent hover:border-stone-200 transition-colors"
                  >
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.firstName}
                      className="w-7 h-7 rounded-lg object-cover border border-stone-200"
                    />
                    <span className="hidden md:inline text-xs font-bold text-stone-800">
                      {currentUser.firstName}
                    </span>
                    <ChevronDown className="w-3 h-3 text-stone-400" />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="px-3.5 py-2 border-b border-stone-100">
                        <div className="text-xs font-bold text-stone-900">
                          {currentUser.firstName} {currentUser.lastName}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate">{currentUser.email}</div>
                      </div>

                      <button
                        onClick={() => navigateTo('artist_profile', 'artist_efe_ozkan')}
                        className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-stone-800 hover:bg-stone-50 transition-colors"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-stone-600" />
                        <span>Profilim</span>
                      </button>

                      <button
                        onClick={() => navigateTo(getDashboardView())}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
                        <span>Yönetim Paneli</span>
                      </button>

                      <div className="border-t border-stone-100 my-1" />

                      <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Çıkış Yap</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthModalMode('login')}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Giriş Yap</span>
                </button>
                <button
                  onClick={() => setAuthModalMode('register')}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Üye Ol</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-stone-600 hover:text-stone-900 focus:outline-hidden"
              aria-label="Menü"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden pt-3 pb-2 border-t border-stone-100 mt-2 space-y-1 text-left">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  navigateTo(item.view);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                  item.match.includes(activeView as any)
                    ? 'bg-stone-900 text-white font-bold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-2 border-t border-stone-100 mt-2 flex flex-col gap-1.5">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      navigateTo('artist_profile', 'artist_efe_ozkan');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-stone-500" />
                    <span>Profilim</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Çıkış Yap</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setAuthModalMode('login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-center text-xs font-semibold text-stone-800 bg-stone-100 rounded-xl"
                  >
                    Giriş Yap
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalMode('register');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-center text-xs font-bold text-white bg-stone-900 rounded-xl"
                  >
                    Üye Ol
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
  );
};
