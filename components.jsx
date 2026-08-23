// Shared chrome and primitives.
// Components export to window for cross-script use.

const { useState } = React;

// ---- Section links --------------------------------------------------------
// Navigation targets are real <a href="#section"> anchors, not buttons, so they
// can be opened in a new tab, middle-clicked, copied, and followed by crawlers.
// A plain left-click is intercepted for SPA navigation; modified clicks are
// left to the browser.
function navHref(id) { return id === 'home' ? './' : '#' + id; }
function navClick(id, go) {
  return (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (typeof e.button === 'number' && e.button !== 0) return;
    e.preventDefault();
    go(id);
  };
}

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null
      ? keyOrEdits : { [keyOrEdits]: val };
    setValues((prev) => ({ ...prev, ...edits }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }));
  }, []);
  return [values, setTweak];
}

// ---- Header ---------------------------------------------------------------
function Header({ section, lang, onNav, onLang, heroOverlay }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [overHero, setOverHero] = useState(!!heroOverlay);
  const items = [
    { id: 'home',     fr: 'Accueil',      en: 'Home' },
    { id: 'research', fr: 'Projets',      en: 'Projects' },
    { id: 'pubs',     fr: 'Publications', en: 'Publications' },
    { id: 'engage',   fr: 'Interventions', en: 'Appearances' },
    { id: 'essays',   fr: 'Notes',        en: 'Notes' },
    { id: 'contact',  fr: 'Contact',      en: 'Contact' },
  ];
  const handleNav = (id) => { setMenuOpen(false); onNav(id); };
  const active = items.find(i => i.id === section);

  // Header is always visible. We track whether it sits over the hero banner —
  // switch styling once the user has scrolled past half the banner's height.
  React.useEffect(() => {
    if (!heroOverlay) { setOverHero(false); return; }
    // Stay in overlay (transparent) mode while the photo's top edge sits
    // BELOW the bottom of the navbar. Switch to white as soon as the photo
    // scrolls up past the navbar.
    const onScroll = () => {
      const photo  = document.querySelector('.banner-info__portrait-frame');
      const header = document.querySelector('.site-header');
      if (!photo) { setOverHero(window.scrollY <= 0); return; }
      const navH = header ? header.getBoundingClientRect().height : 81;
      const photoTop = photo.getBoundingClientRect().top;
      setOverHero(photoTop > navH);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [heroOverlay]);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className={'site-header' + (menuOpen ? ' is-open' : '') + (overHero && !menuOpen ? ' is-over-hero' : '')}>
      {/* Keyboard users land here first and can jump straight past the nav.
          The click is intercepted: letting the browser follow "#main" would
          rewrite the hash the router reads and send the visitor back to Home. */}
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          const m = document.getElementById('main');
          if (!m) return;                 // no target: let the browser try
          e.preventDefault();
          m.setAttribute('tabindex', '-1');
          m.focus({ preventScroll: true });
          m.scrollIntoView({ block: 'start' });
        }}
      >
        {lang === 'fr' ? 'Aller au contenu' : 'Skip to content'}
      </a>
      <div className="shell site-header__row">
        <a className="site-brand" href={navHref('home')} onClick={navClick('home', handleNav)}>
          <img src="assets/logo.svg" width="32" height="32" alt="" className="site-brand__logo" />
          <span className="site-brand__name">Mathieu Poupon</span>
        </a>

        {/* Mobile-only current section + hamburger + lang toggle */}
        <div className="site-header__mobile-meta">
          <span className="lang-toggle lang-toggle--mobile" data-active={lang} role="group" aria-label="Language">
            <span className="lang-toggle__thumb" aria-hidden="true" />
            <button className={lang==='fr'?'is-active':''} onClick={()=>onLang('fr')} aria-pressed={lang==='fr'} aria-label="Français">
              <svg className="lang-toggle__flag" viewBox="0 0 24 16" width="24" height="16" aria-hidden="true">
                <rect x="0"  y="0" width="8" height="16" fill="#0055A4"/>
                <rect x="8"  y="0" width="8" height="16" fill="#FFFFFF"/>
                <rect x="16" y="0" width="8" height="16" fill="#EF4135"/>
              </svg>
            </button>
            <button className={lang==='en'?'is-active':''} onClick={()=>onLang('en')} aria-pressed={lang==='en'} aria-label="English">
              <svg className="lang-toggle__flag" viewBox="0 0 24 16" width="24" height="16" aria-hidden="true">
                <rect width="24" height="16" fill="#FFFFFF"/>
                <g fill="#B22234">
                  <rect y="1.23"  width="24" height="1.23"/>
                  <rect y="3.69"  width="24" height="1.23"/>
                  <rect y="6.15"  width="24" height="1.23"/>
                  <rect y="8.61"  width="24" height="1.23"/>
                  <rect y="11.07" width="24" height="1.23"/>
                  <rect y="13.53" width="24" height="1.23"/>
                </g>
                <rect width="10" height="8.62" fill="#3C3B6E"/>
                <g fill="#FFFFFF">
                  <circle cx="2" cy="2" r="0.55"/>
                  <circle cx="5" cy="2" r="0.55"/>
                  <circle cx="8" cy="2" r="0.55"/>
                  <circle cx="3.5" cy="4.3" r="0.55"/>
                  <circle cx="6.5" cy="4.3" r="0.55"/>
                  <circle cx="2" cy="6.6" r="0.55"/>
                  <circle cx="5" cy="6.6" r="0.55"/>
                  <circle cx="8" cy="6.6" r="0.55"/>
                </g>
              </svg>
            </button>
          </span>
          <button
            className={'site-header__burger' + (menuOpen ? ' is-open' : '')}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu" aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>

        <nav className={'site-nav' + (menuOpen ? ' is-open' : '')}>
          {items.map(it => (
            <a
              key={it.id}
              className={'site-nav__link' + (section === it.id ? ' is-active' : '')}
              href={navHref(it.id)}
              aria-current={section === it.id ? 'page' : undefined}
              onClick={navClick(it.id, handleNav)}
            >
              {lang === 'fr' ? it.fr : it.en}
            </a>
          ))}
          <span className="lang-toggle" data-active={lang} role="group" aria-label="Language">
            <span className="lang-toggle__thumb" aria-hidden="true" />
            <button className={lang==='fr'?'is-active':''} onClick={()=>onLang('fr')} aria-pressed={lang==='fr'} aria-label="Français">
              <svg className="lang-toggle__flag" viewBox="0 0 24 16" width="24" height="16" aria-hidden="true">
                <rect x="0"  y="0" width="8" height="16" fill="#0055A4"/>
                <rect x="8"  y="0" width="8" height="16" fill="#FFFFFF"/>
                <rect x="16" y="0" width="8" height="16" fill="#EF4135"/>
              </svg>
            </button>
            <button className={lang==='en'?'is-active':''} onClick={()=>onLang('en')} aria-pressed={lang==='en'} aria-label="English">
              <svg className="lang-toggle__flag" viewBox="0 0 24 16" width="24" height="16" aria-hidden="true">
                <rect width="24" height="16" fill="#FFFFFF"/>
                <g fill="#B22234">
                  <rect y="1.23"  width="24" height="1.23"/>
                  <rect y="3.69"  width="24" height="1.23"/>
                  <rect y="6.15"  width="24" height="1.23"/>
                  <rect y="8.61"  width="24" height="1.23"/>
                  <rect y="11.07" width="24" height="1.23"/>
                  <rect y="13.53" width="24" height="1.23"/>
                </g>
                <rect width="10" height="8.62" fill="#3C3B6E"/>
                <g fill="#FFFFFF">
                  <circle cx="2" cy="2" r="0.55"/>
                  <circle cx="5" cy="2" r="0.55"/>
                  <circle cx="8" cy="2" r="0.55"/>
                  <circle cx="3.5" cy="4.3" r="0.55"/>
                  <circle cx="6.5" cy="4.3" r="0.55"/>
                  <circle cx="2" cy="6.6" r="0.55"/>
                  <circle cx="5" cy="6.6" r="0.55"/>
                  <circle cx="8" cy="6.6" r="0.55"/>
                </g>
              </svg>
            </button>
          </span>
        </nav>
      </div>
    </header>
  );
}

