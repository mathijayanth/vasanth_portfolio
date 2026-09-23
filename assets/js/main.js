(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-links');

  const storedTheme = localStorage.getItem('portfolio-theme');
  if (storedTheme === 'dark' || storedTheme === 'light') root.dataset.theme = storedTheme;
  updateThemeButton();

  themeButton.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('portfolio-theme', root.dataset.theme);
    updateThemeButton();
  });

  function updateThemeButton() {
    const dark = root.dataset.theme === 'dark';
    themeIcon.textContent = dark ? '☼' : '☾';
    themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', dark ? '#0b1120' : '#f8fafc');
  }

  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    menu.classList.toggle('open', !expanded);
  });

  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }));

  const revealSelector = [
    '.hero-copy > .eyebrow', '.hero-copy > h1', '.hero-copy > .hero-intro',
    '.hero-copy > .hero-actions', '.hero-copy > .hero-facts', '.hero-art',
    '.section-heading', '.about-grid > *', '.stat', '.skill-card',
    '.timeline-item', '.education-card', '.school-note', '.research-card',
    '.contact-wrap > div', '.footer-inner > *'
  ].join(',');
  const revealItems = document.querySelectorAll(revealSelector);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js-motion');

  revealItems.forEach((item, index) => {
    item.setAttribute('data-reveal', '');
    const siblings = Array.from(item.parentElement.children).filter((child) =>
      child.matches('.skill-card, .timeline-item, .education-card, .research-card, .stat')
    );
    const position = siblings.length ? siblings.indexOf(item) : index % 3;
    item.style.setProperty('--reveal-delay', `${Math.max(position, 0) * 80}ms`);
    if (item.matches('.hero-art, .research-card:nth-child(even)')) item.dataset.reveal = 'from-right';
    if (item.matches('.about-image')) item.dataset.reveal = 'from-left';
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -32px 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const sectionLinks = Array.from(menu.querySelectorAll('a[href^="#"]'));
  const pageSections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const updateActiveSection = () => {
    const marker = window.innerHeight * 0.3;
    const activeSection = pageSections
      .filter((section) => section.getBoundingClientRect().top <= marker)
      .at(-1) || pageSections[0];
    sectionLinks.forEach((link) => {
      const active = link.hash === `#${activeSection.id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  window.addEventListener('scroll', updateActiveSection, { passive: true });
  window.addEventListener('resize', updateActiveSection);
  updateActiveSection();

  document.querySelector('#year').textContent = new Date().getFullYear();
})();
