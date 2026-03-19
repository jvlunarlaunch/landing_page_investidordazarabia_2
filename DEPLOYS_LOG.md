# Log de Correções no Deploy (FTP) - Março/2026

Este arquivo descreve as correções efetuadas no processo de deploy via GitHub Actions para resolver os erros de autenticação e diretórios inexistentes.

## ✅ Problemas Resolvidos
1.  **Erro `550 /dicionariododinheiro: No such file or directory`:**
    *   **Causa:** A secret `FTP_DIRECTORY` no GitHub estava apontando para um caminho inadequado ou inexistente no servidor.
    *   **Solução:** Alteramos o `server-dir` no `deploy.yml` para `./` (raiz), ignorando a secret problemática.
2.  **Mismatches de Nomes de Pastas:**
    *   **Causa:** Confusão entre nomes como `dicionario-do-dinheiro` (com hifens) e `dicionariododinheiro` (sem hifens).
    *   **Solução:** Revertemos todos os nomes de pastas para o padrão original com hifens, garantindo consistência com os links no `index.html`.
3.  **Falha de Sincronização (Sync Mode):**
    *   **Causa:** A action de FTP tentava limpar (RMD/DELE) pastas antigas que já não existiam mais, gerando erros 550 fatais.
    *   **Solução:** Adicionamos uma lista de `exclude` no `deploy.yml` para os nomes antigos (`dicionariododinheiro` e `guiadeinvestimentos`), evitando que o script tente interagir com esses fantasmas no servidor.

## ⚙️ Configuração Atual do Workflow (`.github/workflows/deploy.yml`)
```yaml
      - name: FTP Deploy
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          protocol: ftp
          port: 21
          local-dir: ./
          server-dir: ./
          exclude: |
            **/.*
            **/.*/**
            dicionariododinheiro/**
            guiadeinvestimentos/**
            supabase/**
          timeout: 600000
```

## 📝 Observações Importantes
- Se você criar uma nova página em uma pasta com hifens, verifique se a pasta correspondente no servidor FTP já existe ou se o usuário FTP tem permissões para criar novos diretórios.
- Se o deploy travar com **Timeout**, considere verificar se o gateway do servidor FTP está bloqueando a porta 21 (FTP passivo/ativo) ou a porta 22 (SFTP). Atualmente, a porta 21 está funcionando.
