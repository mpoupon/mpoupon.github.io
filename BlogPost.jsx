// Long-text article view. Receives { slug, lang, onBack }.
// Article content is fetched from data/notes/{slug}.json.

function BlogPost({ slug, lang, onBack }) {
  const [w, setW] = React.useState(() => {
    // If already loaded by Writings, use cached version for instant render
    const cached = (window.ARTICLES || []).find(a => a.slug === slug);
    return cached || null;
  });

  React.useEffect(() => {
    if (w) return;
    fetch(`data/notes/${slug}.json`)
      .then(r => r.json())
      .then(a => setW({ ...a, slug }))
      .catch(() => {});
  }, [slug, w]);

  if (!w) return null;

  const t = lang === 'fr' ? {
    kicker: '04 — NOTES',
    back: '← TOUTES LES NOTES',
    meta: { date:'PUBLIÉ', read:'LECTURE', tags:'TAGS', cite:'CITATION' },
  } : {
    kicker: '04 — NOTES',
    back: '← ALL NOTES',
    meta: { date:'PUBLISHED', read:'READ', tags:'TAGS', cite:'CITE' },
  };

  // Format ISO "YYYY-MM-DD" → "YYYY·MM·DD" for display
  const displayDate = (w.date || '').replaceAll('-', '·');

  return (
    <main>
      <article className="article">
        <div className="article__kicker">{t.kicker}</div>
        <h1 className="article__title" dangerouslySetInnerHTML={{__html: w.title[lang]}} />
        <p className="article__lede">{w.sub[lang]}</p>
        <div className="article__meta">
          <span><span style={{color:'var(--ink-grey)',fontWeight:500,letterSpacing:'0.18em'}}>{t.meta.date}</span> &nbsp; {displayDate}</span>
          <span><span style={{color:'var(--ink-grey)',fontWeight:500,letterSpacing:'0.18em'}}>{t.meta.read}</span> &nbsp; {w.read}</span>
          <span><span style={{color:'var(--ink-grey)',fontWeight:500,letterSpacing:'0.18em'}}>{t.meta.cite}</span> &nbsp; mathieupoupon.science/notes/{w.slug}</span>
        </div>
        <div className="article__body" dangerouslySetInnerHTML={{__html: w.body[lang]}} />
        <button className="article__back" onClick={onBack}>{t.back}</button>
      </article>
    </main>
  );
}

Object.assign(window, { BlogPost });
