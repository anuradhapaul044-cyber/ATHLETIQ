Design a complete, high-fidelity, responsive desktop web application called “ATHLETIQ”.

ATHLETIQ is a sports talent discovery and fitness platform with two connected goals:

1. Help students/athletes assess and improve their fitness and sports performance.
2. Make local and grassroots sports talent more discoverable to coaches, scouts, institutions and relevant opportunities.

Core product flow:

STUDENT:
Signup/Login → Student Dashboard → Push-up Assessment → Upload/Record Video → AI Analysis → Result → Athlete Profile → Opportunities

COACH:
Login → Coach Dashboard → Discover Athletes → Search/Filter → Athlete Profile → View Evidence → Verify Evidence → Opportunities

ADMIN:
Login → Admin Dashboard → Platform/User Management → Coach Verification → Athlete/Content Oversight → Opportunity Management → Reports/Activity

IMPORTANT:
Do not invent additional product goals or major functionality outside the requirements below.

━━━━━━━━━━━━━━━━━━━━━━

1. USERS & AUTHORIZATION
   ━━━━━━━━━━━━━━━━━━━━━━

Create three clearly separated role-based portals.

STUDENT:
Authentication:

* Email + password
* Signup with name, email, password and basic profile information
* Login using email and password

Student can access:

* Own dashboard
* Own athlete profile
* Fitness assessments
* AI assessment results
* Performance metrics
* Progress tracking
* Match records
* Achievements
* Coach evidence
* Opportunities
* Diet management
* BMI/health tracking
* Personalized fitness plan
* Challenges/gamification
* Notifications/settings

Student cannot:

* Access other students' private accounts
* Verify their own evidence
* Access coach-only or admin-only areas
* Manage platform opportunities

COACH:
Authentication:

* Email + password
* Coach registration/login
* Coach profile should clearly show verification status

Coach can access:

* Coach dashboard
* Athlete discovery
* Athlete search and filtering
* Athlete profiles
* Athlete performance/evidence
* Match records and achievements
* AI-verified assessment results
* Coach verification workflow
* Opportunities
* Notifications/settings

Coach cannot:

* Access admin controls
* Modify another athlete's actual AI assessment result
* Modify another coach's account
* Manage the platform-wide opportunity catalogue

ADMIN:
Authentication:

* Email + password
* Role-based authorization
* Admin portal must be visually and structurally separate from student/coach portals

Admin can access:

* Platform dashboard
* User management
* Student account oversight
* Coach account oversight
* Coach verification
* Evidence/content moderation
* Opportunity management
* Reports/flagged content
* Platform activity
* Basic platform analytics
* Admin settings

Admin should NOT directly alter an athlete's AI-generated performance result. Admin controls should focus on platform management, verification, moderation and content.

Include appropriate access-denied/unauthorized states for role-protected pages.

━━━━━━━━━━━━━━━━━━━━━━
2. VISUAL DIRECTION
━━━━━━━━━━━━━━━━━━━━━━

Create a visual identity that combines ALL of these qualities:

* Modern sports-tech
* Clean professional
* Futuristic AI
* Minimal and premium
* Youth/student friendly
* Trustworthy enough for coaches and institutions

Do NOT make it look like a generic gym/fitness app.

The visual identity should communicate:
SPORT + AI + TALENT DISCOVERY + OPPORTUNITY.

Generate a suitable original color palette for ATHLETIQ.

Use:

* A clean light primary interface
* Strong but selective accent colors
* Dark text for readability
* One primary brand accent
* One secondary accent for AI/performance
* Green or equivalent semantic color for successful/verified states
* Amber/orange equivalent for warnings/pending states
* Red only for errors/destructive actions

Avoid:

* Full-page saturated color backgrounds
* Excessive gradients
* Neon-heavy cyberpunk styling
* Overly childish fitness graphics
* Excessive glassmorphism
* Visually crowded dashboards

Create a temporary text-based ATHLETIQ wordmark because there is no final logo yet.

━━━━━━━━━━━━━━━━━━━━━━
3. DESIGN SYSTEM
━━━━━━━━━━━━━━━━━━━━━━

Create a proper reusable design system before designing the screens.

Include:

COLOR TOKENS

