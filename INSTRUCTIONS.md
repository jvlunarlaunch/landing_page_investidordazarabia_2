# Instruções para o Agente de IA

Neste projeto, todas as interações com o banco de dados (Supabase) devem seguir estritamente as seguintes regras:

1. **Sufixo Obrigatório:** O programa/agente só deve interagir com tabelas ou recursos que possuam o sufixo `_lpinvestidordazarabia`.
2. **Exemplo:** Se precisar criar uma nova tabela de configurações, o nome deve ser `config_lpinvestidordazarabia`.
3. **Escopo:** Evitar qualquer alteração ou leitura de tabelas que não sigam este padrão de nomenclatura.
