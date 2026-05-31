import type { Metadata } from "next";
import Link from "next/link";
import { SITE, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Mentions légales",
  description:
    "Mentions légales du site Parvana — éditeur, hébergeur et informations légales obligatoires.",
  path: "/mentions-legales",
});

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-t border-ink/10 py-5 sm:grid-cols-[200px_1fr] sm:gap-6">
      <dt className="text-xs uppercase tracking-[0.18em] text-terracotta">
        {label}
      </dt>
      <dd className="text-ink-soft [&_a]:text-terracotta [&_a:hover]:text-terracotta-dark">
        {children}
      </dd>
    </div>
  );
}

export default function MentionsLegalesPage() {
  const { legal } = SITE;
  return (
    <>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-3xl px-6 pb-10 pt-20 md:px-10 md:pb-12 md:pt-28">
          <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
            Informations légales
          </p>
          <h1 className="mt-6 font-display text-4xl leading-[1.0] text-ink md:text-6xl">
            Mentions <span className="italic">légales</span>
          </h1>
          <p className="mt-6 text-sm text-ink-soft">
            Dernière mise à jour : {legal.lastUpdated}.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 pb-24 md:px-10">
        <section className="py-8">
          <h2 className="font-display text-2xl text-ink md:text-3xl">
            Éditeur du site
          </h2>
          <dl className="mt-4">
            <Row label="Dénomination">{SITE.name}</Row>
            <Row label="Forme juridique">{legal.legalForm}</Row>
            {legal.shareCapital && (
              <Row label="Capital social">{legal.shareCapital}</Row>
            )}
            <Row label="Siège social">
              {SITE.address.streetAddress}, {SITE.address.postalCode}{" "}
              {SITE.address.addressLocality}
            </Row>
            <Row label="SIREN">{legal.siren}</Row>
            <Row label="SIRET">{legal.siret}</Row>
            <Row label="RCS">{legal.rcs}</Row>
            <Row label="Directeur de la publication">
              {legal.publicationDirector}
            </Row>
            <Row label="Contact">
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              <br />
              <a href={`tel:${SITE.telephone}`}>{SITE.telephoneDisplay}</a>
            </Row>
          </dl>
        </section>

        <section className="py-8">
          <h2 className="font-display text-2xl text-ink md:text-3xl">
            Hébergeur
          </h2>
          <dl className="mt-4">
            <Row label="Société">
              <a href={legal.host.url} target="_blank" rel="noreferrer">
                {legal.host.name}
              </a>
            </Row>
            <Row label="Adresse">{legal.host.address}</Row>
          </dl>
        </section>

        <section className="border-t border-ink/10 py-8">
          <h2 className="font-display text-2xl text-ink md:text-3xl">
            Propriété intellectuelle
          </h2>
          <p className="mt-4 text-ink-soft">
            L&apos;ensemble des contenus de ce site (textes, photographies,
            vidéos, identité visuelle) est la propriété de {SITE.name} ou de ses
            ayants droit. Toute reproduction sans autorisation est interdite.
          </p>
        </section>

        <section className="border-t border-ink/10 py-8">
          <h2 className="font-display text-2xl text-ink md:text-3xl">
            Données personnelles
          </h2>
          <p className="mt-4 text-ink-soft [&_a]:text-terracotta [&_a:hover]:text-terracotta-dark">
            Le traitement de vos données personnelles est décrit dans notre{" "}
            <Link href="/confidentialite">politique de confidentialité</Link>.
          </p>
        </section>
      </div>
    </>
  );
}
