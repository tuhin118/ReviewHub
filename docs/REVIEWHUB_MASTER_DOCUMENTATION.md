ReviewHub — Master Project Documentation

Project Name: ReviewHub
Tagline: Discover. Review. Trust.
Developer: tuhin118
Repository: https://github.com/tuhin118/ReviewHub
Project Type: App & Website Review Platform
Development Strategy: MVP First, Progressive Updates
Budget: Zero-Cost Target
Priority: Security, Performance, User Experience and Reliability

---

1. Project Vision

ReviewHub একটি platform যেখানে ব্যবহারকারীরা বিভিন্ন App ও Website খুঁজে দেখতে, Rating দিতে এবং Review করতে পারবে।

মূল লক্ষ্য:

- Trusted App & Website Discovery
- Genuine User Reviews
- Transparent Rating System
- Verified Publisher System
- Secure User Accounts
- Professional Admin Management

2. Technology Architecture

নির্ধারিত Architecture:

- Frontend: React + Vite
- Hosting: Cloudflare Pages
- Backend: Cloudflare Workers
- Database: Cloudflare D1 (SQLite)
- Source Code: GitHub
- PWA: Installable Web Application

Architecture Flow:

GitHub → Cloudflare Pages → Frontend

Frontend → Cloudflare Workers → Cloudflare D1

API Secrets অবশ্যই Backend-এর Environment Secrets-এ থাকবে। Frontend বা Public GitHub Repository-তে কোনো Secret রাখা যাবে না।

শুধু Free Tier ব্যবহার করা হবে। Free Tier-এর সীমা অতিক্রম করলে Paid Service স্বয়ংক্রিয়ভাবে চালু করা যাবে না।

3. Zero-Cost & Performance Requirements

- কোনো Paid Hosting বা API ব্যবহার নয়।
- Heavy Dependencies এড়িয়ে চলতে হবে।
- অপ্রয়োজনীয় Animation ও Library ব্যবহার করা যাবে না।
- Reusable Components ব্যবহার করতে হবে।
- Image ও Asset Optimize করতে হবে।
- Frontend Bundle ছোট রাখতে হবে।
- Database Query Optimize করতে হবে।
- Build Memory ও Runtime Memory বিবেচনায় রাখতে হবে।
- Free Quota শেষ হলে Graceful Error দেখাতে হবে।
- Paid Service প্রয়োজন হলে আগে User-এর অনুমতি নিতে হবে।

Unlimited Free Usage-এর প্রতিশ্রুতি দেওয়া যাবে না।

Build Memory Optimization:

- অপ্রয়োজনীয় Dependencies যোগ করা যাবে না।
- Duplicate Code এড়িয়ে চলতে হবে।
- Modular Architecture বজায় রাখতে হবে।
- প্রয়োজন অনুযায়ী Lazy Loading ব্যবহার করতে হবে।
- অপ্রয়োজনীয় বড় Asset ও Animation এড়িয়ে চলতে হবে।
- Build Environment-এর Memory Limit বিবেচনায় রাখতে হবে।

4. Design System — LOCKED

মূল Theme:

- Black / Dark Background
- Cyan / Teal Neon Lighting
- Subtle Green Accents
- Premium Cyber Interface
- Futuristic HUD Elements
- Subtle Glassmorphism

সব Page-এ একই Design Language বজায় রাখতে হবে।

Typography, Buttons, Cards, Icons, Spacing এবং Responsive Layout-এর মধ্যে Consistency থাকতে হবে।

Homepage-এর বর্তমান Design পরিবর্তন না করে Functionality যুক্ত করতে হবে।

Typography প্রয়োজন অনুযায়ী বর্তমানের তুলনায় আনুমানিক ৫–৮% ছোট করা যেতে পারে, তবে Readability ও Accessibility বজায় রাখতে হবে।

4.1 Critical Design Ownership — Login & Register

Design Owner: ChatGPT

Login ও Register-এর Final UI/UX Design, Visual Direction এবং প্রয়োজনীয় Design Assets ChatGPT তৈরি ও নির্ধারণ করবে।

Gemini-এর দায়িত্ব শুধুমাত্র ChatGPT-এর দেওয়া Final Design Specification অনুযায়ী Code Implementation করা।

Gemini নিজে থেকে Login/Register Design তৈরি, পরিবর্তন, Simplify বা Replace করতে পারবে না।

বিশেষ নিয়ম:

