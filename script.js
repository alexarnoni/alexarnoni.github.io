// === THEME: clona container claro para dark e configura toggle ===
const container = document.querySelector('.container');
const cloneContainer = container.cloneNode(true);
cloneContainer.id = 'dark-container';
document.body.appendChild(cloneContainer);
cloneContainer.classList.remove('active');

// Sincroniza imagem (se necessário)
const homeImgSrc = container.querySelector('.home-img img')?.getAttribute('src');
const darkContainerImg = cloneContainer.querySelector('.home-img img');
if (homeImgSrc && darkContainerImg) darkContainerImg.setAttribute('src', homeImgSrc);

const toggleIcons = document.querySelectorAll('.toggle-icon');
const iconEls = document.querySelectorAll('.toggle-icon i');
const darkContainer = document.querySelector('#dark-container');

toggleIcons.forEach(toggle => {
  toggle.addEventListener('click', () => {
    toggle.classList.add('disabled');
    setTimeout(() => toggle.classList.remove('disabled'), 1500);

    iconEls.forEach(icon => icon.classList.toggle('bx-sun'));
    container.classList.toggle('active');
    darkContainer.classList.toggle('active');
  });
});

// Ativa dark-mode por padrão (opcional)
document.querySelector('#container').classList.remove('active');
document.querySelector('#dark-container').classList.add('active');

// === NAV: scroll spy + botão topo (usa sempre o container ATIVO) ===
function getActiveContainer() {
  return document.querySelector('#dark-container.active') || document.querySelector('#container.active');
}

function handleScroll() {
  const active = getActiveContainer();
  if (!active) return;

  const sections = active.querySelectorAll('section');
  const navLinks = active.querySelectorAll('.navbar a');
  const btnTopo = active.querySelector('.btn-topo');

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });

  if (btnTopo) {
    if (window.scrollY > 300) btnTopo.classList.remove('hidden');
    else btnTopo.classList.add('hidden');
  }
}

window.addEventListener('scroll', handleScroll);
handleScroll(); // inicial

// === Fade-in animation com IntersectionObserver (observa os dois containers) ===
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => observer.observe(section));

// === Menu hambúrguer (claro e escuro) ===
document.querySelectorAll('.menu-toggle').forEach(toggle => {
  const navLinks = toggle.closest('.navbar')?.querySelector('.nav-links');
  if (!navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  toggle.setAttribute('aria-expanded', 'false');

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
});

// === DROPDOWN (Download CV): hover no desktop + clique no mobile ===
// CSS já abre no :hover; aqui tratamos clique/touch, acessibilidade e fechar fora.
document.querySelectorAll('.dropdown .btn').forEach(btn => {
  const dropdown = btn.closest('.dropdown');
  if (!dropdown) return;

  // Acessibilidade
  btn.setAttribute('aria-haspopup', 'true');
  btn.setAttribute('aria-expanded', 'false');

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isOpen = dropdown.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));

    // Fecha outros dropdowns
    document.querySelectorAll('.dropdown').forEach(other => {
      if (other !== dropdown) {
        other.classList.remove('open');
        const otherBtn = other.querySelector('.btn');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });
});

// Fecha dropdown ao clicar fora
window.addEventListener('click', (e) => {
  document.querySelectorAll('.dropdown.open').forEach(drop => {
    if (!drop.contains(e.target)) {
      drop.classList.remove('open');
      const btn = drop.querySelector('.btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  });
});

// Fecha dropdown com ESC
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.dropdown.open').forEach(drop => {
      drop.classList.remove('open');
      const btn = drop.querySelector('.btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }
});
