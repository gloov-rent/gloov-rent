/* Gloov Rent — interações da landing page */
(function () {
  'use strict';

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

  /* ---------- Formulário de reserva ---------- */
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

  const pad = (n) => String(n).padStart(2, '0');
  const toInput = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

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

  const agora = new Date();
  retirada.min = toInput(agora);
  retirada.value = toInput(proximaRetirada());
  atualizarDevolucao();

  retirada.addEventListener('change', () => { devolucao.min = retirada.value; atualizarDevolucao(); limparErro(); });
  modalidade.addEventListener('change', atualizarDevolucao);
  devolucao.addEventListener('change', limparErro);

  function mostrarErro(msg, campo) {
    erro.textContent = msg;
    erro.hidden = false;
    campo.setAttribute('aria-invalid', 'true');
    campo.focus();
  }
  function limparErro() {
    erro.hidden = true;
    [retirada, devolucao].forEach((c) => c.removeAttribute('aria-invalid'));
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    limparErro();
    if (!retirada.value) return mostrarErro('Escolha a data e o horário de retirada.', retirada);
    if (new Date(retirada.value) < new Date()) return mostrarErro('A retirada precisa ser em uma data futura.', retirada);
    if (!devolucao.value || new Date(devolucao.value) <= new Date(retirada.value)) {
      return mostrarErro('A devolução precisa ser depois da retirada.', devolucao);
    }
    if (!campoModelo.value) {
      // Sem modelo escolhido: leva à lista de modelos.
      // TODO: integrar com a busca de disponibilidade (API).
      document.getElementById('scooters').scrollIntoView({ behavior: 'smooth' });
      return;
    }
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
    campoModelo.value = modelo || '';
    modeloTexto.textContent = modelo ? `Modelo escolhido: ${modelo}` : '';
    modeloEscolhido.hidden = !modelo;
    textoEnviar.textContent = modelo ? 'Continuar reserva' : 'Ver scooters disponíveis';
    iconeEnviar.setAttribute('href', modelo ? '#i-check' : '#i-search');
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
