/**
 * Unified Quiz Form Logic
 * Handles multi-step lead forms with optimized UX, country-specific phone masks,
 * and currency selection for top 20 countries.
 */

const COUNTRY_DATA = [
  { name: "Brasil", ddi: "+55", currency: "BRL", symbol: "R$", example: "(11) 99999-9999" },
  { name: "EUA", ddi: "+1", currency: "USD", symbol: "$", example: "(555) 000-0000" },
  { name: "Portugal", ddi: "+351", currency: "EUR", symbol: "€", example: "912 345 678" },
  { name: "Japão", ddi: "+81", currency: "JPY", symbol: "¥", example: "090-0000-0000" },
  { name: "Reino Unido", ddi: "+44", currency: "GBP", symbol: "£", example: "07700 900000" },
  { name: "Canadá", ddi: "+1", currency: "CAD", symbol: "$", example: "(555) 000-0000" },
  { name: "Espanha", ddi: "+34", currency: "EUR", symbol: "€", example: "600 000 000" },
  { name: "Alemanha", ddi: "+49", currency: "EUR", symbol: "€", example: "0151 23456789" },
  { name: "Itália", ddi: "+39", currency: "EUR", symbol: "€", example: "333 123 4567" },
  { name: "França", ddi: "+33", currency: "EUR", symbol: "€", example: "06 12 34 56 78" },
  { name: "Suíça", ddi: "+41", currency: "CHF", symbol: "Fr.", example: "079 123 45 67" },
  { name: "Austrália", ddi: "+61", currency: "AUD", symbol: "$", example: "0400 000 000" },
  { name: "Irlanda", ddi: "+353", currency: "EUR", symbol: "€", example: "083 123 4567" },
  { name: "Paraguai", ddi: "+595", currency: "PYG", symbol: "₲", example: "0981 123 456" },
  { name: "Argentina", ddi: "+54", currency: "ARS", symbol: "$", example: "9 11 1234-5678" },
  { name: "Emirados Árabes", ddi: "+971", currency: "AED", symbol: "د.إ", example: "50 123 4567" },
  { name: "Uruguai", ddi: "+598", currency: "UYU", symbol: "$", example: "099 123 456" },
  { name: "Bélgica", ddi: "+32", currency: "EUR", symbol: "€", example: "0470 12 34 56" },
  { name: "Holanda", ddi: "+31", currency: "EUR", symbol: "€", example: "06 12345678" },
  { name: "Chile", ddi: "+56", currency: "CLP", symbol: "$", example: "9 1234 5678" }
];

class UnifiedQuiz {
    constructor(formId, targetModalId) {
        this.form = document.getElementById(formId);
        this.targetModal = targetModalId;
        this.currentStep = 0;
        this.steps = [];
        this.formData = {};
        this.init();
    }

    init() {
        if (!this.form) return;
        this.renderSteps();
        this.setupEventListeners();
        this.updateUI();
    }

