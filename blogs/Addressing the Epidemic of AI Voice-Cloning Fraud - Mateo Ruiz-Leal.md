**Executive Summary** 

Agentic AI systems are already being deployed to automate voice-cloning "grandparent scams" and other highly sophisticated impersonation frauds at scale. Yet, the true operators behind these malicious campaigns are often overseas, transient, and effectively unreachable by U.S. law enforcement and private plaintiffs. While existing tools like the Federal Trade Commission’s (FTC) Impersonation Rule begin to address upstream liability, they fall short. They do not create a clear, ex ante duty to identify deployers, nor do they provide a guaranteed path to financial reimbursement for victims (FTC, 2025; Mintz, 2024). 

This policy brief proposes a “Conditional Cost-Shifting” framework that bridges this gap. By borrowing Bank Secrecy Act–style "Know Your Customer" (KYC) obligations—adapted here as “Know Your Deployer” (KYD)—and combining them with the Truth in Lending Act’s (TILA) strict limits on consumer liability, this framework offers a pragmatic solution. Under this hybrid model, intermediary agentic AI platforms that fail to meet KYD become strictly responsible for making-whole restitution to fraud victims, aligning responsibility with the entities that possess actual control over the technology, rather than burdening the least sophisticated consumers (Lawfare, 2024; Consumer Financial Protection Bureau, n.d). 

**Problem Statement** 

The mechanics of modern impersonation fraud are becoming increasingly sophisticated. Fraudsters use readily available voice-cloning models to mimic relatives and demand urgent wire transfers. While the FTC's new Impersonation Rule aims to prohibit AI-enabled impersonation, it is fundamentally reactive. It seeks to extend liability to firms that provide tools 'with knowledge or reason to know' they will be used unlawfully, but this places a heavy burden of proof on establishing the provider's exact knowledge state. Most importantly, current regulations operate after the harm has occurred and fail to create a clear, automatic compensation channel backed by a financially responsible intermediary. 

**The Unreachable Operator Problem** 

The most significant hurdle in combating these scams is the physical and jurisdictional distance of the perpetrators. In many such scams, the operator is located abroad, utilizes disposable email addresses, operates through burner phone credentials, and interacts with the victim exclusively through AI-mediated channels. This operational security leaves law enforcement and private litigants with no practical way to identify, locate, or sue the human behind the agentic AI deployment (Lawfare, 2024).  
Even when the payment trail is traceable, the intermediaries providing the foundational technology typically disclaim all responsibility. They argue that they merely supply neutral tools and lack direct privity with the victim. The FTC has historically attempted to bridge this gap via “means and instrumentalities” theories, but this approach has demonstrated a limited ex ante deterrent effect on the industry (LawAI, 2024). 

**The Policy Solution: A Hybrid KYD–TILA Model** 

**A. Borrowing from BSA and KYC for AI** 

In the financial sector, the Bank Secrecy Act (BSA) and related anti-money laundering (AML) rules provide a proven risk governance template. Covered institutions are required to perform KYC, maintain rigorous customer identification programs, and report suspicious activity to mitigate the misuse of critical financial infrastructure (Lawfare, 2024; Oracle, 2024). 

Policymakers are already extending KYC-style obligations into the realms of AI and cloud infrastructure. Under Executive Order 14110 and a proposed rule by the Commerce Department, U.S. cloud providers offering infrastructure for training large AI models would be required to verify foreign customers’ identities and adopt comprehensive customer identification programs, extending even to resellers. 

**B. “Know Your Deployer” (KYD) Mandate for Agentic AI** 

Intermediary agentic AI platforms—encompassing providers of agent frameworks, APIs, hosted agent marketplaces, and voice-cloning services—must be required to implement risk-based **Know Your Deployer (KYD)** programs. 

● **Identity Verification:** Platforms must verify the real-world identity of deployers *before* granting them the ability to initiate autonomous outbound outreach or payment-related actions toward consumers. 

● **Supply Chain Extension:** These programs would mirror financial KYC by requiring the collection of identifying information, ongoing customer due diligence, and the strict extension of KYD requirements to resellers and white-label integrators. 

● **Risk-Based Scope:** KYD would be triggered by capabilities most closely associated with consumer fraud risk (e.g., outbound calling, SMS/email outreach, initiation of financial transactions). Smaller or purely experimental deployments lacking external contact capabilities would be subject to simplified, tiered KYD.  
**C. Conditional Cost-Shifting: Losing the Liability Shield** 

The core of this proposal relies on a mechanism analogous to the Truth in Lending Act (TILA). Under 15 U.S.C. 1643 and Regulation Z, a cardholder’s liability for unauthorized credit card use is strictly capped, forcing issuers and card networks to absorb most losses. The cost of doing business underpins consumer trust in card payments. 

This hybrid framework creates a statutory rebuttable presumption: If an agentic AI platform fails to implement and maintain compliant KYD, any consumer loss caused by impersonation or fraud facilitated by that platform's tools is presumptively treated as ‘unauthorized use.’ The platform becomes strictly liable up to the full amount of the loss. 

