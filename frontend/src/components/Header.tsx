import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Scale,
  Zap,
  BookOpen,
  DollarSign,
  HelpCircle,
} from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  onOpenDemo: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  onOpenDemo,
  onScrollToSection,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { key: 'nav-dashboard', label: 'Dashboard', id: 'agent-workspace', icon: Zap },
    { key: 'nav-analysis', label: 'Analysis', id: 'features', icon: Scale },
    { key: 'nav-risk-library', label: 'Risk Library', id: 'playbook', icon: BookOpen },
    { key: 'nav-templates', label: 'Templates', id: 'agent-workspace', icon: FileText },
    { key: 'nav-pricing', label: 'Pricing', id: 'pricing', icon: DollarSign },
    { key: 'nav-faq', label: 'FAQ', id: 'faq', icon: HelpCircle },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-[#F8F9FA]/90 dark:bg-[#090A0C]/90 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-xs'
          : 'bg-[#F8F9FA] dark:bg-[#090A0C] border-b border-neutral-200/50 dark:border-neutral-800/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 group text-left"
              id="brand-logo-btn"
            >
              <div className="w-9 h-9 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold tracking-tighter shadow-xs group-hover:scale-105 transition-transform">
                <span className="font-serif-title text-xl italic font-bold">C</span>
                <span className="text-xs font-mono font-black text-emerald-400 dark:text-emerald-600 ml-[-2px]">IQ</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold tracking-tight text-lg text-neutral-900 dark:text-white">
                    Contract<span className="font-serif-title italic font-normal text-emerald-600 dark:text-emerald-400">IQ</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold border border-neutral-200 dark:border-neutral-700">
                    Agent
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium tracking-tight">
                  Autonomous Legal Intelligence
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-neutral-100/80 dark:bg-neutral-900/80 p-1 rounded-full border border-neutral-200/80 dark:border-neutral-800">
            {navLinks.map((item) => (
              <button
                key={item.key}
                onClick={() => onScrollToSection(item.id)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-full text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-neutral-800 transition-all"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-colors"
              title="Search documentation and clauses (⌘K)"
              id="header-search-btn"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Quick Search</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded text-neutral-500">
                ⌘K
              </kbd>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              id="theme-toggle-btn"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
            </button>

            {/* Log In trigger */}
            <button
              onClick={onOpenDemo}
              className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              id="header-login-btn"
            >
              Log In
            </button>

            {/* Primary CTA button */}
            <button
              onClick={() => onScrollToSection('agent-workspace')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-xs group"
              id="header-launch-agent-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
              <span>Analyze Now</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle Navigation Menu"
              id="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-neutral-200 dark:border-neutral-800 bg-[#F8F9FA] dark:bg-[#090A0C] px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    onScrollToSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left border border-neutral-200/50 dark:border-neutral-800/50"
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                onScrollToSection('agent-workspace');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
              <span>Launch Live Agent</span>
            </button>
            <button
              onClick={() => {
                onOpenDemo();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <span>Book Enterprise Demo</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