1. ChatGPT-এর অনুমোদিত Design ছাড়া বিকল্প Login/Register Design তৈরি করা যাবে না।
2. অন্য কোনো ফাইলে Duplicate Login/Register System তৈরি করা যাবে না।
3. আলাদা Alternative Authentication UI তৈরি করা যাবে না।
4. Existing Project Structure যাচাই করে সঠিক জায়গায় Integration করতে হবে।
5. Final Design Assets বা Specification না পাওয়া পর্যন্ত Design Implementation শুরু করা যাবে না।
6. Design এবং Authentication Logic আলাদা Component-এ রাখা যেতে পারে, তবে UI অপরিবর্তিত রাখতে হবে।
7. কোনো Technical Conflict হলে নিজে থেকে Design পরিবর্তন না করে ChatGPT-এর Review চাইতে হবে।

Gemini must implement the approved design, not invent a replacement.

4.2 Login & Register Visual Concept

নির্ধারিত Design: Full-screen Futuristic Cyber Login.

Visual Concept:

- Central Futuristic Hub
- Connected App / Software Ecosystem Icons
- Circuit Lines
- Cyan / Teal / Green Lighting
- Digital Particles
- HUD Details
- Premium Dark Environment

Login Features:

- Email + Password
- Google Login
- Forgot Password
- Password Show / Hide
- Remember Me
- CAPTCHA / Turnstile Verification
- Sound On / Off

Register Features:

- Email Registration
- Password
- Email Verification
- Allowed Email Domain Validation
- CAPTCHA / Turnstile Verification

Login ও Register-এর জন্য একই Custom Robotic Digital Sound Effect ব্যবহার হবে। কোনো Voice বা Speech থাকবে না।

Browser Autoplay Policy মানতে হবে। Phone-এর System Volume জোর করে পরিবর্তন করা যাবে না।

Sound On / Off Control থাকবে। Sound চালানোর আগে Browser-এর User Interaction প্রয়োজন হলে তা অনুসরণ করতে হবে।

Login ও Register-এর Background Visual Effects:

- Circuit Animation / Flowing Light
- Floating App Icons
- HUD Scanning
- Digital Particles

Effects Medium Intensity-তে রাখার পরিকল্পনা থাকবে, তবে Performance ও Accessibility বিবেচনায় Final Design-এ নির্ধারণ করতে হবে।

5. Homepage & Public Website

Homepage:

- Hero Section
- Search Bar
- Featured Listings
- Trending Listings
- Top Rated Listings
- Categories
- Footer

Homepage-এর Demo Data সম্পূর্ণ Website Development শেষ হওয়া পর্যন্ত থাকবে।

Demo Data শুধু Development Preview-এর জন্য। Backend Integration ও Final Data Migration সম্পন্ন হলে বাস্তব Database Data ব্যবহার করতে হবে।

Demo Data-কে কখনো Real User Data, Real Review বা Verified Rating হিসেবে উপস্থাপন করা যাবে না।

5.1 Search System

Cyber Intelligence Search:

- Smart Auto Suggestions
- Recent Searches
- Category Filtering
- Advanced Filters
- Trending Searches
- App / Website Separate Search

প্রথম Version-এ AI Search প্রয়োজন নেই।

5.2 Search Results

- App / Website Name
- Icon
- Average Rating
- Review Count
- Short Description
- Category
- Verified Publisher Badge
- Advanced Sorting
- Rating Distribution
- Trending Indicators

5.3 Categories

Cyber Category Grid:

- Custom Category Icon
- Category Name
- Listing Count
- App Categories
- Website Categories
- Responsive Grid

5.4 Details Page

- App / Website Information
- Screenshots / Gallery
- Average Rating
- Rating Distribution
- User Reviews
- Publisher Information
- Official Website / Download Link
- Report Listing

6. User System

User Roles:

1. Guest
2. Authenticated User
3. Verified Publisher
4. Admin

Guest:

- Approved Listings দেখতে পারবে।
- Search করতে পারবে।
- Public Reviews দেখতে পারবে।

Authenticated User:

- Review ও Rating দিতে পারবে।
- Listings Save করতে পারবে।
- নিজের Profile পরিচালনা করতে পারবে।
- Support ব্যবহার করতে পারবে।

Verified Publisher:

- নিজের Listing Submit করতে পারবে।
- নিজের Listing Edit করতে পারবে।
- নিজের Listing Analytics দেখতে পারবে।

Admin:

- সম্পূর্ণ অনুমোদিত Admin Management Features ব্যবহার করতে পারবে।

Registration করলেই Publisher Permission পাওয়া যাবে না। Admin অনুমোদন প্রয়োজন।

