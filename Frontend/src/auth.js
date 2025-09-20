// src/auth.js

import { ui, currentUser, setCurrentUser } from './ui.js';
import { showConfirmationModal } from './utils/helpers.js';
import { initializeApp } from './main.js';

const API_BASE_URL = 'http://localhost:4051/api';

export function showLoginPage() {
    ui.loginPage.style.display = 'block';
    ui.app.classList.add('hidden');
}

export async function handleLogin(e) {
    e.preventDefault();
    const username = e.target.username.value.trim();
    const password = e.target.password.value;
    ui.loginMessage.textContent = '';
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Signing In...`;

    try {
        const response = await fetch(`${API_BASE_URL}/`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, portal: selectedPortal })
        });
        
        const result = await response.json();
       
        if (result.success && result.token) {
            // --- FIX: Store both the token and user data ---
            sessionStorage.setItem('sms_auth_token', result.token);
            sessionStorage.setItem('sms_user_pro', JSON.stringify(result.user));
            setCurrentUser(result.user);

            document.getElementById('login-form-container').classList.add('hidden');
            document.getElementById('success-username').textContent = result.user.name;
            document.getElementById('login-success-message').classList.remove('hidden');

            setTimeout(initializeApp, 1500); 

        } else {
            ui.loginMessage.textContent = result.message || `Authentication failed.`;
            submitButton.disabled = false;
            submitButton.innerHTML = 'Sign In';
        }
    } catch (error) {
        console.error("Login request failed:", error);
        ui.loginMessage.textContent = 'A network error occurred. Please try again.';
        submitButton.disabled = false;
        submitButton.innerHTML = 'Sign In';
    }
}

export function handleLogout() {
    showConfirmationModal("Are you sure you want to log out?", () => {
        // --- FIX: Clear all session data ---
        setCurrentUser(null);
        sessionStorage.removeItem('sms_user_pro');
        sessionStorage.removeItem('sms_auth_token');
        window.location.reload();
    });
}