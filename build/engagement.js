const FMT_LABELS = {
  fr: { TALK: "CONFÉRENCE", POSTER: "POSTER", WEBINAR: "WEBINAIRE", "ROUND TABLE": "TABLE RONDE" },
  en: { TALK: "TALK", POSTER: "POSTER", WEBINAR: "WEBINAR", "ROUND TABLE": "ROUND TABLE" }
};
const fmtLabel = (fmt, lang) => FMT_LABELS[lang] && FMT_LABELS[lang][fmt] || fmt;
function Engagement({ lang }) {
  const [confsData, setConfsData] = React.useState([]);
  const [teaching, setTeaching] = React.useState([]);
  const [press, setPress] = React.useState([]);
  const [confsExpanded, setConfsExpanded] = React.useState(false);
  React.useEffect(() => {
    fetch("data/conferences.json").then((r) => r.json()).then(setConfsData).catch(() => {});
    fetch("data/teaching.json").then((r) => r.json()).then(setTeaching).catch(() => {});
    fetch("data/press.json").then((r) => r.json()).then(setPress).catch(() => {});
  }, []);
  const t = lang === "fr" ? {
    kicker: "03 — INTERVENTIONS",
    title: "Conférences, enseignement, presse",
    lede: "Conférences scientifiques, tables rondes, posters, enseignement et apparitions dans la presse.",
    s0: "Conférences",
    s1: "Enseignement et encadrement",
    s2: "Entretiens et blog",
    showMore: "Tout afficher",
    showLess: "Réduire"
  } : {
    kicker: "03 — APPEARANCES",
    title: "Conferences, teaching, press",
    lede: "Scientific talks, round tables, posters, teaching activities, and press appearances.",
    s0: "Conferences",
    s1: "Teaching and Mentorship",
    s2: "Interviews and Blog",
    showMore: "Show all",
    showLess: "Show less"
  };
  const allConfs = confsData.map((c) => ({
    ...c,
    date: c.year + "·" + String(c.month).padStart(2, "0"),
    fmt: c.format,
    loc: c.country ? c.city + ", " + c.country : c.city
  }));
  const visibleConfs = confsExpanded ? allConfs : allConfs.slice(0, 3);
  return React.createElement("main", {
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
  }, t.s0)), React.createElement("div", {
    className: "itemlist"
  }, visibleConfs.map((c, i) => React.createElement("div", {
    className: "itemlist__row itemlist__row--conf",
    key: i
  }, React.createElement("div", {
    className: "itemlist__date"
  }, c.date), React.createElement("div", {
    className: "itemlist__fmt"
  }, React.createElement("span", {
    className: "fmt-pill",
    "data-fmt": c.fmt
  }, fmtLabel(c.fmt, lang))), React.createElement("div", null, React.createElement("div", {
    className: "itemlist__title"
  }, c.title[lang]), React.createElement("div", {
    className: "itemlist__sub"
  }, c.event, " · ", c.loc)), React.createElement("div", {
    style: { textAlign: "right" }
  }, React.createElement(StatusPip, {
    kind: c.status,
    lang
  }))))), allConfs.length > 3 && React.createElement("button", {
    type: "button",
    className: "engage-block__toggle",
    onClick: () => setConfsExpanded((v) => !v),
    "aria-expanded": confsExpanded
  }, confsExpanded ? t.showLess : t.showMore, React.createElement("span", {
    className: "engage-block__toggle-arr",
    "aria-hidden": "true"
  }, confsExpanded ? " ↑" : " ↓"))), React.createElement("section", {
    className: "engage-block"
  }, React.createElement("header", {
    className: "engage-block__head"
  }, React.createElement("h2", {
    className: "engage-block__title"
  }, t.s1)), React.createElement("div", {
    className: "itemlist"
  }, teaching.map((it, i) => React.createElement("div", {
    className: "itemlist__row itemlist__row--teach",
    key: i
  }, React.createElement("div", {
    className: "itemlist__date"
  }, it.date), React.createElement("div", {
    className: "itemlist__fmt"
  }, it.role[lang]), React.createElement("div", null, React.createElement("div", {
    className: "itemlist__title"
  }, it.href ? React.createElement("a", {
    href: it.href,
    target: "_blank",
    rel: "noopener noreferrer"
  }, it.title[lang]) : React.createElement("span", null, it.title[lang])), React.createElement("div", {
    className: "itemlist__sub"
  }, it.venue[lang]), it.note && React.createElement("div", {
    className: "itemlist__note"
  }, it.note[lang])))))), React.createElement("section", {
    className: "engage-block"
  }, React.createElement("header", {
    className: "engage-block__head"
  }, React.createElement("h2", {
    className: "engage-block__title"
  }, t.s2)), React.createElement("div", {
    className: "itemlist"
  }, press.map((it, i) => React.createElement("div", {
    className: "itemlist__row itemlist__row--press",
    key: i
  }, React.createElement("div", {
    className: "itemlist__date"
  }, it.year), React.createElement("div", {
    className: "itemlist__org"
  }, it.org), React.createElement("div", null, React.createElement("div", {
    className: "itemlist__title"
  }, React.createElement("a", {
    href: it.href,
    target: "_blank",
    rel: "noopener noreferrer"
  }, it.title[lang])), React.createElement("div", {
    className: "itemlist__sub"
  }, it.kind[lang])))))));
}
Object.assign(window, { Engagement });
