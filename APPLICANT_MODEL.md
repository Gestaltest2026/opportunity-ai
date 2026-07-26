# Opportunity AI — Applicant Model v0.1

## 1. Purpose

The Applicant Model defines how Opportunity AI represents a person.

The purpose is not to summarize the applicant.

The purpose is to extract opportunity-relevant information from messy human materials in a way that is:

- Structured
- Evidence-backed
- Reviewable
- Correctable
- Reusable across scholarships, fellowships, grants, employment, sponsorship, and other forms of support

The model should capture both obvious characteristics and less obvious characteristics that may matter for opportunity matching.

---

## 2. Core Principle

The system must distinguish between:

1. Facts directly supported by applicant-provided materials
2. Reasonable inferences
3. Unknown information
4. Applicant-confirmed information

AI should never silently convert inference into fact.

---

## 3. Core Object: Applicant Claim

The basic unit of the Applicant Model is an Applicant Claim.

Each claim should include:

- Claim ID
- Category
- Claim
- Value
- Evidence
- Source
- Confidence
- Evidence Type
- Verification Status
- Sensitivity Level
- Notes

Example:

Claim ID:
life_context.family_caregiver

Category:
Life Context

Claim:
Family caregiver

Value:
True

Evidence:
"Caregiver for husband with cancer."

Source:
Personal and Professional Background

Confidence:
1.00

Evidence Type:
Explicit

Verification Status:
Unverified by applicant

Sensitivity Level:
Sensitive

Notes:
Current caregiving responsibility.

---

## 4. Evidence Types

Every claim should be assigned one evidence type.

### Explicit

The applicant or source directly states the fact.

Example:

> "Caregiver for husband with cancer."

Supported claim:

Family caregiver = True

---

### Derived

The claim is a straightforward transformation of explicit facts.

Example:

Source states:

- Graduated from high school in 1998
- Currently pursuing undergraduate education in 2026

Potential derived claim:

Nontraditional student = Likely

This should not automatically be treated as confirmed fact.

---

### Inferred

The claim requires interpretation.

Example:

Long-term volunteer activities across multiple institutions may support:

Community leadership = Possible

This is not equivalent to the applicant explicitly identifying as a community leader.

---

### Unknown

The source materials do not provide enough information.

Example:

First-generation college student = Unknown

The system must preserve unknowns rather than guessing.

---

## 5. Verification Status

Each claim should have one verification status:

- Unreviewed
- Applicant Confirmed
- Applicant Edited
- Applicant Rejected
- Requires Clarification

AI-generated claims begin as Unreviewed unless the claim comes from structured verified data.

---

## 6. Confidence

Confidence describes how strongly the evidence supports the claim.

Suggested scale:

### 1.00 — Direct

Explicitly stated with little or no ambiguity.

### 0.80–0.99 — Strong

Strongly supported but requires minor interpretation.

### 0.50–0.79 — Moderate

Plausible inference with meaningful uncertainty.

### Below 0.50 — Weak

Should normally not be surfaced as an applicant characteristic without clarification.

Confidence is not the same as importance.

A highly important characteristic may still have low confidence.

---

## 7. Applicant Categories

The initial Applicant Model should support the following categories.

### A. Education

Possible claims include:

- Current institution
- Previous institution
- Degree level
- Major
- Minor
- Undergraduate
- Graduate student
- Transfer student
- Returning student
- Nontraditional student
- Adult learner
- Online student
- Distance learner
- Full-time student
- Part-time student
- Expected graduation
- GPA
- Academic honors
- Academic interruption
- Academic trajectory

---

### B. Professional Experience

Possible claims include:

- Current occupation
- Previous occupations
- Industry
- Years of experience
- Legal professional
- Paralegal
- Legal assistant
- Office manager
- Administrator
- Manager
- Supervisor
- Entrepreneur
- Small business owner
- Licensed professional
- Working student
- Career changer
- Career advancement trajectory

---

### C. Life Context

Possible claims include:

- Parent
- Single-parent history
- Current single parent
- Family caregiver
- Spousal caregiver
- Cancer caregiver
- Dependent-care responsibilities
- Returning to education after family responsibilities
- Financial hardship
- Major relocation
- Immigration experience
- Cross-border life experience
- Military family
- First-generation status
- Other major responsibilities or constraints

Sensitive claims must require careful handling and applicant control.

---

### D. Identity and Background

Possible claims include:

- Gender
- Race
- Ethnicity
- National origin
- Cultural background
- Immigration background
- Languages
- Bilingual
- Multilingual
- Geographic background
- International experience

These characteristics should only be used where legally, ethically, and contextually appropriate.

---

### E. Leadership and Entrepreneurship

Possible claims include:

- Founder
- Business owner
- Organization leader
- Team leader
- Community organizer
- Educator
- Mentor
- Program creator
- Long-term project leadership
- Operational responsibility

