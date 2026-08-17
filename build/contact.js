function Contact({ lang }) {
  const t = lang === "fr" ? {
    kicker: "06 — CONTACT",
    title: "M'écrire, <em>échanger</em>, collaborer",
    lede: "",
    h1: "AFFILIATION PRINCIPALE",
    h2: "AFFILIATION PRÉCÉDENTE",
    h3: "COURRIEL",
    h4: "AUTRES RÉSEAUX",
    formH: "",
    formName: "Nom",
    formEmail: "Votre e-mail",
    formSubject: "Sujet",
    formMessage: "Message",
    formSend: "Envoyer",
    formHint: "Le bouton ouvrira votre client e-mail avec le message pré-rempli."
  } : {
    kicker: "06 — CONTACT",
    title: "Write, <em>connect</em>, collaborate",
    lede: "",
    h1: "PRIMARY AFFILIATION",
    h2: "PREVIOUS AFFILIATION",
    h3: "E-MAIL",
    h4: "OTHER PROFILES",
    formH: "",
    formName: "Name",
    formEmail: "Your e-mail",
    formSubject: "Subject",
    formMessage: "Message",
    formSend: "Send",
    formHint: "The button will open your e-mail client with the message pre-filled."
  };
  const links = [
    { label: "GOOGLE SCHOLAR", meta: "1kRXs-IAAAAJ", href: "https://scholar.google.com/citations?user=1kRXs-IAAAAJ", platform: "scholar" },
    { label: "ORCID", meta: "0000-0002-8136-4011", href: "https://orcid.org/0000-0002-8136-4011", platform: "orcid" },
    { label: "GITHUB", meta: "@mpoupon", href: "https://github.com/mpoupon", platform: "github" },
    { label: "LINKEDIN", meta: "mathieu-poupon", href: "https://www.linkedin.com/in/mathieu-poupon", platform: "linkedin" }
  ];
  return React.createElement("main", {
    className: "shell"
  }, React.createElement(KickerBlock, {
    kicker: t.kicker,
    title: t.title,
    lede: t.lede
  }), React.createElement("div", {
    className: "contact-grid"
  }, React.createElement("section", {
    className: "contact-block"
  }, React.createElement("div", {
    className: "contact-block__h"
  }, t.h1), React.createElement("div", {
    className: "contact-card"
  }, React.createElement("div", {
    className: "contact-card__main"
  }, React.createElement("div", {
    className: "contact-card__info"
  }, React.createElement("div", {
    className: "contact-card__org"
  }, "LOCEAN–IPSL"), React.createElement("div", {
    className: "contact-card__addr"
  }, React.createElement("span", null, "Sorbonne Université"), React.createElement("span", null, "4 place Jussieu, Tour 45/46"), React.createElement("span", null, "75005 Paris, France")), React.createElement("div", {
    className: "contact-card__coord"
  }, "48.846°N · 2.357°E")), React.createElement("a", {
    className: "contact-card__map",
    href: "https://www.google.com/maps/search/?api=1&query=LOCEAN-IPSL%2C+Sorbonne+Universit%C3%A9%2C+4+place+Jussieu%2C+75005+Paris%2C+France",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "LOCEAN–IPSL on Google Maps"
  }, React.createElement("iframe", {
    src: "https://maps.google.com/maps?q=LOCEAN-IPSL+Sorbonne+Universit%C3%A9+Tour+45+46+Jussieu&z=14&output=embed",
    title: "LOCEAN–IPSL location",
    loading: "lazy"
  }))), React.createElement("div", {
    className: "contact-card__role"
  }, lang === "fr" ? "Postdoctorat CNRS · 2026 → 2028" : "CNRS postdoctoral fellow · 2026 → 2028")), React.createElement("div", {
    className: "contact-block__h",
    style: { marginTop: 48 }
  }, t.h2), React.createElement("div", {
    className: "contact-card contact-card--past"
  }, React.createElement("div", {
    className: "contact-card__main"
  }, React.createElement("div", {
    className: "contact-card__info"
  }, React.createElement("div", {
    className: "contact-card__org"
  }, "Princeton University"), React.createElement("div", {
    className: "contact-card__addr"
  }, React.createElement("span", null, "Atmospheric & Oceanic Sciences"), React.createElement("span", null, "HMEI–STEP Graduate Fellow"), React.createElement("span", null, "Guyot Hall, Princeton, NJ, USA")), React.createElement("div", {
    className: "contact-card__coord"
  }, "40.346°N · 74.652°W")), React.createElement("a", {
    className: "contact-card__map",
    href: "https://www.google.com/maps/search/?api=1&query=Guyot+Hall%2C+Princeton+University%2C+Princeton%2C+NJ%2C+USA",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "Princeton University on Google Maps"
  }, React.createElement("iframe", {
    src: "https://maps.google.com/maps?q=Guyot+Hall+Princeton+University&z=14&output=embed",
    title: "Princeton University location",
    loading: "lazy"
  }))), React.createElement("div", {
    className: "contact-card__role"
  }, lang === "fr" ? "Doctorant · 2021 → 2026" : "PhD Candidate · 2021 → 2026"))), React.createElement("section", {
    className: "contact-block"
  }, React.createElement("div", {
    className: "contact-block__h"
  }, t.h3), React.createElement("a", {
    className: "contact-email",
    href: "mailto:mathieu.poupon@locean.ipsl.fr"
  }, "mathieu.poupon", React.createElement("span", {
    className: "contact-email__at"
  }, "@"), "locean.ipsl.fr"), React.createElement("form", {
    style: { marginTop: 36 },
    className: "contact-form",
    onSubmit: (e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const name = (fd.get("name") || "").toString().trim();
      const fromEm = (fd.get("email") || "").toString().trim();
      const subject = (fd.get("subject") || "").toString().trim();
      const message = (fd.get("message") || "").toString().trim();
      const body = `${message}

—
${name}${fromEm ? ` <${fromEm}>` : ""}`;
      const href = `mailto:mathieu.poupon@locean.ipsl.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
    }
  }, React.createElement("div", {
    className: "contact-form__row"
  }, React.createElement("label", {
    className: "contact-form__field"
  }, React.createElement("span", null, t.formName), React.createElement("input", {
    type: "text",
    name: "name",
    required: true,
    autoComplete: "name"
  })), React.createElement("label", {
    className: "contact-form__field"
  }, React.createElement("span", null, t.formEmail), React.createElement("input", {
    type: "email",
    name: "email",
    required: true,
    autoComplete: "email"
  }))), React.createElement("label", {
    className: "contact-form__field"
  }, React.createElement("span", null, t.formSubject), React.createElement("input", {
    type: "text",
    name: "subject",
    required: true
  })), React.createElement("label", {
    className: "contact-form__field"
  }, React.createElement("span", null, t.formMessage), React.createElement("textarea", {
    name: "message",
    rows: "5",
    required: true
  })), React.createElement("div", {
    className: "contact-form__foot"
  }, React.createElement("button", {
    type: "submit",
    className: "contact-form__send"
  }, t.formSend, " →"))), React.createElement("div", {
    className: "contact-block__h",
    style: { marginTop: 48, borderBottom: 0, paddingBottom: 0 }
  }, t.h4), React.createElement("ul", {
    className: "contact-links"
  }, links.map((l) => React.createElement("li", {
    key: l.label
  }, React.createElement("a", {
    href: l.href,
    target: l.href.startsWith("http") ? "_blank" : undefined,
    rel: "noopener noreferrer"
  }, React.createElement("span", {
    className: "contact-links__label",
    "data-platform": l.platform
  }, l.label), React.createElement("span", {
    className: "contact-links__meta"
  }, l.meta), React.createElement("span", {
    className: "contact-links__arr"
  }, "↗"))))))));
}
Object.assign(window, { Contact });
