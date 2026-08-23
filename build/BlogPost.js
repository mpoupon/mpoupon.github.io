function BlogPost({ slug, lang, onBack }) {
  const [w, setW] = React.useState(() => {
    const cached = (window.ARTICLES || []).find((a) => a.slug === slug);
    return cached || null;
  });
  React.useEffect(() => {
    if (w)
      return;
    fetch(`data/notes/${slug}.json`).then((r) => r.json()).then((a) => setW({ ...a, slug })).catch(() => {});
  }, [slug, w]);
  if (!w)
    return null;
  const t = lang === "fr" ? {
    kicker: "04 — NOTES",
    back: "← TOUTES LES NOTES",
    meta: { date: "PUBLIÉ", read: "LECTURE", tags: "TAGS", cite: "CITATION" }
  } : {
    kicker: "04 — NOTES",
    back: "← ALL NOTES",
    meta: { date: "PUBLISHED", read: "READ", tags: "TAGS", cite: "CITE" }
  };
  const displayDate = (w.date || "").replaceAll("-", "·");
  return React.createElement("main", {
    id: "main"
  }, React.createElement("article", {
    className: "article"
  }, React.createElement("div", {
    className: "article__kicker"
  }, t.kicker), React.createElement("h1", {
    className: "article__title",
    dangerouslySetInnerHTML: { __html: w.title[lang] }
  }), React.createElement("p", {
    className: "article__lede"
  }, w.sub[lang]), React.createElement("div", {
    className: "article__meta"
  }, React.createElement("span", null, React.createElement("span", {
    style: { color: "var(--ink-grey)", fontWeight: 500, letterSpacing: "0.18em" }
  }, t.meta.date), "   ", displayDate), React.createElement("span", null, React.createElement("span", {
    style: { color: "var(--ink-grey)", fontWeight: 500, letterSpacing: "0.18em" }
  }, t.meta.read), "   ", w.read), React.createElement("span", null, React.createElement("span", {
    style: { color: "var(--ink-grey)", fontWeight: 500, letterSpacing: "0.18em" }
  }, t.meta.cite), "   mathieupoupon.science/notes/", w.slug)), React.createElement("div", {
    className: "article__body",
    dangerouslySetInnerHTML: { __html: w.body[lang] }
  }), React.createElement("button", {
    className: "article__back",
    onClick: onBack
  }, t.back)));
}
Object.assign(window, { BlogPost });
