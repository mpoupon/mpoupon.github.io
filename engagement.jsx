// Activities — three blocks: conferences, teaching & mentorship,
// interviews & blog. Content mirrors the old site mpoupon.github.io.

const FMT_LABELS = {
  fr: { TALK: 'CONFÉRENCE', POSTER: 'POSTER', WEBINAR: 'WEBINAIRE', 'ROUND TABLE': 'TABLE RONDE' },
  en: { TALK: 'TALK', POSTER: 'POSTER', WEBINAR: 'WEBINAR', 'ROUND TABLE': 'ROUND TABLE' },
};
const fmtLabel = (fmt, lang) => (FMT_LABELS[lang] && FMT_LABELS[lang][fmt]) || fmt;

// Teaching, press and conferences are loaded from data/*.json.
// To add an entry, edit the corresponding JSON file — no code change needed.

function Engagement({ lang }) {
  const [confsData,  setConfsData]  = React.useState([]);
  const [teaching,   setTeaching]   = React.useState([]);
  const [press,      setPress]      = React.useState([]);
  const [confsExpanded, setConfsExpanded] = React.useState(false);

  React.useEffect(() => {
    fetch('data/conferences.json').then(r => r.json()).then(setConfsData).catch(() => {});
    fetch('data/teaching.json').then(r => r.json()).then(setTeaching).catch(() => {});
    fetch('data/press.json').then(r => r.json()).then(setPress).catch(() => {});
  }, []);

  const t = lang === 'fr' ? {
    kicker:'03 — INTERVENTIONS',
    title:'Conférences, enseignement, presse',
    lede:"Conférences scientifiques, tables rondes, posters, enseignement et apparitions dans la presse.",
    s0: 'Conférences',
    s1: 'Enseignement et encadrement',
    s2: 'Entretiens et blog',
    showMore: 'Tout afficher',
    showLess: 'Réduire',
  } : {
    kicker:'03 — APPEARANCES',
    title:'Conferences, teaching, press',
    lede:"Scientific talks, round tables, posters, teaching activities, and press appearances.",
    s0: 'Conferences',
    s1: 'Teaching and Mentorship',
    s2: 'Interviews and Blog',
    showMore: 'Show all',
    showLess: 'Show less',
  };

  const allConfs = confsData.map(c => ({
    ...c,
    date: c.year + '·' + String(c.month).padStart(2, '0'),
    fmt:  c.format,
    loc:  c.country ? c.city + ', ' + c.country : c.city,
  }));
  const visibleConfs = confsExpanded ? allConfs : allConfs.slice(0, 3);

  return (
    <main className="shell">
      <KickerBlock kicker={t.kicker} title={t.title} lede={t.lede} />

      {/* Conferences */}
      <section className="engage-block">
        <header className="engage-block__head">
          <h2 className="engage-block__title">{t.s0}</h2>
        </header>
        <div className="itemlist">
          {visibleConfs.map((c, i) => (
            <div className="itemlist__row itemlist__row--conf" key={i}>
              <div className="itemlist__date">{c.date}</div>
              <div className="itemlist__fmt"><span className="fmt-pill" data-fmt={c.fmt}>{fmtLabel(c.fmt, lang)}</span></div>
              <div>
                <div className="itemlist__title">{c.title[lang]}</div>
                <div className="itemlist__sub">{c.event} · {c.loc}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <StatusPip kind={c.status} lang={lang} />
              </div>
            </div>
          ))}
        </div>
        {allConfs.length > 3 && (
          <button
            type="button"
            className="engage-block__toggle"
            onClick={() => setConfsExpanded(v => !v)}
            aria-expanded={confsExpanded}
          >
            {confsExpanded ? t.showLess : t.showMore}
            <span className="engage-block__toggle-arr" aria-hidden="true">{confsExpanded ? ' ↑' : ' ↓'}</span>
          </button>
        )}
      </section>

      {/* Teaching and Mentorship */}
      <section className="engage-block">
        <header className="engage-block__head">
          <h2 className="engage-block__title">{t.s1}</h2>
        </header>
        <div className="itemlist">
          {teaching.map((it, i) => (
            <div className="itemlist__row itemlist__row--teach" key={i}>
              <div className="itemlist__date">{it.date}</div>
              <div className="itemlist__fmt">{it.role[lang]}</div>
              <div>
                <div className="itemlist__title">
                  {it.href
                    ? <a href={it.href} target="_blank" rel="noopener noreferrer">{it.title[lang]}</a>
                    : <span>{it.title[lang]}</span>}
                </div>
                <div className="itemlist__sub">{it.venue[lang]}</div>
                {it.note && <div className="itemlist__note">{it.note[lang]}</div>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interviews and Blog */}
      <section className="engage-block">
        <header className="engage-block__head">
          <h2 className="engage-block__title">{t.s2}</h2>
        </header>
        <div className="itemlist">
          {press.map((it, i) => (
            <div className="itemlist__row itemlist__row--press" key={i}>
              <div className="itemlist__date">{it.year}</div>
              <div className="itemlist__org">{it.org}</div>
              <div>
                <div className="itemlist__title">
                  <a href={it.href} target="_blank" rel="noopener noreferrer">
                    {it.title[lang]}
                  </a>
                </div>
                <div className="itemlist__sub">{it.kind[lang]}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { Engagement });