    renderSteps() {
        // Clear form
        this.form.innerHTML = '';
        
        // Add Progress Bar
        const progress = document.createElement('div');
        progress.className = 'quiz-progress-wrapper';
        progress.innerHTML = '<div class="quiz-progress-fill" id="quiz-progress-fill"></div>';
        this.form.appendChild(progress);

        // Step 1: Nome
        this.addStep({
            id: 'step-name',
            title: 'Como podemos te chamar?',
            content: `
                <input type="text" class="quiz-input-field" id="quiz-nome" placeholder="Seu nome completo" required>
            `
        });

        // Step 2: E-mail
        this.addStep({
            id: 'step-email',
            title: 'Qual seu melhor e-mail?',
            content: `
                <input type="email" class="quiz-input-field" id="quiz-email" placeholder="seu@email.com" required>
            `
        });

        // Step 3: Localização (Mora no exterior?)
        this.addStep({
            id: 'step-abroad',
            title: 'Você mora no exterior atualmente?',
            choices: [
                { label: 'Não, moro no Brasil', value: 'não' },
                { label: 'Sim, moro fora', value: 'sim' }
            ],
            fieldName: 'mora_exterior'
        });

        // Step 4: País (Conditional if Sim)
        this.addStep({
            id: 'step-country',
            title: 'Em qual país você mora?',
            content: `
                <select class="quiz-input-field" id="quiz-country_select" required>
                    <option value="" disabled selected>Selecione um país</option>
                    ${COUNTRY_DATA.map(c => `<option value="${c.name}" data-ddi="${c.ddi}" data-currency="${c.currency}">${c.name} (${c.ddi})</option>`).join('')}
                    <option value="outro">Outro...</option>
                </select>
                <div id="quiz-country_other_group" class="other-input-group">
                    <input type="text" class="quiz-input-field" id="quiz-country_other" placeholder="Digite o nome do país">
                </div>
            `,
            onEnter: () => {
                const select = document.getElementById('quiz-country_select');
                const otherGroup = document.getElementById('quiz-country_other_group');
                const otherInput = document.getElementById('quiz-country_other');
                select.onchange = () => {
                    this.formData.country_select = select.value;
                    if (select.value === 'outro') {
                        otherGroup.style.display = 'block';
                        otherInput.required = true;
                    } else {
                        otherGroup.style.display = 'none';
                        otherInput.required = false;
                        const selectedOption = select.options[select.selectedIndex];
                        this.formData.ddi = selectedOption.dataset.ddi;
                        this.formData.currency = selectedOption.dataset.currency;
                    }
                };
            }
        });

        // Step 5: WhatsApp
        this.addStep({
            id: 'step-whatsapp',
            title: 'Qual seu WhatsApp?',
            content: `
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <label style="font-size: 0.85rem; color: var(--text-secondary);">Código do País:</label>
                    <select class="quiz-input-field" id="quiz-ddi_select"></select>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <input type="text" class="quiz-input-field" id="quiz-ddi" style="width: 80px;" placeholder="+55">
                    <input type="tel" class="quiz-input-field" id="quiz-phone" style="flex: 1;" placeholder="(00) 00000-0000" required>
                </div>
            `,
            onEnter: () => {
                const select = document.getElementById('quiz-ddi_select');
                const ddiInput = document.getElementById('quiz-ddi');
                const phoneInput = document.getElementById('quiz-phone');
                
                const selectedCountryName = this.formData.country_select === 'outro' ? this.formData.country_other : (this.formData.country_select || this.formData.pais);
                const country = COUNTRY_DATA.find(c => c.name === selectedCountryName) || COUNTRY_DATA[0];

                // Prioritize: Selected -> Brasil -> Others
                const others = COUNTRY_DATA.filter(c => c.name !== country.name && c.name !== 'Brasil');
                const sortedCountries = [country];
                if (country.name !== 'Brasil') sortedCountries.push(COUNTRY_DATA[0]);
                sortedCountries.push(...others);

                select.innerHTML = sortedCountries.map(c => `
                    <option value="${c.ddi}" data-example="${c.example}">${c.name} (${c.ddi})</option>
                `).join('');

                select.onchange = () => {
                    ddiInput.value = select.value;
                    const example = select.options[select.selectedIndex].dataset.example;
                    phoneInput.placeholder = example;
                    this.formData.ddi = select.value;
                };

                // Set initial values
                ddiInput.value = country.ddi;
                phoneInput.placeholder = country.example;
                this.formData.ddi = country.ddi;
            }
        });

        // Step 6: Ocupação
        this.addStep({
            id: 'step-occupation',
            title: 'Qual sua ocupação atual?',
            content: `
                <input type="text" class="quiz-input-field" id="quiz-occupation" required>
            `
        });

        // Step 7: Moeda e Renda
        this.addStep({
            id: 'step-income',
            title: 'Qual sua renda mensal aproximada?',
            content: `
                <div style="margin-bottom: 0.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--gold-primary); font-weight: 600;">Moeda:</label>
                    <select class="quiz-input-field" id="quiz-currency_select"></select>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <input type="text" class="quiz-input-field" id="quiz-income" style="flex: 1;" placeholder="Valor (Ex: 5.000)" required>
                </div>
                <div id="quiz_currency_other_group" class="other-input-group">
                    <input type="text" class="quiz-input-field" id="quiz_currency_other" placeholder="Digite a moeda (Ex: CHF)">
                </div>
            `,
            onEnter: () => {
                const select = document.getElementById('quiz-currency_select');
                const otherGroup = document.getElementById('quiz_currency_other_group');
                const otherInput = document.getElementById('quiz_currency_other');
                
                const selectedCountryName = this.formData.country_select === 'outro' ? this.formData.country_other : (this.formData.country_select || this.formData.pais);
                const country = COUNTRY_DATA.find(c => c.name === selectedCountryName) || COUNTRY_DATA[0];

                // Create unique currencies list
                const uniqueCurrencies = [];
                COUNTRY_DATA.forEach(c => {
                    if (!uniqueCurrencies.find(u => u.name === c.currency)) {
                        uniqueCurrencies.push({ name: c.currency, symbol: c.symbol });
                    }
                });

                // Prioritize: Selected Currency -> BRL -> Others
                const countryCurrency = uniqueCurrencies.find(u => u.name === country.currency);
                const brlCurrency = uniqueCurrencies.find(u => u.name === 'BRL');
                const rest = uniqueCurrencies.filter(u => u.name !== country.currency && u.name !== 'BRL');
                
                const sortedCurrencies = [countryCurrency];
                if (countryCurrency.name !== 'BRL') sortedCurrencies.push(brlCurrency);
                sortedCurrencies.push(...rest);

                select.innerHTML = sortedCurrencies.map(c => `
                    <option value="${c.name}">${c.name} (${c.symbol})</option>
                `).join('') + '<option value="outro">Outra...</option>';

                select.onchange = () => {
                    this.formData.currency_select = select.value;
                    if (select.value === 'outro') {
                        otherGroup.style.display = 'block';
                        otherInput.required = true;
                        otherInput.focus();
                    } else {
                        otherGroup.style.display = 'none';
                        otherInput.required = false;
                    }
                };

                // Initial
                this.formData.currency_select = country.currency;
                otherGroup.style.display = 'none';
            }
        });

        this.steps = Array.from(this.form.querySelectorAll('.quiz-step-container'));
    }

