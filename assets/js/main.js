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

  document.querySelector('#year').textContent = new Date().getFullYear();
})();
