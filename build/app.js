const { useState: useStateApp, useEffect: useEffectApp } = React;
const ROUTE_SECTIONS = ["home", "research", "pubs", "engage", "essays", "contact"];
function readRoute() {
  const h = decodeURIComponent((window.location.hash || "").replace(/^#\/?/, ""));
  if (!h)
    return { section: "home", article: null };
  const [head, ...rest] = h.split("/");
  if (head === "note" && rest.length)
    return { section: "essays", article: rest.join("/") };
  if (ROUTE_SECTIONS.includes(head))
    return { section: head, article: null };
  return { section: "home", article: null };
}
function writeRoute(section, article) {
  const target = article ? `#note/${encodeURIComponent(article)}` : section === "home" ? "" : `#${section}`;
  if ((window.location.hash || "") === target)
    return;
  if (target === "") {
    history.pushState(null, "", window.location.pathname + window.location.search);
  } else {
    window.location.hash = target;
  }
}
const LANG_KEY = "mp.lang";
function readStoredLang() {
  try {
    const v = localStorage.getItem(LANG_KEY);
    return v === "fr" || v === "en" ? v : null;
  } catch (e) {
    return null;
  }
}
function storeLang(l) {
  try {
    localStorage.setItem(LANG_KEY, l);
  } catch (e) {}
}
function initialTweaks() {
  const urlLang = new URLSearchParams(window.location.search).get("lang");
  const lang = urlLang === "fr" || urlLang === "en" ? urlLang : readStoredLang();
  return lang ? { ...window.TWEAK_DEFAULTS, lang } : window.TWEAK_DEFAULTS;
}
function App() {
  const [t, setTweak] = useTweaks(initialTweaks());
  const initialRoute = readRoute();
  const [section, setSection] = useStateApp(initialRoute.section);
  const [article, setArticle] = useStateApp(initialRoute.article);
  useEffectApp(() => {
    const onRouteChange = () => {
      const r = readRoute();
      setSection(r.section);
      setArticle(r.article);
    };
    window.addEventListener("hashchange", onRouteChange);
    window.addEventListener("popstate", onRouteChange);
    return () => {
      window.removeEventListener("hashchange", onRouteChange);
      window.removeEventListener("popstate", onRouteChange);
    };
  }, []);
  const lang = t.lang === "en" ? "en" : "fr";
  const setLang = (l) => {
    storeLang(l);
    setTweak("lang", l);
  };
  const [panelReady, setPanelReady] = useStateApp(false);
  useEffectApp(() => {
    if (!new URLSearchParams(window.location.search).has("tweaks"))
      return;
    if (window.TweaksPanel) {
      setPanelReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "build/tweaks-panel.js?v=86";
    s.onload = () => setPanelReady(true);
    document.head.appendChild(s);
  }, []);
  useEffectApp(() => {
    const SITE = "Mathieu Poupon";
    const names = {
      research: { fr: "Projets", en: "Projects" },
      pubs: { fr: "Publications", en: "Publications" },
      engage: { fr: "Interventions", en: "Appearances" },
      essays: { fr: "Notes", en: "Notes" },
      contact: { fr: "Contact", en: "Contact" }
    };
    const n = names[section];
    document.title = n ? `${n[lang] || n.en} — ${SITE}` : `${SITE} — Ocean & Climate Scientist`;
  }, [section, lang]);
  useEffectApp(() => {
    document.documentElement.dataset.theme = t.dark ? "dark" : "light";
    document.documentElement.dataset.density = t.density || "regular";
    document.documentElement.lang = lang;
  }, [t.dark, t.density, lang]);
  const onNav = (s) => {
    setArticle(null);
    setSection(s);
    writeRoute(s, null);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const openArticle = (slug) => {
    setArticle(slug);
    writeRoute("essays", slug);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const closeArticle = () => {
    setArticle(null);
    writeRoute(section, null);
  };
  let body;
  if (article !== null) {
    body = React.createElement(BlogPost, {
      slug: article,
      lang,
      onBack: closeArticle
    });
  } else if (section === "home") {
    body = React.createElement(Home, {
      lang,
      onNav,
      onOpenArticle: openArticle,
      hero: t.hero
    });
  } else if (section === "research") {
    body = React.createElement(Research, {
      lang
    });
  } else if (section === "pubs") {
    body = React.createElement(Publications, {
      lang
    });
  } else if (section === "engage") {
    body = React.createElement(Engagement, {
      lang
    });
  } else if (section === "essays") {
    body = React.createElement(Writings, {
      lang,
      onNav,
      onOpenArticle: openArticle
    });
  } else if (section === "contact") {
    body = React.createElement(Contact, {
      lang
    });
  }
  return React.createElement("div", {
    className: "site",
    "data-screen-label": `Website / ${article !== null ? "Article" : section}`
  }, React.createElement(Header, {
    section,
    lang,
    onNav,
    onLang: setLang,
    heroOverlay: section === "home" && article === null && t.hero === "frontispiece"
  }), body, React.createElement("footer", {
    className: "site-copyright"
  }, "© 2026 Mathieu Poupon · ", lang === "fr" ? "Tous droits réservés" : "All rights reserved"), panelReady && React.createElement(React.Fragment, null, React.createElement(TweaksPanel, {
    title: "Tweaks"
  }, React.createElement(TweakSection, {
    label: lang === "fr" ? "Affichage" : "Display"
  }), React.createElement(TweakRadio, {
    label: lang === "fr" ? "Thème" : "Theme",
    value: t.dark ? "dark" : "light",
    options: [
      { value: "light", label: lang === "fr" ? "Ivoire" : "Ivory" },
      { value: "dark", label: lang === "fr" ? "Prusse" : "Prussian" }
    ],
    onChange: (v) => setTweak("dark", v === "dark")
  }), React.createElement(TweakRadio, {
    label: lang === "fr" ? "Densité" : "Density",
    value: t.density || "regular",
    options: [
      { value: "compact", label: lang === "fr" ? "Compact" : "Compact" },
      { value: "regular", label: lang === "fr" ? "Régulier" : "Regular" },
      { value: "airy", label: lang === "fr" ? "Aéré" : "Airy" }
    ],
    onChange: (v) => setTweak("density", v)
  }), React.createElement(TweakSection, {
    label: lang === "fr" ? "Accueil" : "Home"
  }), React.createElement(TweakSelect, {
    label: lang === "fr" ? "Hero" : "Hero",
    value: t.hero || "portrait",
    options: [
      { value: "frontispiece", label: lang === "fr" ? "Page de garde (par défaut)" : "Frontispiece (default)" },
      { value: "portrait", label: lang === "fr" ? "Portrait à droite" : "Portrait right" },
      { value: "minimal", label: lang === "fr" ? "Minimal (nom seul)" : "Minimal (name only)" }
    ],
    onChange: (v) => setTweak("hero", v)
  }), React.createElement(TweakSection, {
    label: lang === "fr" ? "Langue" : "Language"
  }), React.createElement(TweakRadio, {
    label: lang === "fr" ? "Langue par défaut" : "Default language",
    value: lang,
    options: [{ value: "fr", label: "FR" }, { value: "en", label: "EN" }],
    onChange: setLang
  }))));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));
