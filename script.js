const mobileFix = document.createElement('link');
mobileFix.rel = 'stylesheet';
mobileFix.href = 'mobile-fixes.css?v=hero-fix-1';
document.head.appendChild(mobileFix);

const premiumStyle = document.createElement('link');
premiumStyle.rel = 'stylesheet';
premiumStyle.href = 'premium-home.css?v=imh-premium-1';
document.head.appendChild(premiumStyle);

const mobilePolish = document.createElement('link');
mobilePolish.rel = 'stylesheet';
mobilePolish.href = 'mobile-fixes.css?v=mobile-polish-2';
document.head.appendChild(mobilePolish);

const imhImages = {
  exterior: 'https://upload.wikimedia.org/wikipedia/commons/6/69/IloiloMissionHospital.JPG',
  trainingHall: 'https://upload.wikimedia.org/wikipedia/commons/7/73/CPU_Loreto_D._Tupaz_Hall.jpg',
  historicHall: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Iloilo_Mission_Hospital_Main_Hall.jpg',
  courtyardFallback: 'assets/imh-courtyard.svg'
};

function setImage(img, src, alt, eager = false) {
  if (!img) return;
  img.src = src;
  img.alt = alt;
  img.decoding = 'async';
  if (eager) {
    img.loading = 'eager';
    img.fetchPriority = 'high';
  } else {
    img.loading = 'lazy';
  }
}

function setFigureCaption(figure, title, text) {
  const heading = figure?.querySelector('figcaption strong');
  const body = figure?.querySelector('figcaption span');
  if (heading) heading.textContent = title;
  if (body) body.textContent = text;
}

function fallbackHospitalImage(img) {
  if (img.dataset.fallbackApplied === 'true') return;
  img.dataset.fallbackApplied = 'true';
  img.src = imhImages.courtyardFallback;
}

function hydrateHospitalImages() {
  const preload = document.querySelector('link[rel="preload"][as="image"]');
  if (preload) preload.href = imhImages.exterior;

  const heroFigure = document.querySelector('.hero-visual .image-card');
  setImage(
    heroFigure?.querySelector('img'),
    imhImages.exterior,
    'Iloilo Mission Hospital exterior campus building',
    true
  );
  setFigureCaption(
    heroFigure,
    'A trusted hospital campus',
    'A cleaner exterior image gives the hero a stronger, more professional first impression.'
  );

  setImage(
    document.querySelector('.showcase-image img'),
    imhImages.trainingHall,
    'CPU Iloilo Mission Hospital training hall and campus building'
  );

  setImage(
    document.querySelector('.media .frame img'),
    imhImages.historicHall,
    'Historic Iloilo Mission Hospital main hall building'
  );

  const galleryItems = [
    {
      src: imhImages.exterior,
      alt: 'Iloilo Mission Hospital campus exterior',
      title: 'Hospital campus',
      text: 'A clear exterior view anchors the hospital identity without repeating the same placeholder.'
    },
    {
      src: imhImages.trainingHall,
      alt: 'CPU Iloilo Mission Hospital training hall exterior',
      title: 'Training heritage',
      text: 'A distinct campus building reinforces IMH as a teaching and training hospital.'
    },
    {
      src: imhImages.historicHall,
      alt: 'Historic Iloilo Mission Hospital main hall',
      title: 'Historic main hall',
      text: 'An archival hospital image adds depth to the story while keeping the gallery varied.'
    }
  ];

  document.querySelectorAll('.gallery-card').forEach((card, index) => {
    const item = galleryItems[index];
    if (!item) return;
    card.classList.remove('is-placeholder');
    card.removeAttribute('data-facebook-source');
    setImage(card.querySelector('img'), item.src, item.alt);
    setFigureCaption(card, item.title, item.text);
  });

  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => fallbackHospitalImage(img), { once: true });
    if (img.complete && img.naturalWidth === 0) fallbackHospitalImage(img);
  });
}