General Users App বা Website Listing তৈরি করতে পারবে না।

Publisher শুধু নিজের Listing পরিচালনা করতে পারবে।

Admin Publisher Permission বাতিল করতে পারবে। Backend-এ Permission যাচাই বাধ্যতামূলক।

7. User Profile & Dashboard

User Profile:

- Personal Information
- My Reviews
- Account Settings
- Security

Public Profile:

- Profile Picture
- Name
- Username
- Public Bio
- Joined Date
- Review / Rating Summary
- Public Activity Timeline
- Public Contributions

User নিজের কোন Profile Information Public হবে তা নিয়ন্ত্রণ করতে পারবে।

Private Email বা Sensitive Information অন্য Users দেখতে পারবে না।

User Dashboard:

- My Reviews
- My Ratings
- Saved Listings
- My Reports
- Notifications
- Account Activity

Account Settings:

- Edit Profile
- Change Email (Verification Required)
- Change Password
- Logout
- Delete Account

8. Review & Rating System

Review Submission:

- Star Rating (1–5)
- Review Title
- Review Description
- Optional Screenshot
- Submit Button
- Submission Status

Review Admin Approval না পাওয়া পর্যন্ত Public হবে না।

একজন User একটি Listing-এ একটি Review রাখতে পারবে। Edit করলে Pending Revision হবে।

Approved Review-এর Edit Request Pending Revision হিসেবে থাকবে। Admin Approve না করা পর্যন্ত পুরোনো Approved Review Public থাকবে।

8.1 Public Review Display

- Reviewer Name
- Profile Picture
- Star Rating
- Review Text
- Review Date
- Verified Badge
- Helpful Count
- Profile Link
- Review Timeline
- Review Status

শুধু Approved Reviews Public হবে।

8.2 Review Sorting

- Newest First
- Highest Rating
- Lowest Rating
- Most Helpful

8.3 Helpful System

- Helpful Button
- One Vote Per User Per Review
- নিজের Review-এ Vote করা যাবে না।
- Login Required

8.4 Public Average Rating

শুধু Admin-approved Reviews-এর Rating Average Rating-এ গণনা হবে।

Pending বা Rejected Reviews গণনা হবে না।

9. Publisher System

Publisher Dashboard:

- My Listings
- Add New Listing
- Edit Listing
- Pending Approval Status
- Listing Performance

9.1 Listing Submission Form

- App / Website Name
- Icon / Logo
- Short Description
- Full Description
- Category
- Official Website URL
- Download URL (App-এর ক্ষেত্রে)
- Screenshots / Gallery

9.2 Image Upload Limit

- Maximum 10 MB Per Image
- Maximum 5 Images
- Maximum 50 MB Total Per Listing

Backend-এ File Size, Format এবং Quantity Validate করতে হবে।

9.3 Listing Approval Workflow

New Listing → Pending Approval → Admin Review → Approved / Rejected

Pending Listing Publisher Edit করতে পারবে।

Approved Listing Edit করলে Pending Revision তৈরি হবে।

Admin Revision Approve না করা পর্যন্ত পুরোনো Approved Version Public থাকবে।

9.4 Publisher Analytics

- Total Views
- Total Reviews
- Average Rating
- Rating Distribution
- Listing Approval Status

Publisher শুধু নিজের Listing-এর Analytics দেখতে পারবে।

10. Report Listing System

User Listing Report করতে পারবে।

Report Fields:

- Report Category
- Report Description
- Optional Screenshot
- Report Status

AI দ্রুত প্রাথমিক Report Analysis করবে।

Risk Levels:

- Low
- Medium
- High
- Critical

XELVOR AI Admin-কে Analysis ও Recommendation দেখাবে।

AI একা কোনো Listing Delete বা User Ban করতে পারবে না। গুরুত্বপূর্ণ Action-এর জন্য Admin Approval প্রয়োজন।

একই User-এর অপ্রয়োজনীয় Duplicate Reports নিয়ন্ত্রণ করতে হবে।

11. Saved Listings

- App ও Website Save করা যাবে।
- Saved Listings আলাদা তালিকায় থাকবে।
- Unsave করা যাবে।
- Login Required।
- Saved Listings Private থাকবে।

12. Notification System

Notification Types:

- Review Approval / Rejection
- Review Reply / Support Response
- Account Security Alerts
- Publisher Listing Approval
- Important Website Updates

User Notification Preferences নিয়ন্ত্রণ করতে পারবে।

