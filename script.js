const container = document.querySelector('.container');
const cloneContainer = container.cloneNode(true);
cloneContainer.id = 'dark-container';
document.body.appendChild(cloneContainer);
cloneContainer.classList.remove('active');

// Sincroniza imagem da versão clara com a escura
const homeImgSrc = container.querySelector('.home-img img')?.getAttribute('src');
const darkContainerImg = cloneContainer.querySelector('.home-img img');
if (homeImgSrc && darkContainerImg) {
  darkContainerImg.setAttribute('src', homeImgSrc);
}

const toggleIcons = document.querySelectorAll('.toggle-icon');
const icons = document.querySelectorAll('.toggle-icon i');
const darkContainer = document.querySelector('#dark-container');

toggleIcons.forEach(toggle => {
  toggle.addEventListener('click', () => {
    toggle.classList.add('disabled');
    setTimeout(() => toggle.classList.remove('disabled'), 1500);

    icons.forEach(icon => icon.classList.toggle('bx-sun'));
    container.classList.toggle('active');
    darkContainer.classList.toggle('active');
  });
});

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');
const btnTopo = document.querySelector('.btn-topo');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });

  // Mostrar botão "Voltar ao Topo"
  if (window.scrollY > 300) {
    btnTopo.classList.remove('hidden');
  } else {
    btnTopo.classList.add('hidden');
  }
});

// Fade-in animation com IntersectionObserver
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => observer.observe(section));

// Menu hambúrguer responsivo (suporte ao modo escuro)
const menuToggles = document.querySelectorAll('.menu-toggle');

menuToggles.forEach(toggle => {
  const navLinks = toggle.closest('.navbar')?.querySelector('.nav-links');
  if (!navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  toggle.setAttribute('aria-expanded', false);

  // Fecha o menu ao clicar em um link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      }
    });
  });
});

// Ativa dark-mode por padrão (se desejar)
document.querySelector('#container').classList.remove('active');
document.querySelector('#dark-container').classList.add('active');

// Dropdown (Download CV) com clique
document.querySelectorAll('.dropdown .btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const dropdown = this.closest('.dropdown');
    dropdown.classList.toggle('open');

    // Fecha outros dropdowns se houver
    document.querySelectorAll('.dropdown').forEach(d => {
      if (d !== dropdown) d.classList.remove('open');
    });
  });
});

// Fecha dropdown ao clicar fora
window.addEventListener('click', function () {
  document.querySelectorAll('.dropdown.open').forEach(drop => {
    drop.classList.remove('open');
  });
});
