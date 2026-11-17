/* Gloov Rent — página de login */
(function () {
  'use strict';

  const form = document.getElementById('form-login');
  const usuario = document.getElementById('usuario');
  const senha = document.getElementById('senha');
  const status = document.getElementById('status-login');
  const toggle = document.querySelector('.toggle-senha');

  /* ---------- Mostrar / ocultar senha ---------- */
  toggle.addEventListener('click', () => {
    const mostrar = senha.type === 'password';
    senha.type = mostrar ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', String(mostrar));
    toggle.querySelector('use').setAttribute('href', mostrar ? '#i-eye-off' : '#i-eye');
    toggle.querySelector('.sr-only').textContent = mostrar ? 'Ocultar senha' : 'Mostrar senha';
  });

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

  function erroDe(campo) { return document.getElementById(campo.getAttribute('aria-describedby')); }

  function mostrarErro(campo, msg) {
    const el = erroDe(campo);
    el.textContent = msg;
    el.hidden = false;
    campo.setAttribute('aria-invalid', 'true');
  }

  function limparErro(campo) {
    erroDe(campo).hidden = true;
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
  senha.addEventListener('input', () => limparErro(senha));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.hidden = true;

    const erros = [[usuario, validarUsuario()], [senha, validarSenha()]];
    erros.forEach(([campo, msg]) => (msg ? mostrarErro(campo, msg) : limparErro(campo)));
    const primeiro = erros.find(([, msg]) => msg);
    if (primeiro) { primeiro[0].focus(); return; }

    // TODO: enviar para a API de autenticação e redirecionar para a área do cliente.
    status.textContent = 'Login ainda não está disponível. Em breve você poderá acessar sua conta por aqui.';
    status.hidden = false;
  });

  /* ---------- Ano no rodapé ---------- */
  const ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