// ---- Footer ---------------------------------------------------------------
// Closes every page: affiliation, a way to write, and the profiles. The
// copyright line lives in the bottom bar, so the page has exactly one
// <footer> landmark.
function Footer({ lang, onNav }) {
  const t = lang === 'fr' ? {
    h1: 'AFFILIATION',
    h2: 'CONTACT',
    h3: 'PROFILS',
    address: ['LOCEAN–IPSL', 'Sorbonne Université', '4 place Jussieu', '75005 Paris, France'],
    contactAria: 'Aller à la page contact',
    bottom: '© 2026 Mathieu Poupon · Tous droits réservés',
  } : {
    h1: 'AFFILIATION',
    h2: 'CONTACT',
    h3: 'PROFILES',
    address: ['LOCEAN–IPSL', 'Sorbonne Université', '4 place Jussieu', '75005 Paris, France'],
    contactAria: 'Go to contact page',
    bottom: '© 2026 Mathieu Poupon · All rights reserved',
  };

  const profiles = [
    { label: 'GOOGLE SCHOLAR', href: 'https://scholar.google.com/citations?user=1kRXs-IAAAAJ' },
    { label: 'ORCID',          href: 'https://orcid.org/0000-0002-8136-4011' },
    { label: 'GITHUB',         href: 'https://github.com/mpoupon' },
    { label: 'LINKEDIN',       href: 'https://www.linkedin.com/in/mathieu-poupon' },
  ];

  // Coordinates (mono) — shown under the address as a "measurement point".
  const coord = '48.846°N · 2.357°E';

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="site-footer__grid">

          <div className="site-footer__col">
            <div className="site-footer__h">{t.h1}</div>
            <div className="site-footer__addr">
              <div className="site-footer__affil">
                {t.address.map((l, i) => <div key={i}>{l}</div>)}
                <div className="site-footer__coord">{coord}</div>
              </div>
            </div>
          </div>

          <div className="site-footer__col">
            <a
              className="site-footer__h site-footer__h--link"
              href={navHref('contact')}
              onClick={navClick('contact', onNav)}
              aria-label={t.contactAria}
            >
              {t.h2}  <span className="site-footer__h-arr">→</span>
            </a>
            <a className="site-footer__email" href="mailto:mathieu.poupon@locean.ipsl.fr">
              mathieu.poupon<span className="site-footer__email-at">@</span>locean.ipsl.fr
            </a>
          </div>

          <div className="site-footer__col">
            <div className="site-footer__h">{t.h3}</div>
            <ul className="site-footer__links">
              {profiles.map(l => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label}<span className="site-footer__link-arr">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="site-footer__bottom">
          <span>{t.bottom}</span>
        </div>
      </div>
    </footer>
  );
}

