# Coleta de Dados do IBGE com Playwright

Este projeto automatiza a coleta de dados de diversos estados brasileiros a partir do site do IBGE, utilizando Playwright para navegação e extração das informações. Os dados coletados são salvos em dois formatos: `dados.json` (JSON) e `dados.xlsx` (planilha Excel).

## O que o projeto faz?

- Acessa o site (https://cidades.ibge.gov.br)
- Pesquisa por cada estado brasileiro
- Coleta indicadores de tópicos como População, Educação, Trabalho e Rendimento, Economia, Território, entre outros
- Salva os resultados em arquivos `dados.json` e `dados.xlsx`

## Como rodar o projeto

### Instalação

1. Clone este repositório ou baixe os arquivos.
2. No terminal, navegue até a pasta do projeto.
3. Instale as dependências:

   ```
   npm install
   ```

### Execução

Execute o teste automatizado com:

```
npx run scraping
```

Ao final, os arquivos `dados.json` e `dados.xlsx` serão gerados na raiz do projeto.

### Relatórios

Após a execução, uma planilha .xlsx estará disponível no arquivo `dados.xlsx`.

## Observações

- O script pode demorar alguns minutos, pois coleta dados de todos os estados.
- Em caso de erro de coleta para algum estado, a mensagem de erro será registrada no arquivo de saída.

---

Projeto desenvolvido para fins de automação e extração de dados públicos do IBGE.
