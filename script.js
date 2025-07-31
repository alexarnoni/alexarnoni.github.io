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

// Menu hambúrguer responsivo
const menuToggle = document.querySelector('.menu-toggle');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });
}

menuToggle.setAttribute('aria-expanded', false);

// Fecha o menu ao clicar em um link (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    const nav = document.querySelector('.nav-links');
    if (nav.classList.contains('open')) {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', false);
    }
  });
});

document.querySelector('#container').classList.remove('active');
document.querySelector('#dark-container').classList.add('active');