    addStep({ id, title, content, choices, fieldName, onEnter }) {
        const step = document.createElement('div');
        step.className = 'quiz-step-container';
        step.id = id;
        
        let html = `<h3 class="quiz-question-title">${title}</h3>`;
        
        if (choices) {
            html += `<div class="quiz-choice-list">`;
            choices.forEach(c => {
                html += `<div class="quiz-choice-item" data-value="${c.value}" data-field="${fieldName}">${c.label}</div>`;
            });
            html += `</div>`;
        } else {
            html += content;
        }

        html += `
            <div class="quiz-nav-buttons">
                <button type="button" class="quiz-btn quiz-btn-prev">Voltar</button>
                <button type="button" class="quiz-btn quiz-btn-next">Próximo</button>
            </div>
        `;

        step.innerHTML = html;
        step._onEnter = onEnter;
        this.form.appendChild(step);
    }

    setupEventListeners() {
        // Choice clicks
        this.form.addEventListener('click', (e) => {
            if (e.target.classList.contains('quiz-choice-item')) {
                const field = e.target.dataset.field;
                const value = e.target.dataset.value;
                
                if (field) {
                    this.form.querySelectorAll(`.quiz-choice-item[data-field="${field}"]`).forEach(el => el.classList.remove('selected'));
                    e.target.classList.add('selected');
                    this.formData[field] = value;
                    
                    // Solo avançar automaticamente se for um campo de escolha simples
                    setTimeout(() => this.goNext(), 300);
                }
            }

            if (e.target.classList.contains('quiz-btn-next')) {
                this.goNext();
            }

            if (e.target.classList.contains('quiz-btn-prev')) {
                this.goPrev();
            }
        });
    }

    goNext() {
        if (!this.validateCurrentStep()) return;

        // Conditional logic for country
        if (this.steps[this.currentStep].id === 'step-abroad' && this.formData.mora_exterior === 'não') {
            this.formData.pais = 'Brasil';
            this.formData.ddi = '+55';
            this.formData.currency = 'BRL';
            this.currentStep += 2; // Skip step-country
        } else {
            this.currentStep++;
        }

        if (this.currentStep >= this.steps.length) {
            this.submit();
        } else {
            this.updateUI();
        }
    }

