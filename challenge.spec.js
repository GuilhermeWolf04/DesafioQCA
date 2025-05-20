const fs = require('fs');
const { test, expect } = require('@playwright/test');

const { chromium } = require('playwright');


test('Coletar dados do IBGE', async ({ page }) => {


  const estados = [
    'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
    'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
    'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
    'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
    'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
  ];

  const resultados = [];


  for (const estado of estados) {
    try {
      await page.goto('https://cidades.ibge.gov.br/');
      await page.waitForSelector('input[placeholder="O que você procura?"]', { timeout: 10000 });
      await page.getByPlaceholder('O que você procura?').click();
      await page.keyboard.type(estado);
      await page.waitForTimeout(1200);
      await page.locator('.busca__auto-completar__resultado__item').first().click();

      const topicos = {
        'População': [
          'População no último censo',
          'Densidade demográfica',
          'Total de veículos'
        ],
        'Educação': [
          'IDEB – Anos iniciais do ensino fundamental (Rede pública)',
          'IDEB – Anos finais do ensino fundamental (Rede pública)',
          'Matrículas no ensino fundamental',
          'Matrículas no ensino médio',
        ],
        'Trabalho e rendimento': [
          'Rendimento nominal mensal domiciliar per capita',
          'Pessoas de 16 anos ou mais ocupadas na semana de referência',
          'Proporção de pessoas de 16 anos ou mais em trabalho formal, considerando apenas as ocupadas na semana de referência',
          'Proporção de pessoas de 14 anos ou mais de idade, ocupadas na semana de referência em trabalhos formais',
          'Rendimento médio real habitual do trabalho principal das pessoas de 14 anos ou mais de idade, ocupadas na semana de referência em trabalhos formais',
          'Pessoal ocupado na Administração pública, defesa e seguridade social'
        ],
        'Economia': [
          'Índice de Desenvolvimento Humano (IDH)',
          'Total de receitas brutas realizadas',
          'Total de despesas brutas empenhadas',
        ],
        'Território': [
          'Número de municípios',
          'Área da unidade territorial',
          'Área urbanizada'
        ],
        'Saúde': [

        ],
        'Meio Ambiente': [

        ]
      };

      const dados = {};

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);

      for (const [topico, subtopicos] of Object.entries(topicos)) {
        let encontrouAlgum = false;
        dados[topico] = {};
        for (const sub of subtopicos) {
          try {
            const bloco = page.locator(`.indicador:has(.indicador__nome:has-text("${sub}"))`);
            await bloco.first().waitFor({ timeout: 2000 });
            const valor = await bloco.locator('.indicador__valor').first().textContent();
            dados[topico][sub] = valor.trim();
            encontrouAlgum = true;
          } catch {
            dados[topico][sub] = 'Não encontrado';
          }
        }
        if (!encontrouAlgum) {
          dados[topico] = "Tópico não encontrado.";
        }
      }

      resultados.push({ estado, ...dados });
      console.log(`✅ Coletado: ${estado}`);

    } catch (err) {
      console.log(`❌ Erro com ${estado}: ${err.message}`);
      resultados.push({ estado, erro: err.message });
    }
  }

  fs.writeFileSync('dados.json', JSON.stringify(resultados, null, 2), 'utf-8');
  console.log('✅ Dados salvos em dados.json');

  const XLSX = require('xlsx');

  function flatten(obj, prefix = '') {
    return Object.keys(obj).reduce((acc, k) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flatten(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  }

  const dadosFlat = resultados.map(flatten);

  const ws = XLSX.utils.json_to_sheet(dadosFlat);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Dados');
  XLSX.writeFile(wb, 'dados.xlsx');

  console.log('✅ Planilha dados.xlsx gerada!');
});