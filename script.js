/* ============================================================
   PORTFOLIO – Alexandre Arnoni
   script.js — JavaScript puro (sem frameworks)

   Funcionalidades:
   1. Toggle claro/escuro (persiste no localStorage)
   2. Menu hambúrguer mobile
   3. Scroll spy — destaca link ativo no nav
   4. Header com sombra ao rolar
   5. Botão "voltar ao topo"
   6. Animação de entrada das seções (IntersectionObserver)
   7. Typewriter no hero
   8. Animação das barras de idioma
   9. Validação do formulário de contato + modal de confirmação
   ============================================================ */

/* ---- 1. TOGGLE CLARO / ESCURO ---- */

// Botão de toggle (declarados antes de serem usados)
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');

// Recupera preferência salva no localStorage ou usa preferência do sistema
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

// Aplica o tema ao carregar a página
document.documentElement.setAttribute('data-theme', initialTheme);
updateThemeIcon(initialTheme);

themeToggle.addEventListener('click', () => {
  // Obtém o tema atual e alterna
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next); // persiste no localStorage
  updateThemeIcon(next);
});

// Atualiza o ícone conforme o tema
function updateThemeIcon(theme) {
  if (!themeIcon) return;
  // Ícone: lua = modo claro ativo (clica para escurecer); sol = modo escuro ativo
  themeIcon.className = theme === 'dark' ? 'bx bx-sun' : 'bx bx-moon';
}


/* ---- 2. MENU HAMBÚRGUER MOBILE ---- */

const menuToggle = document.getElementById('menu-toggle');
const navLinks   = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  // Atualiza atributo de acessibilidade
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

// Fecha o menu ao clicar em qualquer link
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Fecha o menu ao clicar fora
document.addEventListener('click', (e) => {
  if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});


/* ---- 3. SCROLL SPY + 4. SOMBRA NO HEADER + 5. BOTÃO TOPO ---- */

const header  = document.getElementById('header');
const btnTopo = document.getElementById('btn-topo');
const allNavLinks = document.querySelectorAll('.nav-link');

// IDs das seções na ordem em que aparecem na página
const sectionIds = ['inicio', 'sobre', 'formacao', 'portfolio', 'contato'];

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // 4. Sombra no header a partir de 10px de scroll
  header.classList.toggle('scrolled', scrollY > 10);

  // 5. Botão "voltar ao topo" aparece após 300px
  if (scrollY > 300) {
    btnTopo.removeAttribute('hidden');
  } else {
    btnTopo.setAttribute('hidden', '');
  }

  // 3. Scroll spy: detecta qual seção está visível
  let current = 'inicio';
  sectionIds.forEach(id => {
    const section = document.getElementById(id);
    if (!section) return;
    // Considera a seção ativa quando o topo dela passa de 80px acima do viewport
    if (scrollY >= section.offsetTop - 100) {
      current = id;
    }
  });

  // Atualiza a classe "active" nos links de navegação
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href'); // ex: "#sobre"
    link.classList.toggle('active', href === `#${current}`);
  });
});

// Botão voltar ao topo: scroll suave até o início
btnTopo.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ---- 6. ANIMAÇÃO DE ENTRADA DAS SEÇÕES ---- */

// IntersectionObserver: adiciona a classe "visible" quando a seção entra na tela
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Para de observar depois de animar (performance)
      sectionObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08  // dispara quando 8% da seção estiver visível
});

// Observa todas as seções
document.querySelectorAll('.section').forEach(section => {
  sectionObserver.observe(section);
});


/* ---- 7. TYPEWRITER NO HERO ---- */

const phrases = [
  'Analista de Dados',
  'Engenheiro de Dados',
  'Python & FastAPI',
  'Power BI & dbt Core',
  'Curioso por natureza'
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
const typeEl    = document.getElementById('typewriter');

function typeWriter() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    // Remove um caractere
    typeEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    // Adiciona um caractere
    typeEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  // Define delay dinâmico
  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === currentPhrase.length) {
    // Pausa no final da frase antes de deletar
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Avança para a próxima frase
    isDeleting  = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(typeWriter, delay);
}

// Inicia o typewriter após 600ms para não competir com o fade-in da página
setTimeout(typeWriter, 600);


/* ---- 8. ANIMAÇÃO DAS BARRAS DE IDIOMA ---- */

// Usa IntersectionObserver para animar as barras somente quando ficarem visíveis
const langObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Dispara a animação CSS (transition: width 1.2s)
      entry.target.querySelectorAll('.lang-fill').forEach(bar => {
        // O atributo style="width:X%" já está no HTML; a transição CSS faz o resto
        // Precisamos "resetar" para 0 e depois aplicar o valor alvo
        const targetWidth = bar.style.width;
        bar.style.width   = '0%';

        // Pequeno delay para o browser renderizar o 0% antes de animar
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            bar.style.width = targetWidth;
          });
        });
      });
      langObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const langSection = document.getElementById('formacao');
