import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RoleType } from '../types';
import { X, Lock, Mail, User as UserIcon, Phone, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-md w-full overflow-hidden text-left">
        {/* Header */}
        <div className="p-6 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center font-black text-sm">
              S
            </div>
            <div>
              <div className="font-bold text-stone-900 text-base leading-tight">SanatSahnede</div>
              <div className="text-[11px] text-stone-500">sanatsahnede.com</div>
            </div>
          </div>
          <button
            onClick={() => setAuthModalMode(null)}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers if not forgot password */}
        {authModalMode !== 'forgot_password' && (
          <div className="flex border-b border-stone-100 text-xs font-semibold">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setFeedback(null);
              }}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                authModalMode === 'login'
                  ? 'border-stone-900 text-stone-900 bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800 bg-stone-50/50'
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
                  ? 'border-stone-900 text-stone-900 bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800 bg-stone-50/50'
              }`}
            >
              Yeni Üye Ol
            </button>
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              {authModalMode === 'login' && 'Hesabınıza Giriş Yapın'}
              {authModalMode === 'register' && 'Sanat Ekosistemine Katılın'}
              {authModalMode === 'forgot_password' && 'Şifremi Unuttum'}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              {authModalMode === 'login' && 'Sanatçı veya mekan hesabınızla ilanlara ve rezervasyonlara erişin.'}
              {authModalMode === 'register' && 'Müzisyen, topluluk lideri veya kurumsal mekan hesabı oluşturun.'}
              {authModalMode === 'forgot_password' && 'Kayıtlı e-posta adresinizi girerek anında sıfırlama linki alın.'}
            </p>
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
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
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Hesap Türünüz</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('artist')}
                      className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-all ${
                        role === 'artist'
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      Bireysel Sanatçı
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('ensemble_leader')}
                      className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-all ${
                        role === 'ensemble_leader'
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      Topluluk / Grup
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('business_owner')}
                      className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-all ${
                        role === 'business_owner'
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      Mekân / İşletme
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Ad Soyad / Kurum Adı</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Örn: Efe Özkan veya Caz Kulübü"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Telefon Numarası</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+90 532 000 00 00"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">E-Posta Adresi</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adiniz@sanatsahnede.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-stone-900"
                />
              </div>
            </div>

            {authModalMode !== 'forgot_password' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-stone-700">Şifre</label>
                  {authModalMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthModalMode('forgot_password');
                        setFeedback(null);
                      }}
                      className="text-[11px] text-[#0a66c2] hover:underline"
                    >
                      Şifremi unuttum?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-stone-900"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm mt-2"
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
                className="text-xs text-stone-600 hover:text-stone-900 underline font-medium"
              >
                Giriş ekranına geri dön
              </button>
            </div>
          )}

          {/* Quick Demo Switcher Buttons */}
          <div className="pt-4 border-t border-stone-100">
            <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider text-center mb-2 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Tek Tıkla Hazır Demo Profiller</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('artist', 'efe.ozkan@konservatuvar.edu.tr')}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-left transition-colors"
              >
                <div className="font-bold text-stone-900">Efe Özkan</div>
                <div className="text-stone-500 text-[10px]">Piyanist (Sanatçı)</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('business_owner', 'etkinlik@hiltonbosphorus.com')}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-left transition-colors"
              >
                <div className="font-bold text-stone-900">Hilton Bosphorus</div>
                <div className="text-stone-500 text-[10px]">Otel & Mekân (İşveren)</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ensemble_leader', 'iletisim@bogazicitrio.com')}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-left transition-colors"
              >
                <div className="font-bold text-stone-900">Boğaziçi Oda Triosu</div>
                <div className="text-stone-500 text-[10px]">Topluluk Lideri</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin', 'admin@sanatsahnede.com')}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-left transition-colors"
              >
                <div className="font-bold text-stone-900">Platform Yöneticisi</div>
                <div className="text-stone-500 text-[10px]">Admin & Denetim</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
