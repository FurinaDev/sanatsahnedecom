import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RoleType } from '../types';
import { X, Lock, Mail, User as UserIcon, Phone, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalMode, setAuthModalMode, login, register, resetPassword, switchRole } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<RoleType>('artist');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!authModalMode) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (authModalMode === 'login') {
      if (!email) {
        setFeedback({ type: 'error', message: 'Lütfen e-posta adresinizi giriniz.' });
        return;
      }
      const res = login(email, password);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Başarıyla giriş yapıldı!' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Giriş yapılamadı.' });
      }
    } else if (authModalMode === 'register') {
      if (!email || !name) {
        setFeedback({ type: 'error', message: 'Lütfen ad-soyad ve e-posta alanlarını doldurunuz.' });
        return;
      }
      const res = register({ email, name, role, phone });
      if (res.success) {
        setFeedback({ type: 'success', message: 'Üyeliğiniz oluşturuldu ve oturum açıldı!' });
      }
    } else if (authModalMode === 'forgot_password') {
      if (!email) {
        setFeedback({ type: 'error', message: 'Lütfen kayıtlı e-posta adresinizi giriniz.' });
        return;
      }
      const res = resetPassword(email);
      setFeedback({ type: 'success', message: res.message });
    }
  };

  const handleQuickDemoLogin = (roleToSwitch: RoleType, demoEmail: string) => {
    switchRole(roleToSwitch);
    login(demoEmail, 'demo123');
    setAuthModalMode(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75">
      <div className="bg-white dark:bg-[#111A2E] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden text-left">
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="font-display font-extrabold text-slate-900 dark:text-white text-lg tracking-tight leading-tight">
              SANAT<span className="text-[#E45424]">.SAHNEDE</span>
            </div>
            <div className="label-caps text-slate-500 dark:text-slate-400 mt-0.5">Çağdaş Müzik Platformu</div>
          </div>
          <button
            onClick={() => setAuthModalMode(null)}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        {authModalMode !== 'forgot_password' && (
          <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-display font-bold">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setFeedback(null);
              }}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                authModalMode === 'login'
                  ? 'border-[#E45424] text-[#E45424] bg-white dark:bg-[#111A2E]'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50/50 dark:bg-slate-900/40'
              }`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => {
                setAuthModalMode('register');
                setFeedback(null);
              }}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                authModalMode === 'register'
                  ? 'border-[#E45424] text-[#E45424] bg-white dark:bg-[#111A2E]'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50/50 dark:bg-slate-900/40'
              }`}
            >
              Yeni Üye Ol
            </button>
          </div>
        )}

        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
              {authModalMode === 'login' && 'Hesabınıza Giriş Yapın'}
              {authModalMode === 'register' && 'Sanat Ekosistemine Katılın'}
              {authModalMode === 'forgot_password' && 'Şifremi Unuttum'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {authModalMode === 'login' && 'Sanatçı veya mekân hesabınızla ilanlara ve rezervasyonlara erişin.'}
              {authModalMode === 'register' && 'Müzisyen, topluluk lideri veya kurumsal mekân hesabı oluşturun.'}
              {authModalMode === 'forgot_password' && 'Kayıtlı e-posta adresinizi girerek anında sıfırlama linki alın.'}
            </p>
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalMode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">Hesap Türünüz</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('artist')}
                      className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-colors ${
                        role === 'artist'
                          ? 'border-[#E45424] bg-[#E45424] text-white'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Bireysel Sanatçı
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('ensemble_leader')}
                      className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-colors ${
                        role === 'ensemble_leader'
                          ? 'border-[#E45424] bg-[#E45424] text-white'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Topluluk / Grup
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('business_owner')}
                      className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-colors ${
                        role === 'business_owner'
                          ? 'border-[#E45424] bg-[#E45424] text-white'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Mekân / İşletme
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">Ad Soyad / Kurum Adı</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Örn: Efe Özkan veya Caz Kulübü"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:outline-hidden focus:border-[#E45424]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">Telefon Numarası</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+90 532 000 00 00"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:outline-hidden focus:border-[#E45424]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">E-Posta Adresi</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adiniz@sanatsahnede.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:outline-hidden focus:border-[#E45424]"
                />
              </div>
            </div>

            {authModalMode !== 'forgot_password' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-900 dark:text-white">Şifre</label>
                  {authModalMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthModalMode('forgot_password');
                        setFeedback(null);
                      }}
                      className="text-[11px] font-semibold text-[#1E2B4F] dark:text-orange-400 hover:text-[#E45424] hover:underline"
                    >
                      Şifremi unuttum?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:outline-hidden focus:border-[#E45424]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[#E45424] hover:bg-[#c94317] text-white rounded-xl text-xs font-display font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm mt-2"
            >
              <span>
                {authModalMode === 'login' && 'Giriş Yap'}
                {authModalMode === 'register' && 'Hesabı Oluştur ve Başla'}
                {authModalMode === 'forgot_password' && 'Sıfırlama Bağlantısı Gönder'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {authModalMode === 'forgot_password' && (
            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setFeedback(null);
                }}
                className="text-xs text-[#1E2B4F] dark:text-orange-400 hover:text-[#E45424] underline font-semibold"
              >
                Giriş ekranına geri dön
              </button>
            </div>
          )}

          {/* Quick Demo Switcher Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="label-caps text-slate-400 text-center mb-2">
              Tek Tıkla Hazır Demo Profiller
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('artist', 'efeozkaniletisim@gmail.com')}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-orange-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left transition-colors"
              >
                <div className="font-bold text-slate-900 dark:text-white">Efe Özkan</div>
                <div className="text-slate-500 dark:text-slate-400 text-[10px]">Piyanist (Sanatçı)</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('business_owner', 'etkinlik@grandbosphorus.com')}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-orange-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left transition-colors"
              >
                <div className="font-bold text-slate-900 dark:text-white">Grand Bosphorus</div>
                <div className="text-slate-500 dark:text-slate-400 text-[10px]">Otel &amp; Mekân (İşveren)</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ensemble_leader', 'selin@istanbulstringtrio.com')}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-orange-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left transition-colors"
              >
                <div className="font-bold text-slate-900 dark:text-white">Boğaziçi Oda Triosu</div>
                <div className="text-slate-500 dark:text-slate-400 text-[10px]">Topluluk Lideri</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin', 'admin@sahnesanat.com')}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-orange-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left transition-colors"
              >
                <div className="font-bold text-slate-900 dark:text-white">Platform Yöneticisi</div>
                <div className="text-slate-500 dark:text-slate-400 text-[10px]">Admin &amp; Denetim</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
