Three Federal Liability Frameworks for Combating AI-Enabled Consumer Fraud 

Dorian Clay*∗*1 and Jessica Wen*∗*2 

1Department of Philosophy, Carnegie Mellon University   
2Department of Materials Science & Engineering, Carnegie Mellon University May 4, 2026 

*∗*Equal contribution.  
**Contents** 

**1 Executive Summary 2 2 Scope of Problem 2** 

**3 Approach A: Strict Vicarious Liability 2** 3.1 Mechanism . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 2 3.2 Precedent . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 2 3.3 Liability allocation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3 3.4 Tradeoffs . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3 

**4 Approach B: Negligence-Based Duty of Care 3** 4.1 Mechanism . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3 4.2 Precedent . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3 4.3 Tradeoffs . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3 

**5 Approach C: Industry-Funded Compensation Fund with Private Right of Action 4** 5.1 Mechanism . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4 5.2 Precedent . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4 5.3 Structure . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4 5.4 Combating Collusion Risk . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4 5.5 Tradeoffs . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5 

**6 The Open-Source Model Problem 5** 

**7 The Optimal Combination 5** 7.1 Layer 1: Platform obligations and safe harbor . . . . . . . . . . . . . . . . . . . . . . 5 7.2 Layer 2: Private right of action . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6 7.3 Layer 3: AFVCC fund as backstop . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6 7.4 Discussion . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6 

**8 References 6** 8.1 Statutes and Regulations . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6 8.2 Case Law . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7 8.3 FTC Enforcement Actions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7 

1  
Federal Liability Frameworks for AI Fraud 

**1 Executive Summary** 

AI-enabled consumer fraud—scams that pair voice cloning with traditional social engineering, for example—is growing rapidly and becoming cheaper to deploy. Voice cloning fraud alone increased by more than 400% in 2024 \[1\], and the FBI’s 2025 IC3 report logged $893 million in AI-specific fraud losses across 22,364 complaints, a figure the Bureau itself describes as conservative \[2\]. The consequences for individual consumers are severe: 77% of people who received a message from an AI voice clone lost money, and 43% of those victims lost between $500 and $15,000 \[3\]. 

This proposal combines three approaches to allocate liability across the AI deployment chain while prioritizing victim recovery. The first imposes strict vicarious liability; the second develops a negligence-based duty of reasonable safeguards; the third creates a mandatory industry-funded victim compensation fund. Each draws on established U.S. legal precedent and presents tradeoffs that the FTC Bureau of Consumer Protection and the Senate Commerce Committee must weigh. 

**2 Scope of Problem** 

AI-driven scams grew by 1,210% in 2025, dwarfing the 195% growth in traditional fraud in the same period \[4\]. Losses are projected to reach $40 billion by 2027 \[5\]. The underlying problem is that general-purpose AI capable of generating realistic text, audio, images, and video can be repurposed for fraud with little technical expertise, allowing scammers to produce deceptive content anonymously and at scale \[6\]. As little as three seconds of source audio is enough to create a voice clone with 85% accuracy \[3\], and detection tools have not kept pace \[6\]. These figures almost certainly understate the problem: victims often decline to report losses out of embarrassment or fear of further harm, making it difficult to assess the full scope. 

Recourse for those who do report AI-enabled fraud is limited. The immediate fraudster is typically anonymous and overseas, leaving the domestic AI developers, platforms, and operators in the deployment chain as the only viable targets for recovery. These are not innocent intermediaries 

— the misuse of voice-cloning and agentic AI tools for fraud is a foreseeable consequence of deploying them without adequate safeguards. Against this backdrop, three distinct federal policy approaches can fairly distribute liability throughout that chain while keeping victim recovery at the center. 

**3 Approach A: Strict Vicarious Liability** 

**3.1 Mechanism** 

This approach would amend the Telephone Consumer Protection Act (TCPA)—or enact parallel legislation—to impose strict liability on AI platforms for fraud committed using their tools. The model is the TCPA’s existing treatment of robocall sellers and lead generators, who already bear liability for third-party violations. 

**3.2 Precedent** 

The FCC’s 2013 Declaratory Ruling established vicarious TCPA liability through agency principles: actual authority, apparent authority, and ratification. *Krakauer v. Dish Network* (4th Cir. 2019\) applied those principles to sustain a $61 million verdict, holding that a company that knew of ongoing violations, continued to profit from them, and failed to act had ratified the misconduct—justifying trebled damages. In *Cunningham v. Montes* (W.D. Wis. 2019), a dialing platform was denied Section 230 protection on the ground that TCPA claims sound in privacy tort, not content moderation. 

