// Types partagés de la couche WhatsApp (transport Meta Cloud API).
//
// On normalise les messages entrants de Meta en `InboundMessage`, et on
// modélise les messages interactifs sortants (boutons ≤3 / listes ≤10 lignes)
// de façon indépendante du format Graph — `cloud-api.ts` fait la traduction.

/** Message entrant normalisé (texte ou réponse interactive). */
export interface InboundMessage {
  /** id du message Meta (sert à l'idempotence). */
  id: string;
  /** expéditeur : numéro WhatsApp en chiffres, sans « + ». */
  from: string;
  /** nom de profil WhatsApp, si fourni. */
  profileName?: string;
  /** corps texte, le cas échéant (vide pour les types non gérés). */
  text?: string;
  /** réponse à un bouton / une ligne de liste, le cas échéant. */
  reply?: { id: string; title: string };
}

/** Une ligne de liste interactive. */
export interface ListRow {
  id: string; // payload opaque renvoyé tel quel dans la réponse
  title: string; // ≤ 24 caractères (limite WhatsApp)
  description?: string; // ≤ 72 caractères
}

export interface ListSection {
  title?: string; // ≤ 24 caractères
  rows: ListRow[];
}

export interface ReplyButton {
  id: string;
  title: string; // ≤ 20 caractères
}

export interface InteractiveListMessage {
  kind: "list";
  body: string;
  button: string; // libellé du bouton d'ouverture, ≤ 20 caractères
  sections: ListSection[];
  header?: string;
  footer?: string;
}

export interface InteractiveButtonsMessage {
  kind: "buttons";
  body: string;
  buttons: ReplyButton[]; // 1–3
  header?: string;
  footer?: string;
}

export type InteractiveMessage =
  | InteractiveListMessage
  | InteractiveButtonsMessage;

/** Sortie du moteur de conversation : texte libre ou message interactif. */
export type Outbound =
  | { type: "text"; body: string }
  | { type: "interactive"; message: InteractiveMessage };
