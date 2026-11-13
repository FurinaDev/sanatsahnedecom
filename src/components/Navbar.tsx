import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { BrandSymbol } from './ui/BrandSymbol';
import {
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  LogIn,
  LogOut,
  User as UserIcon,
  Sun,
  Moon,
  Megaphone,
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

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || localStorage.getItem('ss_theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ss_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ss_theme', 'light');
    }
  }, [isDark]);

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

  const handlePostListingClick = () => {
    if (!isAuthenticated) {
      setAuthModalMode('login');
      return;
    }
    switchRole('business_owner');
    navigateTo('business_dashboard');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#0f1c38] border-b border-slate-200 dark:border-[#1e335a] transition-colors overflow-x-clip">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex lg:grid lg:grid-cols-[1fr_auto_1fr] items-center justify-between gap-3 lg:gap-4">
        {/* Brand Lockup */}
        <button
          onClick={() => navigateTo('home')}
          className="lg:justify-self-start flex items-center gap-2.5 sm:gap-3 group text-left shrink-0 focus:outline-hidden cursor-pointer"
        >
          <div className="relative w-11 h-9 sm:w-12 sm:h-10 bg-[#E45424] rounded-xl flex items-center justify-center shadow-sm overflow-hidden transition-transform duration-200 group-hover:scale-105 shrink-0 px-1.5">
            <BrandSymbol className="w-full h-full text-white" strokeWidth={3.6} />
          </div>
          <div className="flex items-center shrink-0">
            <span className="font-sans font-extrabold text-sm xl:text-lg tracking-tight text-slate-900 dark:text-white leading-none whitespace-nowrap">
              SANAT<span className="text-[#E45424]">SAHNEDE</span>.COM
            </span>
          </div>
        </button>

        {/* Primary Desktop Navigation — Truly Centered */}
        <nav className="hidden lg:flex lg:justify-self-center items-center gap-1 xl:gap-3.5 2xl:gap-5 font-medium text-[13px] xl:text-sm text-slate-600 dark:text-slate-300 min-w-0">
          {navLinks.map((item) => {
            const isActive = item.match.includes(activeView as any);
            return (
              <button
                key={item.label}
                onClick={() => navigateTo(item.view)}
                className={`relative py-2 px-2 xl:px-2.5 rounded-lg whitespace-nowrap shrink-0 flex items-center transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#f25922] font-semibold'
                    : 'hover:text-[#16274e] dark:hover:text-white font-medium'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0.5 inset-x-2 xl:inset-x-2.5 h-0.5 rounded-full bg-[#f25922]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Utility & Action Zone */}
        <div className="lg:justify-self-end flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Dark/Light Mode Switch */}
          <button
            type="button"
            aria-label="Tema Değiştir"
            onClick={() => setIsDark((prev) => !prev)}
            className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {isAuthenticated ? (
            <>
              {/* User Avatar Menu */}
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                  }}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 md:pr-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.firstName}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <span className="hidden md:inline text-xs font-bold text-slate-800 dark:text-white">
                    {currentUser.firstName}
                  </span>
                  <ChevronDown
                    className={`hidden sm:inline w-3 h-3 text-slate-400 transition-transform duration-200 ${
                      userMenuOpen ? 'rotate-180 text-[#f25922]' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#111A2E] rounded-2xl elevation-dock border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-left shadow-xl"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {currentUser.firstName} {currentUser.lastName}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</div>
                      </div>

                      <button
                        onClick={() => navigateTo('artist_profile', 'artist_efe_ozkan')}
                        className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-[#E45424]" />
                        <span>Profilim</span>
                      </button>

                      <button
                        onClick={() => navigateTo(getDashboardView())}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#1E2B4F] dark:text-blue-400" />
                        <span>Yönetim Paneli</span>
                      </button>

                      <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                      <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-semibold cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Çıkış Yap</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <button
              onClick={() => setAuthModalMode('login')}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#E45424] dark:hover:text-[#E45424] px-3 py-2 transition-colors whitespace-nowrap shrink-0"
            >
              <LogIn className="w-4 h-4" />
              <span>Giriş Yap</span>
            </button>
          )}

          {/* Primary Orange CTA matching reference */}
          <button
            type="button"
            onClick={handlePostListingClick}
            className="hidden sm:inline-flex items-center gap-1.5 xl:gap-2 bg-[#E45424] hover:bg-[#c94317] text-white text-xs xl:text-sm font-semibold px-3 xl:px-4 py-2 xl:py-2.5 rounded-xl shadow-md shadow-[#E45424]/20 transition-[background-color,transform] duration-150 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Megaphone className="w-4 h-4 shrink-0" />
            <span>Sahne İlanı Ver</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 dark:text-slate-200 hover:text-[#E45424] focus:outline-hidden rounded-xl border border-slate-200 dark:border-slate-800"
            aria-label="Menü"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] text-left"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((item) => {
                const isActive = item.match.includes(activeView as any);
                return (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => {
                      navigateTo(item.view);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold flex items-center justify-between ${
                      isActive
                        ? 'bg-[#E45424] text-white font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 mt-2 space-y-1.5">
                <button
                  onClick={() => {
                    handlePostListingClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-[#E45424] flex items-center justify-center gap-2"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Sahne İlanı Ver</span>
                </button>

                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        navigateTo(getDashboardView());
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#E45424]" />
                      <span>Yönetim Paneli</span>
                    </button>
                    <button
                      onClick={() => {
                        navigateTo('artist_profile', 'artist_efe_ozkan');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-[#E45424]" />
                      <span>Profilim</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
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
                      className="w-full py-2.5 text-center text-xs font-semibold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 rounded-xl"
                    >
                      Giriş Yap
                    </button>
                    <button
                      onClick={() => {
                        setAuthModalMode('register');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2.5 text-center text-xs font-bold text-white bg-[#1E2B4F] rounded-xl"
                    >
                      Üye Ol
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
