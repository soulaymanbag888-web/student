// Index/Login Page Functionality
// Student Educational Platform

import { 
    auth, 
    onAuthStateChanged,
    signOut,
    doc, 
    getDoc 
} from './firebase.js';

import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// ============================================
// Utility Functions
// ============================================

// Convert student ID to email format
function idToEmail(studentId) {
    return `${studentId}@student.com`;
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
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Already logged in, redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Not logged in, initialize login form
            initLogin();
        }
    });
});
