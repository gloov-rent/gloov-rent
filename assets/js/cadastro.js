/* Gloov Rent — página de cadastro */
(function () {
  'use strict';

  const form = document.getElementById('form-cadastro');
  const status = document.getElementById('status-cadastro');
  const $ = (id) => document.getElementById(id);
  const campos = {
    nome: $('nome'),
    cpf: $('cpf'),
    nascimento: $('nascimento'),
    email: $('email'),
    celular: $('celular'),
    senha: $('senha'),
    confirmar: $('confirmar-senha'),
    termos: $('termos'),
  };

  /* ---------- Mostrar / ocultar senha ---------- */
  document.querySelectorAll('.toggle-senha').forEach((toggle) => {
    const input = $(toggle.getAttribute('aria-controls'));
    toggle.addEventListener('click', () => {
      const mostrar = input.type === 'password';
      input.type = mostrar ? 'text' : 'password';
      toggle.setAttribute('aria-pressed', String(mostrar));
      toggle.querySelector('use').setAttribute('href', mostrar ? '#i-eye-off' : '#i-eye');
      toggle.querySelector('.sr-only').textContent = mostrar ? 'Ocultar senha' : 'Mostrar senha';
    });
  });

  /* ---------- Máscaras ---------- */
  function mascaraCpf(v) {
    return v.replace(/\D/g, '').slice(0, 11)
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2');
  }

  function mascaraCelular(v) {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.replace(/^(\d+)/, '($1');
    if (d.length <= 6) return d.replace(/^(\d{2})(\d+)/, '($1) $2');
    if (d.length <= 10) return d.replace(/^(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
    return d.replace(/^(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
  }

  campos.cpf.addEventListener('input', () => { campos.cpf.value = mascaraCpf(campos.cpf.value); });
  campos.celular.addEventListener('input', () => { campos.celular.value = mascaraCelular(campos.celular.value); });

  /* Data de nascimento: não permite datas futuras no seletor */
  const hoje = new Date();
  campos.nascimento.max = [hoje.getFullYear(), String(hoje.getMonth() + 1).padStart(2, '0'), String(hoje.getDate()).padStart(2, '0')].join('-');

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

  function idade(dataIso) {
    const [a, m, d] = dataIso.split('-').map(Number);
    const hoje = new Date();
    let anos = hoje.getFullYear() - a;
    if (hoje.getMonth() + 1 < m || (hoje.getMonth() + 1 === m && hoje.getDate() < d)) anos--;
    return anos;
  }

  const validar = {
    nome() {
      const v = campos.nome.value.trim();
      if (!v) return 'Informe seu nome completo.';
      if (v.split(/\s+/).length < 2) return 'Informe nome e sobrenome.';
      return '';
    },
    cpf() {
      if (!campos.cpf.value.trim()) return 'Informe seu CPF.';
      return cpfValido(campos.cpf.value) ? '' : 'Confira o CPF digitado.';
    },
    nascimento() {
      const v = campos.nascimento.value;
      if (!v) return 'Informe sua data de nascimento.';
      const anos = idade(v);
      if (anos < 0 || anos > 120) return 'Confira a data digitada.';
      if (anos < 18) return 'É preciso ter 18 anos ou mais para alugar.';
      return '';
    },
    email() {
      const v = campos.email.value.trim();
      if (!v) return 'Informe seu e-mail.';
      return EMAIL.test(v) ? '' : 'Confira o e-mail digitado.';
    },
    celular() {
      const d = campos.celular.value.replace(/\D/g, '');
      if (!d) return 'Informe seu celular.';
      return d.length === 11 && d[2] === '9' ? '' : 'Informe um celular com DDD, ex.: (17) 99999-9999.';
    },
    senha() {
      const v = campos.senha.value;
      if (!v) return 'Crie uma senha.';
      if (v.length < 8) return 'A senha precisa ter pelo menos 8 caracteres.';
      if (!/[a-zA-Z]/.test(v) || !/\d/.test(v)) return 'Use letras e números na senha.';
      return '';
    },
    confirmar() {
      if (!campos.confirmar.value) return 'Repita a senha.';
      return campos.confirmar.value === campos.senha.value ? '' : 'As senhas não conferem.';
    },
    termos() {
      return campos.termos.checked ? '' : 'Aceite os Termos de uso e a Política de privacidade para continuar.';
    },
  };

  function erroDe(campo) {
    const ids = campo.getAttribute('aria-describedby').split(' ');
    return $(ids[ids.length - 1]);
  }

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

  Object.values(campos).forEach((campo) => {
    campo.addEventListener(campo.type === 'checkbox' ? 'change' : 'input', () => limparErro(campo));
  });

  /* Valida ao sair do campo, se ele já foi preenchido */
  Object.entries(campos).forEach(([nome, campo]) => {
    if (campo.type === 'checkbox') return;
    campo.addEventListener('blur', () => {
      if (!campo.value) return;
      const msg = validar[nome]();
      if (msg) mostrarErro(campo, msg);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.hidden = true;

    const erros = Object.entries(campos).map(([nome, campo]) => [campo, validar[nome]()]);
    erros.forEach(([campo, msg]) => (msg ? mostrarErro(campo, msg) : limparErro(campo)));
    const primeiro = erros.find(([, msg]) => msg);
    if (primeiro) { primeiro[0].focus(); return; }

    // TODO: enviar para a API de cadastro e redirecionar para a área do cliente.
    status.textContent = 'O cadastro ainda não está disponível. Em breve você poderá criar sua conta por aqui.';
    status.hidden = false;
  });

  /* ---------- Ano no rodapé ---------- */
  const ano = $('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
