// src/main.js

import { store } from './store.js';
import { ui, currentUser, setCurrentUser, setupUIForRole } from './ui.js';
import { showLoginPage, handleLogin, handleLogout } from './auth.js';
import { navigateTo } from './router.js';
import { navConfig } from './config.js';
import { closeAnimatedModal } from './utils/helpers.js';
import { toggleSidebar } from './ui.js';

export function initializeApp() {
    ui.loginPage.style.display = 'none';
    ui.app.classList.remove('hidden');
    setupUIForRole();

    const roleConfig = navConfig[currentUser.role] || [];
    const defaultPage = roleConfig[0]?.page;

    if (defaultPage) {
        navigateTo(defaultPage);
    } else {
        ui.contentArea.innerHTML = `<p class="text-center p-8">No pages configured for your role.</p>`;
    }
}

export function setupGlobalEventListeners() {
    ui.loginForm.addEventListener('submit', handleLogin);
    ui.logoutButton.addEventListener('click', handleLogout);
    ui.closeModalButton.addEventListener('click', () => closeAnimatedModal(ui.modal));
    ui.confirmNoBtn.addEventListener('click', () => closeAnimatedModal(ui.confirmModal));
    ui.mobileMenuBtn.addEventListener('click', toggleSidebar);
    ui.sidebarOverlay.addEventListener('click', toggleSidebar);

    // This handles browser back/forward buttons correctly
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page) {
            navigateTo(event.state.page);
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Application starting...");
    
    // Initialize the store to an empty state.
    await store.initialize();
    
    const savedUser = sessionStorage.getItem('sms_user_pro');
    const savedToken = sessionStorage.getItem('sms_auth_token');

    // --- FIX: A user is logged in only if BOTH user data AND a token exist ---
    if (savedUser && savedToken) {
        try {
            setCurrentUser(JSON.parse(savedUser));
            initializeApp();
        } catch (e) {
            console.error("Failed to parse saved user data.", e);
            sessionStorage.clear(); // Clear any corrupted data
            showLoginPage();
        }
    } else {
        showLoginPage();
    }

    setupGlobalEventListeners();
});