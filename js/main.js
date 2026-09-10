(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const config = window.GARAGE_CONFIG || {};
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  const mobileQuery = window.matchMedia('(max-width: 950px)');
  const setMenu = open => {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('is-open', open);
  };
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header') && menuButton.getAttribute('aria-expanded') === 'true') setMenu(false);
  });
  mobileQuery.addEventListener('change', () => setMenu(false));

  // Keep navigation useful without motion, scroll interception, or a JS dependency.
  if ('IntersectionObserver' in window) {
    const navigationSections = [...nav.querySelectorAll('a')].map(link => document.querySelector(link.hash));
    const observer = new IntersectionObserver(entries => {
      const current = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!current) return;
      nav.querySelectorAll('a').forEach(link => {
        if (link.hash === `#${current.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    navigationSections.filter(Boolean).forEach(section => observer.observe(section));
  }

  const cleanPhone = value => {
    const normalized = String(value || '').replace(/[\s()-]/g, '');
    return /^\+[1-9]\d{7,14}$/.test(normalized) ? normalized : '';
  };
  const safeMap = value => {
    if (!value) return '';
    try {
      const url = new URL(value);
      const validHost = ['google.com', 'www.google.com', 'maps.google.com', 'maps.app.goo.gl'].includes(url.hostname);
      return url.protocol === 'https:' && validHost ? url.href : '';
    } catch { return ''; }
  };
  const phone = cleanPhone(config.phone);
  const whatsapp = cleanPhone(config.whatsapp);
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email || '') ? config.email : '';
  const mapsUrl = safeMap(config.mapsUrl);
  const links = {
    phone: phone ? `tel:${phone}` : '',
    whatsapp: whatsapp ? `https://wa.me/${whatsapp.slice(1)}?text=${encodeURIComponent('Hello Sri Balaji Motors, I would like to arrange a car service at your Madhapur workshop.')}` : '',
    directions: mapsUrl
  };
  const detailValues = { phone: phone ? config.phone : '', whatsapp: whatsapp ? config.whatsapp : '', email, address: config.address, hours: config.hours };
  Object.entries(detailValues).forEach(([key, value]) => {
    if (!value) return;
    document.querySelectorAll(`[data-detail="${key}"]`).forEach(element => {
      const href = key === 'email' ? `mailto:${email}` : links[key];
      if (href) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = value;
        if (key === 'whatsapp') { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
        element.replaceChildren(link);
      } else element.textContent = value;
    });
  });

  const dialog = document.querySelector('#contact-dialog');
  const messages = {
    phone: ['Phone number coming soon', 'The garage’s phone number is awaiting confirmation. Please check back for phone bookings. No appointment has been made.'],
    whatsapp: ['WhatsApp number coming soon', 'The garage’s WhatsApp number is awaiting confirmation. Please check back to message the team. No message has been sent.'],
    directions: ['Workshop location coming soon', 'The exact street address and workshop map pin are awaiting confirmation. You can view the Madhapur area below, but it is not a verified pin for Sri Balaji Motors.']
  };
  document.querySelectorAll('[data-contact]').forEach(link => {
    const kind = link.dataset.contact;
    if (links[kind]) {
      link.href = links[kind];
      if (kind !== 'phone') { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      return;
    }
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      event.preventDefault();
      document.querySelector('#dialog-title').textContent = messages[kind][0];
      document.querySelector('#dialog-message').textContent = messages[kind][1];
      document.querySelector('#dialog-map-link').hidden = kind !== 'directions';
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else {
        document.querySelector('#contact-status').textContent = messages[kind][1];
        document.querySelector('#contact').scrollIntoView();
      }
    });
  });
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  const embed = safeMap(config.mapEmbedUrl);
  if (embed && new URL(embed).pathname.startsWith('/maps/embed')) {
    const map = document.querySelector('#workshop-map');
    map.src = embed;
    map.hidden = false;
    document.querySelector('#map-placeholder').hidden = true;
  }
  if (phone || whatsapp) {
    document.querySelector('#contact-status').textContent = 'Please contact the garage to confirm your visit, service availability and opening hours.';
  }
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