2  
Federal Liability Frameworks for AI Fraud 

More recently, the FCC’s 2024 ruling (FCC 24-17) declared AI-generated voices “artificial” under the TCPA, and the TRACED Act (2019) added know-your-customer (KYC) obligations along with a Robocall Mitigation Database that locks non-compliant providers out of the U.S. voice ecosystem. 

**3.3 Liability allocation** 

Under this framework, platforms bear primary liability as the structural analog to dialing services. Operators face direct liability for the fraud itself. Developers face exposure if they ratify known misuse, most clearly by continuing to profit from it. 

**3.4 Tradeoffs** 

The TCPA’s statutory damages of $500 per violation have already produced more than $925 million in judgments without direct agency involvement, demonstrating the power of private enforcement. The risk is that strict liability may hamper legitimate audio AI development. There is also a procedural concern: the Eleventh Circuit’s 2025 vacatur of the FCC’s one-to-one consent rule (*Insurance Marketing Coalition v. FCC*) confirms that administrative rulemaking faces sharp limits after *Loper Bright*. Durable reform in this area will require legislation, not agency action alone. 

**4 Approach B: Negligence-Based Duty of Care** 

**4.1 Mechanism** 

This approach would establish that AI platforms failing to implement reasonable safeguards against foreseeable fraud commit an “unfair practice” under Section 5 of the FTC Act, extending the framework the Commission has already applied to negligent payment processors. 

**4.2 Precedent** 

Voice-cloning fraud readily satisfies the three-part unfairness test under §45(n): the injury is substantial, not reasonably avoidable by consumers, and not outweighed by countervailing benefits. *FTC v. Wyndham* (3d Cir. 2015\) held that inadequate data security constituted an unfair practice even in the absence of specific regulations. Payment processor cases pushed this even further: *FTC v. First Data/Fiserv* (2020, $40.2M) and *FTC v. WV Universal Management* (11th Cir. 2017, $1.73M in joint and several liability) held processors liable under a “knew or should have known” standard. The FTC’s 2024 Impersonation Rule—the first Magnuson-Moss trade regulation rule in over 40 years—enables restitution and civil penalties. A proposed supplemental NPRM would expressly impose liability on providers that supply tools “with knowledge or reason to know” they will be used for impersonation. 

**4.3 Tradeoffs** 

Negligence-based liability is the most flexible and technology-neutral of the three approaches, but it has a significant gap: *AMG Capital Management v. FTC* (2021) stripped the Commission’s ability to seek restitution under §13(b), which previously allowed the recovery of over $11 billion in equitable relief. Without that authority, the FTC faces an administrative path of 7-12 years before it can secure monetary recovery. There is no private right of action. The current administration’s AI Action Plan is actively narrowing Section 5’s reach, as illustrated by the FTC’s 2025 decision to vacate its *Rytr* consent order. 

3  
Federal Liability Frameworks for AI Fraud 

**5 Approach C: Industry-Funded Compensation Fund with Private Right of Action** 

**5.1 Mechanism** 

This approach would create an AI Fraud Victim Compensation Corporation (AFVCC), funded by industry assessments, to compensate victims when the fraudster is unreachable. It would be paired with a new federal private right of action against platforms. 

**5.2 Precedent** 

Many existing models provide structural analogs. In the financial sector, the Securities Investor Protection Corporation (SIPC) maintains a mandatory-membership pool funded by broker-dealer assessments at 0.15% of net operating revenues, backed by a Treasury credit line. In public health, the National Vaccine Injury Compensation Program uses a per-dose excise tax to fund no-fault claims adjudicated against presumptive causation tables; it has paid out $4.6 billion since 1988\. In environmental protection, the Oil Spill Liability Trust Fund allows fund claims and private litigation to coexist, preserving deterrence alongside rapid compensation. However, the clearest overall template is CERCLA: an industry-funded trust fund, private cost-recovery actions, and government enforcement all operate simultaneously. The AIVCC would most closely follow CERCLA in its structure, applying liability to “potentially responsible parties” (not just the owner or operator). 

**5.3 Structure** 

Risk-adjusted assessments on AI model developers, platform operators and voice-cloning API providers would target a reserve of $5 billion. An AI Fraud Injury Table would establish presumptive eligibility for defined fraud categories, with 180-day adjudication and a $500,000 per-incident cap. Victims who access the fund would retain the right to pursue private litigation; the fund would hold subrogation rights against any liable party, preventing double recovery. 

**5.4 Combating Collusion Risk** 

