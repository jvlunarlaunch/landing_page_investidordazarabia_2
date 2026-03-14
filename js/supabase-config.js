// Configuração do Supabase Client
window.SUPABASE_URL = "https://dldsnfzqguoewnyxkxay.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsZHNuZnpxZ3VvZXdueXhreGF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NDEyOTksImV4cCI6MjA2MTAxNzI5OX0.3zsl_E60gN-Gfzv2T1hmYGyS0-xpxmwkPOMquNH1kpY";

if (window.supabase) {
    window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    console.log("[Supabase] Cliente inicializado com sucesso.");
} else {
    console.error("[Supabase] SDK não encontrado. Verifique a inclusão da biblioteca.");
}
