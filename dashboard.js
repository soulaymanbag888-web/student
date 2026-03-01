// Dashboard Page Functionality
// Student Educational Platform

import { 
    auth, 
    db, 
    onAuthStateChanged,
    signOut,
    doc, 
    getDoc 
} from './firebase.js';

import { protectRoute } from './guard.js';

// ============================================
// Theme Toggle Functionality
// ============================================

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.querySelector('i').classList.remove('fa-moon');
        themeToggle.querySelector('i').classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', function() {
        const html = document.documentElement;
        const icon = this.querySelector('i');
        
        if (html.getAttribute('data-theme') === 'dark') {
            html.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });
}

// ============================================
// Mobile Menu Toggle
// ============================================

function initMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (!menuToggle || !sidebar) return;

    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}

// ============================================
// Logout Functionality
// ============================================

function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', async function() {
        try {
            await signOut(auth);
            console.log('User signed out');
            window.location.href = '../index.html';
        } catch (error) {
            console.error('Logout error:', error);
        }
    });
}

// ============================================
// Load Student Data
// ============================================

async function loadStudentData() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const completedLessons = document.getElementById('completedLessons');
    const totalExercises = document.getElementById('totalExercises');

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const studentDoc = await getDoc(doc(db, 'students', user.uid));
                if (studentDoc.exists()) {
                    const studentData = studentDoc.data();
                    
                    // Update welcome message if element exists
                    if (welcomeMessage) {
                        welcomeMessage.textContent = `مرحباً يا طالب ${studentData.studentId}`;
                    }
                    
                    // Update completed lessons if elements exist
                    if (completedLessons) {
                        completedLessons.textContent = studentData.completedLessons || 0;
                    }
                    if (totalExercises) {
                        totalExercises.textContent = studentData.completedExercises || 0;
                    }
                }
            } catch (error) {
                console.log('Could not fetch student data:', error);
            }
        }
    });
}

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', async function() {
    // Protect this route
    try {
        await protectRoute();
    } catch (error) {
        console.log('Route protection active');
    }

    // Initialize components
    initThemeToggle();
    initMenuToggle();
    initLogout();
    loadStudentData();
});
