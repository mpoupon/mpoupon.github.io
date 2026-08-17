const { useState } = React;
function Header({ section, lang, onNav, onLang, heroOverlay }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [overHero, setOverHero] = useState(!!heroOverlay);
  const items = [
    { id: "home", fr: "Accueil", en: "Home" },
    { id: "research", fr: "Projets", en: "Projects" },
    { id: "pubs", fr: "Publications", en: "Publications" },
    { id: "engage", fr: "Interventions", en: "Appearances" },
    { id: "essays", fr: "Notes", en: "Notes" },
    { id: "contact", fr: "Contact", en: "Contact" }
  ];
  const handleNav = (id) => {
    setMenuOpen(false);
    onNav(id);
  };
  const active = items.find((i) => i.id === section);
  React.useEffect(() => {
    if (!heroOverlay) {
      setOverHero(false);
      return;
    }
    const onScroll = () => {
      const photo = document.querySelector(".banner-info__portrait-frame");
      const header = document.querySelector(".site-header");
      if (!photo) {
        setOverHero(window.scrollY <= 0);
        return;
      }
      const navH = header ? header.getBoundingClientRect().height : 81;
      const photoTop = photo.getBoundingClientRect().top;
      setOverHero(photoTop > navH);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [heroOverlay]);
  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  return React.createElement("header", {
    className: "site-header" + (menuOpen ? " is-open" : "") + (overHero && !menuOpen ? " is-over-hero" : "")
  }, React.createElement("div", {
    className: "shell site-header__row"
  }, React.createElement("button", {
    className: "site-brand",
    onClick: () => handleNav("home"),
    style: { background: "none", border: 0, cursor: "pointer", padding: 0 }
  }, React.createElement("img", {
    src: "assets/logo.svg",
    width: "32",
    height: "32",
    alt: "",
    className: "site-brand__logo"
  }), React.createElement("span", {
    className: "site-brand__name"
  }, "Mathieu Poupon")), React.createElement("div", {
    className: "site-header__mobile-meta"
  }, React.createElement("span", {
    className: "lang-toggle lang-toggle--mobile",
    "data-active": lang,
    role: "group",
    "aria-label": "Language"
  }, React.createElement("span", {
    className: "lang-toggle__thumb",
    "aria-hidden": "true"
  }), React.createElement("button", {
    className: lang === "fr" ? "is-active" : "",
    onClick: () => onLang("fr"),
    "aria-pressed": lang === "fr",
    "aria-label": "Français"
  }, React.createElement("svg", {
    className: "lang-toggle__flag",
    viewBox: "0 0 24 16",
    width: "24",
    height: "16",
    "aria-hidden": "true"
  }, React.createElement("rect", {
    x: "0",
    y: "0",
    width: "8",
    height: "16",
    fill: "#0055A4"
  }), React.createElement("rect", {
    x: "8",
    y: "0",
    width: "8",
    height: "16",
    fill: "#FFFFFF"
  }), React.createElement("rect", {
    x: "16",
    y: "0",
    width: "8",
    height: "16",
    fill: "#EF4135"
  }))), React.createElement("button", {
    className: lang === "en" ? "is-active" : "",
    onClick: () => onLang("en"),
    "aria-pressed": lang === "en",
    "aria-label": "English"
  }, React.createElement("svg", {
    className: "lang-toggle__flag",
    viewBox: "0 0 24 16",
    width: "24",
    height: "16",
    "aria-hidden": "true"
  }, React.createElement("rect", {
    width: "24",
    height: "16",
    fill: "#FFFFFF"
  }), React.createElement("g", {
    fill: "#B22234"
  }, React.createElement("rect", {
    y: "1.23",
    width: "24",
    height: "1.23"
  }), React.createElement("rect", {
    y: "3.69",
    width: "24",
    height: "1.23"
  }), React.createElement("rect", {
    y: "6.15",
    width: "24",
    height: "1.23"
  }), React.createElement("rect", {
    y: "8.61",
    width: "24",
    height: "1.23"
  }), React.createElement("rect", {
    y: "11.07",
    width: "24",
    height: "1.23"
  }), React.createElement("rect", {
    y: "13.53",
    width: "24",
    height: "1.23"
  })), React.createElement("rect", {
    width: "10",
    height: "8.62",
    fill: "#3C3B6E"
  }), React.createElement("g", {
    fill: "#FFFFFF"
  }, React.createElement("circle", {
    cx: "2",
    cy: "2",
    r: "0.55"
  }), React.createElement("circle", {
    cx: "5",
    cy: "2",
    r: "0.55"
  }), React.createElement("circle", {
    cx: "8",
    cy: "2",
    r: "0.55"
  }), React.createElement("circle", {
    cx: "3.5",
    cy: "4.3",
    r: "0.55"
  }), React.createElement("circle", {
    cx: "6.5",
    cy: "4.3",
    r: "0.55"
  }), React.createElement("circle", {
    cx: "2",
    cy: "6.6",
    r: "0.55"
  }), React.createElement("circle", {
    cx: "5",
    cy: "6.6",
    r: "0.55"
  }), React.createElement("circle", {
    cx: "8",
    cy: "6.6",
    r: "0.55"
  }))))), React.createElement("button", {
    className: "site-header__burger" + (menuOpen ? " is-open" : ""),
    onClick: () => setMenuOpen((v) => !v),
    "aria-label": "Menu",
    "aria-expanded": menuOpen
  }, React.createElement("span", null), React.createElement("span", null), React.createElement("span", null))), React.createElement("nav", {
    className: "site-nav" + (menuOpen ? " is-open" : "")
  }, items.map((it) => React.createElement("button", {
    key: it.id,
    className: "site-nav__link" + (section === it.id ? " is-active" : ""),
    onClick: () => handleNav(it.id)
  }, lang === "fr" ? it.fr : it.en)), React.createElement("span", {
    className: "lang-toggle",
    "data-active": lang,
    role: "group",
    "aria-label": "Language"
  }, React.createElement("span", {
    className: "lang-toggle__thumb",
    "aria-hidden": "true"
  }), React.createElement("button", {
    className: lang === "fr" ? "is-active" : "",
    onClick: () => onLang("fr"),
    "aria-pressed": lang === "fr",
    "aria-label": "Français"
  }, React.createElement("svg", {
    className: "lang-toggle__flag",
    viewBox: "0 0 24 16",
    width: "24",
    height: "16",
    "aria-hidden": "true"
  }, React.createElement("rect", {
    x: "0",
    y: "0",
    width: "8",
    height: "16",
    fill: "#0055A4"
  }), React.createElement("rect", {
    x: "8",
    y: "0",
    width: "8",
    height: "16",
    fill: "#FFFFFF"
  }), React.createElement("rect", {
    x: "16",
    y: "0",
    width: "8",
    height: "16",
    fill: "#EF4135"
  }))), React.createElement("button", {
    className: lang === "en" ? "is-active" : "",
    onClick: () => onLang("en"),
    "aria-pressed": lang === "en",
    "aria-label": "English"
  }, React.createElement("svg", {
    className: "lang-toggle__flag",
    viewBox: "0 0 24 16",
    width: "24",
    height: "16",
    "aria-hidden": "true"
  }, React.createElement("rect", {
    width: "24",
    height: "16",
    fill: "#FFFFFF"
  }), React.createElement("g", {
    fill: "#B22234"
  }, React.createElement("rect", {
    y: "1.23",
    width: "24",
    height: "1.23"
  }), React.createElement("rect", {
    y: "3.69",
    width: "24",
    height: "1.23"
  }), React.createElement("rect", {
    y: "6.15",
    width: "24",
    height: "1.23"
  }), React.createElement("rect", {
    y: "8.61",
    width: "24",
    height: "1.23"
  }), React.createElement("rect", {
    y: "11.07",
    width: "24",
    height: "1.23"
  }), React.createElement("rect", {
    y: "13.53",
    width: "24",
    height: "1.23"
  })), React.createElement("rect", {
    width: "10",
    height: "8.62",
    fill: "#3C3B6E"
  }), React.createElement("g", {
    fill: "#FFFFFF"
  }, React.createElement("circle", {
    cx: "2",
    cy: "2",
    r: "0.55"
  }), React.createElement("circle", {
    cx: "5",
    cy: "2",
    r: "0.55"
  }), React.createElement("circle", {
    cx: "8",
    cy: "2",
    r: "0.55"
  }), React.createElement("circle", {
    cx: "3.5",
    cy: "4.3",
    r: "0.55"
  }), React.createElement("circle", {
    cx: "6.5",
    cy: "4.3",
    r: "0.55"
  }), React.createElement("circle", {
    cx: "2",
    cy: "6.6",
    r: "0.55"
  }), React.createElement("circle", {
    cx: "5",
    cy: "6.6",
    r: "0.55"
  }), React.createElement("circle", {
    cx: "8",
    cy: "6.6",
    r: "0.55"
  }))))))));
}
function Footer({ lang, onNav }) {
  const t = lang === "fr" ? {
    h1: "AFFILIATIONS",
    h2: "CONTACT",
    address1: ["LOCEAN–IPSL", "Sorbonne Université", "4 place Jussieu", "75005 Paris, France"],
    emailLabel: "Écrire",
    bottom: "© 2026 Mathieu Poupon · Tous droits réservés."
  } : {
    h1: "AFFILIATIONS",
    h2: "CONTACT",
    address1: ["LOCEAN–IPSL", "Sorbonne Université", "4 place Jussieu", "75005 Paris, France"],
    emailLabel: "Write",
    bottom: "© 2026 Mathieu Poupon · All rights reserved."
  };
  const coord1 = "48.846°N · 2.357°E";
  return React.createElement("footer", {
    className: "site-footer"
  }, React.createElement("div", {
    className: "shell"
  }, React.createElement("div", {
    className: "site-footer__grid"
  }, React.createElement("div", {
    className: "site-footer__col"
  }, React.createElement("div", {
    className: "site-footer__h"
  }, t.h1), React.createElement("div", {
    className: "site-footer__addr"
  }, React.createElement("div", {
    className: "site-footer__affil"
  }, t.address1.map((l, i) => React.createElement("div", {
    key: i
  }, l)), React.createElement("div", {
    className: "site-footer__coord"
  }, coord1)))), React.createElement("div", {
    className: "site-footer__col"
  }, React.createElement("button", {
    className: "site-footer__h site-footer__h--link",
    onClick: () => onNav && onNav("contact"),
    "aria-label": lang === "fr" ? "Aller à la page contact" : "Go to contact page"
  }, t.h2, "  ", React.createElement("span", {
    className: "site-footer__h-arr"
  }, "→")), React.createElement("a", {
    className: "site-footer__email",
    href: "mailto:mathieu.poupon@locean.ipsl.fr"
  }, "mathieu.poupon", React.createElement("span", {
    className: "site-footer__email-at"
  }, "@"), "locean.ipsl.fr")))));
}
function KickerBlock({ kicker, title, lede }) {
  return React.createElement("div", {
    className: "kicker-block"
  }, React.createElement("h1", {
    className: "kicker-block__title",
    dangerouslySetInnerHTML: { __html: title }
  }), lede && React.createElement("p", {
    className: "kicker-block__lede",
    dangerouslySetInnerHTML: { __html: lede }
  }));
}
function StatusPip({ kind, lang }) {
  const labels = {
    fr: { live: "EN COURS", done: "PUBLIÉ", closed: "TERMINÉ", upcoming: "À VENIR", held: "TENUE", review: "EN RÉVISION", policy: "POLICY" },
    en: { live: "ACTIVE", done: "PUBLISHED", closed: "COMPLETED", upcoming: "UPCOMING", held: "HELD", review: "UNDER REVIEW", policy: "POLICY" }
  };
  const colorMap = { live: "live", done: "live", closed: "closed", upcoming: "live", review: "review", held: "done", policy: "done" };
  return React.createElement("span", {
    className: `status-pip status-pip--${colorMap[kind]}`
  }, React.createElement("span", {
    className: "status-pip__dot"
  }), React.createElement("span", null, labels[lang][kind]));
}
function FigurePlaceholder({ seed = 1, label }) {
  let s = seed;
  const r = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const W = 400, H = 180, M = 20;
  const lines = ["#16273A", "#1E7D74", "#C5612E"].map((color, idx) => {
    let d = `M ${M} ${H - M}`;
    let y = H - M - 20 - idx * 25;
    for (let x = M;x <= W - M; x += 14) {
      y += (r() - 0.5) * 18 - (idx === 0 ? 1.2 : idx === 1 ? 0.3 : 0.8);
      y = Math.max(M + 10, Math.min(H - M - 2, y));
      d += ` L ${x} ${y.toFixed(1)}`;
    }
    return React.createElement("path", {
      key: idx,
      d,
      fill: "none",
      stroke: color,
      strokeWidth: "1.1"
    });
  });
  return React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    width: "100%",
    style: { display: "block", maxHeight: 200 }
  }, React.createElement("line", {
    x1: M,
    y1: H - M,
    x2: W - M,
    y2: H - M,
    stroke: "#E0DCD0"
  }), React.createElement("line", {
    x1: M,
    y1: M,
    x2: M,
    y2: H - M,
    stroke: "#E0DCD0"
  }), lines, label && React.createElement("text", {
    x: M,
    y: 14,
    fontFamily: "JetBrains Mono",
    fontSize: "9",
    letterSpacing: "1.5",
    fill: "#8A93A0"
  }, label));
}
Object.assign(window, { Header, Footer, KickerBlock, StatusPip, FigurePlaceholder });
