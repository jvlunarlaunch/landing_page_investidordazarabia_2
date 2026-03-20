/**
 * i18n logic for Investidor Dazarábia
 * Handles language detection, DOM updates and state persistence.
 */

class I18n {
    constructor() {
        this.language = localStorage.getItem('preferredLanguage') || this.getBrowserLanguage() || 'pt';
        this.translations = null;
        this.baseUrl = this.detectBaseUrl();
    }

    async init() {
        try {
            const response = await fetch(`${this.baseUrl}translations.json`);
            this.translations = await response.json();
            this.updateDOM();
            this.updateHtmlLang();
            this.setupSwitchers();
        } catch (error) {
            console.error('Failed to load translations:', error);
        }
    }

    getBrowserLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        return lang.startsWith('pt') ? 'pt' : 'en';
    }

    detectBaseUrl() {
        // Find how many levels deep we are to locate translations.json in root
        const path = window.location.pathname;
        const depth = (path.match(/\//g) || []).length;
        
        // Adjust based on project structure. If it's on a domain root, it's simpler.
        // For local development or subdirectories:
        if (path.includes('/ferramentas/') || path.includes('/consultoriawswm/') || 
            path.includes('/dicionario-do-dinheiro/') || path.includes('/guia-para-imigrantes/') ||
            path.includes('/instagram-stories/') || path.includes('/obrigado/')) {
            return '../';
        }
        return './';
    }

    updateDOM() {
        if (!this.translations || !this.translations[this.language]) return;

        const langData = this.translations[this.language];
        const elements = document.querySelectorAll('[data-i18n]');

        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.getNestedValue(langData, key);

            if (translation) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translation;
                } else if (el.hasAttribute('data-i18n-html')) {
                    el.innerHTML = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });

        // Update active state in switchers
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === this.language);
        });
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((prev, curr) => prev ? prev[curr] : null, obj);
    }

    updateHtmlLang() {
        document.documentElement.lang = this.language === 'pt' ? 'pt-BR' : 'en-US';
    }

    setLanguage(lang) {
        this.language = lang;
        localStorage.setItem('preferredLanguage', lang);
        this.updateDOM();
        this.updateHtmlLang();
    }

    setupSwitchers() {
        // This is called after the switcher is injected or if it already exists
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = btn.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });
    }

    injectSwitcher(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const switcherHtml = `
            <div class="lang-switcher">
                <button class="lang-btn ${this.language === 'pt' ? 'active' : ''}" data-lang="pt">PT</button>
                <button class="lang-btn ${this.language === 'en' ? 'active' : ''}" data-lang="en">EN</button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', switcherHtml);
        this.setupSwitchers();
    }
}

const i18n = new I18n();
document.addEventListener('DOMContentLoaded', () => i18n.init());

window.setLanguage = (lang) => i18n.setLanguage(lang);