function enhanceHomeContent() {
  const heroButtons = [...document.querySelectorAll('.hero p')].find(paragraph => paragraph.querySelector('.btn'));
  if (heroButtons && !document.querySelector('.trust-strip')) {
    heroButtons.insertAdjacentHTML('afterend', `
      <div class="trust-strip" aria-label="Hospital trust indicators">
        <div class="trust-item"><strong>Since 1901</strong><span>Serving Iloilo families for generations</span></div>
        <div class="trust-item"><strong>Emergency Support</strong><span>Call the hospital for urgent care concerns</span></div>
        <div class="trust-item"><strong>Teaching Hospital</strong><span>Clinical care with a training heritage</span></div>
      </div>
    `);
  }

  document.querySelectorAll('.service').forEach(card => {
    if (card.querySelector('.card-link')) return;
    const link = document.createElement('a');
    link.className = 'card-link';
    link.href = 'services.html';
    link.textContent = 'Learn more';
    card.appendChild(link);
  });

  const contactText = document.querySelector('.blue .contact > div:not(.panel)');
  const contactButtons = contactText ? [...contactText.querySelectorAll('p')].find(paragraph => paragraph.querySelector('.btn')) : null;
  if (contactButtons && !contactButtons.classList.contains('contact-actions')) {
    contactButtons.classList.add('contact-actions');
    if (!contactButtons.querySelector('[href*="maps"]')) {
      const directions = document.createElement('a');
      directions.className = 'btn outline';
      directions.href = 'https://www.google.com/maps/search/?api=1&query=Iloilo%20Mission%20Hospital%20Mission%20Road%20Jaro%20Iloilo%20City';
      directions.textContent = 'Directions';
      directions.rel = 'noopener';
      contactButtons.appendChild(directions);
    }
  }
}

hydrateHospitalImages();
enhanceHomeContent();

const header = document.querySelector('.header');
const toggle = document.querySelector('.toggle');
function setMenu(open) {
  if (!header || !toggle) return;
  header.setAttribute('data-open', String(open));
  toggle.setAttribute('aria-expanded', String(open));
}
if (toggle && header) {
  toggle.addEventListener('click', () => {
    const open = header.getAttribute('data-open') === 'true';
    setMenu(!open);
  });
  document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1120) setMenu(false);
  });
}
const current = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav a').forEach(a => {
  if (a.getAttribute('href') === current) a.setAttribute('aria-current', 'page');
});
const s = document.querySelector('[data-doctor-search]'), sf = document.querySelector('[data-specialty-filter]'), df = document.querySelector('[data-department-filter]'), cards = [...document.querySelectorAll('.doctor')];
function fd() {
  const q = (s?.value || '').toLowerCase(), sp = sf?.value || 'all', dp = df?.value || 'all';
  cards.forEach(c => {
    const ok = (!q || c.textContent.toLowerCase().includes(q)) && (sp === 'all' || c.dataset.specialty === sp) && (dp === 'all' || c.dataset.department === dp);
    c.dataset.hidden = String(!ok);
  });
}
[s, sf, df].forEach(i => i?.addEventListener('input', fd));
const nf = document.querySelector('[data-news-filter]'), news = [...document.querySelectorAll('.news')];
nf?.addEventListener('change', () => {
  news.forEach(n => n.dataset.hidden = String(!(nf.value === 'all' || n.dataset.category === nf.value)));
});
document.querySelectorAll('form[data-validate]').forEach(form => {
  const status = form.querySelector('.status');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = [...form.querySelectorAll('[required]')].find(f => f.type === 'checkbox' ? !f.checked : !f.value.trim());
    if (bad) {
      bad.focus();
      if (status) {
        status.textContent = 'Please complete all required fields and consent before sending.';
        status.style.color = '#b42318';
      }
      return;
    }
    if (status) {
      status.textContent = 'Thank you. This demo form is ready to connect to the hospital inquiry workflow.';
      status.style.color = '#0f766e';
    }
    form.reset();
  });
});
