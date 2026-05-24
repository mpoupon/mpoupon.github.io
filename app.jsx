// Root SPA. Holds section + language + article state and routes between views.
// Tweaks: hero variant, density, dark mode (lang persisted via tweaks too).

const { useState: useStateApp, useEffect: useEffectApp } = React;

function App() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  const [section, setSection] = useStateApp('home');
  const [article, setArticle] = useStateApp(null); // article slug, when open

  const lang = t.lang === 'en' ? 'en' : 'fr';
  const setLang = (l) => setTweak('lang', l);

  // Apply dark + density to the root data-attrs so CSS can hook in.
  useEffectApp(() => {
    document.documentElement.dataset.theme = t.dark ? 'dark' : 'light';
    document.documentElement.dataset.density = t.density || 'regular';
    document.documentElement.lang = lang;
  }, [t.dark, t.density, lang]);

  const onNav = (s) => { setArticle(null); setSection(s); window.scrollTo({top:0,behavior:'instant'}); };
  const openArticle = (slug) => { setArticle(slug); window.scrollTo({top:0,behavior:'instant'}); };
  const closeArticle = () => { setArticle(null); };

  let body;
  if (article !== null) {
    body = <BlogPost slug={article} lang={lang} onBack={closeArticle} />;
  } else if (section === 'home') {
    body = <Home lang={lang} onNav={onNav} onOpenArticle={openArticle} hero={t.hero} />;
  } else if (section === 'research') {
    body = <Research lang={lang} />;
  } else if (section === 'pubs') {
    body = <Publications lang={lang} />;
  } else if (section === 'engage') {
    body = <Engagement lang={lang} />;
  } else if (section === 'essays') {
    body = <Writings lang={lang} onNav={onNav} onOpenArticle={openArticle} />;
  } else if (section === 'contact') {
    body = <Contact lang={lang} />;
  }

  return (
    <div className="site" data-screen-label={`Website / ${article !== null ? 'Article' : section}`}>
      <Header section={section} lang={lang} onNav={onNav} onLang={setLang}
              heroOverlay={section === 'home' && article === null && t.hero === 'frontispiece'} />
      {body}
      <div className="site-copyright">
        © 2026 Mathieu Poupon · {lang === 'fr' ? 'Tous droits réservés' : 'All rights reserved'}
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label={lang === 'fr' ? 'Affichage' : 'Display'} />
        <TweakRadio
          label={lang === 'fr' ? 'Thème' : 'Theme'}
          value={t.dark ? 'dark' : 'light'}
          options={[
            { value: 'light', label: lang === 'fr' ? 'Ivoire' : 'Ivory' },
            { value: 'dark',  label: lang === 'fr' ? 'Prusse' : 'Prussian' },
          ]}
          onChange={(v) => setTweak('dark', v === 'dark')}
        />
        <TweakRadio
          label={lang === 'fr' ? 'Densité' : 'Density'}
          value={t.density || 'regular'}
          options={[
            { value: 'compact', label: lang === 'fr' ? 'Compact' : 'Compact' },
            { value: 'regular', label: lang === 'fr' ? 'Régulier' : 'Regular' },
            { value: 'airy',    label: lang === 'fr' ? 'Aéré' : 'Airy' },
          ]}
          onChange={(v) => setTweak('density', v)}
        />
        <TweakSection label={lang === 'fr' ? 'Accueil' : 'Home'} />
        <TweakSelect
          label={lang === 'fr' ? 'Hero' : 'Hero'}
          value={t.hero || 'portrait'}
          options={[
            { value: 'frontispiece', label: lang === 'fr' ? 'Page de garde (par défaut)' : 'Frontispiece (default)' },
            { value: 'portrait',     label: lang === 'fr' ? 'Portrait à droite' : 'Portrait right' },
            { value: 'minimal',      label: lang === 'fr' ? 'Minimal (nom seul)' : 'Minimal (name only)' },
          ]}
          onChange={(v) => setTweak('hero', v)}
        />
        <TweakSection label={lang === 'fr' ? 'Langue' : 'Language'} />
        <TweakRadio
          label={lang === 'fr' ? 'Langue par défaut' : 'Default language'}
          value={lang}
          options={[{value:'fr',label:'FR'},{value:'en',label:'EN'}]}
          onChange={setLang}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