Security Alerts সবসময় Enabled থাকবে।

প্রথম Version-এ Push Notification বাধ্যতামূলক নয়।

13. Admin Panel

Admin Theme:

Hybrid Intelligence Dashboard

Combination:

- Military Intelligence Control Room
- Premium Cyber Hacker Dashboard
- Robotic Operating System Style UI

Robotic Operating System Style বলতে System-Control Interface Design বোঝাবে; কোনো Robot Character বা Robot Image বাধ্যতামূলক নয়।

Navigation:

- Sidebar
- Top Navigation
- Grouped Menu
- Nested Menu
- Collapsible Sidebar
- Responsive Layout

Main Dashboard:

- Statistics
- Live Activity
- Security Alerts
- Analytics
- Pending Approvals

Color Palette আগের Design অনুযায়ী Black, Cyan, Teal ও Subtle Green থাকবে।

13.1 Admin Modules

নির্ধারিত Admin Module List:

1. Dashboard
2. User Management
3. Publisher Management
4. Apps Management
5. Website Management
6. Reviews Management
7. Ratings Management
8. Approval Center
9. Ban Management
10. Security Center
11. Reports & Analytics
12. Audit Logs
13. Admin Settings & Permissions
14. Support Center
15. Content & Category Management
16. Notification Center
17. System Maintenance Center
18. Database Backup & Recovery
19. Advanced Role & Permission Management
20. Global Search & Command Center
21. Admin Profile & Personalization
22. Email Domain Management

13.2 Admin Module Feature Requirements

User Management — Ultimate User Intelligence Center

- User Details
- Account Edit
- Disable / Enable
- Role Management
- Publisher Permission
- Session Revoke
- Warning
- Temporary / Permanent Ban
- Posting Restriction
- User History
- Activity Analysis
- Support History
- XELVOR Recommendations

Publisher Management — Ultimate Publisher Intelligence Center

- Publisher List / Profile
- Verification
- Approval / Rejection
- Publisher Permission Control
- Listings / Performance Analytics
- Activity History
- XELVOR Analysis

Apps Management — Ultimate App Intelligence Center

- App Listing Management
- Submission & Approval
- Revision Review
- Publisher Control
- App Analytics
- Security Checks
- Activity History
- XELVOR Analysis

Website Management — Ultimate Website Intelligence Center

- Website Listing Management
- Submission & Approval
- Revision Review
- Publisher Control
- Website Analytics
- Security Checks
- Activity History
- XELVOR AI Analysis

Reviews Management — Ultimate Review Intelligence Center

- Review List & Advanced Filters
- Approval / Rejection
- Pending Review & Revision Management
- User History & Review Tracking
- Publisher Tracking
- Review Analytics & Reports
- Suspicious Review Detection
- Security Analysis
- XELVOR AI Recommendations

Ratings Management — Ultimate Rating Intelligence Center

- Rating List & Management
- Rating Verification
- Suspicious Rating Detection
- Average Rating & Distribution Analytics
- Rating Trends & Item Comparison
- User Tracking
- Rating Security Analysis
- XELVOR AI Recommendations

শুধু Approved Review-এর Rating Public Average-এ গণনা হবে।

Approval Center — Ultimate Approval Intelligence Center

- App, Website, Review & Revision Approval
- Advanced Workflow
- Publisher Verification
- Priority & Pending Queue Management
- Approval Analytics & Reports
- Security Checks
- Admin Activity History
- XELVOR AI Recommendations

Ban Management — Ultimate Ban Intelligence Center

- Temporary & Permanent Ban
- Login Ban & Posting Ban
- IP Security Ban
- Warning & Restriction Management
- User Intelligence & Suspicious Activity Monitoring
- Ban Appeals
- Ban History & Audit Logs
- Ban Analytics
- XELVOR AI Recommendations

Security Center — Ultimate Security Intelligence Center

- Security Dashboard & Live Alerts
- Login & Session Protection
- Rate Limiting & API Security
- Suspicious Activity Detection
- Threat Intelligence & Risk Scoring
- Security Audit & Incident Management
- System Health Monitoring
- XELVOR AI Security Analysis

Reports & Analytics — Intelligence Analytics Center

- Trend Analysis
- User Behavior Analytics
- Security Reports
- Website Performance Insights
- Growth Analysis
- Data Visualization
- Predictive Insights
- XELVOR Trend Analysis

Audit Logs — Ultimate Audit Intelligence Center