    goPrev() {
        if (this.currentStep > 0) {
            if (this.steps[this.currentStep-1].id === 'step-country' && this.formData.mora_exterior === 'não') {
                this.currentStep -= 2;
            } else {
                this.currentStep--;
            }
            this.updateUI();
        }
    }

    validateCurrentStep() {
        const step = this.steps[this.currentStep];
        
        // Check for choices
        const choices = step.querySelectorAll('.quiz-choice-item');
        if (choices.length > 0) {
            const selected = step.querySelector('.quiz-choice-item.selected');
            return !!selected;
        }

        // Check for inputs
        const inputs = step.querySelectorAll('input, select, textarea');
        let valid = true;
        inputs.forEach(input => {
            if (input.required && !input.value) {
                valid = false;
                input.style.borderColor = 'var(--alert-red)';
            } else {
                input.style.borderColor = '';
                // Store data
                const id = input.id.replace('quiz-', '');
                this.formData[id] = input.value;
            }
        });

        return valid;
    }

    updateUI() {
        this.steps.forEach((step, i) => {
            step.classList.toggle('active', i === this.currentStep);
        });

        const progressPct = (this.currentStep / (this.steps.length)) * 100;
        const progressFill = document.getElementById('quiz-progress-fill');
        if (progressFill) progressFill.style.width = `${progressPct}%`;

        // Hide prev button on first step
        const prevBtn = this.steps[this.currentStep]?.querySelector('.quiz-btn-prev');
        if (prevBtn) prevBtn.style.visibility = this.currentStep === 0 ? 'hidden' : 'visible';

        // Run enter hook
        if (this.steps[this.currentStep]?._onEnter) {
            this.steps[this.currentStep]._onEnter();
        }

        // Change "Próximo" to "Enviar" on last step
        const nextBtn = this.steps[this.currentStep]?.querySelector('.quiz-btn-next');
        if (nextBtn && this.currentStep === this.steps.length - 1) {
            nextBtn.innerText = 'Liberar Acesso';
        }
    }

    async submit() {
        const nextBtn = this.steps[this.currentStep - 1]?.querySelector('.quiz-btn-next');
        if (nextBtn) {
            nextBtn.disabled = true;
            nextBtn.innerHTML = '<i class="ph ph-circle-notch ph-spin"></i> Enviando...';
        }

        // Prep data for Supabase
        const finalPais = this.formData.country_select === 'outro' ? this.formData.country_other : this.formData.country_select || this.formData.pais;
        const finalMoeda = this.formData.currency_select === 'outro' ? this.formData.currency_other : this.formData.currency_select || this.formData.currency;
        const finalWhatsApp = `${this.formData.ddi || ''} ${this.formData.phone || ''}`.trim();

        const leadData = {
            nome: this.formData.nome,
            email: this.formData.email,
            whatsapp: finalWhatsApp,
            mora_exterior: this.formData.mora_exterior === 'sim',
            pais: finalPais,
            ocupacao: this.formData.occupation,
            renda: this.formData.income ? `${this.formData.income} ${finalMoeda}` : null,
            moeda: finalMoeda,
            origem: document.title || 'Lead Form'
        };

        if (window.sendLeadToSupabase) {
            await window.sendLeadToSupabase(leadData);
        } else {
            console.warn("sendLeadToSupabase not found");
        }

        // Success message or redirect
        const container = this.steps[this.currentStep - 1];
        container.innerHTML = `
            <div class="text-center" style="padding: 2rem 0;">
                <i class="ph-fill ph-check-circle" style="font-size: 5rem; color: var(--gold-primary); margin-bottom: 2rem;"></i>
                <h3 style="color: #fff;">Sucesso!</h3>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Seus dados foram capturados. Você será redirecionado agora.</p>
            </div>
        `;
        
        const redirectUrl = document.getElementById('toolRedirectUrl')?.value || '../obrigado/index.html';
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1500);
    }
}

// Global initialization helper
window.initUnifiedQuiz = (formId, modalId) => {
    return new UnifiedQuiz(formId, modalId);
};