if (langSection) langObserver.observe(langSection);


/* ---- 9. VALIDAÇÃO DO FORMULÁRIO + MODAL ---- */

const form        = document.getElementById('contact-form');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose  = document.getElementById('modal-close');
const btnSubmit   = document.getElementById('btn-submit');

// Referências dos campos
const campoNome     = document.getElementById('nome');
const campoEmail    = document.getElementById('email');
const campoMensagem = document.getElementById('mensagem');

// Referências das mensagens de erro
const erroNome     = document.getElementById('erro-nome');
const erroEmail    = document.getElementById('erro-email');
const erroMensagem = document.getElementById('erro-mensagem');

/**
 * Valida um campo e exibe/oculta mensagem de erro.
 * Retorna true se válido.
 */
function validateField(campo, erroEl, mensagemErro) {
  const valor = campo.value.trim();

  if (!valor) {
    // Campo vazio
    campo.classList.add('error');
    erroEl.textContent = mensagemErro;
    return false;
  }

  campo.classList.remove('error');
  erroEl.textContent = '';
  return true;
}

/**
 * Valida o formato do e-mail usando expressão regular.
 * Exemplo válido: usuario@dominio.com
 */
function validateEmail(campo, erroEl) {
  const valor = campo.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!valor) {
    campo.classList.add('error');
    erroEl.textContent = 'O e-mail é obrigatório.';
    return false;
  }

  if (!regex.test(valor)) {
    campo.classList.add('error');
    erroEl.textContent = 'Informe um e-mail válido (ex: usuario@dominio.com).';
    return false;
  }

  campo.classList.remove('error');
  erroEl.textContent = '';
  return true;
}

// Validação em tempo real ao sair do campo (blur)
campoNome.addEventListener('blur', () =>
  validateField(campoNome, erroNome, 'O nome é obrigatório.')
);

campoEmail.addEventListener('blur', () =>
  validateEmail(campoEmail, erroEmail)
);

campoMensagem.addEventListener('blur', () =>
  validateField(campoMensagem, erroMensagem, 'A mensagem é obrigatória.')
);

// Remove erro ao digitar novamente
[campoNome, campoEmail, campoMensagem].forEach(campo => {
  campo.addEventListener('input', () => {
    campo.classList.remove('error');
  });
});

// Envio do formulário
form.addEventListener('submit', (e) => {
  // Impede o envio padrão do navegador (que recarregaria a página)
  e.preventDefault();

  // Executa todas as validações
  const nomeOk     = validateField(campoNome,     erroNome,     'O nome é obrigatório.');
  const emailOk    = validateEmail(campoEmail,    erroEmail);
  const mensagemOk = validateField(campoMensagem, erroMensagem, 'A mensagem é obrigatória.');

  // Se algum campo for inválido, foca o primeiro com erro e para
  if (!nomeOk || !emailOk || !mensagemOk) {
    if (!nomeOk)     campoNome.focus();
    else if (!emailOk) campoEmail.focus();
    else             campoMensagem.focus();
    return;
  }

  // Simula envio: desabilita botão e mostra estado de carregamento
  btnSubmit.disabled    = true;
  btnSubmit.textContent = 'Enviando…';

  // Simula delay de rede (1.5s) e depois exibe modal de confirmação
  setTimeout(() => {
    // Personaliza a mensagem do modal com o nome do usuário
    document.querySelector('.modal p').textContent = `Obrigado pelo contato, ${campoNome.value.trim()}. Responderei em breve.`;

    // Limpa o formulário
    form.reset();

    // Reativa o botão
    btnSubmit.disabled   = false;
    btnSubmit.innerHTML  = '<i class="bx bx-send"></i> Enviar mensagem';

    // Exibe o modal de sucesso
    showModal();
  }, 1500);
});

// Exibe o modal
function showModal() {
  modalOverlay.removeAttribute('hidden');
  // Foca o botão de fechar para acessibilidade
  modalClose.focus();
  // Impede scroll do body enquanto modal está aberto
  document.body.style.overflow = 'hidden';
}

// Fecha o modal
function closeModal() {
  modalOverlay.setAttribute('hidden', '');
  document.body.style.overflow = '';
  btnSubmit.focus();
}

modalClose.addEventListener('click', closeModal);

// Fecha ao clicar fora do modal
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Fecha com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modalOverlay.hasAttribute('hidden')) {
    closeModal();
  }
});
