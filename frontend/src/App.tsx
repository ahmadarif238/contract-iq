import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ContractAgentWorkspace } from './components/ContractAgentWorkspace';
import { FeaturesBento } from './components/FeaturesBento';
import { HowItWorks } from './components/HowItWorks';
import { InteractivePlaybook } from './components/InteractivePlaybook';
import { ComparisonTable } from './components/ComparisonTable';
import { TestimonialsGrid } from './components/TestimonialsGrid';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { DemoModal } from './components/DemoModal';
import { ClauseDetailModal } from './components/ClauseDetailModal';
import { AuditedClause } from './types';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState('saas-msa');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [activeClauseDetail, setActiveClauseDetail] = useState<AuditedClause | null>(null);

  // Sync dark mode class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#090A0C] text-neutral-900 dark:text-neutral-100 antialiased transition-colors duration-200 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
      {/* Top Announcement Bar */}
      <AnnouncementBar
        onOpenDemo={() => setDemoModalOpen(true)}
      />

      {/* Persistent Navigation Header */}
      <Header
        darkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenDemo={() => setDemoModalOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* Main Content Sections */}
      <main>
        {/* Editorial Hero */}
        <HeroSection
          onScrollToWorkspace={() => scrollToSection('agent-workspace')}
          onSelectSampleContract={(id) => setSelectedContractId(id)}
          onOpenDemo={() => setDemoModalOpen(true)}
        />

        {/* Live Contract Intelligence Agent Workspace */}
        <ContractAgentWorkspace
          selectedContractId={selectedContractId}
          onSelectContractId={(id) => setSelectedContractId(id)}
          onOpenClauseDetail={(clause) => setActiveClauseDetail(clause)}
          onOpenDemo={() => setDemoModalOpen(true)}
        />

        {/* Features Bento Grid */}
        <FeaturesBento />

        {/* 3-Step Autonomous Workflow */}
        <HowItWorks />

        {/* Interactive Playbook Configurator */}
        <InteractivePlaybook />

        {/* Competitive Benchmark Table */}
        <ComparisonTable />

        {/* Customer Proof & Testimonials */}
        <TestimonialsGrid />

        {/* Transparent Pricing Plans */}
        <PricingSection onSelectPlan={() => setDemoModalOpen(true)} />

        {/* FAQ Accordion */}
        <FAQSection />

        {/* High-Impact CTA Banner */}
        <CTASection
          onScrollToWorkspace={() => scrollToSection('agent-workspace')}
          onOpenDemo={() => setDemoModalOpen(true)}
        />
      </main>

      {/* Editorial Footer */}
      <Footer />

      {/* Command Palette (⌘K) Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectContract={(id) => setSelectedContractId(id)}
        onScrollToSection={scrollToSection}
      />

      {/* Enterprise Walkthrough Demo Booking Modal */}
      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />

      {/* Deep-Dive Clause Inspection Modal */}
      <ClauseDetailModal
        clause={activeClauseDetail}
        onClose={() => setActiveClauseDetail(null)}
      />
    </div>
  );
}