Platforms demonstrating substantial compliance retain their intermediary safe harbor shield, facing only traditional FTC and state-law exposure rather than automatic strict restitution obligations (Cornell Law School, n.d.; Consumer Financial Protection Bureau, n.d). 

**Implementation Strategy** 

A theoretical liability shift requires a frictionless execution mechanism to protect vulnerable populations. 

● **Statutory Authority:** Congress must enact a targeted statute modeled on 15 U.S.C. 1643 to codify strict liability for noncompliant AI intermediaries. Concurrently, the FTC should leverage Section 5 to enforce compliance audits. Linking this to existing financial KYC frameworks minimizes constitutional and administrative-law challenges based on novelty. 

● **Victim Redress & Enforcement:** Under this regime, victims retain standard TILA dispute procedures with their financial institutions. Issuers, backed by the new statutory liability, can then seek indemnification directly from the noncompliant AI platforms. 

● **Burden of Proof:** Crucially, the AI platform—not the traumatized victim—bears the burden of proving it possessed valid KYD records at the time of the incident to avoid liability. The FTC and CFPB must establish centralized dispute portals, backed by statutory civil penalties for platforms that systematically deny valid claims, forcing quick settlements over complex litigation.  
**Anticipated Objections** 

Critics may argue that imposing KYD and strict liability will stifle the nascent AI industry. However, historical evidence and market realities suggest otherwise. 

● **KYC and Innovation Coexist:** Financial institutions have operated under BSA KYC/AML obligations for decades without halting massive innovation in digital banking and fintech. Recent extensions of KYC to large AI model cloud providers are correctly framed as necessary security safeguards, not innovation moratoriums (Oracle, 2024). 

● **Alignment with Regulatory Goals:** The FTC’s goal is to ensure upstream actors are not shielded from liability when their tools enable scams. The Conditional Cost-Shifting framework operationalizes this predictability, clearly defining the duties required to maintain a safe harbor (FTC, 2025). 

● **Consumer Protection Baselines:** TILA forces issuers to absorb fraud losses, yet the credit card industry remains ubiquitously profitable and highly innovative. Internalizing fraud externalities at the platform level actually enhances market competition; firms investing in robust KYD can credibly signal trustworthiness to consumers and enterprise partners. 

● **Risk-Proportionate:** By tiering KYD duties to scale with fraud-relevant capabilities, the framework actively minimizes the compliance burden on low-risk, early-stage AI experimentation. 

● **The Open-Source Migration Fallacy:** Critics will correctly note that imposing strict KYD on commercial intermediaries will inevitably drive sophisticated bad actors to utilize localized, open-weights models, effectively bypassing this hosted framework (Seger et al.). However, this argument relies on the perfect solution fallacy. By imposing strict liability on frictionless commercial vectors (APIs and hosted agent marketplaces), this policy deliberately raises the technical barrier to entry, compute requirements, and infrastructure costs for fraudsters (Vake et al.). While localized, open-source deployments will persist, severing access to the cheapest, most scalable commercial tools is a necessary first step to collapsing the sheer volume and speed of automated impersonation scams.  
Cited Works 

Federal Trade Commission. (2025, April 3). FTC highlights actions to protect consumers from impersonation scams. 

https://www.ftc.gov/news-events/news/press-releases/2025/04/ftc-highlights-actions-prot ect-consumers-impersonation-scams 

Mintz. (2024, February 29). *Proposed FTC rule would hold AI companies liable for “deepfake” impersonation fraud*. 

https://www.mintz.com/insights-center/viewpoints/2191/2024-02-29-proposed-ftc-rule-w ould-hold-ai-companies-liable 

Lawfare. (2024, April 28). Know-your-customer is coming for the cloud—the stakes are high. https://www.lawfaremedia.org/article/know-your-customer-is-coming-for-the-cloud-the-s takes-are-high 

Consumer Financial Protection Bureau. (n.d.). § 1026.12 special credit card provisions. https://www.consumerfinance.gov/rules-policy/regulations/1026/12 

LawAI. (2024, July 24). *Existing authorities for oversight of frontier AI models*. https://law-ai.org/existing-authorities-for-oversight/ 

Oracle. (2024, August 27). *Anti–money laundering AI explained*. 

https://www.oracle.com/financial-services/aml-ai/ 

Cornell Law School. (n.d.). *15 U.S. Code § 1643 \- Liability of holder of credit card*. Legal Information Institute. https://www.law.cornell.edu/uscode/text/15/1643 

Consumer Financial Protection Bureau. (n.d.). *§ 1026.12 special credit card provisions*. https://www.consumerfinance.gov/rules-policy/regulations/1026/12  
Seger, Elizabeth, et al. "Open-Sourcing Highly Capable Foundation Models: An Evaluation of Risks, Benefits, and Alternative Methods for Pursuing Open-Source Objectives." *SSRN Electronic Journal*, 2023\. https://doi.org/10.2139/ssrn.4596436 

Vake, Domen, et al. "Is Open Source the Future of AI? A Data-Driven Approach." *arXiv*, 2025\. https://doi.org/10.48550/arxiv.2501.16403