// === Tema ================================================================
const body = document.body;
const themeToggle = document.querySelector('#theme-toggle');
const themeIcon = themeToggle?.querySelector('i');
const prefersDarkScheme = typeof window.matchMedia === 'function'
  ? window.matchMedia('(prefers-color-scheme: dark)')
  : null;
const THEME_STORAGE_KEY = 'alexarnoni-theme';

let storage = null;
try {
  storage = window.localStorage;
} catch (error) {
  storage = null;
}

let storedTheme = null;
if (storage) {
  storedTheme = storage.getItem(THEME_STORAGE_KEY);
}
let userPreference = storedTheme || null;

function applyTheme(theme, { savePreference = false } = {}) {
  const isDark = theme === 'dark';
  body.classList.toggle('dark-mode', isDark);

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Ativar tema claro' : 'Ativar tema escuro');
  }

  if (themeIcon) {
    themeIcon.classList.toggle('bx-sun', isDark);
    themeIcon.classList.toggle('bx-moon', !isDark);
  }

  if (savePreference) {
    userPreference = theme;
    if (storage) {
      storage.setItem(THEME_STORAGE_KEY, theme);
    }
  }
}

applyTheme(userPreference || (prefersDarkScheme?.matches ? 'dark' : 'light'));

const handleThemeTransitionEnd = event => {
  if (!body.classList.contains('theme-transition')) return;
  if (event.target !== body) return;
  if (event.type === 'transitionend' && event.propertyName !== 'clip-path') return;

  body.classList.remove('theme-transition');
};

body.addEventListener('transitionend', handleThemeTransitionEnd);
body.addEventListener('animationend', handleThemeTransitionEnd);

if (themeToggle) {
  themeToggle.addEventListener('click', event => {
    const rect = themeToggle.getBoundingClientRect();
    const isKeyboardTrigger = event.detail === 0 && event.clientX === 0 && event.clientY === 0;
    const clickX = isKeyboardTrigger ? rect.left + rect.width / 2 : event.clientX;
    const clickY = isKeyboardTrigger ? rect.top + rect.height / 2 : event.clientY;

    body.style.setProperty('--click-x', `${clickX}px`);
    body.style.setProperty('--click-y', `${clickY}px`);

    if (body.classList.contains('theme-transition')) {
      body.classList.remove('theme-transition');
      void body.offsetWidth;
    }

    body.classList.add('theme-transition');

    const nextTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
    applyTheme(nextTheme, { savePreference: true });
  });
}

if (prefersDarkScheme) {
  const preferenceListener = event => {
    if (!userPreference) {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  };

  if (typeof prefersDarkScheme.addEventListener === 'function') {
    prefersDarkScheme.addEventListener('change', preferenceListener);
  } else if (typeof prefersDarkScheme.addListener === 'function') {
    prefersDarkScheme.addListener(preferenceListener);
  }
}

// === Navegação e botão topo =============================================
const sections = Array.from(document.querySelectorAll('main section'));
const navLinks = Array.from(document.querySelectorAll('.navbar a[href^="#"]'));
const btnTopo = document.querySelector('.btn-topo');
const header = document.querySelector('.header');

function handleScroll() {
  if (!sections.length) return;

  const headerOffset = header ? header.offsetHeight + 20 : 100;
  let currentSectionId = sections[0].id || '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - headerOffset;
    if (window.scrollY >= sectionTop) {
      currentSectionId = section.id || currentSectionId;
    }
  });

  navLinks.forEach(link => {
    const target = link.getAttribute('href')?.slice(1);
    link.classList.toggle('active', target === currentSectionId);
  });

  if (btnTopo) {
    btnTopo.classList.toggle('hidden', window.scrollY < 300);
  }
}

window.addEventListener('scroll', handleScroll);
handleScroll();

// === Animações de entrada ===============================================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

sections.forEach(section => observer.observe(section));

// === Menu hambúrguer ====================================================
document.querySelectorAll('.menu-toggle').forEach(toggle => {
  const navLinksEl = toggle.closest('.navbar')?.querySelector('.nav-links');
  if (!navLinksEl) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  toggle.setAttribute('aria-expanded', 'false');

  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinksEl.classList.contains('open')) {
        navLinksEl.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
});

// === Dropdown (Download CV) ============================================
document.querySelectorAll('.dropdown .btn').forEach(btn => {
  const dropdown = btn.closest('.dropdown');
  if (!dropdown) return;

  btn.setAttribute('aria-haspopup', 'true');
  btn.setAttribute('aria-expanded', 'false');

  btn.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();

    const isOpen = dropdown.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));

    document.querySelectorAll('.dropdown').forEach(other => {
      if (other !== dropdown) {
        other.classList.remove('open');
        const otherBtn = other.querySelector('.btn');
        if (otherBtn) {
          otherBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
});

window.addEventListener('click', event => {
  document.querySelectorAll('.dropdown.open').forEach(drop => {
    if (!drop.contains(event.target)) {
      drop.classList.remove('open');
      const btn = drop.querySelector('.btn');
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

window.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.dropdown.open').forEach(drop => {
      drop.classList.remove('open');
      const btn = drop.querySelector('.btn');
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }
});