- Admin / User / Publisher Activity Logs
- Login & Session History
- Security Event Timeline
- IP & Suspicious Activity History
- Incident Investigation
- Tamper-resistant Audit Records
- Export Reports
- XELVOR AI Analysis

Ordinary Admin Audit Logs গোপনে Edit বা Delete করতে পারবে না।

Admin Settings & Permissions

- Website Configuration
- API Configuration
- Database Settings
- System Controls
- Security Configuration
- XELVOR AI Control Panel
- XELVOR AI Configuration & Monitoring
- AI Permission Management
- AI Usage & Activity Logs

Support Center

- Advanced Ticket Management
- Priority & Category
- Assignment
- User History & Ticket Tracking
- Complete Ticket History
- NEXORA AI Escalations
- XELVOR Analysis & Recommendations
- Support Analytics

Content & Category Management

- Main Category / Subcategory Management
- Custom Icons / Descriptions
- Sorting
- Active / Inactive
- Content Analytics
- Trending Categories
- Category Performance
- XELVOR Recommendations

Notification Center

- Create / Send / Edit / Delete Notifications
- AI Message Drafting
- Title / Description Suggestions
- Admin Preview / Edit / Approval

XELVOR AI নিজে থেকে Notification পাঠাতে পারবে না।

System Maintenance Center

- Maintenance Mode
- System Status
- Database Status
- Backup Status
- Service Health Monitor

Database Backup & Recovery

- Manual Backup
- Backup History
- Backup Status
- Restore
- Integrity Check
- XELVOR Backup Monitoring / Alerts

Restore-এর আগে Admin Confirmation বাধ্যতামূলক।

Advanced Role & Permission Management

- Role Management
- Custom Role Creation
- Permission Assignment
- Module-wise Access Control
- Admin / Publisher Permissions
- User Access Restrictions
- Permission History
- XELVOR Access Analysis

Global Search & Command Center

- Search User
- Publisher
- App
- Website
- Review
- Support Ticket
- Audit Logs
- Natural Language XELVOR Command Interface

Admin Profile & Personalization

- Profile
- Picture
- Display Name
- Password / Security Settings
- Dashboard Personalization
- Own Account Activity / Login History

Email Domain Management

- Allowed Domain Management
- Add / Remove Domain
- Activate / Deactivate Domain
- Disposable Email Block
- Backend Validation

Advertisement Management এবং Feedback & Feature Request Center বর্তমানে Scope-এর বাইরে।

14. AI Assistants

দুটি আলাদা AI System নির্ধারিত:

14.1 XELVOR AI

Admin-only AI Assistant.

Responsibilities:

- User / Publisher Monitoring
- Security Event Analysis
- Performance Monitoring
- Database Monitoring
- Reports & Analytics
- Admin Recommendations
- Approved Automation

XELVOR AI Theme:

- Premium Futuristic Cyber Interface
- Dark / Cyan / Teal / Subtle Green
- English UI
- Multilingual AI Conversation
- Voice & Image Upload Interface

AI শুধু বাস্তব Backend Events ও Audit Logs-এর ভিত্তিতে Security Analysis করবে।

AI নিজে থেকে Irreversible Action নিতে পারবে না।

14.2 NEXORA AI

User-facing AI Assistant.

Responsibilities:

- ReviewHub Navigation Help
- Login / Register Assistance
- Review / Rating Submission Help
- Website Feature Explanation
- Screenshot-Based Troubleshooting

ReviewHub-এর বাইরে সাধারণ উদ্দেশ্যের AI হিসেবে কাজ করবে না।

NEXORA AI Theme:

- Premium Futuristic Cyber Chat Interface
- English UI
- Multilingual Conversation
- Screenshot Upload Support

সমস্যা সমাধান না হলে Support Ticket তৈরি হবে এবং Admin-কে জানানো হবে।

14.3 AI Security

- দুটি আলাদা API Integration / API Key
- API Key Backend Secrets-এ থাকবে।
- AI কখনো Password, OTP, Security Code বা Secret Key পাবে না।
- Sensitive Data AI-তে পাঠানোর আগে বাদ দিতে হবে।
- AI Action-এর জন্য Backend Permission ও Admin Confirmation প্রয়োজন।
- শুধু Free AI Service / Free Quota ব্যবহার করা যাবে।
- Quota শেষ হলে Graceful Message ও Support Option দিতে হবে।

AI API Provider এখনো Final Selection নয়। Free Tier, Privacy, Rate Limit এবং Terms যাচাই করে নির্বাচন করতে হবে।

14.4 XELVOR Security Intelligence

