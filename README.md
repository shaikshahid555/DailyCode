# DailyCode — Daily LeetCode Challenge Platform

> **"One Problem a Day. One Step Closer to Mastery."**

DailyCode is a full-stack, responsive, production-ready web application where an administrator publishes a curated LeetCode problem every day, and developers practice DSA, mark problems completed, build daily streaks, and track weekly progress.

Built with **React.js, Vite, Tailwind CSS, Lucide Icons, Firebase Authentication (Google OAuth), and Cloud Firestore**.

---

## ⚡ Features

- **Google Authentication**: One-click Google sign-in and sign-out, session persistence, profile pictures, and secure role control.
- **Role-Based Access Control**: Standard users receive `USER` role; admin dashboard is strictly guarded for `ADMIN` role.
- **Curated Daily Challenges**: Administrators post daily problems with LeetCode URLs, difficulty tags (Easy/Medium/Hard), DSA topics, and descriptions.
- **Honor-System Manual Completion**: Clean, self-reported daily completion with duplicate prevention and celebratory confetti animations.
- **Accurate Streak Tracking Algorithm**:
  - Consecutive calendar days increment your streak.
  - Active grace period preserves yesterday's streak until midnight if today's challenge is pending.
  - Longest streak tracked across all-time history.
  - Timezone-safe local calendar date handling (`YYYY-MM-DD`).
- **7-Day Weekly Activity Tracker**: Circular visualizers showing your weekly momentum and consistency.
- **Comprehensive Progress Archive**: Filterable history of all completed challenges.
- **Admin Management Console**:
  - Add new daily problems.
  - Schedule problems for future dates.
  - Edit or delete published challenges.
  - URL validator for LeetCode links.
- **Modern Dark Theme Aesthetic**: Inspired by Linear and GitHub with `#09090B` background, `#141418` cards, purple & blue accents, and subtle glowing borders.

---

## 📁 Project Structure

```
DailyCode/
├── public/
│   └── logo.svg                 # Brand SVG logo
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Responsive navigation with user avatar & admin link
│   │   ├── StatCard.jsx         # Metric card with glow hover effect
│   │   ├── DailyChallenge.jsx   # Hero problem card with LeetCode link & completion button
│   │   ├── WeeklyActivity.jsx   # 7-day circular weekly tracker
│   │   ├── EmptyState.jsx       # Elegant unposted state
│   │   ├── ProtectedRoute.jsx   # Auth guard for dashboard & progress
│   │   └── AdminRoute.jsx       # Role guard for admin console
│   ├── pages/
│   │   ├── LandingPage.jsx      # Public landing with Google login & code preview
│   │   ├── Dashboard.jsx        # User dashboard with stats & today's problem
│   │   ├── ProgressPage.jsx     # Full progress history & search filter
│   │   ├── AdminDashboard.jsx   # Problem publisher & manager
│   │   └── NotFound.jsx         # 404 handler
│   ├── context/
│   │   ├── AuthContext.jsx      # Global authentication & user profile state
│   │   └── ToastContext.jsx     # Floating toast notification manager
│   ├── firebase/
│   │   ├── config.js            # Firebase App initialization & check
│   │   ├── auth.js              # Google OAuth provider
│   │   └── firestore.js         # Firestore instance & helpers
│   ├── services/
│   │   ├── problemService.js    # CRUD & subscriptions for challenges
│   │   ├── completionService.js # Daily completion tracking & duplicate prevention
│   │   └── userService.js       # User synchronization & role attribution
│   ├── utils/
│   │   ├── dateUtils.js         # Local date formatting (YYYY-MM-DD) & helpers
│   │   ├── streakCalculator.js  # Streak calculation & grace period engine
│   │   └── leetcodeValidator.js # LeetCode URL verification & slug extraction
│   ├── App.jsx                  # React Router definitions
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Tailwind directives & custom dark variables
├── tests/
│   └── verify-logic.js          # Unit tests for streaks and date logic
├── firestore.rules              # Production Cloud Firestore Security Rules
├── vercel.json                  # Single-Page Application rewrites for Vercel
├── .env.example                 # Environment variable template
└── package.json
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Open `.env` and fill in your Firebase project configuration:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-app
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef

# Comma-separated list of Admin Google email addresses
VITE_ADMIN_EMAILS=your.email@gmail.com
```

> **Note**: Even without setting up Firebase immediately, DailyCode includes a built-in instant local storage simulation so you can explore the entire UI, solve problems, test streak increments, and explore the admin dashboard right away!

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Run Test Suite
```bash
node tests/verify-logic.js
```

---

## 🔒 Firebase Configuration & Security Rules

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it `dailycode`.
3. Under **Build > Authentication**, enable **Google** sign-in method.
4. Add your domain (e.g. `localhost` and your Vercel deployment domain) to **Authorized Domains** in Authentication Settings.

### Step 2: Create Cloud Firestore
1. Under **Build > Firestore Database**, click **Create Database**.
2. Select your closest region and start in **Production Mode**.
3. Go to the **Rules** tab and paste the contents of `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
    }

    function isAuthenticated() {
      return request.auth != null;
    }

    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId 
        && (!('role' in request.resource.data) || request.resource.data.role == 'USER');
      allow update: if isAuthenticated() && (
        (request.auth.uid == userId && 
         (!('role' in request.resource.data) || request.resource.data.role == resource.data.role))
        || isAdmin()
      );
      allow delete: if isAdmin();
    }

    match /problems/{problemDate} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    match /completions/{userId}/days/{completionDate} {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
    }
  }
}
```
4. Click **Publish**.

---

## 🌐 Deploy to Vercel

1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your DailyCode GitHub repository.
4. Set the Framework Preset to **Vite**.
5. Add the environment variables from your `.env` file under **Environment Variables**:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_ADMIN_EMAILS`
6. Click **Deploy**.
7. Once deployed, copy your Vercel domain (e.g., `https://dailycode.vercel.app`) and add it to **Firebase Console > Authentication > Settings > Authorized Domains**.

---

## 🧪 Verification & Scenarios Tested

| Scenario | Expected Behavior | Status |
| :--- | :--- | :---: |
| **New user signs in with Google** | Auto-creates `users/{uid}` with default `USER` role | ✅ Passed |
| **User views today's challenge** | Fetches `problems/{todayDate}`, displays metadata & link | ✅ Passed |
| **Open LeetCode problem** | Opens problem in new tab with `target="_blank"` & `noopener` | ✅ Passed |
| **Mark challenge completed** | Saves atomic record to `completions/{uid}/days/{date}`, fires confetti | ✅ Passed |
| **Duplicate completion prevention** | Firestore subcollection path `/days/{date}` prevents duplicates | ✅ Passed |
| **Consecutive completions** | Current streak increments by 1 day | ✅ Passed |
| **Grace period handling** | Yesterday completed + today pending keeps streak active until midnight | ✅ Passed |
| **Missing a calendar day** | Breaks current streak to 0, preserves all-time longest streak | ✅ Passed |
| **Admin Route Protection** | Non-admins get redirected with access restriction notice | ✅ Passed |
| **Admin Challenge Publisher** | Form validates LeetCode URL, date, and publishes to Firestore | ✅ Passed |
| **Future date scheduling** | Future challenges appear automatically on their target date | ✅ Passed |
| **Mobile responsiveness** | Responsive header, drawer navigation, stacked cards on small screens | ✅ Passed |

---

## 📜 License
MIT License. Built for passionate developers preparing for technical interviews.
