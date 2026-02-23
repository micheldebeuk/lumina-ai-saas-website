console.log('Lumina Auth Loaded: v1.1.0 - URL: cxwxtlrsfgrwdohavtva.supabase.co');
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://cxwxtlrsfgrwdohavtva.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_pD3ZGJ2TahwLEYI8F5Qu2w_Uubh-oVv'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/**
 * Trigger OAuth login for Google or Microsoft
 * @param {('google'|'azure')} provider 
 */
export async function signIn(provider) {
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
            <span class="user-info">${user.email}</span>
            <button onclick="signOut()" class="btn btn-secondary btn-sm">Sign Out</button>
        `;
    }
}

function updateNavbarLoggedOut() {
    const navCta = document.querySelector('.nav-cta');
    if (navCta) {
        navCta.innerHTML = `
            <a href="#" class="btn btn-primary auth-trigger" data-provider="google">Sign in with Google</a>
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
