/** URL canônica do site (produção). Configurável por env; default = domínio oficial. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://patrinu.com"
).replace(/\/$/, "");

export const SITE_NAME = "Patrinu";
