// Five section views. Each receives { lang, onNav, onOpenArticle }
// Data below is real, sourced from the researcher's CV (Nov 2026).

// ---- Data: research project cards ----------------------------------------
// Three working lines, each illustrated by a dedicated image.
const RESEARCH = [
  {
    id: 1,
    title: { fr: 'Ocean Alkalinity Enhancement', en: 'Ocean Alkalinity Enhancement' },
    summary: {
      fr: "Comment modifier la chimie de l'océan peut augmenter le retrait de CO₂ atmosphérique — où est-ce viable, à quel coût et quels sont les facteurs limitants.",
      en: "How modifying ocean chemistry can enhance atmospheric CO₂ removal — where is it viable, at what cost, and what are the limiting factors.",
    },
    status: 'live',
    image: 'assets/research/oae.jpg',
  },
  {
    id: 2,
    title: { fr: 'Biological Carbon Pump', en: 'Biological Carbon Pump' },
    summary: {
      fr: "Comment l'activité biologique et ses interactions avec la dynamique océanique contrôlent le cycle du carbone et des nutriments.",
      en: "How biological activity and its interplay with ocean dynamics control the carbon and nutrient cycles.",
    },
    status: 'live',
    image: 'assets/research/bcp.webp',
  },
  {
    id: 3,
    title: { fr: 'Oxygen Natural Variability', en: 'Oxygen Natural Variability' },
    summary: {
      fr: "Comment les modes de variabilité pluriannuelle et décennale de l'océan modifient la dynamique des zones pauvres en oxygène.",
      en: "How multi-year and decadal ocean variability modes shape the dynamics of low-oxygen zones.",
    },
    status: 'closed',
    image: 'assets/research/oxygen.jpg',
  },
];

// ---- Data: publications — loaded from data/publications.json -------------
// To add a publication, edit data/publications.json (no code change needed).
// Fields: year (int), status ("done"|"review"), title {fr,en}, authors,
//         venue, doi (string|null), pdf (path|null), supp (path|null)

// ---- Data: conferences — loaded from data/conferences.json ---------------
// To add a conference, edit data/conferences.json (no code change needed).
// Fields: year (int), month (int), status, format, title {fr,en}, event, city, country (2-letter ISO or null for Online)

// ---- Data: public-engagement project cards ------------------------------
// Long-running initiatives — not one-off talks or interviews (those live on the
// Activities page). Each is a programme Mathieu drives or co-drives over years.
const ENGAGE_PROJECTS = [
  {
    id: 1,
    title: { fr: 'ECOP', en: 'ECOP' },
    summary: {
      fr: "Coordination du nœud français d'ECOP — porter la voix des jeunes professionnels de l'océan et faciliter leur développement professionnel.",
      en: "Coordinating the French node of ECOP — giving early-career ocean professionals a voice and supporting their professional development.",
    },
    status: 'live',
    image: 'assets/engagement/ecop.png',
    url: 'https://www.ecopdecade.org/france/',
  },
  {
    id: 5,
    title: { fr: 'EU — Young Ocean Advocate', en: 'EU — Young Ocean Advocate' },
    summary: {
      fr: "Jeune Ambassadeur de l'Océan auprès de la Commission européenne — porte-parole d'une génération engagée pour la protection et la gouvernance de l'océan.",
      en: "Young Ocean Advocate with the European Commission — voice of a generation committed to ocean protection and governance.",
    },
    status: 'live',
    image: 'assets/engagement/young_ocean_advocate.png',
    url: 'https://maritime-forum.ec.europa.eu/node/8227_en',
  },
  {
    id: 2,
    title: { fr: 'JAC', en: 'JAC' },
    summary: {
      fr: "Jeunes Ambassadeurs pour le Climat — conférences et formations en milieu scolaire sur les causes, conséquences et solutions du changement climatique.",
      en: "Jeunes Ambassadeurs pour le Climat — talks and training in schools on the causes, consequences and solutions of climate change.",
    },
    status: 'closed',
    image: 'assets/engagement/jac.jpg',
    url: 'https://jac-asso.fr/',
  },
  {
    id: 3,
    title: { fr: 'ClimateScience', en: 'ClimateScience' },
    summary: {
      fr: "Traducteur francophone pour l'app mobile et le site ClimateScience — contenu éducatif sur les causes et conséquences du changement climatique.",
      en: "French translator for the ClimateScience app and website — educational content on climate change.",
    },
    status: 'closed',
    image: 'assets/engagement/climate_science.webp',
    url: 'https://climatescience.org/',
  },
  {
    id: 6,
    title: { fr: 'Juste 2°C', en: 'Juste 2°C' },
    summary: {
      fr: "Vidéos et communication de vulgarisation sur les rapports du GIEC, les causes et les conséquences du changement climatique.",
      en: "Videos and outreach communication on IPCC reports, and the causes and consequences of climate change.",
    },
    status: 'closed',
    image: 'assets/engagement/j2d.png',
    url: 'https://www.j2d.org/',
  },
  {
    id: 4,
    title: { fr: 'Ordre de Grandeur', en: 'Ordre de Grandeur' },
    summary: {
      fr: "Série de vidéos de vulgarisation sur les grands ordres de grandeur terrestres — pour comprendre le fonctionnement de notre planète.",
      en: "Popular science video series on Earth's orders of magnitude — helping the public understand how our planet works.",
    },
    status: 'closed',
    image: 'assets/engagement/odg.png',
    url: 'https://www.youtube.com/playlist?list=PLOF9KoYAaAFoFY-dbvlk2aJXJI0s_Lo7k',
  },
];