---

### F. Community Service

Possible claims include:

- Volunteer
- Long-term volunteer
- Community service
- Service to elderly populations
- Service to children
- Service to individuals with disabilities
- Educational volunteering
- Cultural volunteering
- Civic engagement
- Pro bono activity

The system should capture duration, frequency, population served, and role where evidence exists.

---

### G. Skills and Capabilities

Possible claims include:

- Legal research
- Writing
- Administration
- Bookkeeping
- Client communication
- Bilingual communication
- Teaching
- Project coordination
- Management
- Research
- Technical skills
- Cross-cultural communication

---

### H. Credentials and Licenses

Possible claims include:

- Professional licenses
- Certifications
- Notary status
- Caregiver training
- Childcare certification
- Language certifications
- Legal certifications
- Other verified credentials

---

### I. Goals and Trajectory

Possible claims include:

- Law school intention
- Graduate-school intention
- Public-service goals
- Career-transition goals
- Community-impact goals
- Professional advancement
- Academic advancement
- Long-term educational goals

The system should distinguish between:

Current fact

and

Future aspiration

---

## 8. Temporal Information

Claims should include time where relevant.

Example:

Role:
Paralegal

Start:
2020

End:
Present

Duration:
Approx. 6 years

Temporal structure matters because many opportunities require:

- Current status
- Minimum years of experience
- Recent service
- Expected graduation date
- Age or career stage
- Length of community involvement

---

## 9. Sensitive Information

The system should treat certain categories as sensitive.

Examples include:

- Health-related caregiving
- Disability
- Immigration status
- Financial hardship
- Race and ethnicity
- Family structure
- Cancer-related circumstances

Sensitive information should not be unnecessarily exposed, inferred, or transmitted.

Applicants should be able to control whether sensitive claims are used for matching.

---

## 10. Contradictions

Different applicant materials may conflict.

Example:

Resume:
Office Manager since 2021

Personal Statement:
Office Manager since 2022

The system should not choose one silently.

It should record:

Conflict detected

Sources involved

Values in conflict

Clarification required

---

## 11. Missing Information

Missing information is itself useful.

For each opportunity-relevant field, the system may classify information as:

- Known
- Unknown
- Contradictory
- Needs verification

Example:

Financial need:
Unknown

Residency:
Florida — likely

Citizenship:
Unknown

First-generation status:
Unknown

The system should ask only high-value clarification questions.

---

## 12. Applicant 001 — Initial Ground Truth

Applicant 001 is the first development test case.

Based on the provided Personal Statement and Professional Background, the following claims are directly or strongly supported.

### Education

- Transfer student
- Undergraduate student
- Legal Studies student
- Studied English Literature
- ESOL study after moving to Florida
- Nontraditional educational trajectory

### Professional

- Legal Assistant
- Paralegal
- Office Manager
- Legal-sector experience
- Administrative experience
- Bookkeeping experience
- International trade experience

### Life Context

- Single-parent history
- Current caregiver for spouse with cancer
- Major Japan-to-Florida relocation
- English-language adaptation through ESOL
- Working adult pursuing higher education

### Entrepreneurship and Leadership

- Founder of a hula school
- Long-term operator of the school
- Teacher
- Community-facing organizer

### Community Service

- Long-term volunteer service
- Nursing-home service
- Children's-center service
- Elementary-school service
- Service involving individuals with disabilities

### Identity and Background

- Woman
- Japanese background
- Cross-cultural Japan-U.S. experience

### Credentials

- Florida Notary Public
- Caregiver training
- Childcare certificate

### Goals and Trajectory

- Legal education
- Law-school aspiration
- Prevention-oriented legal and public contribution

These claims should be treated as test data, not as a complete final profile.

---

## 13. What the Model Should Not Do

The Applicant Model should not:

- Invent demographic characteristics
- Infer protected characteristics from names or photographs
- Turn aspirations into current credentials
- Treat weak inference as confirmed fact
- Hide uncertainty
- Collapse multiple roles into one generic summary
- Overwrite applicant language when specificity matters
- Assume eligibility from profile similarity alone

---

## 14. Human Review Interface

The future interface should allow the applicant to see claims grouped by category.

Each claim should support:

- Confirm
- Edit
- Reject
- Add context
- Hide from matching

Example:

Family caregiver

Source:
"Caregiver for husband with cancer."

Status:
Unreviewed

[Confirm]
[Edit]
[Reject]
[Hide from Matching]

---

## 15. Version 0.1 Success Criterion

The Applicant Model succeeds at v0.1 if it can:

1. Read unstructured applicant materials
2. Extract opportunity-relevant claims
3. Preserve evidence and source
4. Distinguish fact from inference
5. Preserve unknowns
6. Surface useful characteristics the applicant did not manually identify
7. Allow human correction

The first benchmark is Applicant 001.
