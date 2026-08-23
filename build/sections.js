const RESEARCH = [
  {
    id: 1,
    title: { fr: "Ocean Alkalinity Enhancement", en: "Ocean Alkalinity Enhancement" },
    summary: {
      fr: "Comment modifier la chimie de l'océan peut augmenter le retrait de CO₂ atmosphérique — où est-ce viable, à quel coût et quels sont les facteurs limitants.",
      en: "How modifying ocean chemistry can enhance atmospheric CO₂ removal — where is it viable, at what cost, and what are the limiting factors."
    },
    status: "live",
    image: "assets/research/oae.webp",
    alt: { fr: "Vue aérienne du sillage d'un navire coloré par un traceur rose lors d'un essai en mer", en: "Aerial view of a ship's wake stained pink by a dye tracer during a field trial" }
  },
  {
    id: 2,
    title: { fr: "Biological Carbon Pump", en: "Biological Carbon Pump" },
    summary: {
      fr: "Comment l'activité biologique et ses interactions avec la dynamique océanique contrôlent le cycle du carbone et des nutriments.",
      en: "How biological activity and its interplay with ocean dynamics control the carbon and nutrient cycles."
    },
    status: "live",
    image: "assets/research/bcp.webp",
    alt: { fr: "Deux copépodes photographiés au microscope sur fond noir", en: "Two copepods photographed under the microscope against a black background" }
  },
  {
    id: 3,
    title: { fr: "Oxygen Natural Variability", en: "Oxygen Natural Variability" },
    summary: {
      fr: "Comment les modes de variabilité pluriannuelle et décennale de l'océan modifient la dynamique des zones pauvres en oxygène.",
      en: "How multi-year and decadal ocean variability modes shape the dynamics of low-oxygen zones."
    },
    status: "closed",
    image: "assets/research/oxygen.webp",
    alt: { fr: "Bulles de gaz remontant dans une eau bleue", en: "Gas bubbles rising through blue water" }
  }
];
const ENGAGE_PROJECTS = [
  {
    id: 1,
    title: { fr: "ECOP", en: "ECOP" },
    summary: {
      fr: "Coordination du nœud français d'ECOP — porter la voix des jeunes professionnels de l'océan et faciliter leur développement professionnel.",
      en: "Coordinating the French node of ECOP — giving early-career ocean professionals a voice and supporting their professional development."
    },
    status: "live",
    image: "assets/engagement/ecop.webp",
    alt: { fr: "Groupe de jeunes professionnels de l'océan réunis lors d'un atelier ECOP", en: "A group of early career ocean professionals gathered at an ECOP workshop" },
    url: "https://www.ecopdecade.org/france/"
  },
  {
    id: 5,
    title: { fr: "EU — Young Ocean Advocate", en: "EU — Young Ocean Advocate" },
    summary: {
      fr: "Jeune Ambassadeur de l'Océan auprès de la Commission européenne — porte-parole d'une génération engagée pour la protection et la gouvernance de l'océan.",
      en: "Young Ocean Advocate with the European Commission — voice of a generation committed to ocean protection and governance."
    },
    status: "live",
    image: "assets/engagement/young_ocean_advocate.webp",
    alt: { fr: "Visuel de la campagne européenne « I am a Young Ocean Advocate » avec le portrait de Mathieu Poupon", en: "European campaign card reading 'I am a Young Ocean Advocate', with a portrait of Mathieu Poupon" },
    url: "https://maritime-forum.ec.europa.eu/node/8227_en"
  },
  {
    id: 2,
    title: { fr: "JAC", en: "JAC" },
    summary: {
      fr: "Jeunes Ambassadeurs pour le Climat — conférences et formations en milieu scolaire sur les causes, conséquences et solutions du changement climatique.",
      en: "Jeunes Ambassadeurs pour le Climat — talks and training in schools on the causes, consequences and solutions of climate change."
    },
    status: "closed",
    image: "assets/engagement/jac.webp",
    alt: { fr: "Participants rassemblés sous un chapiteau lors d'un rassemblement des Jeunes Ambassadeurs pour le Climat", en: "Participants gathered under a marquee at a Jeunes Ambassadeurs pour le Climat meeting" },
    url: "https://jac-asso.fr/"
  },
  {
    id: 3,
    title: { fr: "ClimateScience", en: "ClimateScience" },
    summary: {
      fr: "Traducteur francophone pour l'app mobile et le site ClimateScience — contenu éducatif sur les causes et conséquences du changement climatique.",
      en: "French translator for the ClimateScience app and website — educational content on climate change."
    },
    status: "closed",
    image: "assets/engagement/climate_science.webp",
    alt: { fr: "Illustration de deux personnages en forme de planète travaillant sur des ordinateurs portables", en: "Illustration of two planet-shaped characters working on laptops" },
    url: "https://climatescience.org/"
  },
  {
    id: 6,
    title: { fr: "Juste 2°C", en: "Juste 2°C" },
    summary: {
      fr: "Vidéos et communication de vulgarisation sur les rapports du GIEC, les causes et les conséquences du changement climatique.",
      en: "Videos and outreach communication on IPCC reports, and the causes and consequences of climate change."
    },
    status: "closed",
    image: "assets/engagement/j2d.webp",
    alt: { fr: "Voilier ancré au coucher du soleil devant un paysage de montagnes", en: "A sailing ship at anchor at sunset in front of a mountain landscape" },
    url: "https://www.j2d.org/"
  },
  {
    id: 4,
    title: { fr: "Ordre de Grandeur", en: "Ordre de Grandeur" },
    summary: {
      fr: "Série de vidéos de vulgarisation sur les grands ordres de grandeur terrestres — pour comprendre le fonctionnement de notre planète.",
      en: "Popular science video series on Earth's orders of magnitude — helping the public understand how our planet works."
    },
    status: "closed",
    image: "assets/engagement/odg.webp",
    alt: { fr: "Mathieu Poupon devant un tableau noir couvert de courbes et d'équations sur le CO₂", en: "Mathieu Poupon at a blackboard covered with CO2 curves and equations" },
    url: "https://www.youtube.com/playlist?list=PLOF9KoYAaAFoFY-dbvlk2aJXJI0s_Lo7k"
  }
];
function Home({ lang, onNav, onOpenArticle, hero = "portrait" }) {
  const [pubs, setPubs] = React.useState([]);
  const [timeline, setTimeline] = React.useState([]);
  const [pubsCount, setPubsCount] = React.useState(typeof window !== "undefined" && window.matchMedia("(min-width: 1100px)").matches ? 4 : 3);
  React.useEffect(() => {
    fetch("data/publications.json").then((r) => r.json()).then(setPubs).catch(() => {});
    fetch("data/timeline.json").then((r) => r.json()).then(setTimeline).catch(() => {});
    const mql = window.matchMedia("(min-width: 1100px)");
    const onChange = (e) => setPubsCount(e.matches ? 4 : 3);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  const t = lang === "fr" ? {
    sub: "Chercheur en sciences de l'océan et en politique environnementale. Postdoc CNRS au LOCEAN–IPSL, après un doctorat à Princeton University. Je travaille sur le cycle naturel du carbone dans l'océan et sur sa modification délibérée par l'homme, ainsi que sur ce que chacun de ces sujets engage pour la prise de décision.",
    meta: "POSTDOC CNRS · LOCEAN–IPSL",
    coord: "48.846°N · 2.357°E — PARIS",
    routes: [
      ["01", "Projets", "research"],
      ["02", "Publications", "pubs"],
      ["03", "Interventions", "engage"],
      ["04", "Notes", "essays"]
    ],
    latest: "DERNIÈRES PUBLICATIONS",
    all: "TOUTES LES PUBLICATIONS  →",
    portraitCap: "PORTRAIT · 2025",
    bg: "PARCOURS"
  } : {
    sub: "Ocean science and environmental policy researcher. CNRS postdoc at LOCEAN–IPSL after a PhD at Princeton University. I work on the natural carbon cycle in the ocean and its deliberate modification by humans, and on what each commits us to in decision-making.",
    meta: "CNRS POSTDOC · LOCEAN–IPSL",
    coord: "48.846°N · 2.357°E — PARIS",
    routes: [
      ["01", "Projects", "research"],
      ["02", "Publications", "pubs"],
      ["03", "Appearances", "engage"],
      ["04", "Notes", "essays"]
    ],
    latest: "LATEST PUBLICATIONS",
    all: "ALL PUBLICATIONS  →",
    portraitCap: "PORTRAIT · 2025",
    bg: "CURRICULUM"
  };
  const heroAside = (() => {
    if (hero === "minimal")
      return null;
    return React.createElement("div", {
      className: "hero__aside"
    }, React.createElement("img", {
      className: "hero__portrait",
      src: "assets/home/portrait.webp",
      alt: "Mathieu Poupon"
    }), React.createElement("div", {
      className: "hero__caption"
    }, React.createElement("span", null, t.portraitCap), React.createElement("span", {
      style: { color: "var(--ink-grey)" }
    }, lang === "fr" ? "PARIS" : "PARIS")));
  })();
  const frontispiece = hero === "frontispiece" ? React.createElement("section", {
    className: "hero-frontispiece"
  }, React.createElement("div", {
    className: "hero-frontispiece__banner"
  }, React.createElement("div", {
    className: "banner-info"
  }, React.createElement("div", {
    className: "banner-info__left"
  }, React.createElement("div", {
    className: "banner-info__portrait-frame"
  }, React.createElement("img", {
    src: "assets/home/portrait.webp",
    alt: "Mathieu Poupon",
    className: "banner-info__portrait"
  })), React.createElement("div", {
    className: "banner-info__kicker"
  }, t.meta), React.createElement("div", {
    className: "banner-info__socials",
    "aria-label": lang === "fr" ? "Liens externes" : "External links"
  }, React.createElement("a", {
    className: "social-pill",
    href: "mailto:mathieu.poupon@locean.ipsl.fr",
    "aria-label": "Email"
  }, React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    width: "18",
    height: "18"
  }, React.createElement("rect", {
    x: "3",
    y: "5",
    width: "18",
    height: "14",
    rx: "2"
  }), React.createElement("path", {
    d: "M3 7l9 6 9-6"
  }))), React.createElement("a", {
    className: "social-pill",
    href: "https://scholar.google.com/citations?user=1kRXs-IAAAAJ",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "Google Scholar"
  }, React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    width: "18",
    height: "18"
  }, React.createElement("path", {
    d: "M12 3L1 9l11 6 9-4.91V17h2V9z"
  }), React.createElement("path", {
    d: "M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"
  }))), React.createElement("a", {
    className: "social-pill",
    href: "https://orcid.org/0000-0002-8136-4011",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "ORCID"
  }, React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    width: "18",
    height: "18"
  }, React.createElement("path", {
    d: "M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947 0 .525-.422.947-.947.947s-.947-.422-.947-.947c0-.516.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z"
  }))), React.createElement("a", {
    className: "social-pill",
    href: "https://github.com/mpoupon",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "GitHub"
  }, React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    width: "18",
    height: "18"
  }, React.createElement("path", {
    d: "M12 0C5.374 0 0 5.374 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.626-5.374-12-12-12z"
  }))), React.createElement("a", {
    className: "social-pill",
    href: "https://www.linkedin.com/in/mathieu-poupon",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "LinkedIn"
  }, React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    width: "18",
    height: "18"
  }, React.createElement("path", {
    d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
  }))), React.createElement("a", {
    className: "social-pill",
    href: "#cv",
    "aria-label": "CV (PDF)"
  }, React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    width: "18",
    height: "18"
  }, React.createElement("path", {
    d: "M14 3v4a1 1 0 001 1h4"
  }), React.createElement("path", {
    d: "M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V8z"
  }), React.createElement("line", {
    x1: "9",
    y1: "13",
    x2: "15",
    y2: "13"
  }), React.createElement("line", {
    x1: "9",
    y1: "17",
    x2: "13",
    y2: "17"
  }))))), React.createElement("div", {
    className: "banner-info__right"
  }, React.createElement("h1", {
    className: "banner-info__name"
  }, "Mathieu Poupon"), React.createElement("p", {
    className: "banner-info__sub"
  }, t.sub))), React.createElement("button", {
    type: "button",
    className: "scroll-cue",
    "aria-label": lang === "fr" ? "Faire défiler" : "Scroll down",
    onClick: () => {
      const next = document.querySelector(".routes");
      const header = document.querySelector(".site-header");
      if (!next)
        return;
      const navH = header ? header.getBoundingClientRect().height : 81;
      const targetY = next.getBoundingClientRect().top + window.scrollY - navH - 24;
      window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
    }
  }, React.createElement("svg", {
    className: "scroll-cue__chevron",
    viewBox: "0 0 32 16",
    width: "30",
    height: "15",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.1",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, React.createElement("polyline", {
    points: "3 4 16 13 29 4"
  }))))) : null;
  return React.createElement("main", {
    id: "main",
    className: "shell"
  }, frontispiece, hero !== "frontispiece" && React.createElement("section", {
    className: "hero hero--" + hero
  }, React.createElement("div", {
    className: "hero__main"
  }, React.createElement("h1", {
    className: "hero__display"
  }, "Mathieu", React.createElement("br", {
    className: "hero__break"
  }), " ", "Poupon"), React.createElement("p", {
    className: "hero__sub"
  }, t.sub), React.createElement("div", {
    className: "hero__meta"
  }, t.meta)), heroAside), React.createElement("nav", {
    className: "routes"
  }, t.routes.map(([n, l, id]) => React.createElement("a", {
    key: id,
    className: "route-tile",
    href: navHref(id),
    onClick: navClick(id, onNav)
  }, React.createElement("div", {
    className: "route-tile__label"
  }, l)))), React.createElement("section", {
    className: "latest"
  }, React.createElement("div", {
    className: "latest__head"
  }, React.createElement("span", {
    className: "latest__h"
  }, t.latest), React.createElement("a", {
    className: "latest__all",
    href: navHref("pubs"),
    onClick: navClick("pubs", onNav)
  }, t.all)), React.createElement("div", {
    className: "latest__list"
  }, pubs.filter((p) => p.status === "done").slice(0, pubsCount).map((p, i) => React.createElement("div", {
    className: "itemlist__row itemlist__row--pub",
    key: i
  }, React.createElement("div", {
    className: "itemlist__yr"
  }, p.year), React.createElement("div", null, React.createElement("div", {
    className: "itemlist__title"
  }, p.doi ? React.createElement("a", {
    href: `https://doi.org/${p.doi}`,
    target: "_blank",
    rel: "noopener noreferrer"
  }, p.title[lang]) : React.createElement("span", null, p.title[lang])), React.createElement("div", {
    className: "itemlist__sub",
    dangerouslySetInnerHTML: { __html: p.authors.replace(/Poupon M\. A\./g, "<strong>Poupon M. A.</strong>") }
  })), React.createElement("div", null, p.venue && React.createElement("div", {
    className: "itemlist__right"
  }, p.venue), React.createElement("div", {
    className: "itemlist__right-meta"
  }, React.createElement(StatusPip, {
    kind: p.status,
    lang
  }))))))), React.createElement("section", {
    className: "timeline"
  }, React.createElement("div", {
    className: "timeline__head"
  }, React.createElement("span", {
    className: "timeline__h"
  }, t.bg)), React.createElement("ol", {
    className: "timeline__list"
  }, timeline.map((it, i) => {
    const isCurrent = it.kind === "position";
    return React.createElement("li", {
      className: `timeline__item${isCurrent ? " timeline__item--current" : ""}`,
      key: i
    }, React.createElement("div", {
      className: "timeline__period"
    }, React.createElement("span", {
      className: "timeline__period-dates"
    }, it.period)), React.createElement("div", {
      className: "timeline__rail"
    }, React.createElement("span", {
      className: "timeline__dot"
    })), React.createElement("div", {
      className: "timeline__content"
    }, it.href ? React.createElement("a", {
      className: "timeline__title",
      href: it.href,
      target: "_blank",
      rel: "noopener noreferrer"
    }, it.title[lang]) : React.createElement("div", {
      className: "timeline__title"
    }, it.title[lang]), React.createElement("div", {
      className: "timeline__org"
    }, it.org[lang]), React.createElement("div", {
      className: "timeline__place"
    }, it.place)));
  }))), React.createElement("section", {
    className: "home-contact"
  }, React.createElement("a", {
    className: "home-contact__kicker home-contact__kicker--link",
    href: navHref("contact"),
    onClick: navClick("contact", onNav),
    "aria-label": lang === "fr" ? "Aller à la page contact" : "Go to contact page"
  }, "— ", lang === "fr" ? "CONTACT" : "CONTACT", " ", React.createElement("span", {
    className: "home-contact__kicker-arr"
  }, "→")), React.createElement("div", {
    className: "home-contact__grid"
  }, React.createElement("div", {
    className: "home-contact__col"
  }, React.createElement("div", {
    className: "home-contact__label"
  }, lang === "fr" ? "ADRESSE" : "ADDRESS"), React.createElement("address", {
    className: "home-contact__addr"
  }, React.createElement("div", null, "LOCEAN–IPSL"), React.createElement("div", null, "Sorbonne Université"), React.createElement("div", null, "4 place Jussieu, Tour 45/46"), React.createElement("div", null, "75005 Paris, France"))), React.createElement("div", {
    className: "home-contact__col"
  }, React.createElement("div", {
    className: "home-contact__label"
  }, lang === "fr" ? "COURRIEL" : "EMAIL"), React.createElement("a", {
    className: "home-contact__email",
    href: "mailto:mathieu.poupon@locean.ipsl.fr"
  }, "mathieu.poupon@locean.ipsl.fr")))));
}
function Research({ lang }) {
  const t = lang === "fr" ? {
    kicker: "01 — PROJETS",
    title: "Recherche et engagement",
    lede: "Mes axes de recherche, et les programmes d'engagement public auxquels je contribue.",
    s1t: "Recherche",
    s2t: "Engagement public"
  } : {
    kicker: "01 — PROJECTS",
    title: "Research and engagement",
    lede: "My research lines, and the public-engagement programmes I contribute to.",
    s1t: "Research",
    s2t: "Public engagement"
  };
  return React.createElement("main", {
    id: "main",
    className: "shell"
  }, React.createElement(KickerBlock, {
    kicker: t.kicker,
    title: t.title,
    lede: t.lede
  }), React.createElement("section", {
    className: "engage-block"
  }, React.createElement("header", {
    className: "engage-block__head"
  }, React.createElement("h2", {
    className: "engage-block__title"
  }, t.s1t)), React.createElement("div", {
    className: "research-grid"
  }, RESEARCH.map((p) => React.createElement("div", {
    key: p.id,
    className: "research-card"
  }, React.createElement("div", {
    className: "research-card__figure"
  }, React.createElement("img", {
    src: p.image,
    alt: p.alt ? lang === "fr" ? p.alt.fr : p.alt.en : "",
    loading: "lazy",
    className: "research-card__img"
  })), React.createElement("div", {
    className: "research-card__status"
  }, React.createElement(StatusPip, {
    kind: p.status,
    lang
  })), React.createElement("div", {
    className: "research-card__body"
  }, React.createElement("h3", {
    dangerouslySetInnerHTML: { __html: p.title[lang] }
  }), React.createElement("p", null, p.summary[lang])))))), React.createElement("section", {
    className: "engage-block"
  }, React.createElement("header", {
    className: "engage-block__head"
  }, React.createElement("h2", {
    className: "engage-block__title"
  }, t.s2t)), React.createElement("div", {
    className: "research-grid"
  }, ENGAGE_PROJECTS.map((p) => React.createElement("a", {
    key: p.id,
    className: "research-card",
    href: p.url,
    target: "_blank",
    rel: "noopener noreferrer"
  }, React.createElement("div", {
    className: "research-card__figure"
  }, React.createElement("img", {
    src: p.image,
    alt: p.alt ? lang === "fr" ? p.alt.fr : p.alt.en : "",
    loading: "lazy",
    className: "research-card__img"
  })), React.createElement("div", {
    className: "research-card__status"
  }, React.createElement(StatusPip, {
    kind: p.status,
    lang
  })), React.createElement("div", {
    className: "research-card__body"
  }, React.createElement("h3", {
    dangerouslySetInnerHTML: { __html: p.title[lang] }
  }), React.createElement("p", null, p.summary[lang])))))));
}
function Publications({ lang }) {
  const [pubs, setPubs] = React.useState([]);
  React.useEffect(() => {
    fetch("data/publications.json").then((r) => r.json()).then(setPubs).catch(() => {});
  }, []);
  const t = lang === "fr" ? {
    kicker: "02 — PUBLICATIONS",
    title: "Publications",
    lede: "Articles à comité de lecture, publiés ou en révision, et contributions à des documents d'orientation pour les politiques publiques.",
    s1: "Articles en révision",
    s2: "Articles publiés",
    s3: "Politiques publiques",
    article: "PDF",
    supp: "Supplementary"
  } : {
    kicker: "02 — PUBLICATIONS",
    title: "Publications",
    lede: "Peer-reviewed papers, published or under review, and policy-oriented documents I contributed expertise to.",
    s1: "Articles under review",
    s2: "Published articles",
    s3: "Policy contributions",
    article: "PDF",
    supp: "Supplementary"
  };
  React.useEffect(() => {
    let cancelled = false;
    const BADGE_SCRIPTS = [
      ["altmetric", "https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js"],
      ["dimensions", "https://badge.dimensions.ai/badge.js"]
    ];
    const renderBadges = () => {
      if (cancelled)
        return;
      try {
        window._altmetric_embed_init && window._altmetric_embed_init();
      } catch (e) {}
      try {
        window.__dimensions_embed && window.__dimensions_embed.addBadges && window.__dimensions_embed.addBadges();
      } catch (e) {}
    };
    BADGE_SCRIPTS.forEach(([key, src]) => {
      if (document.querySelector(`script[data-badge="${key}"]`))
        return;
      const el = document.createElement("script");
      el.src = src;
      el.async = true;
      el.dataset.badge = key;
      el.onload = renderBadges;
      document.head.appendChild(el);
    });
    renderBadges();
    const t1 = setTimeout(renderBadges, 400);
    const t2 = setTimeout(renderBadges, 1200);
    return () => {
      cancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  const reviewPubs = pubs.filter((p) => p.status === "review");
  const donePubs = pubs.filter((p) => p.status === "done");
  const policyPubs = pubs.filter((p) => p.status === "policy");
  const docIcon = React.createElement("span", {
    className: "itemlist__action-icon",
    "aria-hidden": "true"
  }, React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    width: "14",
    height: "14"
  }, React.createElement("path", {
    d: "M14 3v4a1 1 0 001 1h4"
  }), React.createElement("path", {
    d: "M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V8z"
  }), React.createElement("line", {
    x1: "9",
    y1: "13",
    x2: "15",
    y2: "13"
  }), React.createElement("line", {
    x1: "9",
    y1: "17",
    x2: "13",
    y2: "17"
  })));
  const renderRow = (p, i, withActions) => React.createElement("div", {
    className: "itemlist__row itemlist__row--pub",
    key: i
  }, React.createElement("div", {
    className: "itemlist__yr"
  }, p.status === "review" ? React.createElement("span", {
    className: "itemlist__spinner",
    "aria-label": lang === "fr" ? "En révision" : "Under review",
    title: lang === "fr" ? "En révision" : "Under review"
  }) : p.year), React.createElement("div", null, React.createElement("div", {
    className: "itemlist__title"
  }, p.doi ? React.createElement("a", {
    href: `https://doi.org/${p.doi}`,
    target: "_blank",
    rel: "noopener noreferrer"
  }, p.title[lang]) : p.url ? React.createElement("a", {
    href: p.url,
    target: "_blank",
    rel: "noopener noreferrer"
  }, p.title[lang]) : React.createElement("span", null, p.title[lang])), React.createElement("div", {
    className: "itemlist__sub",
    dangerouslySetInnerHTML: { __html: p.authors.replace(/Poupon M\. A\./g, "<strong>Poupon M. A.</strong>") }
  }), p.role && React.createElement("div", {
    className: "itemlist__sub itemlist__sub--role"
  }, p.role[lang]), (p.venue || withActions && (p.pdf || p.supp)) && React.createElement("div", {
    className: "itemlist__actions"
  }, p.venue && p.doi && React.createElement("a", {
    className: "itemlist__action itemlist__action--venue",
    href: `https://doi.org/${p.doi}`,
    target: "_blank",
    rel: "noopener noreferrer"
  }, p.venue), p.venue && !p.doi && p.url && React.createElement("a", {
    className: "itemlist__action itemlist__action--venue",
    href: p.url,
    target: "_blank",
    rel: "noopener noreferrer"
  }, p.venue), p.venue && !p.doi && !p.url && React.createElement("span", {
    className: "itemlist__action itemlist__action--venue itemlist__action--static"
  }, p.venue), withActions && p.pdf && React.createElement("a", {
    className: "itemlist__action",
    href: p.pdf,
    target: "_blank",
    rel: "noopener noreferrer"
  }, docIcon, t.article), withActions && p.supp && React.createElement("a", {
    className: "itemlist__action",
    href: p.supp,
    target: "_blank",
    rel: "noopener noreferrer"
  }, docIcon, t.supp))), React.createElement("div", null, withActions && p.doi && p.status !== "policy" && React.createElement("div", {
    className: "itemlist__right-badges"
  }, React.createElement("span", {
    className: "__dimensions_badge_embed__ itemlist__badge",
    "data-doi": p.doi,
    "data-style": "small_circle"
  }), React.createElement("div", {
    className: "altmetric-embed itemlist__badge",
    "data-badge-type": "donut",
    "data-badge-popover": "left",
    "data-hide-no-mentions": "true",
    "data-doi": p.doi
  })), React.createElement("div", {
    className: "itemlist__right-meta"
  }, React.createElement(StatusPip, {
    kind: p.status,
    lang
  }))));
  return React.createElement("main", {
    id: "main",
    className: "shell"
  }, React.createElement(KickerBlock, {
    kicker: t.kicker,
    title: t.title,
    lede: t.lede
  }), reviewPubs.length > 0 && React.createElement("section", {
    className: "engage-block"
  }, React.createElement("header", {
    className: "engage-block__head"
  }, React.createElement("h2", {
    className: "engage-block__title"
  }, t.s1)), React.createElement("div", {
    className: "itemlist"
  }, reviewPubs.map((p, i) => renderRow(p, `r-${i}`, false)))), donePubs.length > 0 && React.createElement("section", {
    className: "engage-block"
  }, React.createElement("header", {
    className: "engage-block__head"
  }, React.createElement("h2", {
    className: "engage-block__title"
  }, t.s2)), React.createElement("div", {
    className: "itemlist"
  }, donePubs.map((p, i) => renderRow(p, `d-${i}`, true)))), policyPubs.length > 0 && React.createElement("section", {
    className: "engage-block"
  }, React.createElement("header", {
    className: "engage-block__head"
  }, React.createElement("h2", {
    className: "engage-block__title"
  }, t.s3)), React.createElement("div", {
    className: "itemlist"
  }, policyPubs.map((p, i) => renderRow(p, `p-${i}`, true)))));
}
function confStatus(c) {
  const now = new Date;
  const past = c.year < now.getFullYear() || c.year === now.getFullYear() && c.month < now.getMonth() + 1;
  return past ? "held" : "upcoming";
}
function Conferences({ lang }) {
  const [confs, setConfs] = React.useState([]);
  React.useEffect(() => {
    fetch("data/conferences.json").then((r) => r.json()).then((data) => {
      setConfs(data);
      window.CONFS = data;
    }).catch(() => {});
  }, []);
  const t = lang === "fr" ? {
    kicker: "03 — CONFÉRENCES",
    title: "Interventions à venir et passées",
    lede: "Talks, posters, webinaires, sessions invitées. Diapos sur demande."
  } : {
    kicker: "03 — CONFERENCES",
    title: "Upcoming and past talks",
    lede: "Talks, posters, webinars, invited sessions. Slides on request."
  };
  return React.createElement("main", {
    id: "main",
    className: "shell"
  }, React.createElement(KickerBlock, {
    kicker: t.kicker,
    title: t.title,
    lede: t.lede
  }), React.createElement("div", {
    className: "itemlist"
  }, confs.map((c, i) => {
    const date = c.year + "·" + String(c.month).padStart(2, "0");
    const loc = c.country ? c.city + ", " + c.country : c.city;
    return React.createElement("div", {
      className: "itemlist__row itemlist__row--conf",
      key: i
    }, React.createElement("div", {
      className: "itemlist__date"
    }, date), React.createElement("div", {
      className: "itemlist__fmt"
    }, c.format), React.createElement("div", null, React.createElement("div", {
      className: "itemlist__title"
    }, c.title[lang]), React.createElement("div", {
      className: "itemlist__sub"
    }, c.event, " · ", loc)), React.createElement("div", {
      style: { textAlign: "right" }
    }, React.createElement(StatusPip, {
      kind: confStatus(c),
      lang
    })));
  })));
}
function Writings({ lang, onNav, onOpenArticle }) {
  const [articles, setArticles] = React.useState([]);
  React.useEffect(() => {
    fetch("data/notes/index.json").then((r) => r.json()).then((slugs) => Promise.all(slugs.map((slug) => fetch(`data/notes/${slug}.json`).then((r) => r.json()).then((a) => ({ ...a, slug }))))).then((list) => {
      list.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      setArticles(list);
      window.ARTICLES = list;
    }).catch(() => {});
  }, []);
  const fmtDate = (d) => (d || "").replaceAll("-", "·");
  const t = lang === "fr" ? {
    kicker: "04 — NOTES",
    title: "Réflexions et <em>marginalia</em>",
    lede: "Penser tout haut, en espérant déclencher des résonances."
  } : {
    kicker: "04 — NOTES",
    title: "Essays and <em>marginalia</em>",
    lede: "Thinking aloud, hoping to spark resonances."
  };
  return React.createElement("main", {
    id: "main",
    className: "shell"
  }, React.createElement(KickerBlock, {
    kicker: t.kicker,
    title: t.title,
    lede: t.lede
  }), articles.length > 0 && (() => {
    const w = articles[0];
    return React.createElement("article", {
      className: "essay-featured",
      onClick: () => onOpenArticle(w.slug)
    }, React.createElement("div", {
      className: "essay-featured__side"
    }, React.createElement("div", {
      className: "essay-featured__kicker"
    }, lang === "fr" ? "À LA UNE" : "FEATURED"), React.createElement("div", {
      className: "essay-featured__meta"
    }, fmtDate(w.date), " · ", w.read, " · ", w.tag[lang])), React.createElement("div", {
      className: "essay-featured__main"
    }, React.createElement("h2", {
      className: "essay-featured__title"
    }, w.title[lang]), React.createElement("p", {
      className: "essay-featured__sub"
    }, w.sub[lang]), React.createElement("span", {
      className: "essay-featured__cta"
    }, lang === "fr" ? "Lire la note  →" : "Read the note  →")));
  })(), React.createElement("div", {
    className: "essays-index"
  }, React.createElement("div", {
    className: "essays-index__head"
  }, React.createElement("span", {
    className: "essays-index__h"
  }, lang === "fr" ? "TOUTES LES NOTES" : "ALL NOTES")), articles.slice(1).map((w) => React.createElement("button", {
    key: w.slug,
    className: "essay-row",
    onClick: () => onOpenArticle(w.slug)
  }, React.createElement("div", {
    className: "essay-row__date"
  }, fmtDate(w.date)), React.createElement("div", {
    className: "essay-row__body"
  }, React.createElement("div", {
    className: "essay-row__tag"
  }, w.tag[lang], " · ", w.read), React.createElement("h3", {
    className: "essay-row__title"
  }, w.title[lang]), React.createElement("p", {
    className: "essay-row__sub"
  }, w.sub[lang])), React.createElement("div", {
    className: "essay-row__arr"
  }, "→")))), React.createElement("aside", {
    className: "essay-follow"
  }, React.createElement("div", {
    className: "essay-follow__l"
  }, React.createElement("div", {
    className: "essay-follow__k"
  }, lang === "fr" ? "ÉCHANGER" : "REPLY"), React.createElement("p", {
    className: "essay-follow__t"
  }, lang === "fr" ? "Une idée, un désaccord, une lecture à partager ? Écrivez-moi." : "An idea, a disagreement, a reading to share? Write to me.")), React.createElement("div", {
    className: "essay-follow__r"
  }, React.createElement("button", {
    type: "button",
    className: "essay-follow__btn",
    onClick: () => onNav && onNav("contact")
  }, lang === "fr" ? "M'ÉCRIRE  →" : "WRITE TO ME  →"))));
}
Object.assign(window, { Home, Research, Publications, Conferences, Writings, confStatus });
