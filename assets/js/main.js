/* Gloov Rent — interações da landing page */
(function () {
  'use strict';

  /* ---------- Catálogo e regras de negócio ---------- */
  const CATALOGO_SCOOTERS = {
    'X13': {
      nome: 'X13',
      categoria: 'Chopper',
      precoSemanal: 200,
      exigeCNH: false
    },
    'Calebito': {
      nome: 'Calebito',
      categoria: 'Urbana',
      precoSemanal: 200,
      exigeCNH: false
    },
    'VTX Ventane': {
      nome: 'VTX Ventane',
      categoria: 'Premium',
      precoSemanal: 350,
      exigeCNH: true
    }
  };

  /* ---------- Menu no celular ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('menu-principal');

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
    toggle.querySelector('.sr-only').textContent = open ? 'Fechar menu' : 'Abrir menu';
  }

  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Link do menu da seção visível ---------- */
  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- Formulário de reserva e prévia ---------- */
  const form = document.getElementById('reserva');
  const retirada = document.getElementById('retirada');
  const devolucao = document.getElementById('devolucao');
  const modalidade = document.getElementById('modalidade');
  const erro = document.getElementById('erro-datas');
  const campoModelo = document.getElementById('campo-modelo');
  const modeloEscolhido = document.getElementById('modelo-escolhido');
  const modeloTexto = document.getElementById('modelo-texto');
  const trocarModelo = document.getElementById('trocar-modelo');
  const botaoEnviar = form.querySelector('.booking-submit');
  const textoEnviar = botaoEnviar.querySelector('.booking-submit-texto');
  const iconeEnviar = botaoEnviar.querySelector('use');
  const DIAS = { semanal: 7, mensal: 30 };

  const previaBox = document.createElement('div');
  previaBox.id = 'previa-reserva';
  previaBox.className = 'booking-preview';
  previaBox.hidden = true;
  previaBox.setAttribute('aria-live', 'polite');
  form.appendChild(previaBox);

  const pad = (n) => String(n).padStart(2, '0');
  const toInput = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
  const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  function proximaRetirada() {
    // amanhã às 10h (horário de abertura da loja)
    const d = addDays(new Date(), 1);
    d.setHours(10, 0, 0, 0);
    return d;
  }

  function atualizarDevolucao() {
    if (!retirada.value) return;
    devolucao.value = toInput(addDays(new Date(retirada.value), DIAS[modalidade.value] || 7));
  }

  function validarHorarioLoja(data, tipo) {
    const diaSemana = data.getDay(); // 0 = Domingo, 6 = Sábado
    const horaDecimal = data.getHours() + data.getMinutes() / 60;

    if (diaSemana === 0) {
      return `A loja não abre aos domingos. Escolha outro dia para a ${tipo}.`;
    }
    if (diaSemana === 6 && (horaDecimal < 9 || horaDecimal > 13)) {
      return `Aos sábados, a ${tipo} deve ocorrer entre 09:00 e 13:00.`;
    }
    if (diaSemana >= 1 && diaSemana <= 5 && (horaDecimal < 9 || horaDecimal > 18)) {
      return `De segunda a sexta, a ${tipo} deve ocorrer entre 09:00 e 18:00.`;
    }
    return null;
  }

  function mostrarErro(msg, campo) {
    erro.textContent = msg;
    erro.hidden = false;
    previaBox.hidden = true;
    if (campo) {
      campo.setAttribute('aria-invalid', 'true');
      campo.focus();
    }
  }

  function limparErro() {
    erro.hidden = true;
    erro.textContent = '';
    [retirada, devolucao].forEach((c) => c.removeAttribute('aria-invalid'));
  }

  function obterPeriodoValido() {
    limparErro();
    if (!retirada.value) {
      mostrarErro('Escolha a data e o horário de retirada.', retirada);
      return null;
    }
    const dataRet = new Date(retirada.value);
    if (dataRet < new Date()) {
      mostrarErro('A retirada precisa ser em uma data futura.', retirada);
      return null;
    }
    const erroRet = validarHorarioLoja(dataRet, 'retirada');
    if (erroRet) {
      mostrarErro(erroRet, retirada);
      return null;
    }

    if (!devolucao.value) {
      mostrarErro('Escolha a data e o horário de devolução.', devolucao);
      return null;
    }
    const dataDev = new Date(devolucao.value);
    if (dataDev <= dataRet) {
      mostrarErro('A devolução precisa ser depois da retirada.', devolucao);
      return null;
    }
    const erroDev = validarHorarioLoja(dataDev, 'devolução');
    if (erroDev) {
      mostrarErro(erroDev, devolucao);
      return null;
    }

    const diffDias = (dataDev - dataRet) / (1000 * 60 * 60 * 24);
    if (diffDias < 7) {
      mostrarErro('O período mínimo de locação é de 7 dias (plano semanal).', devolucao);
      return null;
    }

    return { retirada: dataRet, devolucao: dataDev, diffDias };
  }

  function calcularPrevia() {
    const scooter = CATALOGO_SCOOTERS[campoModelo.value];
    if (!scooter) {
      previaBox.hidden = true;
      return;
    }

    const periodo = obterPeriodoValido();
    if (!periodo) return;

    const totalDias = Math.ceil(periodo.diffDias);
    let valorAluguel = 0;
    let detalhePlano = '';

    if (modalidade.value === 'mensal') {
      const meses = Math.max(1, Math.ceil(totalDias / 30));
      const valorMensalComDesconto = scooter.precoSemanal * 4 * 0.75;
      valorAluguel = valorMensalComDesconto * meses;
      detalhePlano = `${meses} mês(es) · 25% de desconto aplicado`;
    } else {
      const semanas = Math.max(1, Math.ceil(totalDias / 7));
      valorAluguel = scooter.precoSemanal * semanas;
      detalhePlano = `${semanas} semana(s) (${totalDias} dias)`;
    }

    const valorCaucao = valorAluguel * 0.5;
    const totalRetirada = valorAluguel + valorCaucao;

    previaBox.innerHTML = `
      <div style="margin-top: 1rem; padding: 1rem; border-radius: 8px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2);">
        <strong>Prévia da Reserva — ${scooter.nome}</strong>
        <p style="margin: 0.25rem 0; font-size: 0.9rem;">
          Plano ${modalidade.value === 'mensal' ? 'Mensal' : 'Semanal'} (${detalhePlano})
        </p>
        <ul style="list-style: none; padding: 0; margin: 0.5rem 0; font-size: 0.95rem;">
          <li>Aluguel: <strong>${formatarMoeda(valorAluguel)}</strong></li>
          <li>Caução reembolsável (50%): <strong>${formatarMoeda(valorCaucao)}</strong></li>
          <li style="margin-top: 0.35rem; padding-top: 0.35rem; border-top: 1px solid rgba(255,255,255,0.15);">
            Total estimado na retirada: <strong>${formatarMoeda(totalRetirada)}</strong>
          </li>
        </ul>
        <small style="display: block; opacity: 0.85;">
          ${scooter.exigeCNH ? '⚠️ Este modelo exige CNH categoria A.' : '✅ Não exige CNH (necessário ter 18+ anos e documento com foto).'}
        </small>
      </div>
    `;
    previaBox.hidden = false;
  }

  const agora = new Date();
  retirada.min = toInput(agora);
  retirada.value = toInput(proximaRetirada());
  atualizarDevolucao();

  retirada.addEventListener('change', () => {
    devolucao.min = retirada.value;
    atualizarDevolucao();
    calcularPrevia();
  });

  modalidade.addEventListener('change', () => {
    atualizarDevolucao();
    calcularPrevia();
  });

  devolucao.addEventListener('change', () => {
    calcularPrevia();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const periodo = obterPeriodoValido();
    if (!periodo) return;

    if (!campoModelo.value) {
      // Sem modelo escolhido: leva à lista de modelos.
      // TODO: integrar com a busca de disponibilidade (API).
      document.getElementById('scooters').scrollIntoView({ behavior: 'smooth' });
      return;
    }

    calcularPrevia();

    // Com modelo escolhido: guarda a reserva e segue para o login.
    // TODO: enviar a reserva para a API quando o back-end existir.
    const reserva = {
      modelo: campoModelo.value,
      ponto: form.ponto.value,
      retirada: retirada.value,
      devolucao: devolucao.value,
      modalidade: modalidade.value,
    };
    try { sessionStorage.setItem('gloov-reserva', JSON.stringify(reserva)); } catch (_) { /* armazenamento indisponível */ }
    window.location.href = 'login.html';
  });

  /* Botões "Reservar" dos cards preenchem o modelo e voltam ao formulário */
  function definirModelo(modelo) {
    const scooter = CATALOGO_SCOOTERS[modelo];
    campoModelo.value = scooter ? scooter.nome : '';
    modeloTexto.textContent = scooter
      ? `Modelo escolhido: ${scooter.nome} (${scooter.categoria})`
      : '';
    modeloEscolhido.hidden = !scooter;
    textoEnviar.textContent = scooter ? 'Continuar reserva' : 'Ver scooters disponíveis';
    iconeEnviar.setAttribute('href', scooter ? '#i-check' : '#i-search');
    calcularPrevia();
  }

  document.querySelectorAll('[data-modelo]').forEach((btn) => {
    btn.addEventListener('click', () => {
      definirModelo(btn.dataset.modelo);
      setTimeout(() => retirada.focus({ preventScroll: true }), 400);
    });
  });

  trocarModelo.addEventListener('click', () => {
    definirModelo('');
    document.getElementById('scooters').scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- Ano no rodapé ---------- */
  const ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();