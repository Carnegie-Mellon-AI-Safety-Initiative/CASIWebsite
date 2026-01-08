# Spring 2025 Semester Website Changes

## Summary
Updates to the CASI website in preparation for Spring 2025 semester, including new programs (CASI Research Scholars, Core Membership), office location updates, and navigation restructuring.

## New Pages to Create

### 1. CASI Research Scholars Page (`research-scholars.html`)
- **Location**: Under "Get Involved" dropdown in navbar
- **Content**:
  - Header explaining CASI Research Scholars program
  - Differentiation from Research Fellowship (pre-scoped projects vs. exploratory)
  - Application process overview (~10 hours to complete)
  - Dropdown/expandable section showing pilot research project:
    - Pilot 1: Red-teaming decomposition attacks w/ Alex Robey (CMU Postdoc)
    - Link to application PDF: `https://github.com/GnarlyMshtep/casi-mats-1-application/blob/main/casi_mats_1_application.pdf`
  - Benefits: mentorship, research skills, publications, compute/API credits, impact
  - Time commitment: 10-20 hours per week (project dependent)
  - Call to action: We're actively recruiting mentors; once recruited, will open applications for mentees
  - Recommendation: Start with AI fundamentals, reading groups, or Research Fellowship

### 2. Core Membership Page (`core-membership.html`)
- **Location**: New tab on navbar (not under dropdown)
- **Content**:
  - FAQ section with expandable dropdowns (similar to hackathon page)
  - **Questions & Answers**:
    - **How can I become a core member?**
      - Applications open every semester
    - **What do I get from being a core member?**
      - Member-only socials, dinners, and discussions
      - 24/7 access to CASI office (1500 sq ft at 201 S Craig St, opening next semester)
      - Curated reading groups and lunch & learns with core members, PhD students, and faculty
      - Smaller, more technical discussions beyond fundamentals programs
      - Travel funding for conferences and workshops
      - Research and compute funding (previously limited to official programs)
    - **What is the bar to becoming a core member?**
      - Active participation in any regular programming (e.g., reading groups)
      - We encourage applications and err on the side of accepting
    - **Where is the office?**
      - Units 1M and 1E of the Craig-Henry Building, located at 201 South Craig Street, Pittsburgh, PA 15213
    - **How can I gain entry into the office?**
      - Core members can ping a bot for entry to the office (system to be implemented)

### 3. Office Page (`office.html`)
- **Location**: New tab on navbar
- **Content**: Simple placeholder page with large font text:
  - "Details to be announced soon"
  - Keep minimal for now as details are being figured out

## Pages to Remove
- **about.html** (mission page)
  - Update navbar to remove "About" dropdown
  - Replace "About" dropdown with direct link to "Team" page
  - Keep "About" button label in navbar for styling consistency

## Pages to Update

### 1. Homepage (`index.html`)
- **Changes**:
  - Add link to new "CASI Research Scholars" page in the overview section
  - Change "Research Fellowship Program" text to "CASI Research Fellowship"
  - Add it alongside existing links to AI Alignment Fundamentals, AI Governance Fundamentals, and new Research Scholars link

### 2. Research Fellowship Page (`research-fellowship.html`)
- **Changes**:
  - Replace "The fall 2025 version of the research fellowship..." text with:
    - "The Spring 2025 version of the research fellowship will be mentored by Jennifer Evans and Ida Mattson, both PhD students with experience in AI safety research. Throughout the semester, there will be guest mentors based on your research project."
  - Update application button link (same as technical/policy reading groups)
  - Update button text to "Spring 2025 applications are now open."
  - Add FAQ section with dropdowns:
    - **What is the time commitment?**
      - Two hour weekly meeting for mentorship; additional independent project work expected
    - **Do I need to know what I want to work on before coming into the fellowship?**
      - Good to have area of interest and a few papers to explore. Fellowship includes team matching and project scoping phase.
    - **Why should I participate in the fellowship?**
      - Transition from broad understanding to initial projects. Work with peers at similar stage. Connect with experienced mentors and PhD students at CMU. Find the right people to explore and figure things out with.
    - **Do I receive any funding to conduct my research?**
      - Yes, approximately $800 worth of compute or API credits per project

### 3. Technical Reading Group Page (`technical-reading-group.html`)
- **Changes**:
  - Update link to previous iteration: `https://docs.google.com/document/d/1Wq5SRwbvHy-ZAZg3EpSgpBErPRoOn5Ne5iJtEExGynw/edit?tab=t.62r1wr4swo3w#heading=h.s6r99nefbblp`
  - Update button text to "Spring 2025 applications are now open."
  - Update button link to: `https://docs.google.com/forms/d/e/1FAIpQLSdxJwke3keDr8y-tbDCOllTzS1rxDvM6VwaXhrIsn_Bg8iYjg/viewform?usp=dialog`

### 4. Policy Reading Group Page (`policy-reading-group.html`)
- **Changes**:
  - Update button text to "Spring 2025 applications are now open."
  - Update button link to: `https://docs.google.com/forms/d/e/1FAIpQLSdxJwke3keDr8y-tbDCOllTzS1rxDvM6VwaXhrIsn_Bg8iYjg/viewform?usp=dialog`

### 5. Contact Page (`contact.html`)
- **Changes**:
  - Update address/location to: Units 1M and 1E of the Craig-Henry Building, located at 201 South Craig Street, Pittsburgh, PA 15213

### 6. All Pages (Navigation Bar Update)
- **Changes**:
  - Remove "About" dropdown
  - Replace with direct "Team" link (keep button label as "About" for consistency)
  - Add "Core Membership" as new navbar item
  - Add "Office" as new navbar item
  - Add "CASI Research Scholars" under "Get Involved" dropdown

## Implementation Order
1. Create CASI Research Scholars page
2. Create Core Membership page
3. Create Office page
4. Update all navigation bars across all pages
5. Update homepage
6. Update research fellowship page
7. Update technical reading group page
8. Update policy reading group page
9. Update contact page
10. Remove/archive about.html
