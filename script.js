/* =====================================================
   AGRINHO — SUSTENTABILIDADE
   script.js
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAno();
  initHeaderScroll();
  initMenuMobile();
  initFlashcards();
  initFadeInOnScroll();
  initContadores();
  initMenuAtivo();
  initBackToTop();
  initFormulario();
  initSmoothAnchorClose();
});

/* ---------------------------------------------------
   Atualiza o ano no rodapé automaticamente
--------------------------------------------------- */
function initAno() {
  const anoEl = document.getElementById('ano');
  if (anoEl) {
    anoEl.textContent = new Date().getFullYear();
  }
}

/* ---------------------------------------------------
   Header: adiciona sombra/fundo ao rolar a página
--------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ---------------------------------------------------
   Menu mobile (hambúrguer)
--------------------------------------------------- */
function initMenuMobile() {
  const toggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isActive = navLinks.classList.toggle('active');
    toggle.classList.toggle('active');
    toggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  });
}

/* Fecha o menu mobile ao clicar em um link */
function initSmoothAnchorClose() {
  const navLinks = document.getElementById('navLinks');
  const toggle = document.getElementById('menuToggle');
  const links = document.querySelectorAll('.nav-link');

  links.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* ---------------------------------------------------
   Flashcards: vira o card ao clicar ou pressionar Enter
--------------------------------------------------- */
function initFlashcards() {
  const flashcards = document.querySelectorAll('.flashcard');

  flashcards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });

    // Acessibilidade: permite virar com o teclado (Enter ou espaço)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
}

/* ---------------------------------------------------
   Fade-in dos elementos ao rolar a página
   (usa IntersectionObserver para performance)
--------------------------------------------------- */
function initFadeInOnScroll() {
  const elementos = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  elementos.forEach(el => observer.observe(el));
}

/* ---------------------------------------------------
   Efeito de contador animado nas estatísticas
--------------------------------------------------- */
function initContadores() {
  const numeros = document.querySelectorAll('.stat-number');
  if (!numeros.length) return;

  let jaAnimou = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !jaAnimou) {
        jaAnimou = true;
        numeros.forEach(animarContador);
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats');
  if (statsSection) observer.observe(statsSection);
}

function animarContador(elemento) {
  const alvo = parseInt(elemento.getAttribute('data-target'), 10) || 0;
  const duracao = 1600; // milissegundos
  const inicio = performance.now();

  function atualizar(agora) {
    const progresso = Math.min((agora - inicio) / duracao, 1);
    const valorAtual = Math.floor(progresso * alvo);
    elemento.textContent = valorAtual;

    if (progresso < 1) {
      requestAnimationFrame(atualizar);
    } else {
      elemento.textContent = alvo;
    }
  }

  requestAnimationFrame(atualizar);
}

/* ---------------------------------------------------
   Destaca o link do menu conforme a seção visível
--------------------------------------------------- */
function initMenuAtivo() {
  const secoes = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');

  if (!secoes.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        links.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -50% 0px',
    threshold: 0
  });

  secoes.forEach(secao => observer.observe(secao));
}

/* ---------------------------------------------------
   Botão "Voltar ao topo"
--------------------------------------------------- */
function initBackToTop() {
  const botao = document.getElementById('backToTop');
  if (!botao) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      botao.classList.add('visible');
    } else {
      botao.classList.remove('visible');
    }
  });

  botao.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------------------------------------------------
   Validação simples do formulário de contato
--------------------------------------------------- */
function initFormulario() {
  const form = document.getElementById('contatoForm');
  if (!form) return;

  const campoNome = document.getElementById('nome');
  const campoEmail = document.getElementById('email');
  const campoMensagem = document.getElementById('mensagem');

  const erroNome = document.getElementById('erroNome');
  const erroEmail = document.getElementById('erroEmail');
  const erroMensagem = document.getElementById('erroMensagem');

  const mensagemSucesso = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    mensagemSucesso.classList.remove('visible');

    let formularioValido = true;

    // Validação do nome
    if (campoNome.value.trim().length < 3) {
      mostrarErro(campoNome, erroNome, 'Digite um nome com pelo menos 3 letras.');
      formularioValido = false;
    } else {
      limparErro(campoNome, erroNome);
    }

    // Validação do e-mail
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(campoEmail.value.trim())) {
      mostrarErro(campoEmail, erroEmail, 'Digite um e-mail válido.');
      formularioValido = false;
    } else {
      limparErro(campoEmail, erroEmail);
    }

    // Validação da mensagem
    if (campoMensagem.value.trim().length < 10) {
      mostrarErro(campoMensagem, erroMensagem, 'Sua mensagem precisa ter pelo menos 10 caracteres.');
      formularioValido = false;
    } else {
      limparErro(campoMensagem, erroMensagem);
    }

    if (formularioValido) {
      mensagemSucesso.classList.add('visible');
      form.reset();

      // Esconde a mensagem de sucesso após alguns segundos
      setTimeout(() => {
        mensagemSucesso.classList.remove('visible');
      }, 4000);
    }
  });
}

function mostrarErro(campo, elementoErro, mensagem) {
  campo.closest('.form-group').classList.add('error');
  elementoErro.textContent = mensagem;
}

function limparErro(campo, elementoErro) {
  campo.closest('.form-group').classList.remove('error');
  elementoErro.textContent = '';
}
