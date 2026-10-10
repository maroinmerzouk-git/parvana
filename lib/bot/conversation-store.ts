import "server-only";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import type { ConversationData, ConversationState, Step } from "./state";

export type { CartLine, ConversationData, ConversationState } from "./state";

/** Charge l'état de conversation ; retombe sur un état neuf si absent/erreur. */
export async function loadConversation(
  waId: string,
): Promise<ConversationState> {
  try {
    const db = getDb();
    const [row] = await db
      .select()
      .from(schema.waConversations)
      .where(eq(schema.waConversations.waId, waId))
      .limit(1);
    if (!row) return { step: "greet", data: {} };
    return {
      step: (row.step as Step) ?? "greet",
      data: (row.data as ConversationData) ?? {},
    };
  } catch (err) {
    console.error("[wa] loadConversation échec:", err);
    return { step: "greet", data: {} };
  }
}

/** Sauve l'état (upsert sur waId). */
export async function saveConversation(
  waId: string,
  state: ConversationState,
): Promise<void> {
  const db = getDb();
  await db
    .insert(schema.waConversations)
    .values({ waId, step: state.step, data: state.data, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: schema.waConversations.waId,
      set: { step: state.step, data: state.data, updatedAt: new Date() },
    });
}

/** Supprime la conversation (commande terminée ou annulée). */
export async function resetConversation(waId: string): Promise<void> {
  const db = getDb();
  await db
    .delete(schema.waConversations)
    .where(eq(schema.waConversations.waId, waId));
}

/**
 * Idempotence : réserve l'id du message. Renvoie true si c'est la première
 * fois (insertion réussie), false si déjà traité (conflit de clé primaire).
 */
export async function claimMessage(messageId: string): Promise<boolean> {
  try {
    const db = getDb();
    await db.insert(schema.waProcessedMessages).values({ id: messageId });
    return true;
  } catch {
    return false;
  }
}