XELVOR AI বাস্তব Security Event থেকে বিশ্লেষণ করবে:

- Authentication Bypass Indicators
- Rate Limit Violations
- Access Control Violations
- API Abuse
- Database Security Anomalies
- Session Anomalies

Alert-এর মধ্যে থাকতে পারে:

- Timestamp
- Relevant Account / Session Reference
- Risk Level
- Reason
- Supporting Evidence
- Recommendation

AI অনুমানকে কখনো Confirmed Attack হিসেবে দেখাতে পারবে না।

14.5 XELVOR IP Management

Admin Natural Language Command দিয়ে IP Security Management করতে পারবে।

উদাহরণ:

- কোনো Suspicious Activity আছে কি না পরীক্ষা করা।
- কোনো নির্দিষ্ট IP সাময়িকভাবে Block করা।
- Blocked IP List দেখা।
- নির্দিষ্ট IP Unblock করা।
- Block History দেখা।

এই Action-এর জন্য:

- Backend Admin Permission যাচাই করবে।
- Sensitive Action-এর আগে Step-up Authentication প্রয়োজন হবে।
- Admin Confirmation নিতে হবে।
- সব Action Audit Log-এ থাকবে।
- Temporary Block-এর Expiry থাকবে।
- ভুল IP Block হলে Admin Override / Unblock করতে পারবে।

শুধু ২–৩টি Request হওয়ার কারণে স্বয়ংক্রিয় IP Block করা যাবে না। একাধিক Security Signal ও Risk Assessment বিবেচনা করতে হবে।

Shared IP ও Mobile Network-এর কারণে False Positive হতে পারে। তাই IP Block-এর সিদ্ধান্তে সতর্কতা প্রয়োজন।

14.6 XELVOR AI Auto Bug Detection & Repair

Future Advanced Feature — Confirmed

নির্ধারিত System: Hybrid AI Repair.

XELVOR AI:

- Error Logs Monitor করবে।
- API Failure Detect করবে।
- Database Error Analyse করবে।
- Bug Classify করবে।
- Severity নির্ধারণ করবে।
- Repair Recommendation তৈরি করবে।

Repair Policy:

1. ছোট ও Pre-approved Safe Bug-এর জন্য সীমিত Automated Repair Workflow ব্যবহার করা যেতে পারে।
2. বড় Code Change-এর জন্য Admin Approval প্রয়োজন।
3. Production Code-এ AI-এর Unrestricted Write Access থাকবে না।
4. Repair-এর আগে Backup / Rollback Point তৈরি করতে হবে।
5. Repair-এর পরে Automated Tests চালাতে হবে।
6. Test Failure হলে Rollback করতে হবে।
7. প্রতিটি Repair-এর Report ও Audit Record থাকবে।

AI নিজে থেকে Production Code বা Database নির্বিচারে পরিবর্তন করতে পারবে না।

এটি প্রথম Version-এর বাধ্যতামূলক Feature নয়; Future Roadmap-এ থাকবে।

15. Security Requirements

Security বাধ্যতামূলক।

- Modern Password Hashing (Argon2id বা উপযুক্ত সমমান)
- Plaintext Password সংরক্ষণ নয়
- Secure Authentication
- Secure Session Management
- CSRF Protection
- XSS Protection
- SQL Injection Protection
- Backend Authorization
- API Rate Limiting
- Password Reset Security
- Email Verification
- File Upload Validation
- Audit Logging
- Session Revocation
- Privacy Protection

15.1 Login Protection

পাঁচবার ভুল Password দিলে Account 15 মিনিটের জন্য Temporarily Lock হবে।

Lock চলাকালে সঠিক Password দিলেও Login হবে না।

Generic Error Response ব্যবহার করতে হবে।

Lock Enforcement Backend-এ হতে হবে। Abuse Prevention-এর জন্য Account ও Request Context অনুযায়ী Rate Limiting বিবেচনা করতে হবে।

15.2 Email Domain Rules

বর্তমানে Registration-এর জন্য অনুমোদিত Domain:

- gmail.com
- outlook.com
- hotmail.com
- live.com
- yahoo.com

অন্যান্য Domain Block থাকবে।

Temporary / Disposable Email Block করতে হবে।

Email Verification বাধ্যতামূলক।

Admin ভবিষ্যতে Email Domain Management থেকে Domain Add, Remove, Activate ও Deactivate করতে পারবে।

সব Validation Backend-এ হতে হবে।

15.3 Admin Security