* Primary
* Secondary
* Accent
* Background
* Surface
* Elevated surface
* Text primary
* Text secondary
* Border
* Success
* Warning
* Error
* Info

TYPOGRAPHY
Create a clear hierarchy for:

* Display heading
* Page heading
* Section heading
* Card heading
* Body
* Small/supporting text
* Labels
* Buttons
* Metrics/numbers

COMPONENTS
Create reusable components for:

* Primary button
* Secondary button
* Ghost button
* Destructive button
* Text input
* Password input
* Search bar
* Dropdown
* Filter chips
* Tabs
* Navigation
* Sidebar
* Top navigation
* Cards
* Metric cards
* Profile cards
* Athlete cards
* Opportunity cards
* Assessment cards
* Evidence badges
* Verification badges
* Progress indicators
* Charts
* Tables
* Modal/dialog
* Toast
* Empty state
* Loading state
* Error state
* Confirmation state
* Pagination
* Avatar
* Status indicators

Define:

* Consistent spacing system
* Border radius
* Shadows
* Icon style
* Hover states
* Active states
* Disabled states
* Focus states
* Error states

Use a consistent 8px-based spacing system where appropriate.

━━━━━━━━━━━━━━━━━━━━━━
4. GLOBAL NAVIGATION
━━━━━━━━━━━━━━━━━━━━━━

Student navigation should include:

* Dashboard
* Assessments
* Athlete Profile
* Progress
* Records
* Opportunities
* Wellness
* Notifications
* Settings

Coach navigation should include:

* Dashboard
* Discover Athletes
* Saved Athletes
* Verification
* Opportunities
* Notifications
* Settings

Admin navigation should include:

* Dashboard
* Users
* Coaches
* Verification
* Opportunities
* Reports
* Activity
* Settings

Use a consistent sidebar/top navigation architecture while adapting it to each role.

━━━━━━━━━━━━━━━━━━━━━━
5. LANDING PAGE
━━━━━━━━━━━━━━━━━━━━━━

Create a polished ATHLETIQ landing page.

Hero message should communicate:

“Talent is everywhere. Opportunity is not.”

Support the message with the concept:

Test anywhere → AI-assisted verification → Performance analysis → Scout discovery → Opportunities

Include sections for:

* What ATHLETIQ does
* Fitness assessment
* AI-assisted performance analysis
* Athlete profiles
* Coach discovery
* Evidence and verification
* Opportunities
* Fitness/wellness features
* Call to action

Do not overload the landing page.

Use visual cards/illustrations rather than a phone mockup.

━━━━━━━━━━━━━━━━━━━━━━
6. AUTHENTICATION
━━━━━━━━━━━━━━━━━━━━━━

Design:

* Student signup
* Student login
* Coach login/signup
* Admin login
* Forgot-password state
* Password visibility control
* Validation states
* Loading state
* Authentication error state
* Successful authentication transition

Role-based routing should be visually clear.

Do not use OTP/social login as the primary authentication flow.

━━━━━━━━━━━━━━━━━━━━━━
7. STUDENT DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━

Create a clean personalized dashboard.

Show:

* Welcome/profile area
* Current fitness/performance snapshot
* Recent assessment
* Latest AI result
* Progress
* Upcoming/recommended opportunity cards
* Achievements
* Match record summary
* Coach evidence summary
* Wellness snapshot
* Quick action: Start Assessment

The dashboard should immediately guide the student toward completing an assessment.

━━━━━━━━━━━━━━━━━━━━━━
8. PUSH-UP ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━

This is the main AI demonstration feature.

Create the complete assessment experience:

Assessment introduction:

* Push-up assessment title
* Instructions
* Requirements for recording/uploading
* Start assessment button

Recording/upload screen:

* Upload video
* Record video
* Video preview
* Upload progress
* Cancel/retry

AI processing screen:

* Processing indicator
* “Analyzing your movement”
* Clear explanation that AI is analyzing the uploaded video
* Do not display fake accuracy claims

Result screen:

* Total valid repetitions
* Form consistency
* Performance metrics
* Movement feedback
* Assessment duration if available
* Visual performance summary
* Save result to profile

Important:
The UI must make a clear distinction between:

