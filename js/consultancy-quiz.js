document.addEventListener('DOMContentLoaded', function() {
    const quizOverlay = document.getElementById('consultancyQuizOverlay');
    const quizSteps = document.querySelectorAll('.quiz-step');
    const progressBar = document.querySelector('.quiz-progress-bar');
    const btnsNext = document.querySelectorAll('.btn-quiz-next');
    const btnsPrev = document.querySelectorAll('.btn-quiz-prev');
    const quizClose = document.getElementById('quizClose');
    
    let currentStep = 0;
    const formData = {
        origem: 'Consultoria WSWM'
    };

    // Open Quiz on buttons click
    const ctaButtons = document.querySelectorAll('a[href="#contato"], a[href="#"], .btn-primary');
    ctaButtons.forEach(btn => {
        if (btn.innerText.includes('CONSULTOR') || btn.innerText.includes('ANÁLISE')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                openQuiz();
            });
        }
    });

    function openQuiz() {
        quizOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        updateStep();
    }

    function closeQuiz() {
        quizOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    if (quizClose) quizClose.addEventListener('click', closeQuiz);

    function updateStep() {
        quizSteps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });
        
        const progress = ((currentStep) / (quizSteps.length - 1)) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Handle Option Selection
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            const field = parent.dataset.field;
            const value = this.dataset.value;
            formData[field] = value;

            // Simple conditional logic for exterior
            if (field === 'mora_exterior') {
                if (value === 'não') {
                    formData.pais = 'Brasil';
                    // Skip the country step
                    setTimeout(() => {
                        currentStep += 2; 
                        updateStep();
                    }, 300);
                } else {
                    setTimeout(() => nextStep(), 300);
                }
            } else if (!this.classList.contains('no-auto-next')) {
                setTimeout(() => nextStep(), 300);
            }
        });
    });

    function nextStep() {
        if (currentStep < quizSteps.length - 1) {
            currentStep++;
            updateStep();
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            // Handle skipping the country step back
            if (currentStep === 7 && formData.mora_exterior === 'não') {
                currentStep -= 2;
            } else {
                currentStep--;
            }
            updateStep();
        }
    }

    btnsNext.forEach(btn => {
        btn.addEventListener('click', function() {
            const step = quizSteps[currentStep];
            const inputs = step.querySelectorAll('input, textarea, select');
            let valid = true;

            inputs.forEach(input => {
                if (input.required && !input.value) {
                    valid = false;
                    input.style.borderColor = 'var(--alert-red)';
                } else {
                    formData[input.id || input.name] = input.value;
                }
            });

            if (valid) {
                if (currentStep === quizSteps.length - 1) {
                    submitQuiz();
                } else {
                    nextStep();
                }
            }
        });
    });

    btnsPrev.forEach(btn => {
        btn.addEventListener('click', prevStep);
    });

    // Special case for "Outro" country
    const countrySelect = document.getElementById('pais_select');
    const otherCountryGroup = document.getElementById('otherCountryGroup');
    if (countrySelect) {
        countrySelect.addEventListener('change', function() {
            if (this.value === 'outro') {
                otherCountryGroup.style.display = 'block';
                document.getElementById('pais_outro').required = true;
            } else {
                otherCountryGroup.style.display = 'none';
                document.getElementById('pais_outro').required = false;
                formData.pais = this.value;
            }
        });
    }

    async function submitQuiz() {
        const btn = document.querySelector('.btn-submit-quiz');
        if (!btn) return;
        
        btn.disabled = true;
        btn.innerHTML = '<i class="ph-bold ph-circle-notch animate-spin"></i> ENVIANDO...';

        // Final data prep
        let finalPais = formData.pais || 'Brasil';
        if (formData.pais_select && formData.pais_select !== 'outro') finalPais = formData.pais_select;
        if (formData.pais_outro) finalPais = formData.pais_outro;
        
        // Map to table columns
        const leadData = {
            nome: formData.nome,
            whatsapp: formData.whatsapp,
            email: formData.email || '',
            patrimonio: formData.patrimonio,
            renda: formData.renda,
            moeda: formData.moeda,
            idade: formData.idade,
            ocupacao: formData.ocupacao,
            mora_exterior: formData.mora_exterior === 'sim',
            pais: finalPais,
            mensagem: formData.mensagem,
            origem: 'Consultoria WSWM Quiz'
        };

        try {
            if (!window.supabaseClient) {
                throw new Error("Supabase não inicializado.");
            }

            const { data, error } = await window.supabaseClient
                .from('leads_lpinvestidordazarabia')
                .insert([leadData]);

            if (error) throw error;

            // Success
            quizSteps[currentStep].innerHTML = `
                <div class="text-center" style="padding: 2rem 0;">
                    <i class="ph-fill ph-check-circle" style="font-size: 5rem; color: var(--gold-primary); margin-bottom: 2rem;"></i>
                    <h3 style="color: #fff;">Solicitação Enviada!</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 2rem;">Recebemos seus dados. Um de nossos consultores entrará em contato em breve via WhatsApp.</p>
                    <button class="btn-primary" onclick="location.reload()">FECHAR</button>
                </div>
            `;
            progressBar.style.width = '100%';

        } catch (err) {
            console.error("Erro ao enviar lead:", err);
            alert("Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente via WhatsApp.");
            btn.disabled = false;
            btn.innerText = 'TENTAR NOVAMENTE';
        }
    }
});
