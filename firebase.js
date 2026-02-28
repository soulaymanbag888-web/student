// Firebase Configuration and Initialization
// Student Educational Platform - Firebase v9+ Modular SDK

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged,
    signOut 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc,
    collection,
    query,
    where,
    getCountFromServer
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// ============================================
// Firebase Configuration
// ============================================
// IMPORTANT: Replace these values with your own Firebase project configuration
// Get these values from: Firebase Console > Project Settings > General > Your apps

const firebaseConfig = {
    apiKey: "AIzaSyAF3n-ygZe72fSD5nUYNT78GFJVuOmMGGQ",
    authDomain: "shop-505a6.firebaseapp.com",
    projectId: "shop-505a6",
    storageBucket: "shop-505a6.firebasestorage.app",
    messagingSenderId: "90621386598",
      measurementId: "G-SJXS50TJV2",
    appId: "1:90621386598:web:499c6edf17211d0893b2a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export Firebase services for use in other modules
export { 
    auth, 
    db,
    onAuthStateChanged,
    signOut,
    doc,
    getDoc,
    setDoc,
    collection,
    query,
    where,
    getCountFromServer
};

// Helper function to check if user is authenticated
export function isAuthenticated() {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(!!user);
        });
    });
}

// Get current user
export function getCurrentUser() {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
}
