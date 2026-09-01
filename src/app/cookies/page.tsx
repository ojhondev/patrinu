import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { LegalArticle, LegalUpdated } from "@/components/legal-content";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Quais cookies o Patrinu usa e para quê.",
};

const COOKIES = [
  {
    name: "patrinu_session",
    purpose: "Mantém você logado na sua conta.",
    type: "Essencial",
    duration: "30 dias",
  },
  {
    name: "patrinu_master",
    purpose: "Sessão da conta administrativa (Master).",
    type: "Essencial",
    duration: "12 horas",
  },
  {
    name: "patrinu_plan",
    purpose: "Lembra o plano usado numa navegação de demonstração.",
    type: "Funcional",
    duration: "1 ano",
  },
];

const LOCAL_STORAGE = [
  { name: "patrinu_signup_dismissed", purpose: "Não repetir o convite de cadastro." },
  { name: "patrinu_promo_anual60_dismissed", purpose: "Não repetir uma faixa de promoção já fechada." },
  { name: "patrinu_cookie_consent", purpose: "Lembra que você já leu este aviso de cookies." },
];

export default function CookiesPage() {
  return (
    <>
      <PageHero eyebrow="Seus dados" title="Política de Cookies">
        Cookies são pequenos arquivos que um site guarda no seu navegador. Aqui explicamos, de
        forma direta, quais usamos no Patrinu e por quê.
      </PageHero>

      <LegalArticle>
        <LegalUpdated date="1 de setembro de 2026" />

        <section>
          <h2>1. Só o essencial</h2>
          <p>
            O Patrinu usa cookies estritamente necessários para o site funcionar — login,
            sessão e algumas preferências. <strong>Não usamos cookies de publicidade, de
            rastreamento entre sites ou de terceiros</strong> (como Google Analytics ou pixels de
            redes sociais).
          </p>
        </section>

        <section>
          <h2>2. Cookies que usamos</h2>
          <div className="mt-3 overflow-x-auto rounded-card border border-border">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-sunk text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-2.5">Nome</th>
                  <th className="px-4 py-2.5">Finalidade</th>
                  <th className="px-4 py-2.5">Tipo</th>
                  <th className="px-4 py-2.5">Duração</th>
                </tr>
              </thead>
              <tbody>
                {COOKIES.map((c) => (
                  <tr key={c.name} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 font-mono text-xs text-ink">{c.name}</td>
                    <td className="px-4 py-2.5 text-ink-soft">{c.purpose}</td>
                    <td className="px-4 py-2.5 text-ink-soft">{c.type}</td>
                    <td className="px-4 py-2.5 text-ink-soft">{c.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            Os cookies <strong>patrinu_session</strong> e <strong>patrinu_master</strong> são{" "}
            <strong>httpOnly</strong>: não podem ser lidos por scripts no navegador, o que reduz o
            risco de roubo de sessão.
          </p>
        </section>

        <section>
          <h2>3. Armazenamento local (não são cookies)</h2>
          <p>
            Também guardamos alguns sinalizadores no armazenamento local do seu navegador
            (<code>localStorage</code>), que nunca saem do seu dispositivo e não são enviados ao
            nosso servidor:
          </p>
          <ul>
            {LOCAL_STORAGE.map((l) => (
              <li key={l.name}>
                <span className="font-mono text-xs text-ink">{l.name}</span> — {l.purpose}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>4. Cookies de terceiros</h2>
          <p>
            Não usamos. Nossos prestadores de infraestrutura (hospedagem, banco de dados, e-mail
            e pagamento) podem usar cookies técnicos próprios ao processar sua sessão de
            pagamento no checkout — veja a{" "}
            <Link href="/privacidade">Política de Privacidade</Link> para a lista de prestadores.
          </p>
        </section>

        <section>
          <h2>5. Como gerenciar cookies</h2>
          <p>
            Como os cookies do Patrinu são essenciais, bloqueá-los no seu navegador impede login
            e algumas funções do site. Você pode, a qualquer momento, apagar os cookies e o
            armazenamento local do Patrinu nas configurações de privacidade do seu navegador.
          </p>
        </section>

        <section>
          <h2>6. Contato</h2>
          <p>
            Dúvidas sobre esta política? Escreva para{" "}
            <a href="mailto:contato@patrinu.com">contato@patrinu.com</a>.
          </p>
        </section>
      </LegalArticle>
    </>
  );
}