A compensation fund that pays claims without verification creates an incentive for collusion between a purported victim and a fraudster: the fraudster manufactures a transaction, the victim files a claim, and both share the payout. To address this, the AFVCC should be granted its own investigative authority, modeled on SIPC’s power to seek court-appointed trustees and compel document production in suspected fraud cases. Claims would trigger a mandatory verification period before disbursement, during which the AFVCC could subpoena financial records, compel cooperation from platforms, and refer suspected collusion to the DOJ for criminal prosecution. Importantly, the False Claims Act (31 U.S.C. §§3729–3733) should expressly apply to AFVCC claims: anyone who knowingly submits a fraudulent claim would face treble damages and civil penalties of up to $28,619 per false claim as of 2025, with *qui tam* provisions allowing whistleblowers—including co-conspirators—to bring suits on the government’s behalf in exchange for a share of the recovery. This last point is particularly effective in the collusion context: it creates a financial incentive for the fraudster or victim to defect and report the scheme, structurally undermining the stability of any collusive arrangement. The clawback provisions would allow the AFVCC to recover the disbursements from any claimant subsequently found to have submitted fraudulently, with interest. 

4  
Federal Liability Frameworks for AI Fraud 

**5.5 Tradeoffs** 

This is the only framework that directly addresses the problem of judgment-proof fraudsters. The obstacles are political and practical: no such legislation has been introduced, industry opposition will be intense, and if losses reach the projected $40 billion by 2027, even a $5 billion fund would cover only a fraction of claims. 

**6 The Open-Source Model Problem** 

Open-source models appear to create a liability gap, but the framing matters. Voice-cloning fraud at scale requires more than an open-source model deployed locally. It relies on downstream commercial infrastructure such as API hosting, telephony carriers, and payment processing. Bad actors using open-source models still pass through regulated choke-points. The real question then is not how to hold the open-source developer liable but how to prevent the framework from being circumvented by routing through open-source tools. 

Three mechanisms address this gap. The first is to shift liability to the hosting layer, which has the added benefit of having lowest political cost. Platforms like Hugging Face, Replicate, and GitHub that host and distribute model weights are commercial entities with ongoing user relationships. They are much closer to the TRACED Act’s “gateway providers” than the original developers are. Requiring KYC before serving high-fidelity voice-cloning models and imposing liability for failure to do so captures most open-source risk without reaching the developer. 

The second mechanism is capability-based registration for high-risk releases. Congress could require registration with the FTC or NIST before publicly releasing models capable of producing voice clones below a defined perceptual detection threshold. Registration would require embedded watermarking as a condition of lawful release; compliant developers would receive safe harbor, while non-compliant developers would face a rebuttable presumption of negligence if their model is used for fraud. The EU AI Act applies a version of this logic to general-purpose models above 1025 FLOPs. 

The third mechanism is to exclude open-source developers from AFVCC assessments but include commercial fine-tuners. A developer releasing weights without commercial revenue should not face fund assessments—doing so would be legally difficult and politically damaging to the research community. But a commercial entity that takes an open-source model, fine-tunes it for voice cloning, and offers it as an API is indistinguishable from a proprietary developer for fund purposes. The assessment obligation should be attached to commercial deployment, not original release. 

Of these three, the hosting-layer approach has the strongest combination of impact and feasibility. Capability registration carries a genuine risk of slowing research and works best when scoped narrowly to voice-cloning models, which is more defensible than general-purpose AI. 

**7 The Optimal Combination** 

No single approach is sufficient, as each has shortcomings and faces challenges in implementation. The recommended approach layers all three, drawing on CERCLA’s structure as a model. 

**7.1 Layer 1: Platform obligations and safe harbor** 

Congress would mandate TRACED Act-style duties for AI platforms: KYC for voice-cloning API access, certified AI Fraud Mitigation Plans, embedded watermarking in synthetic audio, and mandatory traceback cooperation. Hosting platforms would face KYC obligations for open-source 

5  
Federal Liability Frameworks for AI Fraud 

voice-cloning model distribution. Platforms that comply receive a safe harbor from strict liability, while those that do not face ecosystem exclusion and have no safe harbor. 

**7.2 Layer 2: Private right of action** 

A new federal cause of action would allow consumers to sue platforms under a “knew or had reason to know” negligence standard, with actual damages, treble damages for willful violations, and fee-shifting. This bypasses the gap left by *AMG* and does not depend on the bandwidth of FTC enforcement or shifting political priorities. The negligence standard, combined with the Layer 1 safe harbor, distinguishes good-faith actors from bad ones and is more likely to survive major-questions doctrine challenges after *Loper Bright*. 