* AI-generated result
* Coach-attested evidence
* Self-reported information
* Officially verified information

Do not claim scientific validation or a specific AI accuracy percentage unless explicitly provided later.

━━━━━━━━━━━━━━━━━━━━━━
9. ATHLETE PROFILE
━━━━━━━━━━━━━━━━━━━━━━

Design a strong athlete profile intended to become the athlete's digital sports identity.

Include:

Profile header:

* Name
* Profile photo/avatar
* Sport
* Age
* Location
* Verification status

Sections:

* Performance overview
* AI assessment results
* Progress
* Match records
* Achievements
* Coach evidence
* Verification labels
* Opportunities

Use evidence labels such as:

* Self-reported
* AI-verified
* Coach-attested
* Officially verified

Do not imply that all information is verified.

Include a coach/scout-friendly version of the profile.

━━━━━━━━━━━━━━━━━━━━━━
10. COACH DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━

Create a professional coach portal.

Dashboard should show:

* Athlete discovery shortcut
* Recent athlete activity
* Pending evidence verification
* Saved athletes
* Relevant opportunities
* Basic activity overview

The design should feel more professional and information-focused than the student dashboard.

━━━━━━━━━━━━━━━━━━━━━━
11. ATHLETE DISCOVERY
━━━━━━━━━━━━━━━━━━━━━━

Create a searchable athlete discovery interface.

Allow coaches to search/filter by:

* Sport
* Age
* Location
* Performance
* Assessment results
* Verification/evidence status

Display athlete cards containing:

* Athlete name
* Sport
* Location
* Key performance metric
* Latest assessment
* Verification indicators
* View profile action
* Save athlete action

Create:

* Search state
* Filtered results
* Empty results
* Loading state

━━━━━━━━━━━━━━━━━━━━━━
12. COACH VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━

Create a dedicated evidence verification workflow.

Coach should be able to:

* Open athlete evidence
* Review assessment/result
* Review supporting information
* Add coach observation
* Attest/verify evidence
* See verification status

Use clear states:

* Pending
* Verified
* Rejected/needs review

Make verification visually trustworthy and understandable.

━━━━━━━━━━━━━━━━━━━━━━
13. OPPORTUNITIES
━━━━━━━━━━━━━━━━━━━━━━

Create an opportunity discovery system.

Opportunity categories:

* Government schemes
* Scholarships
* Trials
* Competitions
* Talent identification programmes

Opportunity cards should include:

* Opportunity name
* Category
* Sport
* Location/eligibility
* Deadline if available
* Eligibility summary
* Official/source indicator
* View details

Create:

* Opportunity listing
* Search/filter
* Opportunity details
* Eligibility section
* Application/action area

For prototype/demo content, clearly design the interface so sample/demo opportunities can be distinguished from officially verified information.

━━━━━━━━━━━━━━━━━━━━━━
14. MATCH RECORDS
━━━━━━━━━━━━━━━━━━━━━━

Create a match-record section.

Show:

* Match/event name
* Date
* Sport
* Competition
* Result/achievement where applicable
* Evidence/verification status

Include add-record and view-record states.

━━━━━━━━━━━━━━━━━━━━━━
15. ACHIEVEMENTS
━━━━━━━━━━━━━━━━━━━━━━

Create an achievements section.

Display:

* Achievement title
* Event/competition
* Date
* Sport
* Evidence status

Use visual cards but keep them professional rather than game-like.

━━━━━━━━━━━━━━━━━━━━━━
16. PROGRESS
━━━━━━━━━━━━━━━━━━━━━━

Create a performance progress page.

Show:

* Assessment history
* Performance trends
* Repetition progress
* Consistency trend
* Completed assessments
* Milestones

Use simple, readable charts.

Do not fabricate scientific conclusions from the charts.

━━━━━━━━━━━━━━━━━━━━━━
17. WELLNESS
━━━━━━━━━━━━━━━━━━━━━━

Create a wellness area containing:

DIET MANAGEMENT:

* Basic diet tracking interface
* Meals
* Hydration
* Simple progress indicators

BMI / HEALTH:

* BMI/health tracking section
* Basic health metrics
* History/progress

PERSONALIZED FITNESS:

* Personalized plan
* Recommended activities
* Progress

CHALLENGES:

* Fitness challenges
* Completion progress
* Achievement states

Keep this section supportive and functional rather than appearance-focused.

━━━━━━━━━━━━━━━━━━━━━━
18. ADMIN PORTAL
━━━━━━━━━━━━━━━━━━━━━━

Create a dedicated admin dashboard with a more data-oriented interface.

Admin dashboard:

* Total users
* Students
* Coaches
* Pending coach verifications
* Pending reports
* Opportunities/content status
* Recent platform activity

USER MANAGEMENT:

* Student list
* Coach list
* Search
* Filters
* Account status
* View account

COACH VERIFICATION:

* Pending applications
* Coach information
* Verification documents/status
* Approve
* Reject
* Request review

CONTENT/OPPORTUNITY MANAGEMENT:

* Opportunity list
* Add opportunity
* Edit opportunity
* Archive opportunity
* Verification/source status

REPORTS:

* Reported content
* Flagged profiles/evidence
* Review actions

ACTIVITY:

* Recent administrative/platform actions
* Timestamp
* Action
* User/role

Admin interface should prioritize clarity, tables, filters and status indicators rather than decorative elements.

━━━━━━━━━━━━━━━━━━━━━━
19. RESPONSIVE DESIGN
━━━━━━━━━━━━━━━━━━━━━━

Design primarily for desktop web.

Also ensure the layout can adapt to smaller screens.

Use:

* Responsive grid
* Collapsible sidebar
* Responsive cards
* Responsive tables
* Appropriate mobile stacking

Do not design it as a mobile-app-only interface.

━━━━━━━━━━━━━━━━━━━━━━
20. ACCESSIBILITY & UX
━━━━━━━━━━━━━━━━━━━━━━

Ensure:

* Strong text contrast
* Clear labels
* Consistent button hierarchy
* Keyboard-friendly interactions
* Visible focus states
* Clear error messages
* Clear success messages
* Understandable icons
* Icons should not replace important text
* Do not rely only on color to communicate status

Prioritize usability over visual decoration.

━━━━━━━━━━━━━━━━━━━━━━
21. PROTOTYPE INTERACTIONS
━━━━━━━━━━━━━━━━━━━━━━

Make the Figma prototype genuinely clickable.

Connect the primary journeys:

STUDENT:
Landing → Signup → Login → Dashboard → Assessment → Upload/Record → Processing → AI Result → Athlete Profile → Opportunities

COACH:
Login → Coach Dashboard → Discover Athletes → Search/Filter → Athlete Profile → Evidence → Verify → Opportunities

ADMIN:
Login → Admin Dashboard → Users → Coach Verification → Opportunity Management → Reports

Include realistic:

* Hover states
* Button states
* Navigation
* Tabs
* Filters
* Modals
* Confirmation dialogs
* Loading states
* Empty states
* Error states
* Successful actions

Use prototype interactions that make the product feel like a real working web application.

━━━━━━━━━━━━━━━━━━━━━━
22. SIH DEMO PRIORITY
━━━━━━━━━━━━━━━━━━━━━━

Although the complete product should be represented, visually prioritize the core SIH demonstration:

Student creates account
↓
Student dashboard
↓
Push-up assessment
↓
Video upload/record
↓
Real AI analysis
↓
Rep count + form consistency/result
↓
Athlete profile updated
↓
Coach discovers athlete
↓
Coach reviews evidence
↓
Coach verifies evidence
↓
Relevant opportunity displayed

These screens should receive the highest level of polish because they represent the core product story.

━━━━━━━━━━━━━━━━━━━━━━
23. OUTPUT
━━━━━━━━━━━━━━━━━━━━━━

Create:

1. Complete ATHLETIQ design system
2. Component library
3. Landing page
4. Authentication screens
5. Student portal
6. Coach portal
7. Admin portal
8. All major feature screens listed above
9. Empty/loading/error/success states
10. Clickable prototype flows
11. Consistent desktop web layouts
12. Reusable components throughout

Maintain one coherent visual language across all three portals.

The final result should look like a serious, modern sports technology platform suitable for an SIH prototype presentation and future product development — not like a generic template or a simple student project dashboard.
