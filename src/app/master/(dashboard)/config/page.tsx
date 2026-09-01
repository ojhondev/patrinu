import Link from "next/link";
import { Play, Mail } from "lucide-react";

import { getSetting } from "@/lib/settings";
import { pendingIngestCounts } from "@/lib/ingest/run";
import { saveBanner, triggerIngest, sendTestEmail } from "../../actions";

const BANNERS = [
  {
    slot: "news" as const,
    title: "Banner das notícias",
    hint: "Aparece dentro de cada matéria e no topo da lista de notícias.",
  },
  {
    slot: "projects" as const,
    title: "Banner de Projetos (1920 × 500)",
    hint: "Faixa abaixo dos filtros na página Projetos.",
  },
];

const IMG_HINT =
  "Cole o LINK DIRETO da imagem (termina em .jpg / .png). No ImgBB: abra a imagem, botão direito → Copiar endereço da imagem (i.ibb.co/…), não o link da página (ibb.co/…).";

export default async function ConfigPage() {
  const [banners, counts, emailTest] = await Promise.all([
    Promise.all(
      BANNERS.map(async (b) => ({
        ...b,
        image: await getSetting(`${b.slot}_banner_image`),
        link: await getSetting(`${b.slot}_banner_link`),
      })),
    ),
    pendingIngestCounts(),
    getSetting("email_test_result"),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <p className="kicker text-muted">Sistema</p>
        <h1 className="display mt-1 text-3xl text-ink sm:text-4xl">Configurações</h1>
      </div>

      <section>
        <h2 className="text-lg font-bold">Ingestão do Radar</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Roda sozinha 1×/dia (GitHub Actions). Depois de rodar, os itens caem em{" "}
          <Link href="/master/moderacao" className="font-semibold text-green-ink hover:underline">
            Moderação
          </Link>
          .
        </p>
        <p className="mt-2 text-sm">
          Na fila agora: <strong>{counts.editais}</strong> editais ·{" "}
          <strong>{counts.noticias}</strong> notícias.
        </p>
        <form action={triggerIngest} className="mt-3">
          <button
            type="submit"
            className="btn btn-secondary btn-sm"
          >
            <Play size={13} /> Rodar ingestão agora
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-bold">E-mail (Resend)</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Envia um e-mail de teste para o endereço do Master. Se chegar, os avisos da
          plataforma (projeto em análise, vaga aprovada, nova candidatura…) estão funcionando.
        </p>
        <form action={sendTestEmail} className="mt-3">
          <button type="submit" className="btn btn-secondary btn-sm">
            <Mail size={13} /> Enviar e-mail de teste
          </button>
        </form>
        {emailTest && (
          <p className="mt-2 rounded-btn bg-sunk px-3 py-2 text-sm text-ink-soft">{emailTest}</p>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold">Banners de anúncio</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {banners.map((b) => (
            <div key={b.slot} className="card p-5">
              <h3 className="text-base font-bold">{b.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{b.hint}</p>
              <p className="mt-1 text-xs text-muted">{IMG_HINT}</p>
              <form action={saveBanner} className="mt-4 space-y-3">
                <input type="hidden" name="slot" value={b.slot} />
                <input
                  name="image"
                  defaultValue={b.image ?? ""}
                  placeholder="https://i.ibb.co/…/banner.png"
                  className="w-full rounded-btn border border-border-strong bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
                />
                <input
                  name="link"
                  defaultValue={b.link ?? ""}
                  placeholder="https://… (destino do clique, opcional)"
                  className="w-full rounded-btn border border-border-strong bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                >
                  Salvar
                </button>
              </form>
              {b.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={b.image}
                  alt="Banner atual"
                  className="mt-4 max-h-28 rounded-btn border border-border"
                />
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
