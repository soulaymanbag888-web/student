// Authentication Functions
// Student Educational Platform

import { 
    auth, 
    db, 
    onAuthStateChanged,
    signOut,
    doc, 
    getDoc, 
    setDoc 
} from './firebase.js';

import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// ============================================
// Utility Functions
// ============================================

// Convert student ID to email format
function idToEmail(studentId) {
    return `${studentId}@student.com`;
}

// Get student ID from email
function emailToId(email) {
    return email.split('@')[0];
}

// Show error message
function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
    }
}

// Hide error message
function hideError(elementId) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.classList.remove('show');
    }
}

// Show success message
function showSuccess(elementId, message) {
    const successEl = document.getElementById(elementId);
    if (successEl) {
        successEl.textContent = message;
        successEl.classList.add('show');
    }
}

// Hide success message
function hideSuccess(elementId) {
    const successEl = document.getElementById(elementId);
    if (successEl) {
        successEl.classList.remove('show');
    }
}

// ============================================
// Login Functionality
// ============================================

function initLogin() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    // Password toggle
    const toggleButtons = loginForm.querySelectorAll('.toggle-password');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        hideError('loginError');

        const studentId = document.getElementById('studentId').value.trim();
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        // Validate input
        if (!studentId || studentId.length !== 10) {
            showError('loginError', 'يرجى إدخال رقم الطالب الصحيح (10 أرقام)');
            return;
        }

        if (!password) {
            showError('loginError', 'يرجى إدخال كلمة المرور');
            return;
        }

        // Disable button during login
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>جاري التحقق...</span><i class="fas fa-spinner fa-spin"></i>';

        try {
            const email = idToEmail(studentId);
            console.log('Attempting login with:', email);

            // Sign in with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log('Login successful:', user.uid);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';

        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'حدث خطأ أثناء تسجيل الدخول';
            
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'البريد الإلكتروني غير صالح';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'تم تعطيل هذا الحساب';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'رقم الطالب غير موجود';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'كلمة المرور غير صحيحة';
                    break;
                case 'auth/invalid-credential':
                    errorMessage = 'رقم الطالب أو كلمة المرور غير صحيحة';
                    break;
                default:
                    errorMessage = 'فشل تسجيل الدخول: ' + error.message;
            }
            
            showError('loginError', errorMessage);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>تسجيل الدخول</span><i class="fas fa-sign-in-alt"></i>';
        }
    });
}

// ============================================
// Register Functionality
// ============================================

function initRegister() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    const studentIdSuffix = document.getElementById('studentIdSuffix');
    const fullStudentId = document.getElementById('fullStudentId');
    const prefix = '10806549';

    // Auto-generate full student ID
    studentIdSuffix.addEventListener('input', function() {
        const suffix = this.value.replace(/\D/g, ''); // Only digits
        this.value = suffix;
        fullStudentId.value = prefix + suffix;
    });

    // Password toggle
    const toggleButtons = registerForm.querySelectorAll('.toggle-password');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        hideError('registerError');
        hideSuccess('registerSuccess');

        const studentId = fullStudentId.value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const submitBtn = registerForm.querySelector('button[type="submit"]');

        // Validate input
        if (!studentId || studentId.length !== 10) {
            showError('registerError', 'يرجى إدخال رقم الطالب الصحيح (10 أرقام)');
            return;
        }

        if (!password || password.length < 6) {
            showError('registerError', 'يجب أن تكون كلمة المرور 6 أحرف على الأقل');
            return;
        }

        if (password !== confirmPassword) {
            showError('registerError', 'كلمات المرور غير متطابقة');
            return;
        }

        // Disable button during registration
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>جاري إنشاء الحساب...</span><i class="fas fa-spinner fa-spin"></i>';

        try {
            const email = idToEmail(studentId);
            console.log('Attempting registration with:', email);

            // Create user with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log('Registration successful:', user.uid);

            // Store student data in Firestore
            await setDoc(doc(db, 'students', user.uid), {
                studentId: studentId,
                email: email,
                createdAt: new Date().toISOString(),
                completedLessons: 0,
                completedExercises: 0
            });

            console.log('Student data saved to Firestore');
            
            // Show success message
            showSuccess('registerSuccess', 'تم إنشاء حسابك بنجاح! جاري التوجيه...');
            
            // Redirect to dashboard after short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);

        } catch (error) {
            console.error('Registration error:', error);
            let errorMessage = 'حدث خطأ أثناء إنشاء الحساب';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'رقم الطالب مسجل بالفعل';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'البريد الإلكتروني غير صالح';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'كلمة المرور ضعيفة جداً';
                    break;
                case 'auth operation-not-allowed':
                    errorMessage = 'التسجيل غير مسموح به';
                    break;
                default:
                    errorMessage = 'فشل إنشاء الحساب: ' + error.message;
            }
            
            showError('registerError', errorMessage);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>إنشاء حساب</span><i class="fas fa-user-plus"></i>';
        }
    });
}

// ============================================
// Dashboard Functionality
// ============================================

function initDashboard() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
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

    // Menu toggle for mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
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

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
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
}

// ============================================
// Auth State Listener & Initialization
// ============================================

// Initialize based on current page
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        // Check if already logged in
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Already logged in, redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                initLogin();
            }
        });
    } else if (path.includes('register.html')) {
        // Check if already logged in
        onAuthStateChanged(auth, (user) => {
            if (user) {
                window.location.href = 'dashboard.html';
            } else {
                initRegister();
            }
        });
    } else if (path.includes('dashboard.html') || path.includes('lessons/')) {
        // Protected pages - guard.js will handle this
        initDashboard();
    }
});

// Export functions for use in guard.js
export { idToEmail, emailToId };