// ---- KickerBlock (top of every internal section) -------------------------
function KickerBlock({ kicker, title, lede }) {
  return (
    <div className="kicker-block">
      <h1 className="kicker-block__title" dangerouslySetInnerHTML={{__html: title}} />
      {lede && <p className="kicker-block__lede" dangerouslySetInnerHTML={{__html: lede}} />}
    </div>
  );
}

// ---- StatusPip ------------------------------------------------------------
function StatusPip({ kind, lang }) {
  const labels = {
    fr: { live: 'EN COURS', done: 'PUBLIÉ', closed: 'TERMINÉ', upcoming: 'À VENIR', held: 'PASSÉ', review: 'EN RÉVISION', policy: 'POLICY' },
    en: { live: 'ACTIVE', done: 'PUBLISHED', closed: 'COMPLETED', upcoming: 'UPCOMING', held: 'HELD', review: 'UNDER REVIEW', policy: 'POLICY' },
  };
  const colorMap = { live:'live', done:'live', closed:'closed', upcoming:'live', review:'review', held:'done', policy:'done' };
  return (
    <span className={`status-pip status-pip--${colorMap[kind]}`}>
      <span className="status-pip__dot" />
      <span>{labels[lang][kind]}</span>
    </span>
  );
}

// ---- FigurePlaceholder ----------------------------------------------------
function FigurePlaceholder({ seed = 1, label }) {
  let s = seed;
  const r = () => { s = (s*9301+49297)%233280; return s/233280; };
  const W=400, H=180, M=20;
  const lines = ['#16273A','#1E7D74','#C5612E'].map((color, idx) => {
    let d = `M ${M} ${H-M}`;
    let y = H-M - 20 - idx*25;
    for (let x = M; x <= W-M; x += 14) {
      y += (r()-0.5)*18 - (idx===0 ? 1.2 : (idx===1 ? 0.3 : 0.8));
      y = Math.max(M+10, Math.min(H-M-2, y));
      d += ` L ${x} ${y.toFixed(1)}`;
    }
    return <path key={idx} d={d} fill="none" stroke={color} strokeWidth="1.1" />;
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:'block',maxHeight:200}}>
      <line x1={M} y1={H-M} x2={W-M} y2={H-M} stroke="#E0DCD0" />
      <line x1={M} y1={M} x2={M} y2={H-M} stroke="#E0DCD0" />
      {lines}
      {label && (
        <text x={M} y={14} fontFamily="JetBrains Mono" fontSize="9" letterSpacing="1.5" fill="#8A93A0">{label}</text>
      )}
    </svg>
  );
}

Object.assign(window, { Header, Footer, KickerBlock, StatusPip, FigurePlaceholder, navHref, navClick, useTweaks });
