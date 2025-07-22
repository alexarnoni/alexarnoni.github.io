const container = document.querySelector('.container');
const cloneContainer = container.cloneNode(true);
cloneContainer.id = 'dark-container';
document.body.appendChild(cloneContainer);
cloneContainer.classList.remove('active');

const toggleIcons = document.querySelectorAll('.toggle-icon');
const icons = document.querySelectorAll('.toggle-icon i');
const darkContainer = document.querySelector('#dark-container');
const darkContainerImg = document.querySelector('#dark-container .home-img img');
darkContainerImg.src = 'imgDark.png';

toggleIcons.forEach(toggle => {
    toggle.addEventListener('click', () => {
        toggle.classList.add('disabled');
        setTimeout(() => {
            toggle.classList.remove('disabled');
        }, 1500);

        icons.forEach(icon => {
            icon.classList.toggle('bx-sun');
        });

        container.classList.toggle('active');
        darkContainer.classList.toggle('active');
    });
});

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');

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
});

// Fade-in animation on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

sections.forEach(section => {
    observer.observe(section);
});