- Admin Password ও Security Verification আলাদা থাকবে।
- Sensitive Actions-এর আগে Step-up Authentication প্রয়োজন।
- OTP / Security Code AI-এর কাছে প্রকাশ করা যাবে না।
- Permission Change ও Security Actions Audit Log-এ থাকবে।
- Admin Password বা User Password দেখা যাবে না।
- Admin Password Reset Initiate করতে পারবে; নতুন Password User নিজে সেট করবে।
- Password Hash সাধারণ Admin UI-তে প্রকাশ করা হবে না।

16. Privacy & User Intelligence

Admin প্রয়োজন অনুযায়ী User Account ও Activity Information দেখতে পারবে।

Ordinary Users শুধু Public Information দেখতে পারবে।

Privacy-Friendly Tracking:

- Account ID / Guest ID
- Device Type
- OS
- Browser
- Session
- Visit Count
- Last Visit
- Online / Offline Status

Guest Tracking-এর জন্য Random Guest ID ব্যবহার করা যাবে।

Covert CPU / Canvas Fingerprinting ব্যবহার করা যাবে না।

Repeat Visits একটি Summary Record-এ দেখানো হবে; বিস্তারিত History আলাদাভাবে দেখা যাবে।

Guest ID একই Browser-এর Storage বজায় থাকলে পুনরায় ব্যবহার করা যাবে। Browser Data Clear, Incognito বা অন্য Device-এ একই Guest শনাক্ত হবে—এমন নিশ্চয়তা দেওয়া যাবে না।

17. Support Center

- Ticket Management
- Priority & Category
- Assignment
- User History
- Complete Ticket History
- NEXORA AI Escalation
- XELVOR Analysis
- Support Analytics

AI Recommendation দিতে পারবে; গুরুত্বপূর্ণ Action Admin অনুমোদন করবে।

NEXORA AI কোনো সমস্যা সমাধান করতে না পারলে Support Ticket তৈরি করবে।

Admin Response User-এর Support Center-এ দেখানো হবে।

18. PWA Requirements

ReviewHub Android ও Desktop-এ Installable হতে হবে।

- App Icon
- Standalone Display
- Splash Screen
- Offline Fallback
- Static Asset Caching
- Update Management

Online Features-এর জন্য Internet Connection প্রয়োজন হবে।

Offline Mode-এ Authentication, Review Submission, AI এবং Admin Actions-এর মতো Online Feature কাজ করবে না।

19. Database & Recovery

Cloudflare D1 ব্যবহার করা হবে।

Core Entities:

- Users
- User Profiles
- Sessions
- Publishers
- Apps
- Websites
- Categories
- Reviews
- Ratings
- Saved Listings
- Reports
- Notifications
- Support Tickets
- Approval Records
- Audit Logs
- User Activity
- Guest Records

Database Schema বাস্তব Implementation-এর আগে যাচাই ও Finalize করতে হবে।

প্রয়োজন অনুযায়ী Foreign Key, Unique Constraint, Index এবং Ownership Validation রাখতে হবে।

Backup & Recovery:

- Manual Backup
- Backup History
- Backup Status
- Restore
- Integrity Check
- Backup Monitoring

Restore-এর আগে Admin Confirmation বাধ্যতামূলক।

Backup-এর বাস্তব পদ্ধতি, Free Tier Limit এবং Recovery Capability যাচাই করে Implementation করতে হবে। Backup আছে বলেই Recovery নিশ্চিত—এমন দাবি করা যাবে না।

20. Development Phases

Phase 1 — Core Website

- Existing Homepage Design Preserve
- Public Homepage
- Search
- Categories
- Listing Details
- App / Website Data
- Responsive Layout

Phase 2 — User System

- Registration
- Login
- Email Verification
- User Profile
- Account Settings
- Password Security
- Approved Login / Register Design Integration

Phase 3 — Reviews & Publishers

- Review Submission
- Rating System
- Admin Approval
- Publisher Dashboard
- Listing Submission
- Revision Workflow
- Saved Listings

Phase 4 — Admin Core

- Admin Dashboard
- User Management
- Listing Management
- Review Management
- Approval Center
- Basic Security Center
- Support Center

Phase 5 — PWA & AI

- PWA
- NEXORA AI Basic Integration
- XELVOR AI Basic Integration
- Support Escalation

AI Integration শুধু Free Quota ও Verified Security Controls অনুযায়ী বাস্তবায়ন করতে হবে।

Phase 6 — Testing & Launch

- Functional Testing
- Security Audit
- Database Testing
- Mobile Testing
- Performance Testing
- Final Deployment

