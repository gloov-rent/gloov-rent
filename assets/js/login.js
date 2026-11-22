/* Gloov Rent — página de login */
(function () {
  'use strict';

  const form = document.getElementById('form-login');
  const usuario = document.getElementById('usuario');
  const senha = document.getElementById('senha');
  const lembrar = document.getElementById('lembrar');
  const status = document.getElementById('status-login');
  const toggle = document.querySelector('.toggle-senha');

  if (toggle) {
    toggle.remove();
  }

  const USUARIO_FALSO_EMAIL = 'cliente.teste@gloovrent.com.br';
  const USUARIO_FALSO_CPF = '12345678900';
  const SENHA_FALSA = 'Gloov@2026';
  const EMAIL_ANTIGO_SALVO = 'cliente@gloovrent.com.br';

  /* Dados da conta falsa que serão preenchidos na página de reserva */
  const PERFIL_FALSO = {
    nome: 'Lucas Henrique Mendes',
    cpf: '123.456.789-00',
    nascimento: '1996-08-15',
    email: USUARIO_FALSO_EMAIL,
    whatsapp: '(17) 99123-4567',
    cnhNumero: '04829173650',
    cnhValidade: '2029-10-20'
  };

  /* Evita que um autofill antigo com o e-mail errado fique preso na tela */
  function corrigirAutofillAntigo() {
    if (usuario && usuario.value.trim().toLowerCase() === EMAIL_ANTIGO_SALVO) {
      usuario.value = '';
      if (senha) senha.value = '';
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    corrigirAutofillAntigo();
    setTimeout(corrigirAutofillAntigo, 150);
  });

  window.addEventListener('pageshow', corrigirAutofillAntigo);

  /* ---------- Validação ---------- */
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function cpfValido(valor) {
    const cpf = valor.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    for (let t = 9; t < 11; t++) {
      let soma = 0;
      for (let i = 0; i < t; i++) soma += Number(cpf[i]) * (t + 1 - i);
      if (((soma * 10) % 11) % 10 !== Number(cpf[t])) return false;
    }
    return true;
  }

  function erroDe(campo) {
    return document.getElementById(campo.getAttribute('aria-describedby'));
  }

  function mostrarErro(campo, msg) {
    const el = erroDe(campo);
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    campo.setAttribute('aria-invalid', 'true');
  }

  function limparErro(campo) {
    const el = erroDe(campo);
    if (el) {
      el.textContent = '';
      el.hidden = true;
    }
    campo.removeAttribute('aria-invalid');
  }

  function validarUsuario() {
    const v = usuario.value.trim();
    if (!v) return 'Informe seu e-mail ou CPF.';
    if (v.includes('@')) return EMAIL.test(v) ? '' : 'Confira o e-mail digitado.';
    if (/^[\d.\-\s]+$/.test(v)) return cpfValido(v) ? '' : 'Confira o CPF digitado.';
    return 'Informe um e-mail ou CPF válido.';
  }

  function validarSenha() {
    if (!senha.value) return 'Informe sua senha.';
    if (senha.value.length < 6) return 'A senha tem pelo menos 6 caracteres.';
    return '';
  }

  /* Formata o CPF enquanto digita (só quando o campo tem apenas números) */
  if (usuario) {
    usuario.addEventListener('input', () => {
      limparErro(usuario);
      const v = usuario.value;
      if (v.includes('@') || !/^[\d.\-]*$/.test(v)) return;
      const d = v.replace(/\D/g, '').slice(0, 11);
      usuario.value = d
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1-$2');
    });
  }

  if (senha) {
    senha.addEventListener('input', () => limparErro(senha));
  }

  /* ---------- Envio e login simulado ---------- */
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (status) status.hidden = true;

      const erros = [
        [usuario, validarUsuario()],
        [senha, validarSenha()]
      ];
      erros.forEach(([campo, msg]) => (msg ? mostrarErro(campo, msg) : limparErro(campo)));
      const primeiro = erros.find(([, msg]) => msg);
      if (primeiro) {
        primeiro[0].focus();
        return;
      }

      const valorUsuario = usuario.value.trim();
      const cpfLimpo = valorUsuario.replace(/\D/g, '');
      const valorSenha = senha.value;

      const usuarioValido =
        valorUsuario.toLowerCase() === USUARIO_FALSO_EMAIL.toLowerCase() ||
        (cpfLimpo.length === 11 && cpfLimpo === USUARIO_FALSO_CPF);

      if (usuarioValido && valorSenha === SENHA_FALSA) {
        const sessao = {
          usuario: valorUsuario,
          autenticadoEm: new Date().toISOString(),
          perfil: PERFIL_FALSO,
          padraoReserva: {
            ponto: 'rio-preto',
            modalidade: 'semanal',
            modelosDisponiveis: ['X13', 'Calebito', 'VTX Ventane']
          }
        };

        const storage = lembrar && lembrar.checked ? localStorage : sessionStorage;
        storage.setItem('gloov_sessao_teste', JSON.stringify(sessao));

        if (status) {
          status.textContent = 'Login realizado. Redirecionando para a reserva...';
          status.hidden = false;
        }

        setTimeout(() => {
          window.location.href = 'reserva.html';
        }, 600);
      } else if (status) {
        // TODO: substituir por chamada real à API de autenticação
        status.textContent = 'E-mail/CPF ou senha inválidos para o ambiente de teste.';
        status.hidden = false;
      }
    });
  }

  /* ---------- Ano no rodapé ---------- */
  const ano = document.getElementById('ano');
  if (ano) ano.textContent = String(new Date().getFullYear());
})();