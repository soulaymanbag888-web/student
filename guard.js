// Route Guard - Protect Pages from Unauthorized Access
// Student Educational Platform

import { 
    auth, 
    onAuthStateChanged,
    getCurrentUser 
} from './firebase.js';

// ============================================
// Route Protection
// ============================================

// Check if user is authenticated and redirect if not
function protectRoute() {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe();
            
            if (user) {
                // User is authenticated
                console.log('User authenticated:', user.uid);
                
                // Get student data from Firestore to display welcome message
                try {
                    const { doc, getDoc } = await import('./firebase.js');
                    const { db } = await import('./firebase.js');
                    
                    const studentDoc = await getDoc(doc(db, 'students', user.uid));
                    if (studentDoc.exists()) {
                        const studentData = studentDoc.data();
                        
                        // Update welcome message if element exists
                        const welcomeMessage = document.getElementById('welcomeMessage');
                        if (welcomeMessage) {
                            welcomeMessage.textContent = `مرحباً يا طالب ${studentData.studentId}`;
                        }
                        
                        // Update completed lessons if elements exist
                        const completedLessons = document.getElementById('completedLessons');
                        const totalExercises = document.getElementById('totalExercises');
                        
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
                
                resolve(user);
            } else {
                // User is not authenticated, redirect to login
                console.log('User not authenticated, redirecting to login');
                window.location.href = '../index.html';
                reject(new Error('Not authenticated'));
            }
        });
    });
}

// Initialize route protection on protected pages
document.addEventListener('DOMContentLoaded', async function() {
    const path = window.location.pathname;
    
    // Only apply protection to protected pages
    const isProtectedPage = path.includes('dashboard.html') || 
                           path.includes('lessons/');
    
    if (isProtectedPage) {
        try {
            await protectRoute();
        } catch (error) {
            console.log('Route protection active');
        }
    }
});

// Export for use in other modules
export { protectRoute };
