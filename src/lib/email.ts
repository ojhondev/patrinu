/**
 * E-mail transacional (Resend).
 *
 * Sem `RESEND_API_KEY` no ambiente, `sendEmail` vira no-op (só registra no log).
 * Todo e-mail sai com layout de marca: se o chamador passa só `text`, geramos
 * o HTML automaticamente (com o logo, cores e rodapé do Patrinu).
 */

import { SITE_URL } from "@/lib/site";

type SendInput = {
  to: string;
  subject: string;
  /** corpo em texto puro — vira HTML de marca automaticamente */
  text?: string;
  /** HTML pronto (sobrepõe a geração automática) */
  html?: string;
  replyTo?: string;
};

const FROM = process.env.EMAIL_FROM ?? "Patrinu <avisos@patrinu.com>";
const REPLY_TO = process.env.EMAIL_REPLY_TO ?? "contato@patrinu.com";
/** base para imagens do e-mail — precisa resolver sempre (alias permanente). */
const ASSET = (process.env.EMAIL_ASSET_URL ?? "https://patrinu.vercel.app").replace(/\/$/, "");

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** transforma texto puro em parágrafos HTML, com links clicáveis. */
function textToHtml(text: string): string {
  return text
    .trim()
    .split(/\n{2,}/)
    .map((block) => {
      const withBreaks = esc(block).replace(/\n/g, "<br>");
      const linked = withBreaks.replace(
        /(https?:\/\/[^\s<]+)/g,
        '<a href="$1" style="color:#c92a13;word-break:break-all">$1</a>',
      );
      return `<p style="margin:0 0 16px;line-height:1.6">${linked}</p>`;
    })
    .join("");
}

/** envelope de marca (tabelas + estilos inline = compatível com todo cliente). */
function brandLayout(innerHtml: string): string {
  return `<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf4f2;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf4f2;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #ece0dc;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;color:#241a17;">
        <tr><td style="padding:24px 28px 8px;">
          <img src="${ASSET}/logo-patrinu.png" alt="Patrinu" width="120" style="display:block;height:auto;border:0;">
        </td></tr>
        <tr><td style="padding:8px 28px 24px;font-size:15px;color:#574c48;">
          ${innerHtml}
        </td></tr>
        <tr><td style="padding:18px 28px;background:#faf4f2;border-top:1px solid #ece0dc;font-size:12px;color:#958a86;">
          <strong style="color:#574c48;">Patrinu</strong> — o radar do patrimônio e restauro do Brasil.<br>
          <a href="${SITE_URL}" style="color:#c92a13;text-decoration:none;">${SITE_URL.replace(/^https?:\/\//, "")}</a>
          &nbsp;·&nbsp; Dúvidas? <a href="mailto:${REPLY_TO}" style="color:#c92a13;text-decoration:none;">${REPLY_TO}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendEmail(input: SendInput): Promise<{ ok: boolean; skipped?: boolean }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[email] ignorado (sem RESEND_API_KEY) → ${input.to} · "${input.subject}"`);
    return { ok: true, skipped: true };
  }

  const html =
    input.html ?? (input.text ? brandLayout(textToHtml(input.text)) : undefined);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        from: FROM,
        to: input.to,
        reply_to: input.replyTo ?? REPLY_TO,
        subject: input.subject,
        text: input.text,
        html,
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
    subject: "Recebemos sua publicação — em análise",
    text: `Olá, ${name}.\n\nRecebemos "${title}". Nosso time revisa todo conteúdo antes de publicar — normalmente em até 1 dia útil. Avisamos assim que estiver no ar.\n\nEquipe Patrinu`,
  };
}

export function projectApprovedEmail(name: string, title: string, url: string) {
  return {
    subject: "Sua publicação está no ar",
    text: `Olá, ${name}.\n\n"${title}" foi aprovada e já está publicada:\n${url}\n\nEquipe Patrinu`,
  };
}

export function projectRejectedEmail(name: string, title: string, reason: string) {
  return {
    subject: "Sua publicação precisa de ajustes",
    text: `Olá, ${name}.\n\n"${title}" ainda não pôde ser publicada.\nMotivo: ${reason}\n\nVocê pode ajustar e enviar de novo pelo painel: ${SITE_URL}/painel\n\nEquipe Patrinu`,
  };
}
