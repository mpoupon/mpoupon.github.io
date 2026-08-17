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
function App() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
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
  const setLang = (l) => setTweak("lang", l);
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
  }), body, React.createElement("div", {
    className: "site-copyright"
  }, "© 2026 Mathieu Poupon · ", lang === "fr" ? "Tous droits réservés" : "All rights reserved"), React.createElement(TweaksPanel, {
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
  })));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));
