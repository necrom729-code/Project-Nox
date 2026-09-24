import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AssistantRequest = {
  message?: string;
  personalities?: string[];
  locale?: string;
};

export async function POST(req: NextRequest) {
  let body: AssistantRequest;
  try {
    body = (await req.json()) as AssistantRequest;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  if (!message) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  const personalities: string[] = Array.isArray(body.personalities)
    ? body.personalities
    : [];
  const locale = typeof body.locale === "string" ? body.locale : "en";

  const q = message.toLowerCase();
  let reply: string;

  if (/(backup|back up|save|schedul|automatically)/.test(q)) {
    reply =
      personalities.includes("Kind")
        ? "Sure! I can help you set up a backup schedule so your files are saved safely."
        : personalities.includes("Serious")
          ? "Configuring an automated backup schedule is recommended. Specify frequency and retention."
          : personalities.includes("Playful")
            ? "Let's back those files up before they go BOO-bye! 🦇"
            : personalities.includes("Childish")
              ? "Wah-wah! We gotta save the files or they go bye-bye!"
              : "I can help you set up a backup schedule.";
  } else if (/(restore|recover|retriev|resurrect|back)/.test(q)) {
    reply =
      personalities.includes("Helpful")
        ? "To restore, go to Recovery and pick the backup you want. I'll walk you through it."
        : personalities.includes("Serious")
          ? "Restoration requires selecting a valid backup point and confirming the operation."
          : personalities.includes("Playful")
            ? "Resurrection spell incoming! Pick a backup and we'll bring your data back to life."
            : personalities.includes("Childish")
              ? "Boo! Scared of losing data? Let's restore from a backup!"
              : "I can help you restore from a previous backup.";
  } else if (
    /(language|lang|translat|français|french|thai|japanese|deutsch|german|russian|korean|italian|malay|indonesian|español)/.test(
      q,
    )
  ) {
    reply =
      personalities.includes("Kind")
        ? "Of course! I support multiple languages to help everyone."
        : personalities.includes("Childish")
          ? "I can speak many languages! Wah-wah, so cool!"
          : personalities.includes("Playful")
            ? "I speak like 100 languages! 🌏✨"
            : "I can help with language settings and translations.";
  } else {
    reply =
      personalities.length === 0
        ? "I'm not sure about that yet. Try asking about backups, restores, or languages."
        : personalities.includes("Serious")
          ? "I don't have enough information to answer that question reliably."
          : personalities.includes("Helpful")
            ? "I'm still learning! Ask me about backups, restores, or language support."
            : personalities.includes("Kind")
              ? "Hmm, I'm not quite sure, but I want to help! Try asking about backups or restores."
              : personalities.includes("Playful")
                ? "Beep boop! That one's a mystery even to me. 🤖"
                : "Wah-wah, I don't know that one yet!";
  }

  return NextResponse.json({ reply, locale });
}