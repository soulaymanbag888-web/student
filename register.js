// Register Page Functionality
// Student Educational Platform

import { 
    auth, 
    db, 
    onAuthStateChanged,
    doc, 
    getDoc,
    setDoc 
} from './firebase.js';

import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

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
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location.href = 'dashboard.html';
        } else {
            initRegister();
        }
    });
});
