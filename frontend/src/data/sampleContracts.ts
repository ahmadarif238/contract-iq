import { SampleContract } from '../types';

export const SAMPLE_CONTRACTS: SampleContract[] = [
  {
    id: 'saas-msa',
    title: 'Enterprise Cloud SaaS Master Services Agreement',
    category: 'Cloud & Technology',
    type: 'Master Services Agreement',
    defaultParty: 'Customer / Licensee',
    badge: 'High Risk Traps Detected',
    riskCount: 4,
    description: 'B2B Software-as-a-Service subscription agreement with unilateral indemnities and automatic perpetual renewal locks.',
    text: `MASTER SERVICES AGREEMENT (MSA)

This Master Services Agreement ("Agreement") is entered into as of October 12, 2025 ("Effective Date") by and between CloudScale Enterprise Inc. ("Vendor"), a Delaware corporation, and Global Logistics Corp. ("Customer").

1. SUBSCRIPTION AND ACCESS
Vendor hereby grants Customer a non-exclusive, non-transferable right to access and use the hosted software platform solely for Customer's internal business purposes during the Term.

2. FEES, PAYMENT & AUTOMATIC RENEWAL
(a) Fees. Customer shall pay all fees set forth in applicable Order Forms. All invoices are due net fifteen (15) days from invoice date. Any late payments shall accrue interest at 2.5% per month or the maximum statutory rate.
(b) Auto-Renewal Trap. This Agreement shall automatically renew for successive two (2) year terms at Vendor's then-current list price (plus mandatory 15% annual uplift) unless Customer provides written notice of non-renewal at least one hundred and twenty (120) days prior to the expiration of the then-current term.

3. INTELLECTUAL PROPERTY & DERIVATIVE WORKS
Customer acknowledges that Vendor exclusively retains all rights, title, and interest in and to the Service, including all algorithms, telemetry, aggregated usage data, and any modifications or derivative works created by or for Customer during the engagement. Customer hereby assigns all intellectual property rights in feedback and custom configurations irrevocably to Vendor.

4. UNILATERAL INDEMNIFICATION
Customer shall defend, indemnify, and hold harmless Vendor, its affiliates, directors, officers, employees, and agents against any and all third-party claims, damages, liabilities, losses, costs, and attorney's fees arising out of or related to: (i) Customer Data; (ii) any breach of this Agreement by Customer; or (iii) Customer's use of the Service, without limitation.

5. LIMITATION OF LIABILITY
(a) VENDOR'S MAXIMUM AGGREGATE LIABILITY ARISING UNDER OR IN CONNECTION WITH THIS AGREEMENT SHALL BE STRICTLY LIMITED TO THE TOTAL FEES ACTUALLY PAID BY CUSTOMER IN THE PRECEDING ONE (1) MONTH PERIOD.
(b) IN NO EVENT SHALL VENDOR BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE, OR LOST PROFIT DAMAGES, EVEN IF ADVISED OF THE POSSIBILITY THEREOF.
(c) THE FOREGOING LIMITATIONS SHALL NOT APPLY TO CUSTOMER'S PAYMENT OBLIGATIONS OR CUSTOMER'S INDEMNIFICATION OBLIGATIONS UNDER SECTION 4.

6. DATA PRIVACY & SECURITY
Vendor will implement commercially reasonable safeguards. In the event of a security incident or unauthorized access to Customer Personal Data, Vendor shall notify Customer within thirty (30) business days following confirmation of data compromise.

7. TERMINATION FOR CONVENIENCE & AUDIT RIGHTS
Vendor may terminate this Agreement at any time without cause upon thirty (30) days written notice. Customer shall have no right to terminate for convenience. Vendor shall have the right, upon 24 hours notice, to audit Customer's internal systems to verify compliance with license counts.

8. GOVERNING LAW & JURISDICTION
This Agreement shall be governed exclusively by the laws of the State of Delaware, without regard to conflict of laws principles. The parties submit to the exclusive jurisdiction of the state and federal courts in Wilmington, Delaware.`,
    initialAudit: {
      overallScore: 38,
      riskGrade: 'D',
      summary: 'This SaaS Master Services Agreement contains severe one-sided terms heavily skewed in favor of the Vendor. Key red flags include an extreme 1-month liability cap for the Vendor while Customer faces uncapped liability, an onerous 120-day auto-renewal notice window with mandatory 15% price spikes, a 30-day delayed data breach notification window, and an unreciprocated termination for convenience clause.',
      criticalRisksCount: 3,
      moderateRisksCount: 2,
      favorableTermsCount: 1,
      financialExposureEstimate: 'Uncapped Liability with 1-Month Asymmetric Recovery Cap ($250k+ Exposure)',
      negotiationAdvantage: 'High Leverage: Standard market pushback will resolve 4 major traps easily',
      keyClauses: [
        {
          id: 'clause-1',
          title: 'Asymmetric 1-Month Limitation of Liability Cap',
          category: 'Liability & Indemnity',
          riskLevel: 'critical',
          originalText: "VENDOR'S MAXIMUM AGGREGATE LIABILITY ARISING UNDER OR IN CONNECTION WITH THIS AGREEMENT SHALL BE STRICTLY LIMITED TO THE TOTAL FEES ACTUALLY PAID BY CUSTOMER IN THE PRECEDING ONE (1) MONTH PERIOD.",
          issueDescription: 'A 1-month fee cap severely limits Customer recovery in the event of major system outages, data loss, or gross negligence, while Customer liability remains uncapped.',
          recommendedRedline: "EACH PARTY'S MAXIMUM AGGREGATE LIABILITY ARISING UNDER OR RELATED TO THIS AGREEMENT SHALL BE MUTUALLY LIMITED TO THE TOTAL FEES PAID OR PAYABLE BY CUSTOMER IN THE TWELVE (12) MONTH PERIOD PRECEDING THE EVENT GIVING RISE TO LIABILITY.",
          counterPartyTalkingPoint: 'Standard enterprise market norm for B2B SaaS is a mutual 12-month trailing fee cap. A 1-month cap provides negligible coverage for core service failure.',
          legalRationale: 'Under UCC § 2-719, severe failure of essential purpose can invalidate one-sided remedy limitations.',
          appliedRedline: false
        },
        {
          id: 'clause-2',
          title: 'Unilateral Customer Indemnification Without Reciprocity',
          category: 'Liability & Indemnity',
          riskLevel: 'critical',
          originalText: "Customer shall defend, indemnify, and hold harmless Vendor... against any and all third-party claims... arising out of or related to Customer's use of the Service, without limitation.",
          issueDescription: 'Customer is forced to indemnify Vendor for general usage, but Vendor provides zero IP infringement indemnity defending Customer against third-party patent or copyright claims.',
          recommendedRedline: "Vendor shall defend, indemnify, and hold harmless Customer from and against any third-party claims alleging that Customer's authorized use of the Service infringes any patent, copyright, or misappropriates a trade secret. Customer shall indemnify Vendor solely for third-party claims resulting from unlawful Customer Data.",
          counterPartyTalkingPoint: 'Vendor must warrant that its own SaaS software does not infringe third-party IP rights and must indemnify Customer accordingly.',
          legalRationale: 'Mutual IP indemnification is universally standard in cloud software licensing.',
          appliedRedline: false
        },
        {
          id: 'clause-3',
          title: 'Onerous 120-Day Auto-Renewal Lock & 15% Price Hike',
          category: 'Payment & Penalties',
          riskLevel: 'critical',
          originalText: "This Agreement shall automatically renew for successive two (2) year terms at Vendor's then-current list price (plus mandatory 15% annual uplift) unless Customer provides written notice of non-renewal at least one hundred and twenty (120) days prior...",
          issueDescription: 'A 120-day lock-in with mandatory 15% price compounding creates severe vendor lock-in and budget unpredictability.',
          recommendedRedline: "This Agreement shall renew for successive one (1) year terms unless either party provides written notice of non-renewal at least thirty (30) days prior to term expiration. Any annual price adjustment shall not exceed the lesser of 3% or the Consumer Price Index (CPI).",
          counterPartyTalkingPoint: 'Enterprise governance requires a 30-day notice standard and price adjustment caps tied to CPI inflation.',
          legalRationale: 'FTC and state auto-renewal statutes (e.g. California ARL) increasingly penalize deceptive renewal windows.',
          appliedRedline: false
        },
        {
          id: 'clause-4',
          title: 'Delayed 30-Business-Day Data Breach Notification',
          category: 'IP & Data Rights',
          riskLevel: 'moderate',
          originalText: "Vendor shall notify Customer within thirty (30) business days following confirmation of data compromise.",
          issueDescription: 'A 30-business-day delay violates GDPR (72h), HIPAA (60d), and US state data breach notification laws, exposing Customer to regulatory fines.',
          recommendedRedline: "Vendor shall notify Customer in writing without undue delay and in any event within forty-eight (48) hours of becoming aware of any confirmed or suspected Security Incident or unauthorized access to Customer Data.",
          counterPartyTalkingPoint: 'GDPR Article 33 and state breach notification compliance mandates a 48-72 hour notification SLA.',
          legalRationale: 'Customer cannot fulfill its statutory obligations to data protection authorities with a 30-day vendor delay.',
          appliedRedline: false
        }
      ],
      missingStandardClauses: [
        'Mutual IP Infringement Indemnification by Vendor',
        'Service Level Agreement (SLA) with 99.9% uptime and fee credit remedies',
        'Customer Data export and deletion obligations upon termination (within 30 days)',
        'Reciprocal right for Customer to terminate for material breach with 30-day cure period'
      ],
      keyObligationDeadlines: [
        { obligation: 'Non-Renewal Notice', timeframe: '120 days before term end', consequence: 'Automatic 2-year lock with 15% price surge' },
        { obligation: 'Payment Due Date', timeframe: 'Net 15 days', consequence: '2.5% monthly interest penalty' },
        { obligation: 'Audit Notice Window', timeframe: '24 hours notice', consequence: 'Immediate intrusive system inspection' }
      ]
    }
  },
  {
    id: 'mutual-nda',
    title: 'Bilateral Non-Disclosure & Confidentiality Agreement',
    category: 'M&A & Partnerships',
    type: 'Non-Disclosure Agreement',
    defaultParty: 'Disclosing / Receiving Party (Mutual)',
    badge: 'Standard + Hidden Non-Solicit',
    riskCount: 2,
    description: 'Mutual confidentiality agreement containing an disguised 3-year employee non-solicitation restriction and indefinite trade secret definition.',
    text: `MUTUAL CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is made effective as of January 15, 2026, by and between Apex Ventures LLC ("Party A") and Nexus Robotics Inc. ("Party B").

1. PURPOSE
The parties wish to explore a potential strategic business transaction or investment ("Purpose").

2. CONFIDENTIAL INFORMATION
"Confidential Information" means all non-public information disclosed by either party, whether orally or in writing, that is designated as confidential or reasonably should be understood to be confidential given the nature of the information. Confidential Information includes all source code, roadmaps, customer lists, and financial projections.

3. OBLIGATIONS OF RECEIVING PARTY
Each party agrees to: (i) protect Confidential Information with at least reasonable care; (ii) not use Confidential Information for any purpose outside the Purpose; and (iii) restrict access to employees and advisors on a need-to-know basis.

4. EXCLUSIONS
Confidential Information does not include information that: (a) becomes publicly known without breach; (b) was already known prior to disclosure; or (c) is independently developed without reference to the Disclosing Party's information.

5. TERM AND SURVIVAL
This Agreement shall remain in effect for two (2) years. Confidentiality obligations shall survive for a period of five (5) years, except for Trade Secrets which shall be protected indefinitely.

6. HIDDEN RESTRICTION: NON-SOLICITATION OF EMPLOYEES
During the term of this Agreement and for a period of three (3) years thereafter, neither party shall directly or indirectly solicit, hire, or induce to leave employment any employee or independent contractor of the other party introduced during discussions.

7. INJUNCTIVE RELIEF & ATTORNEYS' FEES
The parties acknowledge that unauthorized disclosure causes irreparable harm and the prevailing party in any enforcement action shall be entitled to recover full attorneys' fees and costs.`,
    initialAudit: {
      overallScore: 68,
      riskGrade: 'B',
      summary: 'While this agreement appears to be a standard mutual NDA, Section 6 injects a broad 3-year non-solicitation and no-hire restriction that restricts hiring freedom beyond the scope of a preliminary evaluation. The 5-year general confidentiality survival is also above market (typically 2-3 years for commercial partnerships).',
      criticalRisksCount: 1,
      moderateRisksCount: 1,
      favorableTermsCount: 3,
      financialExposureEstimate: 'Hiring Injunction & Attorney Fee Risk on Talented Staff',
      negotiationAdvantage: 'High: Non-solicitation is readily removable or narrowable to targeted executive headhunting',
      keyClauses: [
        {
          id: 'clause-nda-1',
          title: 'Aggressive 3-Year Employee Non-Solicitation / No-Hire Ban',
          category: 'Confidentiality & Non-Compete',
          riskLevel: 'critical',
          originalText: "During the term of this Agreement and for a period of three (3) years thereafter, neither party shall directly or indirectly solicit, hire, or induce to leave employment any employee or independent contractor...",
          issueDescription: 'A 3-year absolute no-hire clause in an exploratory NDA restricts standard hiring pipelines and general job postings.',
          recommendedRedline: "During the term of this Agreement and for twelve (12) months thereafter, neither party shall specifically solicit any key technical employee with whom it had direct contact during Purpose discussions; provided that general public job advertisements shall not constitute a breach.",
          counterPartyTalkingPoint: 'An exploratory NDA should not bar routine hiring or general job board applications. A 12-month targeted non-solicit with public carveout is standard.',
          legalRationale: 'Broad no-hire agreements may trigger antitrust scrutiny (DOJ Antitrust Guidance) and unenforceability under California Business & Professions Code § 16600.',
          appliedRedline: false
        },
        {
          id: 'clause-nda-2',
          title: 'Excessive 5-Year Survival Period for General Information',
          category: 'Termination & Breach',
          riskLevel: 'moderate',
          originalText: "Confidentiality obligations shall survive for a period of five (5) years, except for Trade Secrets which shall be protected indefinitely.",
          issueDescription: 'A 5-year survival for commercial discussions creates ongoing compliance tracking burdens for tech roadmaps that become obsolete in 18-24 months.',
          recommendedRedline: "Confidentiality obligations shall survive for a period of two (2) years following termination of this Agreement, provided that Trade Secrets shall remain protected for so long as they qualify as trade secrets under applicable law.",
          counterPartyTalkingPoint: 'Tech product cycles move rapidly. A 2-year survival period aligns with Silicon Valley and tech industry standard practice.',
          legalRationale: 'Restricting general commercial info for 5 years imposes unreasonable monitoring costs on receiving parties.',
          appliedRedline: false
        }
      ],
      missingStandardClauses: [
        'Carveout for general public job postings and unsolicited applicant resumes',
        'Standard Defend Trade Secrets Act (DTSA) whistleblower statutory immunity notice',
        'Explicit residuals clause allowing retention of unaided human memory concepts'
      ],
      keyObligationDeadlines: [
        { obligation: 'Confidentiality Survival', timeframe: '5 years from disclosure', consequence: 'Ongoing tracking obligation' },
        { obligation: 'Non-Solicit Ban', timeframe: '3 years post-expiration', consequence: 'Injunction and attorneys fees liability' }
      ]
    }
  },
  {
    id: 'executive-employment',
    title: 'Executive Employment & IP Assignment Agreement',
    category: 'Employment & Talent',
    type: 'Executive Employment Agreement',
    defaultParty: 'Executive / Employee',
    badge: 'Critical Non-Compete Risk',
    riskCount: 3,
    description: 'C-Suite employment agreement featuring worldwide 2-year non-compete, comprehensive prior invention assignment, and equity clawback triggers.',
    text: `EXECUTIVE EMPLOYMENT & PROPRIETARY INFORMATION AGREEMENT

1. POSITION AND DUTIES
Executive shall serve as Chief Technology Officer, reporting to the Chief Executive Officer. Executive agrees to devote 100% of productive business time and best efforts to the Company.

2. COMPENSATION & SEVERANCE
(a) Base Salary of $325,000 annually.
(b) Severance: If Executive is terminated Without Cause, Executive shall receive two (2) months base salary, conditioned upon signing a general release of claims.

3. INTELLECTUAL PROPERTY ASSIGNMENT
Executive hereby assigns to Company all right, title, and interest in and to all inventions, algorithms, designs, patents, trademarks, and copyrightable works created by Executive during employment or within twelve (12) months following termination, whether or not conceived during working hours or using Company equipment.

4. POST-EMPLOYMENT RESTRICTIVE COVENANTS
(a) Non-Competition. For a period of twenty-four (24) months following termination of employment for any reason, Executive shall not directly or indirectly engage in, advise, invest in, or perform services for any business entity in North America or Europe that competes with the Company.
(b) Non-Solicitation. Executive shall not solicit Company clients or employees for thirty-six (36) months post-termination.

5. EQUITY ACCELERATION & CLAWBACK
In the event of a Change of Control, unvested options shall not accelerate unless approved by the incoming Board. The Company reserves the right to claw back any vested equity or incentive bonus if Executive is accused of any conduct that disparages the Company.`,
    initialAudit: {
      overallScore: 42,
      riskGrade: 'D',
      summary: 'This executive agreement contains draconian terms for the executive: an abusive 12-month post-employment invention assignment (assigning ideas created after leaving!), a 24-month worldwide non-compete, only 2 months severance for a C-suite role (market is 6-12 months), and subjective equity clawback triggers.',
      criticalRisksCount: 3,
      moderateRisksCount: 2,
      favorableTermsCount: 1,
      financialExposureEstimate: 'Forfeiture of Post-Employment Inventions & Equity Clawback Risk',
      negotiationAdvantage: 'Critical: Post-employment IP assignment and 2-month severance are extreme outliers',
      keyClauses: [
        {
          id: 'clause-exec-1',
          title: 'Post-Employment 12-Month Invention Assignment ("Trailer Clause")',
          category: 'IP & Data Rights',
          riskLevel: 'critical',
          originalText: "Executive hereby assigns... all copyrightable works created by Executive during employment or within twelve (12) months following termination, whether or not conceived during working hours...",
          issueDescription: 'Claiming ownership of inventions conceived AFTER employment terminates prevents the executive from founding a new startup or working elsewhere.',
          recommendedRedline: "Executive assigns inventions created solely during the period of employment that directly relate to the Company's actual business or resulted from work performed for the Company. Post-termination inventions remain the sole property of Executive.",
          counterPartyTalkingPoint: 'Trailer clauses that capture post-employment inventions are commercially unreasonable and void under California Labor Code § 2870.',
          legalRationale: 'Courts view post-termination invention assignments as an illegal restraint of trade unless strictly limited to trade secret misappropriation.',
          appliedRedline: false
        },
        {
          id: 'clause-exec-2',
          title: '24-Month Worldwide Non-Compete & No Severance Parity',
          category: 'Confidentiality & Non-Compete',
          riskLevel: 'critical',
          originalText: "For a period of twenty-four (24) months following termination... Executive shall not directly or indirectly engage in, advise, invest in, or perform services for any business entity...",
          issueDescription: 'A 24-month broad non-compete effectively prevents earning a living for 2 years while severance is capped at a meager 2 months.',
          recommendedRedline: "Non-competition restrictions shall be limited to twelve (12) months in direct competitor entities, and shall only apply if the Company continues paying full salary garden leave compensation during the restricted period.",
          counterPartyTalkingPoint: 'Executive non-competes must be compensated (garden leave) and capped at 12 months. FTC non-compete guidelines require clear scope limits.',
          legalRationale: 'FTC final rule and state laws (NY, CA, CO, MN, IL) severely restrict non-compete enforceability without ongoing compensation.',
          appliedRedline: false
        },
        {
          id: 'clause-exec-3',
          title: 'Sub-Market 2-Month Severance & Unilateral Equity Clawback',
          category: 'Payment & Penalties',
          riskLevel: 'critical',
          originalText: "Severance: ...shall receive two (2) months base salary... Company reserves the right to claw back any vested equity... if Executive is accused of any conduct that disparages...",
          issueDescription: 'Two months severance for a CTO is well below the 6-12 month market norm, and equity clawback based merely on "accusations" without court finding is predatory.',
          recommendedRedline: "Upon termination Without Cause or resignation for Good Reason, Executive shall receive twelve (12) months Base Salary severance, 100% COBRA continuation, and double-trigger equity vesting acceleration upon Change of Control. Clawbacks shall only apply upon final criminal conviction for fraud.",
          counterPartyTalkingPoint: 'C-suite executives standardly receive 6 to 12 months severance and double-trigger change-of-control acceleration.',
          legalRationale: 'Subjective clawbacks without due process violate standard equity compensation governance and ERISA standards.',
          appliedRedline: false
        }
      ],
      missingStandardClauses: [
        'Double-Trigger Change of Control Equity Acceleration (100% vesting)',
        'Good Reason resignation definition (salary reduction, relocation, demotion)',
        'Standard D&O Indemnification and separate Director/Officer liability insurance coverage'
      ],
      keyObligationDeadlines: [
        { obligation: 'Non-Compete Period', timeframe: '24 months post-exit', consequence: 'Complete industry employment lockout' },
        { obligation: 'Severance Release', timeframe: 'Within 45 days of exit', consequence: 'Forfeiture of 2-month severance' }
      ]
    }
  },
  {
    id: 'vendor-sow',
    title: 'Master Vendor Statement of Work & SLA',
    category: 'Procurement & Operations',
    type: 'Statement of Work (SOW)',
    defaultParty: 'Buyer / Client',
    badge: 'Liquidated Damages & SLA Gaps',
    riskCount: 3,
    description: 'Professional engineering services statement of work with undefined milestone acceptance criteria and asymmetric breach remedies.',
    text: `STATEMENT OF WORK & SERVICE LEVEL AGREEMENT (SOW #04)

1. SERVICES AND DELIVERABLES
Vendor will provide custom machine learning pipeline engineering services as outlined in Exhibit A. All deliverables shall be deemed accepted upon delivery unless Customer provides specific rejection within 48 hours.

2. PAYMENT & EXPENSES
Customer shall pay a fixed fee of $180,000 in three milestone installments. In addition, Customer reimburses all actual travel and software expenses incurred by Vendor without prior written cap.

3. SERVICE LEVEL AGREEMENT (SLA)
Vendor targets 99.0% service availability. If availability falls below 95.0% in any calendar month, Customer's sole and exclusive remedy shall be a 5% credit applied to the next billing cycle.

4. DELAY & LIQUIDATED DAMAGES
If Customer delays milestone approvals by more than 3 business days, Customer shall pay liquidated delay damages of $1,500 per day. Vendor shall have no liability for schedule slippage.

5. SUBCONTRACTING & DATA PRIVACY
Vendor may freely subcontract any portion of the development work to overseas third parties without prior notice to Customer. Customer data may be stored on unencrypted testing environments during sprint cycles.`,
    initialAudit: {
      overallScore: 45,
      riskGrade: 'D',
      summary: 'This Statement of Work creates massive operational and security exposure for the Client: an impossible 48-hour silent acceptance window, uncapped expense reimbursements, weak 99.0% SLA with negligible 5% credits, asymmetric $1,500/day penalties against Customer for feedback delays while Vendor has zero delivery deadlines, and unvetted offshore subcontracting with unencrypted testing.',
      criticalRisksCount: 3,
      moderateRisksCount: 1,
      favorableTermsCount: 1,
      financialExposureEstimate: 'Uncapped Expense Liabilities and Daily $1,500 Delay Penalties',
      negotiationAdvantage: 'High: Standard procurement protections will rebalance these terms immediately',
      keyClauses: [
        {
          id: 'clause-sow-1',
          title: 'Deemed Acceptance Within 48 Hours & Uncapped Expenses',
          category: 'Payment & Penalties',
          riskLevel: 'critical',
          originalText: "All deliverables shall be deemed accepted upon delivery unless Customer provides specific rejection within 48 hours. In addition, Customer reimburses all actual travel and software expenses... without prior written cap.",
          issueDescription: 'A 48-hour testing window is insufficient for complex engineering review, and open-ended expense reimbursement invites cost overruns.',
          recommendedRedline: "Customer shall have ten (10) business days following delivery to test and accept or provide written notice of deficiencies. Expenses must be pre-approved in writing by Customer and capped at $5,000 total.",
          counterPartyTalkingPoint: 'Standard enterprise acceptance windows are 10-15 business days. All client-reimbursed expenses require prior written approval.',
          legalRationale: 'Reasonable inspection windows are protected under UCC § 2-606.',
          appliedRedline: false
        },
        {
          id: 'clause-sow-2',
          title: 'Unrestricted Offshore Subcontracting & Unencrypted Data Storage',
          category: 'IP & Data Rights',
          riskLevel: 'critical',
          originalText: "Vendor may freely subcontract... to overseas third parties without prior notice... Customer data may be stored on unencrypted testing environments...",
          issueDescription: 'Unrestricted subcontracting and unencrypted data breach SOC2, ISO27001, and GDPR compliance, creating severe regulatory breach liability.',
          recommendedRedline: "Vendor shall not subcontract any Services without Customer's prior written consent. Vendor warrants all Customer Data shall be encrypted in transit and at rest using AES-256 standards, with zero storage on unencrypted environments.",
          counterPartyTalkingPoint: 'Enterprise data protection rules strictly forbid unencrypted test storage and require prior approval for third-party subcontractors.',
          legalRationale: 'Security negligence provisions directly violate FTC Section 5 and EU GDPR Article 32 mandates.',
          appliedRedline: false
        }
      ],
      missingStandardClauses: [
        'Milestone-based retention holdback (10%) until final production sign-off',
        '99.9% High-Availability SLA with escalating tiered service credits up to 30%',
        'Work-for-Hire clause ensuring Customer owns all custom deliverables upon payment'
      ],
      keyObligationDeadlines: [
        { obligation: 'Acceptance Testing', timeframe: '48 hours from delivery', consequence: 'Automatic irreversible acceptance' },
        { obligation: 'Feedback Delay Penalty', timeframe: 'After 3 days', consequence: '$1,500/day liquidated damages owed' }
      ]
    }
  },
  {
    id: 'ip-license',
    title: 'Commercial Technology & IP License Agreement',
    category: 'IP & Patents',
    type: 'Intellectual Property License',
    defaultParty: 'Licensee / Tech Partner',
    badge: 'Patent & Derivative Ownership Trap',
    riskCount: 3,
    description: 'Cross-licensing agreement where Licensor retains ownership over Licensee improvements, with restrictive grant-back covenants.',
    text: `COMMERCIAL IP LICENSE & TECHNOLOGY TRANSFER AGREEMENT

1. GRANT OF LICENSE
Licensor hereby grants Licensee a revocable, non-exclusive, non-sublicensable license to utilize the Licensed Patents and Software solely in the Field of Use during the Term.

2. ROYALTIES & AUDIT
Licensee shall pay a 7.5% gross revenue royalty on all products incorporating or derived from the Licensed Technology. Licensor may audit Licensee's books quarterly on 48 hours notice at Licensee's sole expense.

3. OWNERSHIP OF DERIVATIVE WORKS & GRANT-BACK
(a) Licensor shall own all right, title, and interest in all modifications, derivative works, enhancements, and improvements to the Licensed IP, whether created by Licensor or Licensee.
(b) Licensee hereby irrevocably grants to Licensor an exclusive, perpetual, royalty-free, worldwide license to any new patentable invention created by Licensee that interfaces with the Licensed IP.

4. WARRANTIES & INDEMNIFICATION DISCLAIMER
THE LICENSED TECHNOLOGY IS PROVIDED "AS IS" WITHOUT ANY WARRANTY OF MERCHANTABILITY, FITNESS FOR PURPOSE, OR NON-INFRINGEMENT. LICENSOR DISCLAIMS ALL INDEMNIFICATION OBLIGATIONS FOR THIRD-PARTY PATENT CLAIMS.

5. TERMINATION
Licensor may terminate this Agreement immediately upon written notice if Licensee challenges the validity or enforceability of any Licensor patent anywhere in the world.`,
    initialAudit: {
      overallScore: 50,
      riskGrade: 'C',
      summary: 'This IP license contains dangerous "grant-back" and derivative ownership terms that strip the Licensee of its own proprietary R&D breakthroughs. Additionally, the Licensor disclaims all IP warranties while demanding a high 7.5% gross royalty and the power to terminate if patent validity is contested.',
      criticalRisksCount: 2,
      moderateRisksCount: 2,
      favorableTermsCount: 1,
      financialExposureEstimate: 'Loss of Proprietary Patent Rights to Licensee Improvements',
      negotiationAdvantage: 'Moderate: Exclusive grant-back clauses face heavy antitrust pushback',
      keyClauses: [
        {
          id: 'clause-ip-1',
          title: 'Licensor Ownership of Licensee Improvements & Exclusive Grant-Back',
          category: 'IP & Data Rights',
          riskLevel: 'critical',
          originalText: "Licensor shall own all right, title, and interest in all modifications, derivative works... whether created by Licensor or Licensee. Licensee hereby irrevocably grants... an exclusive, perpetual, royalty-free license...",
          issueDescription: 'Forcing Licensee to give up ownership or grant exclusive rights back to Licensor for its own R&D destroys company enterprise valuation.',
          recommendedRedline: "Licensee shall exclusively retain all right, title, and interest in and to its own independent improvements, derivative works, and patentable inventions. Licensee grants Licensor a non-exclusive, limited license solely to the extent necessary to operate the core platform.",
          counterPartyTalkingPoint: 'Licensee cannot surrender ownership of its own engineering R&D. Non-exclusive grant-backs without exclusivity are standard.',
          legalRationale: 'Exclusive grant-back conditions in patent licenses can constitute patent misuse and violate US antitrust guidelines (DOJ/FTC IP Licensing Guidelines).',
          appliedRedline: false
        },
        {
          id: 'clause-ip-2',
          title: 'Zero Non-Infringement Warranty for 7.5% Gross Royalty',
          category: 'Warranties & Disclaimers',
          riskLevel: 'critical',
          originalText: "THE LICENSED TECHNOLOGY IS PROVIDED 'AS IS'... LICENSOR DISCLAIMS ALL INDEMNIFICATION OBLIGATIONS FOR THIRD-PARTY PATENT CLAIMS.",
          issueDescription: 'Paying 7.5% royalty with zero patent warranty means Licensee assumes 100% of third-party patent infringement risk.',
          recommendedRedline: "Licensor represents and warrants that the Licensed IP does not infringe or misappropriate any third-party patent, copyright, or trade secret, and shall defend and indemnify Licensee against all third-party infringement claims.",
          counterPartyTalkingPoint: 'A commercial licensor collecting ongoing royalties must warrant clear title and protect licensees from patent lawsuits.',
          legalRationale: 'Implied warranty of title and non-infringement is standard under UCC § 2-312.',
          appliedRedline: false
        }
      ],
      missingStandardClauses: [
        'Non-exclusive, irrevocable license grant for paid-up terms',
        'Patent prosecution cooperation and infringement enforcement cost sharing',
        'Audit cost shift: Licensor pays audit costs unless discrepancy exceeds 5%'
      ],
      keyObligationDeadlines: [
        { obligation: 'Quarterly Royalty Reporting', timeframe: 'Within 30 days of quarter close', consequence: 'Audit rights triggered' },
        { obligation: 'Audit Notice Window', timeframe: '48 hours', consequence: 'Immediate financial records inspection' }
      ]
    }
  }
];