**7.3 Layer 3: AFVCC fund as backstop** 

The AFVCC would activate only after the exhaustion of alternative paths to compensation. The victim must have reported to law enforcement and must certify that the fraudster is unreachable. Risk-adjusted assessments give platforms an ongoing incentive to invest in prevention, and the fund’s subrogation rights ensure that successful private litigation replenishes payouts over time. 

**7.4 Discussion** 

These layers work together because each solves a problem that the others cannot. Layer 1 alters platform’s behaviors by making safeguards a condition of market access. Layer 2 provides fast victim recovery without agency bottlenecks. Private enforcement scales naturally with the volume of fraud. Layer 3 addresses the irreducible problem that some fraudsters will always be beyond reach, ensuring that older and low-income victims, those least able to navigate civil litigation, receive compensation regardless of whether a liable platform can be identified. The FTC’s role under this framework is rule-making, defining “reasonable safeguards” under the Impersonation Rule. The Senate Commerce Committee’s role is the legislation needed to create the private right of action, the AFVCC, and the safe harbor structure. Neither body can do this alone. 

**8 References** 

**8.1 Statutes and Regulations** 

• FTC Act §5, 15 U.S.C. §45(a), (n) 

• Wire Fraud Statute, 18 U.S.C. §1343 

• Telephone Consumer Protection Act, 47 U.S.C. §227 

• TRACED Act, Pub. L. No. 116-105 (2019) 

• Securities Investor Protection Act, 15 U.S.C. §78aaa et seq. 

• National Vaccine Injury Compensation Program, 42 U.S.C. §§300aa-10–34 • Oil Pollution Act / Oil Spill Liability Trust Fund, 33 U.S.C. §§2701–62 

• CERCLA / Superfund, 42 U.S.C. §§9601 et seq. 

• FTC Impersonation Rule, 16 C.F.R. §§461.1–461.3 (eff. April 1, 2024\) 

6  
Federal Liability Frameworks for AI Fraud 

• FTC Supplemental NPRM on Individual Impersonation, 89 Fed. Reg. (Feb. 2024\) • FCC Declaratory Ruling on AI-Generated Voices, FCC 24-17 (Feb. 2024\) • FCC Declaratory Ruling on Vicarious TCPA Liability, CG Docket No. 11-50 (2013) • EU AI Act, Regulation (EU) (2024) 

• False Claims Act, 31 U.S.C. §§3729-3733 

**8.2 Case Law** 

• AMG Capital Management, LLC v. FTC, 593 U.S. 67 (2021) 

• FTC v. Wyndham Worldwide Corp., 799 F.3d 236 (3d Cir. 2015\) 

• Krakauer v. Dish Network, LLC, 925 F.3d 643 (4th Cir. 2019\) 

• Cunningham v. Montes, No. 18-cv-00244 (W.D. Wis. 2019\) 

• Mey v. All Access Telecom, No. 5:19-cv-00237 (N.D. W.Va. 2021\) 

• Insurance Marketing Coalition v. FCC, No. 24-10277 (11th Cir. Jan. 2025\) • FTC v. WV Universal Management, 877 F.3d 1234 (11th Cir. 2017\) 

• Garcia v. Character Technologies, No. 8:24-cv-01716 (M.D. Fla. 2025\) 

**8.3 FTC Enforcement Actions** 

• FTC v. First Data/Fiserv (2020) 

• FTC v. Nexway (2023) 

• FTC v. Air AI Technologies (2026) 

• FTC v. Rytr LLC (2025) 

**Additional Sources** 

\[1\] *Vishing Statistics 2025: AI Deepfakes & the $40B Voice Scam Surge*. en-US. Oct. 2025\. url: https://deepstrike.io/blog/vishing-statistics-2025. 

\[2\] *2025 Internet Crime Report*. Federal Bureau of Investigation, Apr. 8, 2026\. url: https : //www.ic3.gov/AnnualReport/Reports/2025\_IC3Report.pdf. 

\[3\] *Scammers use AI voice cloning tools to fuel new scams | McAfee AI Hub*. en-US. url: https: //www.mcafee.com/ai/news/ai-voice-scam/. 

\[4\] *Inside the 2025 AI Fraud Spike*. en. url: https://www.pindrop.com/ai-fraud-spike/. 

\[5\] *AI scams in 2026: how they work and how to detect them*. en. url: https://www.vectra.ai/ topics/ai-scams. 

\[6\] *International AI Safety Report 2026 | International AI Safety Report*. en. url: https:// internationalaisafetyreport . org / publication / international \- ai \- safety \- report \- 2026. 

7