// ---- Data: essays — loaded from data/notes/ ---------------------------
// To add an article:
//   1) Drop a new JSON file in data/notes/ named YYYY-MM-DD-slug.json
//   2) Add the slug (filename without .json) to data/notes/index.json
// The Writings view fetches the index, then each article, sorts by date,
// features the most recent at the top, and lists the rest below.

// ---- Data: CV timeline — loaded from data/timeline.json ------------------
// To add or edit an entry, edit data/timeline.json (no code change needed).
// Fields: period (string), kind ("position"|"degree"),
//         title {fr,en}, org {fr,en}, place, href

// ============================================================================
// Home
// ============================================================================
function Home({ lang, onNav, onOpenArticle, hero = 'portrait' }) {
  const [pubs,     setPubs]     = React.useState([]);
  const [timeline, setTimeline] = React.useState([]);
  // On large screens, show 4 latest publications; 3 below 1100px.
  const [pubsCount, setPubsCount] = React.useState(
    typeof window !== 'undefined' && window.matchMedia('(min-width: 1100px)').matches ? 4 : 3
  );
  React.useEffect(() => {
    fetch('data/publications.json').then(r => r.json()).then(setPubs).catch(() => {});
    fetch('data/timeline.json').then(r => r.json()).then(setTimeline).catch(() => {});
    const mql = window.matchMedia('(min-width: 1100px)');
    const onChange = (e) => setPubsCount(e.matches ? 4 : 3);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const t = lang === 'fr' ? {
    sub: "Chercheur en sciences de l'océan et en politique environnementale. Postdoc CNRS au LOCEAN–IPSL, après un doctorat à Princeton University. Je travaille sur le cycle naturel du carbone dans l'océan et sur sa modification délibérée par l'homme, ainsi que sur ce que chacun de ces sujets engage pour la prise de décision.",
    meta: 'POSTDOC CNRS · LOCEAN–IPSL',
    coord: '48.846°N · 2.357°E — PARIS',
    routes: [
      ['01','Projets','research'],
      ['02','Publications','pubs'],
      ['03','Interventions','engage'],
      ['04','Notes','essays'],
    ],
    latest: 'DERNIÈRES PUBLICATIONS',
    all: 'TOUTES LES PUBLICATIONS  →',
    portraitCap: 'PORTRAIT · 2025',
    bg: 'PARCOURS',
  } : {
    sub: "Ocean science and environmental policy researcher. CNRS postdoc at LOCEAN–IPSL after a PhD at Princeton University. I work on the natural carbon cycle in the ocean and its deliberate modification by humans, and on what each commits us to in decision-making.",
    meta: 'CNRS POSTDOC · LOCEAN–IPSL',
    coord: '48.846°N · 2.357°E — PARIS',
    routes: [
      ['01','Projects','research'],
      ['02','Publications','pubs'],
      ['03','Appearances','engage'],
      ['04','Notes','essays'],
    ],
    latest: 'LATEST PUBLICATIONS',
    all: 'ALL PUBLICATIONS  →',
    portraitCap: 'PORTRAIT · 2025',
    bg: 'CURRICULUM',
  };

  const heroAside = (() => {
    if (hero === 'minimal') return null;
    // portrait (default for non-frontispiece variants)
    return (
      <div className="hero__aside">
        <img className="hero__portrait" src="assets/home/portrait.png" alt="Mathieu Poupon" />
        <div className="hero__caption">
          <span>{t.portraitCap}</span>
          <span style={{color:'var(--ink-grey)'}}>{lang === 'fr' ? 'PARIS' : 'PARIS'}</span>
        </div>
      </div>
    );
  })();

  // 'frontispiece' variant: full-bleed banner + circular portrait overlapping it,
  // name and bio centered below — book title-page feel.
  const frontispiece = hero === 'frontispiece' ? (
    <section className="hero-frontispiece">
      <div className="hero-frontispiece__banner">
        <div className="banner-info">
          <div className="banner-info__left">
            <div className="banner-info__portrait-frame">
              <img src="assets/home/portrait.png" alt="Mathieu Poupon" className="banner-info__portrait" />
            </div>
            <div className="banner-info__kicker">{t.meta}</div>
            <div className="banner-info__socials" aria-label={lang === 'fr' ? 'Liens externes' : 'External links'}>
              <a className="social-pill" href="mailto:mathieu.poupon@locean.ipsl.fr" aria-label="Email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <rect x="3" y="5" width="18" height="14" rx="2"/>
                  <path d="M3 7l9 6 9-6"/>
                </svg>
              </a>
              <a className="social-pill" href="https://scholar.google.com/citations?user=1kRXs-IAAAAJ" target="_blank" rel="noopener noreferrer" aria-label="Google Scholar">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9z"/>
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                </svg>
              </a>
              <a className="social-pill" href="https://orcid.org/0000-0002-8136-4011" target="_blank" rel="noopener noreferrer" aria-label="ORCID">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947 0 .525-.422.947-.947.947s-.947-.422-.947-.947c0-.516.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z"/>
                </svg>
              </a>
              <a className="social-pill" href="https://github.com/mpoupon" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12 0C5.374 0 0 5.374 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.626-5.374-12-12-12z"/>
                </svg>
              </a>
              <a className="social-pill" href="https://www.linkedin.com/in/mathieu-poupon" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a className="social-pill" href="#cv" aria-label="CV (PDF)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <path d="M14 3v4a1 1 0 001 1h4"/>
                  <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <line x1="9" y1="13" x2="15" y2="13"/>
                  <line x1="9" y1="17" x2="13" y2="17"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="banner-info__right">
            <h1 className="banner-info__name">Mathieu Poupon</h1>
            <p className="banner-info__sub">{t.sub}</p>
          </div>
        </div>
        <button
          type="button"
          className="scroll-cue"
          aria-label={lang === 'fr' ? 'Faire défiler' : 'Scroll down'}
          onClick={() => {
            const next = document.querySelector('.routes');
            const header = document.querySelector('.site-header');
            if (!next) return;
            const navH = header ? header.getBoundingClientRect().height : 81;
            const targetY = next.getBoundingClientRect().top + window.scrollY - navH - 24;
            window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
          }}
        >
          <svg className="scroll-cue__chevron" viewBox="0 0 32 16" width="30" height="15" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="3 4 16 13 29 4" />
          </svg>
        </button>
      </div>
    </section>
  ) : null;

  return (
    <main className="shell">
      {frontispiece}
      {hero !== 'frontispiece' && (
      <section className={'hero hero--' + hero}>
        <div className="hero__main">
          <h1 className="hero__display">Mathieu<br className="hero__break" />{' '}Poupon</h1>
          <p className="hero__sub">{t.sub}</p>
          <div className="hero__meta">{t.meta}</div>
        </div>
        {heroAside}
      </section>
      )}

      <nav className="routes">
        {t.routes.map(([n,l,id]) => (
          <button key={id} className="route-tile" onClick={() => onNav(id)}>
            <div className="route-tile__label">{l}</div>
          </button>
        ))}
      </nav>

      <section className="latest">
        <div className="latest__head">
          <span className="latest__h">{t.latest}</span>
          <button className="latest__all" onClick={()=>onNav('pubs')}>{t.all}</button>
        </div>
        <div className="latest__list">
          {pubs.filter(p => p.status === 'done').slice(0, pubsCount).map((p,i) => (
            <div className="itemlist__row itemlist__row--pub" key={i}>
              <div className="itemlist__yr">{p.year}</div>
              <div>
                <div className="itemlist__title">
                  {p.doi
                    ? <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer">{p.title[lang]}</a>
                    : <span>{p.title[lang]}</span>}
                </div>
                <div className="itemlist__sub" dangerouslySetInnerHTML={{__html: p.authors.replace(/Poupon M\. A\./g, '<strong>Poupon M. A.</strong>')}} />
              </div>
              <div>
                {p.venue && <div className="itemlist__right">{p.venue}</div>}
                <div className="itemlist__right-meta"><StatusPip kind={p.status} lang={lang} /></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="timeline">
        <div className="timeline__head">
          <span className="timeline__h">{t.bg}</span>
        </div>
        <ol className="timeline__list">
          {timeline.map((it, i) => {
            const isCurrent = it.kind === 'position';
            return (
              <li className={`timeline__item${isCurrent ? ' timeline__item--current' : ''}`} key={i}>
                <div className="timeline__period">
                  <span className="timeline__period-dates">{it.period}</span>
                </div>
                <div className="timeline__rail">
                  <span className="timeline__dot" />
                </div>
                <div className="timeline__content">
                  {it.href
                    ? <a className="timeline__title" href={it.href} target="_blank" rel="noopener noreferrer">{it.title[lang]}</a>
                    : <div className="timeline__title">{it.title[lang]}</div>}
                  <div className="timeline__org">{it.org[lang]}</div>
                  <div className="timeline__place">{it.place}</div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="home-contact">
        <button
          type="button"
          className="home-contact__kicker home-contact__kicker--link"
          onClick={() => onNav('contact')}
          aria-label={lang === 'fr' ? 'Aller à la page contact' : 'Go to contact page'}
        >
          — {lang === 'fr' ? 'CONTACT' : 'CONTACT'} <span className="home-contact__kicker-arr">→</span>
        </button>
        <div className="home-contact__grid">
          <div className="home-contact__col">
            <div className="home-contact__label">{lang === 'fr' ? 'ADRESSE' : 'ADDRESS'}</div>
            <address className="home-contact__addr">
              <div>LOCEAN–IPSL</div>
              <div>Sorbonne Université</div>
              <div>4 place Jussieu, Tour 45/46</div>
              <div>75005 Paris, France</div>
            </address>
          </div>
          <div className="home-contact__col">
            <div className="home-contact__label">{lang === 'fr' ? 'COURRIEL' : 'EMAIL'}</div>
            <a className="home-contact__email" href="mailto:mathieu.poupon@locean.ipsl.fr">
              mathieu.poupon@locean.ipsl.fr
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

// ============================================================================
// Research
// ============================================================================
function Research({ lang }) {
  const t = lang === 'fr' ? {
    kicker:'01 — PROJETS',
    title:'Recherche et engagement',
    lede:"Mes axes de recherche, et les programmes d'engagement public auxquels je contribue.",
    s1t:'Recherche',
    s2t:'Engagement public',
  } : {
    kicker:'01 — PROJECTS',
    title:'Research and engagement',
    lede:"My research lines, and the public-engagement programmes I contribute to.",
    s1t:'Research',
    s2t:'Public engagement',
  };
  return (
    <main className="shell">
      <KickerBlock kicker={t.kicker} title={t.title} lede={t.lede} />

      <section className="engage-block">
        <header className="engage-block__head">
          <h2 className="engage-block__title">{t.s1t}</h2>
        </header>
        <div className="research-grid">
          {RESEARCH.map(p => (
            <button key={p.id} className="research-card">
              <div className="research-card__figure">
                <img src={p.image} alt="" className="research-card__img" />
              </div>
              <div className="research-card__status">
                <StatusPip kind={p.status} lang={lang} />
              </div>
              <div className="research-card__body">
                <h3 dangerouslySetInnerHTML={{__html:p.title[lang]}} />
                <p>{p.summary[lang]}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="engage-block">
        <header className="engage-block__head">
          <h2 className="engage-block__title">{t.s2t}</h2>
        </header>
        <div className="research-grid">
          {ENGAGE_PROJECTS.map(p => (
            <a key={p.id} className="research-card" href={p.url} target="_blank" rel="noopener noreferrer">
              <div className="research-card__figure">
                <img src={p.image} alt="" className="research-card__img" />
              </div>
              <div className="research-card__status">
                <StatusPip kind={p.status} lang={lang} />
              </div>
              <div className="research-card__body">
                <h3 dangerouslySetInnerHTML={{__html:p.title[lang]}} />
                <p>{p.summary[lang]}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

// ============================================================================
// Publications
// ============================================================================
function Publications({ lang }) {
  const [pubs, setPubs] = React.useState([]);
  React.useEffect(() => {
    fetch('data/publications.json').then(r => r.json()).then(setPubs).catch(() => {});
  }, []);

  const t = lang === 'fr' ? {
    kicker:'02 — PUBLICATIONS',
    title:'Articles à comité de lecture',
    lede:"Articles à comité de lecture, publiés ou en révision.",
    s1:'En révision',
    s2:'Publiés',
    article:'PDF',
    supp:'Supplementary',
  } : {
    kicker:'02 — PUBLICATIONS',
    title:'Peer-reviewed papers',
    lede:"Peer-reviewed papers, published or under review.",
    s1:'Under review',
    s2:'Published',
    article:'PDF',
    supp:'Supplementary',
  };

  // Trigger Altmetric + Dimensions badge rendering on mount.
  // SPA navigation doesn't fire DOMContentLoaded, so we manually re-init each.
  React.useEffect(() => {
    let cancelled = false;
    const renderBadges = () => {
      if (cancelled) return;
      try { window._altmetric_embed_init && window._altmetric_embed_init(); } catch (e) {}
      try { window.__dimensions_embed && window.__dimensions_embed.addBadges && window.__dimensions_embed.addBadges(); } catch (e) {}
    };
    renderBadges();
    const t1 = setTimeout(renderBadges, 400);
    const t2 = setTimeout(renderBadges, 1200);
    return () => { cancelled = true; clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const reviewPubs = pubs.filter(p => p.status === 'review');
  const donePubs = pubs.filter(p => p.status === 'done');

  const docIcon = (
    <span className="itemlist__action-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <path d="M14 3v4a1 1 0 001 1h4"/>
        <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <line x1="9" y1="13" x2="15" y2="13"/>
        <line x1="9" y1="17" x2="13" y2="17"/>
      </svg>
    </span>
  );

  const renderRow = (p, i, withActions) => (
    <div className="itemlist__row itemlist__row--pub" key={i}>
      <div className="itemlist__yr">
        {p.status === 'review'
          ? <span className="itemlist__spinner" aria-label={lang === 'fr' ? 'En révision' : 'Under review'} title={lang === 'fr' ? 'En révision' : 'Under review'} />
          : p.year}
      </div>
      <div>
        <div className="itemlist__title">
          {p.doi
            ? <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer">{p.title[lang]}</a>
            : <span>{p.title[lang]}</span>}
        </div>
        <div className="itemlist__sub" dangerouslySetInnerHTML={{__html: p.authors.replace(/Poupon M\. A\./g, '<strong>Poupon M. A.</strong>')}} />
        {(p.venue || (withActions && (p.pdf || p.supp))) && (
          <div className="itemlist__actions">
            {p.venue && p.doi && (
              <a className="itemlist__action itemlist__action--venue" href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer">
                {p.venue}
              </a>
            )}
            {p.venue && !p.doi && (
              <span className="itemlist__action itemlist__action--venue itemlist__action--static">
                {p.venue}
              </span>
            )}
            {withActions && p.pdf && (
              <a className="itemlist__action" href={p.pdf} target="_blank" rel="noopener noreferrer">
                {docIcon}{t.article}
              </a>
            )}
            {withActions && p.supp && (
              <a className="itemlist__action" href={p.supp} target="_blank" rel="noopener noreferrer">
                {docIcon}{t.supp}
              </a>
            )}
          </div>
        )}
      </div>
      <div>
        {withActions && p.doi && (
          <div className="itemlist__right-badges">
            <span
              className="__dimensions_badge_embed__ itemlist__badge"
              data-doi={p.doi}
              data-style="small_circle"
            />
            <div
              className="altmetric-embed itemlist__badge"
              data-badge-type="donut"
              data-badge-popover="left"
              data-hide-no-mentions="true"
              data-doi={p.doi}
            />
          </div>
        )}
        <div className="itemlist__right-meta"><StatusPip kind={p.status} lang={lang} /></div>
      </div>
    </div>
  );

  return (
    <main className="shell">
      <KickerBlock kicker={t.kicker} title={t.title} lede={t.lede} />

      {reviewPubs.length > 0 && (
        <section className="engage-block">
          <header className="engage-block__head">
            <h2 className="engage-block__title">{t.s1}</h2>
          </header>
          <div className="itemlist">
            {reviewPubs.map((p,i) => renderRow(p, `r-${i}`, false))}
          </div>
        </section>
      )}

      {donePubs.length > 0 && (
        <section className="engage-block">
          <header className="engage-block__head">
            <h2 className="engage-block__title">{t.s2}</h2>
          </header>
          <div className="itemlist">
            {donePubs.map((p,i) => renderRow(p, `d-${i}`, true))}
          </div>
        </section>
      )}
    </main>
  );
}

// ============================================================================
// Conferences
// ============================================================================
function Conferences({ lang }) {
  const [confs, setConfs] = React.useState([]);

  React.useEffect(() => {
    fetch('data/conferences.json')
      .then(r => r.json())
      .then(data => {
        setConfs(data);
        window.CONFS = data; // shared with Engagement component
      })
      .catch(() => {});
  }, []);

  const t = lang === 'fr' ? {
    kicker:'03 — CONFÉRENCES',
    title:'Interventions à venir et passées',
    lede:'Talks, posters, webinaires, sessions invitées. Diapos sur demande.',
  } : {
    kicker:'03 — CONFERENCES',
    title:'Upcoming and past talks',
    lede:'Talks, posters, webinars, invited sessions. Slides on request.',
  };

  return (
    <main className="shell">
      <KickerBlock kicker={t.kicker} title={t.title} lede={t.lede} />
      <div className="itemlist">
        {confs.map((c, i) => {
          const date = c.year + '·' + String(c.month).padStart(2, '0');
          const loc  = c.country ? c.city + ', ' + c.country : c.city;
          return (
            <div className="itemlist__row itemlist__row--conf" key={i}>
              <div className="itemlist__date">{date}</div>
              <div className="itemlist__fmt">{c.format}</div>
              <div>
                <div className="itemlist__title">{c.title[lang]}</div>
                <div className="itemlist__sub">{c.event} · {loc}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <StatusPip kind={c.status} lang={lang} />
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

// ============================================================================
// Writings (blog index)
// ============================================================================
function Writings({ lang, onNav, onOpenArticle }) {
  const [articles, setArticles] = React.useState([]);
  React.useEffect(() => {
    fetch('data/notes/index.json')
      .then(r => r.json())
      .then(slugs =>
        Promise.all(
          slugs.map(slug =>
            fetch(`data/notes/${slug}.json`)
              .then(r => r.json())
              .then(a => ({ ...a, slug }))
          )
        )
      )
      .then(list => {
        // Sort newest first by ISO date
        list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        setArticles(list);
        window.ARTICLES = list; // cache for BlogPost
      })
      .catch(() => {});
  }, []);

  // Format ISO "YYYY-MM-DD" → "YYYY·MM·DD" for display
  const fmtDate = (d) => (d || '').replaceAll('-', '·');

  const t = lang === 'fr' ? {
    kicker:'04 — NOTES',
    title:'Réflexions et <em>marginalia</em>',
    lede:"Penser tout haut, en espérant déclencher des résonances.",
  } : {
    kicker:'04 — NOTES',
    title:'Essays and <em>marginalia</em>',
    lede:"Thinking aloud, hoping to spark resonances.",
  };
  return (
    <main className="shell">
      <KickerBlock kicker={t.kicker} title={t.title} lede={t.lede} />

      {/* Featured — the latest essay, displayed full-width above the grid */}
      {articles.length > 0 && (() => {
        const w = articles[0];
        return (
          <article className="essay-featured" onClick={()=>onOpenArticle(w.slug)}>
            <div className="essay-featured__side">
              <div className="essay-featured__kicker">{lang==='fr' ? 'À LA UNE' : 'FEATURED'}</div>
              <div className="essay-featured__meta">{fmtDate(w.date)} · {w.read} · {w.tag[lang]}</div>
            </div>
            <div className="essay-featured__main">
              <h2 className="essay-featured__title">{w.title[lang]}</h2>
              <p className="essay-featured__sub">{w.sub[lang]}</p>
              <span className="essay-featured__cta">{lang==='fr' ? 'Lire la note  →' : 'Read the note  →'}</span>
            </div>
          </article>
        );
      })()}

      {/* Index — all other essays, single column with date/tag rail */}
      <div className="essays-index">
        <div className="essays-index__head">
          <span className="essays-index__h">{lang==='fr' ? 'TOUTES LES NOTES' : 'ALL NOTES'}</span>
        </div>
        {articles.slice(1).map(w => (
          <button key={w.slug} className="essay-row" onClick={()=>onOpenArticle(w.slug)}>
            <div className="essay-row__date">{fmtDate(w.date)}</div>
            <div className="essay-row__body">
              <div className="essay-row__tag">{w.tag[lang]} · {w.read}</div>
              <h3 className="essay-row__title">{w.title[lang]}</h3>
              <p className="essay-row__sub">{w.sub[lang]}</p>
            </div>
            <div className="essay-row__arr">→</div>
          </button>
        ))}
      </div>

      {/* Invite to write back — links to the contact page */}
      <aside className="essay-follow">
        <div className="essay-follow__l">
          <div className="essay-follow__k">{lang==='fr' ? 'ÉCHANGER' : 'REPLY'}</div>
          <p className="essay-follow__t">
            {lang==='fr'
              ? "Une idée, un désaccord, une lecture à partager ? Écrivez-moi."
              : "An idea, a disagreement, a reading to share? Write to me."}
          </p>
        </div>
        <div className="essay-follow__r">
          <button
            type="button"
            className="essay-follow__btn"
            onClick={() => onNav && onNav('contact')}
          >
            {lang==='fr' ? "M'ÉCRIRE  →" : "WRITE TO ME  →"}
          </button>
        </div>
      </aside>
    </main>
  );
}

Object.assign(window, { Home, Research, Publications, Conferences, Writings });
