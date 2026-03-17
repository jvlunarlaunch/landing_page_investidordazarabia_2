/**
 * Integração com Supabase para captura de Leads
 * INSTRUÇÃO IMPORTANTE: Este programa só deve interagir com tabelas que possuam
 * o sufixo "_lpinvestidordazarabia".
 */

const SUPABASE_TABLE = 'leads_lpinvestidordazarabia';

/**
 * Envia os dados para o Supabase
 * @param {Object} data Objeto com os campos da tabela leads_lpinvestidordazarabia
 */
async function sendLeadToSupabase(data) {
    if (!window.supabaseClient) {
        console.warn("[Supabase] Cliente não inicializado. Verifique js/supabase-config.js");
        return null;
    }

    try {
        const { data: result, error } = await window.supabaseClient
            .from(SUPABASE_TABLE)
            .insert([data]);

        if (error) {
            console.error("[Supabase Error]", error.message);
            return null;
        }
        
        console.log("[Supabase] Lead capturado com sucesso!");
        return result;
    } catch (err) {
        console.error("[Supabase Exception]", err);
        return null;
    }
}

// Interceptação automática de formulários conhecidos (Calculadoras e ferramentas específicas)
document.addEventListener('DOMContentLoaded', () => {
    
    // NOTA: Os formulários de captura de leads (leadUnlockForm e popupForm) 
    // agora são gerenciados pelo js/unified-quiz.js para uma experiência multi-step.

    // 3. Calculadoras (Opcional - Captura os parâmetros da simulação)
    const jurosForm = document.getElementById('jurosForm');
    if (jurosForm) {
        jurosForm.addEventListener('submit', async () => {
            const data = {
                origem: 'Calculadora de Juros Compostos',
                detalhes: {
                    patrimonio_inicial: document.getElementById('vInitial')?.value,
                    aporte_mensal: document.getElementById('vMonthly')?.value,
                    taxa: document.getElementById('vRate')?.value,
                    tempo: document.getElementById('vTime')?.value
                }
            };
            await sendLeadToSupabase(data);
        });
    }

    const reservaForm = document.getElementById('reservaForm');
    if (reservaForm) {
        reservaForm.addEventListener('submit', async () => {
            const gastos = [];
            document.querySelectorAll('.expense-val').forEach(input => gastos.push(input.value));
            const data = {
                origem: 'Cálculo de Reserva de Emergência',
                detalhes: {
                    gastos: gastos,
                    perfil: document.getElementById('occupType')?.value,
                    dependentes: document.getElementById('depCount')?.value
                }
            };
            await sendLeadToSupabase(data);
        });
    }
});
