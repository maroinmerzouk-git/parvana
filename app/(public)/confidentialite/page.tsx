import type { Metadata } from "next";
import Link from "next/link";
import { SITE, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité de Parvana — données personnelles collectées via les formulaires de réservation et de traiteur, finalités, durée de conservation et droits RGPD.",
  path: "/confidentialite",
});

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-ink/10 py-10">
      <h2 className="font-display text-2xl text-ink md:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-ink-soft [&_a]:text-terracotta [&_a:hover]:text-terracotta-dark">
        {children}
      </div>
    </section>
  );
}

export default function ConfidentialitePage() {
  return (
    <>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-3xl px-6 pb-10 pt-20 md:px-10 md:pb-12 md:pt-28">
          <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
            Données personnelles
          </p>
          <h1 className="mt-6 font-display text-4xl leading-[1.0] text-ink md:text-6xl">
            Politique de <span className="italic">confidentialité</span>
          </h1>
          <p className="mt-6 text-sm text-ink-soft">
            Dernière mise à jour : {SITE.legal.lastUpdated}.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 pb-24 md:px-10">
        <Section title="Responsable du traitement">
          <p>
            Les données personnelles collectées sur ce site le sont par{" "}
            <strong>{SITE.name}</strong>, exploitant du restaurant situé{" "}
            {SITE.address.streetAddress}, {SITE.address.postalCode}{" "}
            {SITE.address.addressLocality}.
          </p>
          <p>
            Pour toute question relative à vos données :{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a> ou{" "}
            <a href={`tel:${SITE.telephone}`}>{SITE.telephoneDisplay}</a>.
          </p>
        </Section>

        <Section title="Données collectées et finalités">
          <p>
            Nous ne collectons que les données que vous nous transmettez
            volontairement via nos formulaires :
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Formulaire de réservation</strong> : nom, adresse email,
              numéro de téléphone, date et service souhaités, nombre de
              convives et message éventuel. Finalité : traiter et confirmer
              votre demande de réservation.
            </li>
            <li>
              <strong>Formulaire traiteur</strong> : nom, adresse email,
              numéro de téléphone, date et type d&apos;événement, message.
              Finalité : étudier votre demande et vous adresser une
              proposition.
            </li>
          </ul>
          <p>
            Aucun cookie publicitaire ni outil de mesure d&apos;audience
            n&apos;est utilisé. Le site ne dépose qu&apos;un cookie technique
            strictement nécessaire à l&apos;espace de gestion réservé à
            l&apos;équipe — il ne concerne pas les visiteurs du site public et
            ne requiert pas de consentement.
          </p>
        </Section>

        <Section title="Base légale">
          <p>
            Le traitement de vos données repose sur l&apos;exécution de mesures
            précontractuelles et contractuelles : sans ces informations, nous
            ne pouvons pas traiter votre demande de réservation ou de
            prestation traiteur.
          </p>
        </Section>

        <Section title="Destinataires des données">
          <p>
            Vos données sont traitées par l&apos;équipe de Parvana. Pour
            fonctionner, le site fait appel à des prestataires techniques
            (sous-traitants au sens du RGPD), qui peuvent héberger ou acheminer
            ces données, y compris hors de l&apos;Union européenne (États-Unis,
            sur la base de garanties appropriées) :
          </p>
          <ul className="list-disc space-y-2 pl-5">
            {SITE.legal.processors.map((p) => (
              <li key={p.name}>
                <a href={p.url} target="_blank" rel="noreferrer">
                  {p.name}
                </a>{" "}
                — {p.role}.
              </li>
            ))}
          </ul>
          <p>
            Vos données ne sont jamais vendues ni cédées à des tiers à des fins
            commerciales.
          </p>
        </Section>

        <Section title="Durée de conservation">
          <p>
            Les données issues des formulaires sont conservées pendant{" "}
            {SITE.legal.retention}, puis supprimées ou anonymisées.
          </p>
        </Section>

        <Section title="Vos droits">
          <p>
            Conformément au Règlement général sur la protection des données
            (RGPD) et à la loi « Informatique et Libertés », vous disposez
            d&apos;un droit d&apos;accès, de rectification, d&apos;effacement,
            de limitation, d&apos;opposition et de portabilité de vos données.
          </p>
          <p>
            Pour exercer ces droits, écrivez-nous à{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Vous pouvez
            également introduire une réclamation auprès de la CNIL (
            <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">
              www.cnil.fr
            </a>
            ).
          </p>
        </Section>

        <Section title="Mentions légales">
          <p>
            Les informations relatives à l&apos;éditeur et à l&apos;hébergeur du
            site figurent sur la page{" "}
            <Link href="/mentions-legales">mentions légales</Link>.
          </p>
        </Section>
      </div>
    </>
  );
}
