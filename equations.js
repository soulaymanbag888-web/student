// Equations Lesson Page Functionality
// Student Educational Platform

import { protectRoute } from './guard.js';

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

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

function initMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (!menuToggle || !sidebar) return;

    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });

    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}

function checkAnswer(exerciseId, correctAnswer) {
    const input = document.getElementById(exerciseId + '-answer');
    const resultDiv = document.getElementById(exerciseId + '-result');
    const userAnswer = parseFloat(input.value);
    
    if (userAnswer === correctAnswer) {
        resultDiv.innerHTML = '<i class="fas fa-check-circle"></i> إجابة صحيحة!';
        resultDiv.className = 'exercise-result correct';
    } else {
        resultDiv.innerHTML = '<i class="fas fa-times-circle"></i> إجابة خاطئة، حاول مرة أخرى';
        resultDiv.className = 'exercise-result incorrect';
    }
}

// Make checkAnswer available globally for inline onclick handlers
window.checkAnswer = checkAnswer;

document.addEventListener('DOMContentLoaded', async function() {
    try {
        await protectRoute();
    } catch (error) {
        console.log('Route protection active');
    }

    initThemeToggle();
    initMenuToggle();
});
