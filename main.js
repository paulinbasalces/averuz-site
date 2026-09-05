// ============================================
// CAPI CRM - main.js
// Unifica: Máscara, Score, Google Sheets e WhatsApp
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // 1. CONFIGURAÇÕES
  const CONFIG = {
    WEBHOOK_URL: 'https://script.google.com/macros/s/SEU_CODIGO_AQUI/exec', // ⚠️ TROQUE AQUI
    WHATSAPP: '5531984470001'
  };

  // 2. MÁSCARA DE TELEFONE
  const inputWhats = document.getElementById('whats');
  if (inputWhats) {
    inputWhats.addEventListener('input', function (e) {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 7) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
      else if (v.length > 0) v = `(${v}`;
      e.target.value = v;
    });
  }

  // 3. ENVIO DO FORMULÁRIO (Google Sheets + WhatsApp)
  const form = document.getElementById('diag-form');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const btnSubmit = form.querySelector('button[type="submit"]');
    const textoOriginal = btnSubmit ? btnSubmit.textContent : 'Enviar';
    
    if(btnSubmit) {
      btnSubmit.textContent = 'Calculando e enviando...';
      btnSubmit.disabled = true;
    }

    // Coleta dados do formulário
    const formData = new FormData(form);
    const dados = {
      nome: formData.get('nome') || '',
      email: formData.get('email') || '',
      telefone: formData.get('telefone') || '',
      nicho: formData.get('nicho') || '',
      leads_mensais: formData.get('leads') || '',
      tempo_resposta_min: formData.get('resposta') || '',
      organizacao: formData.get('crm') || '',
      ticket_medio: formData.get('ticket') || '',
      clientes_perdidos: formData.get('perdidos') || '',
      origem_url: window.location.href
    };

    // Pega a perda vinda da calculadora (se houver na URL)
    const params = new URLSearchParams(window.location.search);
    if (params.get('perda')) {
      dados.perda_vinda_calculadora = params.get('perda');
    }

    // Calcula Score simples (Master Doc §5)
    let score = 0;
    if (dados.tempo_resposta_min === '24h' || dados.tempo_resposta_min === 'nunca') score += 4;
    else if (dados.tempo_resposta_min === '4h') score += 2;
    
    if (dados.organizacao === 'memoria') score += 4;
    else if (dados.organizacao === 'planilha') score += 2;
    
    if (dados.clientes_perdidos === '10' || dados.clientes_perdidos === 'nao_sei') score += 4;
    else if (dados.clientes_perdidos === '3') score += 2;
    
    dados.score = score;

    // Envia para Google Sheet (Webhook)
    try {
      await fetch(CONFIG.WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    } catch (error) {
      console.warn('Erro ao salvar na Sheet:', error);
    }

    // Analytics (Master Doc §4)
    if (typeof umami !== 'undefined') {
      umami.track('formulario_enviado', { 
        score: dados.score, 
        nicho: dados.nicho 
      });
    }

    // Monta mensagem do WhatsApp (Tom Mineiro Tech)
    const perdaFmt = dados.perda_vinda_calculadora 
      ? parseFloat(dados.perda_vinda_calculadora).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
      : '';
    
    const msgWhats = encodeURIComponent(
      `Opa, Capi! Fiz o diagnóstico. Sou ${dados.nome}, trabalho com ${dados.nicho}. ${perdaFmt ? `Vi na calculadora que tô perdendo uns ${perdaFmt}/mês.` : ''} Meu score deu ${dados.score}. Bora estancar esse sangramento?`
    );

    // Abre WhatsApp
    window.open(`https://wa.me/${CONFIG.WHATSAPP}?text=${msgWhats}`, '_blank');

    // Restaura botão
    if(btnSubmit) {
      btnSubmit.textContent = textoOriginal;
      btnSubmit.disabled = false;
    }
  });
});