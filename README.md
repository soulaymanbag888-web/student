# Student - Educational Platform for 3AC Students

A modern digital notebook for 3rd middle school students (3AC) in Morocco, featuring mathematics lessons on equations and systems.

## 🌐 Live Demo

**GitHub Pages URL:** https://soulaymanbag888-web.github.io/student/

## Features

- **Authentication System**
  - Student ID based login (ID: 10806549XX)
  - Email auto-conversion (10806549XX@student.com)
  - Secure Firebase Authentication
  
- **Dashboard**
  - Welcome message with student ID
  - Dark/Light mode toggle
  - Sidebar navigation
  - Quick stats

- **Lessons**
  - **المعادلات (Equations)**: First-degree equations with examples and exercises
  - **النظمات (Systems)**: Linear systems with step-by-step solutions
  
- **Design**
  - Modern, responsive UI
  - Arabic + French content
  - Gradient backgrounds
  - Smooth animations
  - Mobile-friendly

## GitHub Pages Deployment

This project is configured to work with GitHub Pages. All file paths are set to work from the `/student/` subdirectory.

### To Deploy:

1. Push your code to GitHub
2. Go to Repository Settings
3. Select "Pages" from the left menu
4. Under "Branch", select "main" (or your default branch)
5. Click Save
6. Your site will be available at: `https://yourusername.github.io/student/`

## Setup Instructions

### 1. Create Firebase Project

1. Go to Firebase Console (https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication**
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
4. Enable **Firestore Database**
   - Go to Firestore Database > Create database
   - Start in Test Mode

### 2. Get Firebase Configuration

1. Go to Project Settings
2. Scroll to "Your apps"
3. Click the web icon
4. Copy the firebaseConfig object

### 3. Update Firebase Config

Open `js/firebase.js` and replace the placeholder values with your Firebase config.

### 4. Run the Project

Serve via local server (due to ES6 modules):

```
python -m http.server 8000
```

Then open http://localhost:8000

## Project Structure

```
student/
├── index.html          # Login page
├── register.html       # Registration page
├── dashboard.html      # Main dashboard
├── about.html          # About page
├── contact.html        # Contact page
├── lessons/
│   ├── equations.html # Equations lesson
│   └── systeme.html   # Systems lesson
├── css/
│   └── style.css      # All styles
└── js/
    ├── firebase.js    # Firebase config & exports
    ├── auth.js       # Auth functions
    └── guard.js      # Route protection
```

## How Authentication Works

### Registration:
1. Student ID starts with 10806549 (prefix)
2. Student enters last 2 digits
3. Example: 1080654912
4. Auto-converted to email: 1080654912@student.com
5. Password set by student (min 6 characters)
6. Student data stored in Firestore

### Login:
1. Enter full 10-digit ID: 1080654912
2. Enter password
3. ID converted to email internally
4. Firebase Authentication validates

## Theme

The website supports Dark/Light mode. Click the moon/sun icon in the header. Preference saved in localStorage.

## License

This project is for educational purposes.