Future Advanced Roadmap

- Advanced XELVOR Security Intelligence
- Natural Language IP Management
- Advanced Admin Analytics
- Advanced AI Automation
- Hybrid AI Auto Bug Detection & Repair
- Advanced Backup Monitoring
- Additional Intelligence Modules

Future Features বাতিল করা হচ্ছে না। MVP-এর পরে প্রয়োজন ও Resource অনুযায়ী যুক্ত করা হবে।

21. Security Testing Policy

Launch-এর আগে নিজের ReviewHub-এর Development Environment-এ Authorized Security Testing করতে হবে।

Testing Areas:

- Authentication
- Password Security
- Access Control
- API Authorization
- SQL Injection Protection
- XSS Protection
- Session Security
- Rate Limiting
- File Upload Validation
- Privacy

শুধু নিজের Test Accounts ও Test Data ব্যবহার করতে হবে।

Production User Data বা Third-party System ব্যবহার করে অনুমোদনহীন Testing করা যাবে না।

সব সমস্যা Fix করে Retest করতে হবে।

22. Important Development Rules

1. Existing Approved Homepage Design পরিবর্তন করা যাবে না।
2. Login/Register Design ChatGPT তৈরি ও নির্ধারণ করবে।
3. Gemini নিজে থেকে Login/Register UI Redesign করতে পারবে না।
4. Gemini অন্য ফাইলে Duplicate বা Alternative Login/Register System তৈরি করতে পারবে না।
5. Unnecessary Dependencies যোগ করা যাবে না।
6. Paid Service ব্যবহার করা যাবে না।
7. Backend Security ছাড়া Frontend-only Validation গ্রহণযোগ্য নয়।
8. Demo Data সম্পূর্ণ Website Development শেষ হওয়ার আগে সরানো যাবে না।
9. Demo Data-কে Real Data হিসেবে দেখানো যাবে না।
10. প্রতিটি Feature Test করতে হবে।
11. Complete Replacement Files ও Exact File Paths দিতে হবে।
12. নতুন Feature যোগ করার আগে Scope যাচাই করতে হবে।
13. User-এর অনুমতি ছাড়া Project Vision পরিবর্তন করা যাবে না।
14. আগে থেকে Approved Design ও Feature Requirements সংরক্ষণ করতে হবে।
15. MVP-তে কোনো Advanced Feature না থাকলেও সেটি Future Roadmap থেকে বাদ যাবে না।
16. Build Memory ও Runtime Performance সব Implementation-এ বিবেচনা করতে হবে।
17. API Secrets কখনো Frontend বা Public Repository-তে রাখা যাবে না।
18. AI-এর গুরুত্বপূর্ণ Action Backend Permission ও প্রয়োজনীয় Admin Confirmation ছাড়া কার্যকর হবে না।

23. Current Project Status

- GitHub Repository: Created
- Cloudflare Pages: Deployed
- Frontend: Existing React + Vite Project
- Homepage: Demo Data Connected
- Backend: Pending
- D1 Database: Pending
- Authentication: Pending
- Admin Backend: Pending
- AI Integrations: Pending

বর্তমান Deployment সফল হলেও Website এখনো সম্পূর্ণ Functional Platform নয়।

বর্তমান Frontend-এর Demo Data Development Preview হিসেবে থাকবে।

Final Backend Integration-এর আগে Repository Structure, Existing Components এবং Build Configuration যাচাই করতে হবে।

24. Final Project Goal

ReviewHub হবে একটি:

Premium, Secure, Lightweight, Responsive and Trustworthy App & Website Review Platform.

প্রথমে Core Website সম্পূর্ণ ও Launch-Ready করতে হবে। এরপর User Feedback, Usage এবং বাস্তব প্রয়োজন অনুযায়ী পূর্বনির্ধারিত Advanced Features ধাপে ধাপে যুক্ত করতে হবে।

Project Principle:

Build the Foundation Right. Launch Smart. Improve Continuously.

---

DOCUMENT CONTROL

এই Master Documentation হলো ReviewHub-এর প্রধান Project Reference।

পরবর্তী Development Prompt, Code Review, UI/UX Implementation, Backend Design এবং Testing Plan এই Documentation-এর সঙ্গে সামঞ্জস্যপূর্ণ হতে হবে।

কোনো নতুন সিদ্ধান্তে এই Documentation পরিবর্তন করতে হলে আগে সিদ্ধান্তটি অনুমোদন করতে হবে।
