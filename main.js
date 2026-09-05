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

  // 3. ENVIO DO FORMULÁRIO (Google Sheets + Exibe Resultado)
  const form = document.getElementById('diag-form');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const btnSubmit = form.querySelector('button[type="submit"]');
    const textoOriginal = btnSubmit ? btnSubmit.textContent : 'Enviar';
    
    if(btnSubmit) {
      btnSubmit.textContent = 'Calculando...';
      btnSubmit.disabled = true;
    }

    // Coleta dados do formulário
    const formData = new FormData(form);
    const dados = {
      nome: formData.get('nome') || '',
      email: formData.get('email') || '',
      telefone: formData.get('whats') || '',
      nicho: formData.get('nicho') || '',
      leads_mensais: formData.get('leads') || '',
      tempo_resposta_min: formData.get('resposta') || '',
      organizacao: formData.get('crm') || '',
      ticket_medio: formData.get('ticket') || '',
      clientes_perdidos: formData.get('perdidos') || '',
      origem_url: window.location.href
    };

    // Calcula Score (Master Doc §5)
    let score = 0;
    if (dados.tempo_resposta_min === '24h' || dados.tempo_resposta_min === 'nunca') score += 4;
    else if (dados.tempo_resposta_min === '4h') score += 2;
    
    if (dados.organizacao === 'memoria') score += 4;
    else if (dados.organizacao === 'planilha') score += 2;
    
    if (dados.clientes_perdidos === '10' || dados.clientes_perdidos === 'nao_sei') score += 4;
    else if (dados.clientes_perdidos === '3') score += 2;
    
    dados.score = score;

    // Calcula perda financeira (Master Doc §5)
    const leadsPorMes = parseInt(dados.leads_mensais) || 0;
    const ticketMedio = parseFloat(dados.ticket_medio.replace(/\D/g, '')) || 1000;
    
    // Fator de conversão baseado no tempo de resposta
    let fatorPerda = 0.3; // padrão 30%
    if (dados.tempo_resposta_min === 'nunca') fatorPerda = 0.7;
    else if (dados.tempo_resposta_min === '24h') fatorPerda = 0.5;
    else if (dados.tempo_resposta_min === '4h') fatorPerda = 0.3;
    else if (dados.tempo_resposta_min === '1h') fatorPerda = 0.1;
    
    const perdaMensal = leadsPorMes * fatorPerda * ticketMedio;
    dados.perda_mensal = perdaMensal;

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
        nicho: dados.nicho,
        perda: perdaMensal
      });
    }

    // EXIBE O RESULTADO NA TELA (ao invés de ir direto pro WhatsApp)
    exibirResultado(dados);

    // Restaura botão
    if(btnSubmit) {
      btnSubmit.textContent = textoOriginal;
      btnSubmit.disabled = false;
    }
  });

  // Função para exibir resultado na tela
  function exibirResultado(dados) {
    const perdaFmt = dados.perda_mensal.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL', 
      maximumFractionDigits: 0 
    });

    // Determina nível de urgência baseado no score
    let nivelUrgencia = '🟢';
    let mensagemUrgencia = 'Sua operação está organizada, mas dá pra melhorar.';
    
    if (dados.score >= 12) {
      nivelUrgencia = '🔴';
      mensagemUrgencia = 'ALERTA: Você está perdendo dinheiro AGORA.';
    } else if (dados.score >= 8) {
      nivelUrgencia = '';
      mensagemUrgencia = 'Atenção: há vazamentos no seu funil.';
    }

    // Cria HTML do resultado
    const resultadoHTML = `
      <div id="resultado-diagnostico" style="
        background: var(--card-bg);
        border: 2px solid var(--brand-primary);
        border-radius: 16px;
        padding: 2.5rem;
        margin-top: 2rem;
        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        animation: fadeInUp 0.6s ease-out;
      ">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">${nivelUrgencia}</div>
          <h2 style="
            font-family: 'Sora', sans-serif;
            font-weight: 800;
            font-size: 1.75rem;
            color: var(--heading);
            margin: 0 0 0.5rem 0;
          ">${mensagemUrgencia}</h2>
          <p style="color: var(--text-soft); margin: 0;">Score: ${dados.score}/16</p>
        </div>

        <div style="
          background: var(--alert-bg);
          border: 1px solid var(--alert-border);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          margin-bottom: 2rem;
        ">
          <p style="
            color: var(--alert-text);
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0 0 0.5rem 0;
          ">Você está perdendo aproximadamente</p>
          <div style="
            font-family: 'Sora', sans-serif;
            font-size: 3rem;
            font-weight: 800;
            color: var(--brand-cta);
            line-height: 1;
            margin-bottom: 0.5rem;
          ">${perdaFmt}<span style="font-size: 1.2rem; color: var(--alert-text);">/mês</span></div>
          <p style="color: var(--alert-text); font-size: 0.9rem; margin: 0;">
            em leads não acompanhados
          </p>
        </div>

        <div style="margin-bottom: 2rem;">
          <h3 style="font-family: 'Sora', sans-serif; color: var(--heading); margin-bottom: 1rem;">
            O que isso significa:
          </h3>
          <ul style="color: var(--text-body); line-height: 1.8; padding-left: 1.5rem;">
            <li>Com ${dados.leads_mensais} leads/mês e resposta ${dados.tempo_resposta_min === '1h' ? 'rápida' : 'lenta'}, você perde ~${Math.round(dados.leads_mensais * (dados.tempo_resposta_min === 'nunca' ? 0.7 : dados.tempo_resposta_min === '24h' ? 0.5 : 0.3))} clientes por mês</li>
            <li>Usando organização "${dados.organizacao === 'memoria' ? 'memória' : dados.organizacao === 'planilha' ? 'planilha' : 'CRM'}", leads escapam sem acompanhamento</li>
            <li>Em 12 meses, isso representa <strong style="color: var(--brand-cta);">${(dados.perda_mensal * 12).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL', maximumFractionDigits: 0})}</strong> deixados na mesa</li>
          </ul>
        </div>

        <div style="
          background: var(--bg-tint);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        ">
          <p style="color: var(--text-body); margin: 0 0 1rem 0; font-weight: 600;">
            💡 A boa notícia:
          </p>
          <p style="color: var(--text-body); margin: 0;">
            Com a CAPI CRM, você recupera até 90% desses leads. 
            Isso significa <strong style="color: var(--brand-primary);">+${(dados.perda_mensal * 0.9).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL', maximumFractionDigits: 0})}/mês</strong> no seu bolso.
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <button onclick="enviarWhatsAppResultado()" class="btn-primary" style="
            width: 100%;
            padding: 1.25rem;
            font-size: 1.1rem;
            font-weight: 700;
          ">
            🦫 Receber diagnóstico completo no WhatsApp
          </button>
          <button onclick="fecharResultado()" class="btn-secondary" style="
            width: 100%;
            padding: 1rem;
          ">
            Fechar e continuar navegando
          </button>
        </div>

        <p style="
          text-align: center;
          color: var(--text-faint);
          font-size: 0.85rem;
          margin-top: 1.5rem;
          font-style: italic;
        ">
          Usamos números conservadores. A Capi chama você em poucos minutos.
        </p>
      </div>
    `;

    // Insere o resultado após o formulário
    const existingResultado = document.getElementById('resultado-diagnostico');
    if (existingResultado) {
      existingResultado.remove();
    }
    
    form.insertAdjacentHTML('afterend', resultadoHTML);
    
    // Scroll suave até o resultado
    document.getElementById('resultado-diagnostico').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });

    // Armazena dados para usar no WhatsApp
    window.dadosDiagnostico = dados;
  }

  // Função para enviar resultado no WhatsApp (chamada pelo botão)
  window.enviarWhatsAppResultado = function() {
    const dados = window.dadosDiagnostico;
    if (!dados) return;

    const perdaFmt = dados.perda_mensal.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL', 
      maximumFractionDigits: 0 
    });

    const msgWhats = encodeURIComponent(
      `Opa, Capi! Fiz o diagnóstico.\n\n` +
      `Sou ${dados.nome}, trabalho com ${dados.nicho}.\n` +
      `Descobri que tô perdendo ${perdaFmt}/mês \n` +
      `Meu score deu ${dados.score}/16.\n\n` +
      `Bora estancar esse sangramento?`
    );

    window.open(`https://wa.me/${CONFIG.WHATSAPP}?text=${msgWhats}`, '_blank');
    
    // Analytics
    if (typeof umami !== 'undefined') {
      umami.track('whatsapp', { origem: 'resultado_diagnostico' });
    }
  };

  // Função para fechar resultado
  window.fecharResultado = function() {
    const resultado = document.getElementById('resultado-diagnostico');
    if (resultado) {
      resultado.remove();
    }
  };
});

// Lógica do Dark Mode Toggle
const darkToggle = document.getElementById('dark-toggle');
if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('capi-dark-mode', document.body.classList.contains('dark'));
  });
  
  // Restaura preferência ao carregar
  if (localStorage.getItem('capi-dark-mode') === 'true') {
    document.body.classList.add('dark');
  }
}

const params = new URLSearchParams(window.location.search);
if (params.get('perda')) {
  dados.perda_vinda_calculadora = params.get('perda');
}


// Ícone mineiro rotativo no footer
const mineiroIcons = ['💜', '🧀', '☕', '🫘', '', '🐄', '', '🍯', '', '⛏️'];
const mineiroEl = document.getElementById('mineiro-icon');
if (mineiroEl) {
    const randomIcon = mineiroIcons[Math.floor(Math.random() * mineiroIcons.length)];
    mineiroEl.textContent = randomIcon;
}
