/**
 * E-mail transacional.
 *
 * Sem `RESEND_API_KEY` no ambiente, `sendEmail` vira no-op (só registra no log)
 * — a plataforma funciona, mas nenhum e-mail sai. Assim que a chave existir,
 * o envio real liga sozinho, sem mudar as chamadas.
 */

type SendInput = {
  to: string;
  subject: string;
  /** corpo em texto puro; para HTML use `html` */
  text?: string;
  html?: string;
  replyTo?: string;
};

/** Remetente e "responder para" — configuráveis por env; default = domínio oficial. */
const FROM = process.env.EMAIL_FROM ?? "Patrinu <avisos@patrinu.com>";
const REPLY_TO = process.env.EMAIL_REPLY_TO ?? "contato@patrinu.com";

export async function sendEmail(input: SendInput): Promise<{ ok: boolean; skipped?: boolean }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(
      `[email] ignorado (sem RESEND_API_KEY) → ${input.to} · "${input.subject}"`,
    );
    return { ok: true, skipped: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: input.to,
        reply_to: input.replyTo ?? REPLY_TO,
        subject: input.subject,
        text: input.text,
        html: input.html,
      }),
    });
    if (!res.ok) {
      console.error(`[email] falha ${res.status}: ${await res.text()}`);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] erro", err);
    return { ok: false };
  }
}

/* ---- mensagens da plataforma ---- */

export function projectSubmittedEmail(name: string, title: string) {
  return {
    subject: "Recebemos seu projeto — em análise",
    text: `Olá, ${name}.\n\nRecebemos o projeto "${title}". Nosso time revisa todo conteúdo antes de publicar — normalmente em até 1 dia útil. Avisamos assim que estiver no ar.\n\nEquipe Patrinu`,
  };
}

export function projectApprovedEmail(name: string, title: string, url: string) {
  return {
    subject: "Seu projeto está no ar",
    text: `Olá, ${name}.\n\nO projeto "${title}" foi aprovado e já está publicado:\n${url}\n\nEquipe Patrinu`,
  };
}

export function projectRejectedEmail(name: string, title: string, reason: string) {
  return {
    subject: "Seu projeto precisa de ajustes",
    text: `Olá, ${name}.\n\nO projeto "${title}" ainda não pôde ser publicado.\nMotivo: ${reason}\n\nVocê pode ajustar e enviar de novo pelo painel.\n\nEquipe Patrinu`,
  };
}
