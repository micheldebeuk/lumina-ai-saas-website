console.log('Lumina Auth Loaded: v2.0.0 - Ground Up Rebuild');
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Verified Supabase Credentials
const SUPABASE_URL = 'https://cxwxtlrsfgrwdohavtva.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4d3h0bHJzZmdyd2RvaGF2dHZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NDYyODMsImV4cCI6MjA4NzQyMjI4M30.ow09HXr5TLS6ayYHjvJuQQ4TzU4nk_WWOhQVOhjk_j4'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/**
 * Trigger OAuth login for Google
 * @param {('google')} provider 
 */
export async function signIn(provider) {
    console.log(`Starting login flow for: ${provider}`);
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
            redirectTo: window.location.origin
        }
    })

    if (error) {
        console.error('Auth error:', error.message)
        showToast(`Error: ${error.message}`, 'error')
    }
}

export async function signOut() {
    await supabase.auth.signOut()
}

// Session Listener
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth Event:', event)
    if (session) {
        updateNavbarLoggedIn(session.user)
        showToast(`Welcome back, ${session.user.user_metadata.full_name || session.user.email}`, 'success')
    } else {
        updateNavbarLoggedOut()
    }
})

// UI Helper Functions
function updateNavbarLoggedIn(user) {
    const navCta = document.querySelector('.nav-cta');
    if (navCta) {
        navCta.innerHTML = `
            <span class="user-info" style="margin-right: 1.5rem; font-size: 0.9rem; opacity: 0.8;">${user.email}</span>
            <button id="sign-out-btn" class="btn btn-secondary" style="padding: 0.5rem 1.5rem;">Sign Out</button>
        `;
        document.getElementById('sign-out-btn').onclick = signOut;
    }
}

function updateNavbarLoggedOut() {
    const navCta = document.querySelector('.nav-cta');
    if (navCta) {
        navCta.innerHTML = `
            <a href="#" class="btn btn-secondary auth-trigger" data-provider="google">Login</a>
            <a href="#" class="btn btn-primary auth-trigger" data-provider="google" id="hero-cta-btn">Join the Waitlist</a>
        `;
        attachAuthListeners();
    }
}

function attachAuthListeners() {
    document.querySelectorAll('.auth-trigger').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            signIn(btn.dataset.provider);
        };
    });
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `glass-card toast toast-${type} animate-fade-up`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// Initialize listeners on load
window.addEventListener('DOMContentLoaded', () => {
    attachAuthListeners();
});

window.signOut = signOut;
window.signIn = signIn;
