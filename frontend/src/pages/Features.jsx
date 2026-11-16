import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import SettingsDropdown from '../components/SettingsDropdown';
import WalletConnectButton from '../components/WalletConnectButton';
import { Menu, X } from 'lucide-react';

export default function Features() {
  const navigate = useNavigate();
  const { account, connectWallet, disconnectWallet, isAdmin, isIssuer, networkId, loading, error } = useWeb3();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sandbox State
  const [credInput, setCredInput] = useState('0x78a9c2...ee84d0b1f_stanford_mscs');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const dataPresets = {
    '0x78a9c2...ee84d0b1f_stanford_mscs': {
      title: 'Master of Science in CS',
      status: 'Authentic',
      isAuthentic: true,
      issuer: 'Stanford University (ID: 0x9021)',
      hash: '8a42...9f01',
      latency: '172ms'
    },
    '0x11b93f...ca8922c3e_state_bar_license': {
      title: 'Juris Doctor & Active Bar License',
      status: 'Authentic',
      isAuthentic: true,
      issuer: 'California State Bar (ID: 0x1402)',
      hash: 'c130...ef22',
      latency: '189ms'
    },
    '0x999999...unverified_diploma_forge': {
      title: 'Unrecognized Certificate [FORGERY ALERT]',
      status: 'Intercepted / Fraudulent',
      isAuthentic: false,
      issuer: 'Unknown Diploma Syndicate (Revoked)',
      hash: 'ff00...0000',
      latency: '94ms'
    }
  };

  const [resData, setResData] = useState(dataPresets['0x78a9c2...ee84d0b1f_stanford_mscs']);

  const triggerVerify = (key) => {
    setIsVerifying(true);
    const item = dataPresets[key] || {
      title: 'Custom Soulbound Attestation',
      status: 'Verified (Valid zk-Proof)',
      isAuthentic: true,
      issuer: 'Independent Public Validator (deoxys.in)',
      hash: '77bc...19d4',
      latency: '204ms'
    };

    setTimeout(() => {
      setResData(item);
      setIsVerifying(false);
    }, 320);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(credInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-[#fef9ee] text-[#1d1c15] antialiased min-h-screen selection:bg-[#ff6f38] selection:text-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      
      {/* ══════════════════════════════════════════════════════════════════════
         HOME-PAGE-STYLE FLOATING PILL NAVBAR
         ══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed top-0 left-0 w-full pt-[24px] flex justify-center px-[24px] lg:px-[32px] z-[100] pointer-events-none">
        <div className="w-full max-w-[1560px] flex items-center justify-between pointer-events-auto relative">
          {/* Left: Logo */}
          <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity h-[56px] -ml-2 lg:-ml-6" onClick={() => navigate('/')}>
            <img 
              src="/tokcred_logo-removebg-preview.png" 
              alt="TokCred" 
              className="h-[90px] lg:h-[120px] max-w-none object-contain relative transition-all duration-300" 
            />
          </div>

          {/* Center: Solid White Pill Nav */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center h-[56px] px-[32px] rounded-full text-[15px] font-[400] gap-[24px] tracking-[-0.01em] shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-colors duration-300 pointer-events-auto bg-white border border-[#e7e2d7]/80 text-[#101014]">
            <span className="cursor-pointer hover:opacity-70 transition-opacity select-none" onClick={() => navigate('/')}>Home</span>
            <span className="cursor-pointer hover:opacity-70 transition-opacity select-none font-semibold text-[#101014]" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Features</span>
            <span className="cursor-pointer hover:opacity-70 transition-opacity select-none" onClick={() => navigate('/developers')}>Developers</span>

            {Boolean(account && (isAdmin || isIssuer)) && (
              <span className="cursor-pointer hover:opacity-70 transition-opacity select-none font-semibold text-[#7053AD]" onClick={() => navigate('/dashboard')}>Admin</span>
            )}
            {Boolean(account && !isAdmin && !isIssuer) && (
              <span className="cursor-pointer hover:opacity-70 transition-opacity select-none font-semibold text-[#7053AD]" onClick={() => navigate('/student-dashboard')}>Student</span>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-[8px] sm:gap-[16px]">
            <div>
              <SettingsDropdown 
                account={account}
                isAdmin={isAdmin}
                isIssuer={isIssuer}
                networkId={networkId}
                connectWallet={connectWallet}
                disconnectWallet={disconnectWallet}
                loading={loading}
                error={error}
                buttonClassName="w-[44px] h-[44px] sm:w-[56px] sm:h-[56px] rounded-full flex items-center justify-center hover:opacity-80 transition-colors duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.04)] bg-white border border-[#e7e2d7]/80 text-[#101014]"
                iconSize={20}
              />
            </div>

            <WalletConnectButton
              disconnectedLabel="Connect"
              showStatusDot={true}
              className="h-[44px] px-[16px] sm:h-[56px] sm:px-[28px] text-[13px] sm:text-[16px] font-[400] rounded-full hover:scale-105 active:scale-95 shadow-[0_8px_24px_rgba(170,55,0,0.18)] bg-[#aa3700] text-white hover:bg-[#ff6f38]"
            />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-[44px] h-[44px] rounded-full flex md:hidden items-center justify-center transition-colors duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.04)] bg-white border border-[#e7e2d7]/80 text-[#101014]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="absolute top-[68px] left-0 right-0 p-4 bg-[#101014]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col gap-2 text-white z-50 md:hidden animate-in fade-in slide-in-from-top-3 duration-200">
              <button 
                onClick={() => { navigate('/'); setMobileMenuOpen(false); }} 
                className="text-left px-4 py-3 rounded-2xl hover:bg-white/10 text-[15px] text-white/80"
              >
                Home
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); }} 
                className="text-left px-4 py-3 rounded-2xl hover:bg-white/10 text-[15px] font-semibold flex items-center justify-between"
              >
                <span>Features</span>
                <span className="text-white/40">●</span>
              </button>
              <button 
                onClick={() => { navigate('/developers'); setMobileMenuOpen(false); }} 
                className="text-left px-4 py-3 rounded-2xl hover:bg-white/10 text-[15px] text-white/80"
              >
                Developers
              </button>
              <button 
                onClick={() => { navigate('/public-verify'); setMobileMenuOpen(false); }} 
                className="text-left px-4 py-3 rounded-2xl bg-[#EAE4FF]/10 text-[#C4B9F5] text-[15px] font-medium flex items-center justify-between"
              >
                <span>Public Verifier</span>
                <span>↗</span>
              </button>
              {Boolean(account && (isAdmin || isIssuer)) && (
                <button 
                  onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }} 
                  className="text-left px-4 py-3 rounded-2xl bg-[#7053AD]/30 text-[#EAE4FF] text-[15px] font-semibold flex items-center justify-between"
                >
                  <span>Admin Dashboard</span>
                  <span>→</span>
                </button>
              )}
              {Boolean(account && !isAdmin && !isIssuer) && (
                <button 
                  onClick={() => { navigate('/student-dashboard'); setMobileMenuOpen(false); }} 
                  className="text-left px-4 py-3 rounded-2xl bg-[#7053AD]/30 text-[#EAE4FF] text-[15px] font-semibold flex items-center justify-between"
                >
                  <span>Student Dashboard</span>
                  <span>→</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Page Container */}
      <main className="w-full pt-32 lg:pt-36 bg-[#fef9ee]">
        <div className="flex flex-col w-full">

          {/* ══════════════════════════════════════════════════════════════════
             1. TOP ANNOUNCEMENT NOTIFICATION PILL
             ══════════════════════════════════════════════════════════════════ */}
          <section className="w-full max-w-[1400px] xl:max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pt-2 pb-2">
            <div className="flex justify-center">
              <a 
                href="#sandbox" 
                className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f2ede2] hover:bg-[#ede8dd] transition-all duration-300 shadow-sm border border-[#e7e2d7]/50"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-[#ff6f38] animate-pulse" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#1d1c15]">
                  Controlled by you, secured by us.
                </span>
                <span className="material-symbols-outlined text-[16px] text-[#aa3700] group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </a>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
             2. HERO SECTION
             ══════════════════════════════════════════════════════════════════ */}
          <section className="w-full max-w-[1400px] xl:max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-8 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
              
              {/* Left Column: Editorial Headline & Actions */}
              <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
                <h1 
                  className="text-[44px] sm:text-[54px] lg:text-[64px] xl:text-[70px] lg:leading-[70px] xl:leading-[76px] font-normal text-black tracking-tight"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  The credential wallet<br />that{' '}
                  <span className="italic text-[#aa3700] font-normal relative inline-block">
                    never sleeps
                    <svg className="absolute -bottom-2 left-0 w-full h-2 text-[#ff6f38]" preserveAspectRatio="none" viewBox="0 0 100 10">
                      <path d="M0 6 Q 50 12, 100 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
                    </svg>
                  </span>.
                </h1>

                <p className="text-[17px] sm:text-[19px] text-[#444748] max-w-xl leading-relaxed pt-1">
                  TokCred turns degrees, licenses, and institutional records into self-custodial cryptographic proofs. Verifiable in seconds, zero centralized databases, and zero PII exposed.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <a 
                    href="#sandbox" 
                    className="inline-flex items-center justify-center text-[15px] font-semibold px-8 py-4 rounded-full bg-[#aa3700] text-white hover:bg-[#ff6f38] transition-all shadow-md group"
                  >
                    <span>Download TokCred</span>
                    <span className="material-symbols-outlined text-[18px] ml-1.5 group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </a>

                  <button 
                    onClick={() => setDemoModalOpen(true)}
                    className="inline-flex items-center gap-2.5 text-[15px] font-semibold px-7 py-4 rounded-full bg-[#f8f3e8] text-black hover:bg-[#f2ede2] transition-all border border-[#e7e2d7] cursor-pointer"
                  >
                    <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                    </span>
                    <span>Watch the 2 min demo</span>
                  </button>
                </div>

                {/* Startup Status Badge */}
                <div className="pt-4">
                  <div className="inline-flex flex-wrap items-center gap-3 px-5 py-2.5 rounded-full bg-[#f8f3e8] text-[#444748] text-[11px] font-bold tracking-wider uppercase border border-[#e7e2d7]/50">
                    <span className="flex items-center gap-1.5 text-[#aa3700] font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#aa3700]" />
                      Early Prototype
                    </span>
                    <span className="text-[#c4c7c7]">/</span>
                    <span className="flex items-center gap-1.5 normal-case font-normal">
                      <span className="material-symbols-outlined text-[15px]">dns</span>
                      Hosted at deoxys.in
                    </span>
                    <span className="text-[#c4c7c7]">/</span>
                    <span className="flex items-center gap-1.5 text-black font-semibold normal-case">
                      <span className="material-symbols-outlined text-[15px] text-[#aa3700]">verified_user</span>
                      Zero PII by design
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Stage with Offset Burnt Orange Backer */}
              <div className="lg:col-span-6 relative mt-8 lg:mt-0">
                {/* Burnt Orange Offset Underlay Layer */}
                <div className="absolute -bottom-4 -right-4 w-full h-full rounded-[16px] bg-[#aa3700] transition-transform duration-500 hover:scale-[1.01]" />

                {/* Main Photo Frame */}
                <div className="relative w-full rounded-[16px] overflow-hidden bg-[#1c1b1b] shadow-xl">
                  {/* Authentic Architectural Background */}
                  <div 
                    className="w-full h-[520px] sm:h-[540px] bg-cover bg-center grayscale contrast-125 opacity-85 hover:scale-105 transition-transform duration-700" 
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDaQ9cFJt4jEebOsCzz1ETjtmcjDA9xdfrJAphABarsX2T39Q0pztOlhtXByhWRU6Wx5_7RMXOZLPLm-zrxjS831Wm-9UswDuoudqBYbiWlE5wNg2oAuYvVcfvdaXWYFfuTL-dNiT_JROkFzuOHM3DHRjMZAVSirEIbqChpOjKRegXu7yBsZOgs9d_bvyMslB08WTnkYG9xVW2_x5rGfL2A62exGofuB1CUTAH3yyoB')" }}
                  >
                    {/* Scrim Gradient */}
                    <div className="w-full h-full bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>

                  {/* Top-Left Location Indicator */}
                  <div className="absolute top-5 left-5 px-3.5 py-1.5 rounded-full bg-[#fef9ee]/90 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#ff6f38]" />
                    <span className="text-[10px] font-bold tracking-wider uppercase text-black">
                      Node: deoxys.in/core-01
                    </span>
                  </div>

                  {/* Top-Right Metric Chip */}
                  <div className="absolute top-5 right-5 p-3.5 rounded-[12px] bg-[#fef9ee]/95 backdrop-blur-md shadow-md flex flex-col gap-1 min-w-[150px]">
                    <span className="text-[11px] text-[#444748] uppercase tracking-wider font-semibold">
                      Verification Speed
                    </span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[24px] font-bold text-black" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
                        0.18<span className="text-[13px] font-normal text-[#aa3700]">s</span>
                      </span>
                      {/* Sparkline SVG Chart */}
                      <svg className="w-14 h-5 text-[#aa3700]" fill="none" viewBox="0 0 56 20">
                        <path d="M1 17L12 12L23 15L34 6L45 9L55 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <circle cx="55" cy="2" fill="currentColor" r="2" />
                      </svg>
                    </div>
                    <div className="w-full bg-[#f2ede2] rounded-full h-1 mt-1 overflow-hidden">
                      <div className="bg-[#ff6f38] h-full w-[94%]" />
                    </div>
                  </div>

                  {/* Bottom Floating Activity Card: "While you slept" */}
                  <div className="absolute bottom-5 left-5 right-5 sm:left-6 sm:right-6 p-4 sm:p-5 rounded-[14px] bg-[#fef9ee]/95 backdrop-blur-lg shadow-xl border border-black/5">
                    <div className="flex items-center justify-between pb-3 border-b border-black/5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-[#aa3700]">cloud_upload</span>
                        <span className="text-[12px] font-bold text-black uppercase tracking-wider">
                          Proof Lifecycle Record
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-[#444748] uppercase tracking-wider">
                        Continuous Ledger
                      </span>
                    </div>

                    <div className="space-y-2.5 pt-2.5">
                      {/* Item 1 */}
                      <div className="flex items-center justify-between py-1 hover:bg-[#f2ede2]/50 px-2 rounded-[6px] transition-colors">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-4 h-4 rounded-full bg-black flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[#fef9ee] text-[12px]">check</span>
                          </span>
                          <span className="text-[13px] text-black font-medium truncate">
                            Stanford MSCS degree anchored
                          </span>
                        </div>
                        <span className="text-[10px] text-[#444748] shrink-0 pl-3 font-mono">2:14 AM</span>
                      </div>

                      {/* Item 2 */}
                      <div className="flex items-center justify-between py-1 hover:bg-[#f2ede2]/50 px-2 rounded-[6px] transition-colors">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-4 h-4 rounded-full bg-black flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[#fef9ee] text-[12px]">check</span>
                          </span>
                          <span className="text-[13px] text-black font-medium truncate">
                            Zero-knowledge proof generated for employer
                          </span>
                        </div>
                        <span className="text-[10px] text-[#444748] shrink-0 pl-3 font-mono">3:40 AM</span>
                      </div>

                      {/* Item 3 */}
                      <div className="flex items-center justify-between py-1 hover:bg-[#f2ede2]/50 px-2 rounded-[6px] transition-colors">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-4 h-4 rounded-full bg-[#aa3700] flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-white text-[12px]">security</span>
                          </span>
                          <span className="text-[13px] text-[#aa3700] font-medium truncate">
                            Malicious diploma mill attempt intercepted
                          </span>
                        </div>
                        <span className="text-[10px] text-[#444748] shrink-0 pl-3 font-mono">4:05 AM</span>
                      </div>

                      {/* Item 4 (Active/In-Progress) */}
                      <div className="flex items-center justify-between py-1 px-2 rounded-[6px] bg-[#f8f3e8]">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-4 h-4 rounded-full bg-[#ffdbcf] flex items-center justify-center shrink-0 animate-spin">
                            <span className="material-symbols-outlined text-[#aa3700] text-[12px]">sync</span>
                          </span>
                          <span className="text-[13px] text-[#444748] truncate">
                            Syncing decentralized attestation...
                          </span>
                        </div>
                        <span className="text-[10px] text-[#aa3700] font-medium shrink-0 pl-3 uppercase">in progress</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
             3. STANDARDS & ECOSYSTEM TICKER
             ══════════════════════════════════════════════════════════════════ */}
          <section className="w-full bg-[#f8f3e8] py-8 my-8 border-y border-[#e7e2d7]/50">
            <div className="max-w-[1400px] xl:max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="shrink-0 flex items-center gap-2 text-[#444748]">
                  <span className="w-2 h-2 rounded-full bg-[#aa3700]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#444748]">
                    Engineered on standards
                  </span>
                </div>

                {/* Ecosystem typographic wordmarks */}
                <div className="w-full flex flex-wrap items-center justify-between md:justify-end gap-x-8 lg:gap-x-12 gap-y-3 text-black">
                  <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[18px] text-[#aa3700]">lock</span>
                    <span className="text-[14px] font-bold">Cryptographic Proof</span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[18px] text-[#aa3700]">account_tree</span>
                    <span className="text-[14px] font-bold">Tamper-Proof Registry</span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[18px] text-[#aa3700]">verified_user</span>
                    <span className="text-[14px] font-bold">Zero-PII Verification</span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[18px] text-[#aa3700]">shield</span>
                    <span className="text-[14px] font-bold">End-to-End Privacy</span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                    <span className="w-2 h-2 rounded-full bg-[#ff6f38]" />
                    <span className="text-[14px] font-bold">deoxys.in</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
             4. CORE WHAT & HOW: ARCHITECTURAL PILLARS (BENTO GRID)
             ══════════════════════════════════════════════════════════════════ */}
          <section className="w-full max-w-[1400px] xl:max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-12" id="features">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <div className="space-y-2 max-w-2xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#aa3700]">
                  Architectural Pillars
                </span>
                <h2 
                  className="text-[34px] sm:text-[42px] text-black tracking-tight"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  Designed for trust in an era of synthetic deception.
                </h2>
              </div>
              <p className="text-[15px] sm:text-[16px] text-[#444748] max-w-sm mt-4 md:mt-0 leading-relaxed">
                Every interaction is backed by immutable cryptographic mathematics, preserving agency for individuals and undeniable authority for institutions.
              </p>
            </div>

            {/* 4-Feature Editorial Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
              
              {/* Feature 1: Self-Custodial Record Wallet (7 cols) */}
              <div className="lg:col-span-7 p-8 sm:p-10 rounded-[16px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex flex-col justify-between group hover:border-[#aa3700]/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.09)] transition-all border border-[#d8d3c5]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#aa3700] font-bold">01 / SOVEREIGNTY</span>
                  </div>
                  <h3 
                    className="text-[28px] text-black pt-2 font-medium"
                    style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                  >
                    Self-Custodial Record Wallet
                  </h3>
                  <p className="text-[15px] text-[#444748] leading-relaxed">
                    Users hold and control their own verified credentials in one place. TokCred never has access to private user data, custodial keys, or passwords. Your identity records exist exclusively on your authorized hardware.
                  </p>
                </div>

                {/* Inline Visual: Key Vault Diagram */}
                <div className="mt-8 pt-4 rounded-[10px] bg-[#f8f3e8] p-4 shadow-inner flex items-center justify-between border border-[#e7e2d7]">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#aa3700] text-[24px]">key</span>
                    <div>
                      <div className="text-[13px] text-black font-mono font-bold">0x4F92...B31C</div>
                      <div className="text-[12px] text-[#444748]">Enclave Secp256k1 · Offline Airgap</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white text-[#aa3700] text-[11px] font-semibold border border-[#e7e2d7]">
                    100% User Custody
                  </span>
                </div>
              </div>

              {/* Feature 2: Document-to-Proof Lifecycle (5 cols) */}
              <div className="lg:col-span-5 p-8 sm:p-10 rounded-[16px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex flex-col justify-between group hover:border-[#aa3700]/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.09)] transition-all border border-[#d8d3c5]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full bg-[#aa3700] text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">verified</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#aa3700] font-bold">02 / PROOF ENGINE</span>
                  </div>
                  <h3 
                    className="text-[28px] text-black pt-2 font-medium"
                    style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                  >
                    Document-to-Proof Lifecycle
                  </h3>
                  <p className="text-[15px] text-[#444748] leading-relaxed">
                    When an accredited institution issues an official record, TokCred compiles it into a tamper-proof cryptographic proof anchored permanently on-chain and distributed across IPFS.
                  </p>
                </div>

                {/* Inline Visual: Hash State Stepper */}
                <div className="mt-8 p-3.5 rounded-[10px] bg-[#f8f3e8] flex items-center justify-around text-center border border-[#e7e2d7]">
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-[18px] text-[#444748]">description</span>
                    <span className="text-[11px] text-[#444748] mt-1 font-semibold">Raw Record</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-[#aa3700]">arrow_forward</span>
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-[18px] text-[#aa3700]">enhanced_encryption</span>
                    <span className="text-[11px] text-[#aa3700] font-bold mt-1">zk-Compress</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-[#aa3700]">arrow_forward</span>
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-[18px] text-black">token</span>
                    <span className="text-[11px] text-black font-bold mt-1">Proof On-Chain</span>
                  </div>
                </div>
              </div>

              {/* Feature 3: Instant Verification (<200ms) (5 cols) */}
              <div className="lg:col-span-5 p-8 sm:p-10 rounded-[16px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex flex-col justify-between group hover:border-[#aa3700]/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.09)] transition-all border border-[#d8d3c5]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">bolt</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#aa3700] font-bold">03 / LATENCY</span>
                  </div>
                  <h3 
                    className="text-[28px] text-black pt-2 font-medium"
                    style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                  >
                    Instant Verification (&lt;200ms)
                  </h3>
                  <p className="text-[15px] text-[#444748] leading-relaxed">
                    Anyone (employers, universities, background verifiers) can confirm authenticity in fractions of a second without handling raw PDFs, making phone calls, or retaining vulnerable personal information.
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between p-4 rounded-[10px] bg-[#f8f3e8] border border-[#e7e2d7]">
                  <div>
                    <div className="text-[11px] text-[#444748] uppercase tracking-wider font-semibold">
                      Average Protocol Turnaround
                    </div>
                    <div className="text-[24px] font-bold text-black" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
                      178 ms
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ffdbcf] text-[#aa3700] text-[12px] font-bold">
                    <span className="material-symbols-outlined text-[14px]">speed</span> Zero Wait
                  </div>
                </div>
              </div>

              {/* Feature 4: Built-In Scam & Fake Issuer Detection (7 cols) */}
              <div className="lg:col-span-7 p-8 sm:p-10 rounded-[16px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex flex-col justify-between group hover:border-[#aa3700]/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.09)] transition-all border border-[#d8d3c5]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full bg-[#aa3700] text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">policy</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#aa3700] font-bold">04 / DEFENSE</span>
                  </div>
                  <h3 
                    className="text-[28px] text-black pt-2 font-medium"
                    style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                  >
                    Built-In Scam &amp; Fake Issuer Detection
                  </h3>
                  <p className="text-[15px] text-[#444748] leading-relaxed">
                    Real-time smart registry checks issuer authenticity against decentralized public-key registries. It immediately flags fraudulent certificates, altered graduation dates, and unaccredited diploma mills.
                  </p>
                </div>

                {/* Threat Interception Banner */}
                <div className="mt-8 p-4 rounded-[10px] bg-[#f8f3e8] flex items-center justify-between border border-[#e7e2d7]">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#aa3700]" />
                    <div>
                      <div className="text-[13px] text-black font-semibold">Global Accreditation Registry</div>
                      <div className="text-[12px] text-[#444748]">Sybil &amp; forged credential attempts automatically nullified</div>
                    </div>
                  </div>
                  <span className="text-[11px] px-3 py-1 rounded bg-[#ffdbcf] text-[#aa3700] font-bold">
                    100% Intercept Rate
                  </span>
                </div>
              </div>

            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
             5. INTERACTIVE CRYPTOGRAPHIC VERIFICATION SANDBOX
             ══════════════════════════════════════════════════════════════════ */}
          <section className="w-full max-w-[1400px] xl:max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-12" id="sandbox">
            <div className="rounded-[24px] bg-[#f2ede2] p-8 sm:p-12 lg:p-14 shadow-md relative overflow-hidden border border-[#e7e2d7]">
              
              {/* Subtle Decorative Accent Flare in Burnt Orange */}
              <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#ff6f38]/10 filter blur-3xl pointer-events-none" />

              <div className="max-w-2xl mb-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fef9ee] text-[#aa3700] text-[11px] font-bold mb-3 shadow-sm border border-[#e7e2d7]">
                  <span className="material-symbols-outlined text-[14px]">science</span>
                  <span>deoxys.in Prototype Sandbox v1.0</span>
                </div>
                <h2 
                  className="text-[34px] sm:text-[42px] text-black tracking-tight"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  Test live verification proof
                </h2>
                <p className="text-[15px] sm:text-[16px] text-[#444748] pt-2">
                  Experience zero-PII cryptographic evaluation directly through the TokCred node. Input a Credential Hash or select a preset record.
                </p>
              </div>

              {/* Simulator Console Container */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#fef9ee] rounded-[16px] p-6 sm:p-10 shadow-sm border border-[#e7e2d7]">
                
                {/* Left: Input & Trigger */}
                <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#444748] mb-2" htmlFor="cred-input">
                        Credential Hash / Record Identifier
                      </label>
                      <div className="relative">
                        <input 
                          id="cred-input"
                          type="text"
                          value={credInput}
                          onChange={(e) => setCredInput(e.target.value)}
                          placeholder="e.g. 0x4f... or select preset"
                          className="w-full px-4 py-3.5 pr-12 rounded-[12px] bg-[#f8f3e8] font-mono text-[13px] text-black focus:outline-none focus:bg-[#fef9ee] border border-[#e7e2d7] transition-all"
                        />
                        <button 
                          onClick={handleCopy}
                          type="button"
                          className="absolute right-3 top-3 text-[#444748] hover:text-black transition-colors cursor-pointer"
                          title="Copy to clipboard"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {copied ? 'done' : 'content_copy'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Preset buttons */}
                    <div>
                      <span className="block text-[11px] font-bold text-[#444748] mb-2">
                        Sample attestation hashes:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          type="button"
                          onClick={() => {
                            setCredInput('0x78a9c2...ee84d0b1f_stanford_mscs');
                            triggerVerify('0x78a9c2...ee84d0b1f_stanford_mscs');
                          }}
                          className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all active:scale-95 cursor-pointer ${
                            credInput.includes('stanford') 
                              ? 'bg-[#aa3700] text-white shadow-sm' 
                              : 'bg-[#f8f3e8] text-black hover:bg-[#ffdbcf]'
                          }`}
                        >
                          Stanford MSCS Degree
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            setCredInput('0x11b93f...ca8922c3e_state_bar_license');
                            triggerVerify('0x11b93f...ca8922c3e_state_bar_license');
                          }}
                          className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all active:scale-95 cursor-pointer ${
                            credInput.includes('bar_license') 
                              ? 'bg-[#aa3700] text-white shadow-sm' 
                              : 'bg-[#f8f3e8] text-black hover:bg-[#ffdbcf]'
                          }`}
                        >
                          CA State Bar License
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            setCredInput('0x999999...unverified_diploma_forge');
                            triggerVerify('0x999999...unverified_diploma_forge');
                          }}
                          className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all active:scale-95 cursor-pointer ${
                            credInput.includes('forge') 
                              ? 'bg-[#ba1a1a] text-white shadow-sm' 
                              : 'bg-[#f8f3e8] text-[#aa3700] hover:bg-[#ffdbcf]'
                          }`}
                        >
                          Unverified Scam Attempt
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="button"
                      onClick={() => triggerVerify(credInput.trim())}
                      disabled={isVerifying}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#aa3700] text-white hover:bg-[#ff6f38] transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-75"
                    >
                      {isVerifying ? (
                        <>
                          <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                          <span className="text-[14px] font-semibold">Verifying Proof...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">verified</span>
                          <span className="text-[14px] font-semibold">Verify Proof on deoxys.in</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-[#444748] mt-2 flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[13px] text-[#aa3700]">lock</span>
                      Runs zero-knowledge circuit locally. No IP or personal headers sent.
                    </p>
                  </div>
                </div>

                {/* Right: Verification Result Terminal Preview */}
                <div className="lg:col-span-6 bg-[#1c1b1b] text-white rounded-[14px] p-6 sm:p-7 flex flex-col justify-between font-mono text-[13px] shadow-inner relative min-h-[280px] border border-black/40">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#aa3700]" />
                      <span className="w-3 h-3 rounded-full bg-[#ffb59c]" />
                      <span className="w-3 h-3 rounded-full bg-[#ede8dd]" />
                      <span className="text-[11px] text-[#858383] ml-2">deoxys-verifier v1.0</span>
                    </div>
                    <span className="text-[11px] text-[#ffdbcf] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff6f38] animate-ping" /> Live Node
                    </span>
                  </div>

                  <div className="py-4 space-y-2.5">
                    <div className="text-[#858383] text-[13px]">&gt; Initializing proof evaluation circuit...</div>
                    <div className="text-[#858383] text-[13px]">&gt; Querying node: <span className="text-white font-semibold">node-01.deoxys.in</span></div>
                    
                    <div className="p-3.5 rounded-[8px] bg-black/60 mt-2 space-y-1.5 border border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-[#858383]">Credential Record:</span>
                        <span className="text-white font-semibold">{resData.title}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#858383]">Verification Status:</span>
                        {resData.isAuthentic ? (
                          <span className="text-[#ffdbcf] font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-emerald-400">check_circle</span> Authentic
                          </span>
                        ) : (
                          <span className="text-[#ffdad6] font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-rose-400">dangerous</span> Blocked: Fake Issuer
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#858383]">Issuer Authority:</span>
                        <span className="text-white">{resData.issuer}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#858383]">Private PII Exposed:</span>
                        <span className="text-[#ff6f38] font-bold">0 bytes</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-[#858383] border-t border-white/10">
                    <span>Latency: <strong className="text-white">{resData.latency}</strong></span>
                    <span>Proof Hash: <strong className="text-[#ffdbcf]">{resData.hash}</strong></span>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
             6. FAQ ACCORDION: INTELLECTUAL CLARITY
             ══════════════════════════════════════════════════════════════════ */}
          <section className="w-full max-w-[1100px] xl:max-w-[1180px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-12" id="faq">
            <div className="text-center space-y-2 mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#aa3700]">
                Inquiries &amp; Clarifications
              </span>
              <h2 
                className="text-[34px] sm:text-[42px] text-black tracking-tight"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Everything you need to know about TokCred
              </h2>
              <p className="text-[15px] sm:text-[16px] text-[#444748] max-w-lg mx-auto">
                A transparent breakdown of self-custody, zero-knowledge mechanics, and the prototype release cycle.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'How does TokCred verify documents without revealing personal information?',
                  a: 'TokCred leverages zero-knowledge cryptographic proofs. When an accredited issuer signs a degree or credential, the mathematical properties are turned into an attestation proof. A verifier (such as a recruiter) can mathematically confirm you hold a legitimate degree from an accredited university without ever seeing your home address, birthdate, or raw student ID.'
                },
                {
                  q: 'What happens if TokCred or deoxys.in servers go offline?',
                  a: 'Nothing is locked inside proprietary servers. TokCred records are anchored on decentralized, tamper-proof ledgers with public cryptographic proofs. Even if specific infrastructure nodes cease operations, your wallet retains the cryptographic keys and anyone can independently verify your proofs using standard client tools.'
                },
                {
                  q: 'How are fake diploma mills and unauthorized issuers identified?',
                  a: 'The TokCred smart registry maintains an on-chain ledger of legitimate university keys audited by educational bodies. If an issuer key does not match the verifiable public key of the university, the verification circuit instantly returns a cryptographic rejection flag and alerts the user to potential fraud.'
                },
                {
                  q: 'What is the deoxys.in network architecture?',
                  a: 'deoxys.in serves as the dedicated low-latency infrastructure layer hosting TokCred validator instances, high-throughput cryptographic verification caching, and public resolver endpoints for client wallets.'
                }
              ].map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx}
                    className={`rounded-[14px] p-6 sm:p-7 transition-all duration-300 border border-[#e7e2d7]/70 ${
                      isOpen ? 'bg-[#f2ede2] shadow-sm' : 'bg-[#f8f3e8] hover:bg-[#f2ede2]/70'
                    }`}
                  >
                    <button 
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      className="w-full flex items-center justify-between cursor-pointer list-none text-left select-none"
                    >
                      <span 
                        className="text-[18px] sm:text-[20px] text-black font-semibold pr-4"
                        style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                      >
                        {item.q}
                      </span>
                      <span className={`material-symbols-outlined text-[#aa3700] transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>
                    {isOpen && (
                      <p className="text-[15px] sm:text-[16px] text-[#444748] pt-3 leading-relaxed border-t border-black/5 mt-3">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
             7. FINAL CTA CONVERSION BANNER
             ══════════════════════════════════════════════════════════════════ */}
          <section className="w-full max-w-[1400px] xl:max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-12 pb-24">
            <div className="relative rounded-[20px] bg-[#f8f3e8] p-8 sm:p-14 lg:p-16 shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-[#e7e2d7]">
              <div className="absolute left-0 top-0 w-2 h-full bg-[#aa3700]" />
              
              <div className="space-y-3 max-w-xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#aa3700]">
                  Get Early Access
                </span>
                <h2 
                  className="text-[34px] sm:text-[42px] text-black tracking-tight"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  Where the world verifies.
                </h2>
                <p className="text-[15px] sm:text-[16px] text-[#444748] leading-relaxed">
                  Your home for verifying credentials, records, and more. Experience the future of verifiable trust hosted on deoxys.in.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <a 
                  href="#sandbox" 
                  className="w-full sm:w-auto inline-flex items-center justify-center text-[15px] font-semibold px-8 py-4 rounded-full bg-[#aa3700] text-white hover:bg-[#ff6f38] transition-all shadow-md group"
                >
                  <span>Download TokCred</span>
                  <span className="material-symbols-outlined text-[18px] ml-2 group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </a>
                <button 
                  onClick={account ? disconnectWallet : connectWallet}
                  className="w-full sm:w-auto inline-flex items-center justify-center text-[15px] font-semibold px-7 py-4 rounded-full bg-[#fef9ee] text-black hover:bg-[#f2ede2] transition-all border border-[#e7e2d7] cursor-pointer"
                >
                  <span>{account ? 'Connected' : 'Connect'}</span>
                </button>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════
         INTERACTIVE DEMO WALKTHROUGH MODAL
         ══════════════════════════════════════════════════════════════════ */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fef9ee] rounded-[16px] max-w-lg w-full p-6 shadow-2xl border border-[#e7e2d7] relative">
            <button 
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-4 right-4 text-[#444748] hover:text-black transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#aa3700]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#aa3700]">
                TokCred 2-Minute Walkthrough
              </span>
            </div>

            <h3 
              className="text-[24px] font-medium text-black mb-3"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              How Self-Custodial Proofs Work
            </h3>

            <div className="space-y-3 text-[14px] text-[#444748] leading-relaxed">
              <div className="p-3 bg-[#f8f3e8] rounded-xl flex items-start gap-3 border border-[#e7e2d7]">
                <span className="font-mono text-[#aa3700] font-bold text-[14px]">1.</span>
                <div>
                  <strong className="text-black block">University Signs Payload</strong>
                  Accredited registrars sign graduation records on-chain with zero gas overhead for graduates.
                </div>
              </div>

              <div className="p-3 bg-[#f8f3e8] rounded-xl flex items-start gap-3 border border-[#e7e2d7]">
                <span className="font-mono text-[#aa3700] font-bold text-[14px]">2.</span>
                <div>
                  <strong className="text-black block">Zero-Knowledge Attestation</strong>
                  Sensitive student identifiers (SSN, DOB) are mathematically redacted while proving degree conferral.
                </div>
              </div>

              <div className="p-3 bg-[#f8f3e8] rounded-xl flex items-start gap-3 border border-[#e7e2d7]">
                <span className="font-mono text-[#aa3700] font-bold text-[14px]">3.</span>
                <div>
                  <strong className="text-black block">Instant Employer Verification</strong>
                  Recruiters verify authentic credentials in &lt;180ms via node-01.deoxys.in without central server reliance.
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setDemoModalOpen(false)}
                className="px-6 py-2.5 rounded-full bg-[#aa3700] text-white text-[13px] font-semibold hover:bg-[#ff6f38] transition-colors"
              >
                Close Walkthrough
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
