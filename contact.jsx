// Contact — coordonnées, affiliations, liens.
// Une page sobre, calée sur le motif spirale, en 2 colonnes.

function Contact({ lang }) {
  const t = lang === 'fr' ? {
    kicker:'06 — CONTACT',
    title:"M'écrire, <em>échanger</em>, collaborer",
    lede:"",
    h1:'AFFILIATION PRINCIPALE',
    h2:'AFFILIATION PRÉCÉDENTE',
    h3:'COURRIEL',
    h4:'AUTRES RÉSEAUX',
    formH:'',
    formName:'Nom',
    formEmail:'Votre e-mail',
    formSubject:'Sujet',
    formMessage:'Message',
    formSend:'Envoyer',
    formHint:"Le bouton ouvrira votre client e-mail avec le message pré-rempli.",
  } : {
    kicker:'06 — CONTACT',
    title:'Write, <em>connect</em>, collaborate',
    lede:"",
    h1:'PRIMARY AFFILIATION',
    h2:'PREVIOUS AFFILIATION',
    h3:'E-MAIL',
    h4:'OTHER PROFILES',
    formH:'',
    formName:'Name',
    formEmail:'Your e-mail',
    formSubject:'Subject',
    formMessage:'Message',
    formSend:'Send',
    formHint:"The button will open your e-mail client with the message pre-filled.",
  };

  const links = [
    { label: 'GOOGLE SCHOLAR', meta: '1kRXs-IAAAAJ', href: 'https://scholar.google.com/citations?user=1kRXs-IAAAAJ', platform: 'scholar' },
    { label: 'ORCID',          meta: '0000-0002-8136-4011', href: 'https://orcid.org/0000-0002-8136-4011', platform: 'orcid' },
    { label: 'GITHUB',         meta: '@mpoupon', href: 'https://github.com/mpoupon', platform: 'github' },
    { label: 'LINKEDIN',       meta: 'mathieu-poupon', href: 'https://www.linkedin.com/in/mathieu-poupon', platform: 'linkedin' },
  ];

  return (
    <main className="shell">
      <KickerBlock kicker={t.kicker} title={t.title} lede={t.lede} />

      <div className="contact-grid">

        {/* Affiliations */}
        <section className="contact-block">
          <div className="contact-block__h">{t.h1}</div>
          <div className="contact-card">
            <div className="contact-card__main">
              <div className="contact-card__info">
                <div className="contact-card__org">LOCEAN–IPSL</div>
                <div className="contact-card__addr">
                  <span>Sorbonne Université</span>
                  <span>4 place Jussieu, Tour 45/46</span>
                  <span>75005 Paris, France</span>
                </div>
                <div className="contact-card__coord">48.846°N · 2.357°E</div>
              </div>
              <a
                className="contact-card__map"
                href="https://www.google.com/maps/search/?api=1&query=LOCEAN-IPSL%2C+Sorbonne+Universit%C3%A9%2C+4+place+Jussieu%2C+75005+Paris%2C+France"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LOCEAN–IPSL on Google Maps"
              >
                <iframe
                  src="https://maps.google.com/maps?q=LOCEAN-IPSL+Sorbonne+Universit%C3%A9+Tour+45+46+Jussieu&z=14&output=embed"
                  title="LOCEAN–IPSL location"
                  loading="lazy"
                />
              </a>
            </div>
            <div className="contact-card__role">
              {lang === 'fr' ? 'Postdoctorat CNRS · 2026 → 2028' : 'CNRS postdoctoral fellow · 2026 → 2028'}
            </div>
          </div>

          <div className="contact-block__h" style={{marginTop:48}}>{t.h2}</div>
          <div className="contact-card contact-card--past">
            <div className="contact-card__main">
              <div className="contact-card__info">
                <div className="contact-card__org">Princeton University</div>
                <div className="contact-card__addr">
                  <span>Atmospheric & Oceanic Sciences</span>
                  <span>HMEI–STEP Graduate Fellow</span>
                  <span>Guyot Hall, Princeton, NJ, USA</span>
                </div>
                <div className="contact-card__coord">40.346°N · 74.652°W</div>
              </div>
              <a
                className="contact-card__map"
                href="https://www.google.com/maps/search/?api=1&query=Guyot+Hall%2C+Princeton+University%2C+Princeton%2C+NJ%2C+USA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Princeton University on Google Maps"
              >
                <iframe
                  src="https://maps.google.com/maps?q=Guyot+Hall+Princeton+University&z=14&output=embed"
                  title="Princeton University location"
                  loading="lazy"
                />
              </a>
            </div>
            <div className="contact-card__role">
              {lang === 'fr' ? 'Doctorant · 2020 → 2025' : 'PhD Candidate · 2020 → 2025'}
            </div>
          </div>
        </section>

        {/* E-mail + Form + Links */}
        <section className="contact-block">
          <div className="contact-block__h">{t.h3}</div>
          <a className="contact-email" href="mailto:mathieu.poupon@locean.ipsl.fr">
            mathieu.poupon<span className="contact-email__at">@</span>locean.ipsl.fr
          </a>

          {/* Contact form — opens user's e-mail client via mailto: */}
          <form
            style={{marginTop: 36}}
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const name    = (fd.get('name')    || '').toString().trim();
              const fromEm  = (fd.get('email')   || '').toString().trim();
              const subject = (fd.get('subject') || '').toString().trim();
              const message = (fd.get('message') || '').toString().trim();
              const body = `${message}\n\n—\n${name}${fromEm ? ` <${fromEm}>` : ''}`;
              const href = `mailto:mathieu.poupon@locean.ipsl.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
              window.location.href = href;
            }}
          >
            <div className="contact-form__row">
              <label className="contact-form__field">
                <span>{t.formName}</span>
                <input type="text" name="name" required autoComplete="name" />
              </label>
              <label className="contact-form__field">
                <span>{t.formEmail}</span>
                <input type="email" name="email" required autoComplete="email" />
              </label>
            </div>
            <label className="contact-form__field">
              <span>{t.formSubject}</span>
              <input type="text" name="subject" required />
            </label>
            <label className="contact-form__field">
              <span>{t.formMessage}</span>
              <textarea name="message" rows="5" required />
            </label>
            <div className="contact-form__foot">
              <button type="submit" className="contact-form__send">{t.formSend} →</button>
            </div>
          </form>

          <div className="contact-block__h" style={{marginTop:48, borderBottom:0, paddingBottom:0}}>{t.h4}</div>
          <ul className="contact-links">
            {links.map(l => (
              <li key={l.label}>
                <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                  <span className="contact-links__label" data-platform={l.platform}>{l.label}</span>
                  <span className="contact-links__meta">{l.meta}</span>
                  <span className="contact-links__arr">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

    </main>
  );
}

Object.assign(window, { Contact });
