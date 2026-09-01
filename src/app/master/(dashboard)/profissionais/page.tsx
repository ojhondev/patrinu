import Link from "next/link";
import { BadgeCheck, Ban, Trash2, ExternalLink } from "lucide-react";

import { listProsForMod, VERIF_LEVELS } from "@/lib/master";
import {
  actBanUser,
  actDeleteProfessional,
  actSetVerification,
  actUnbanUser,
} from "../../mod-actions";

const VERIF_LABEL: Record<string, string> = {
  nao_verificado: "Não verificado",
  email: "E-mail confirmado",
  registro_profissional: "Registro verificado",
  projeto_documentado: "Obra documentada",
  completo: "Verificação completa",
};

export default async function ProfissionaisMod({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const pros = await listProsForMod(q);

  return (
    <div className="space-y-6">
      <div>
        <p className="kicker text-muted">Moderação</p>
        <h1 className="display mt-1 text-3xl text-ink sm:text-4xl">Profissionais</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Defina o selo de verificação, remova o perfil do diretório ou bane a conta.
        </p>
      </div>

      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar por nome, e-mail ou cidade"
          className="w-full max-w-sm rounded-btn border border-border-strong bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
        />
        <button className="btn-museum">Buscar</button>
      </form>

      <div className="space-y-3">
        {pros.length === 0 && (
          <p className="border border-dashed border-border bg-surface p-6 text-center text-sm text-muted">
            Nenhum profissional.
          </p>
        )}
        {pros.map((p) => (
          <div key={p.id} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/profissionais/${p.slug}`}
                    className="font-display font-bold text-ink hover:text-green-ink"
                  >
                    {p.displayName}
                  </Link>
                  {p.verified && <BadgeCheck size={15} className="text-green-ink" />}
                  {p.bannedAt && (
                    <span className="bg-crit/15 px-1.5 py-0.5 text-[11px] font-bold uppercase text-crit">
                      Banido
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted">
                  {p.email} · {p.city ?? "—"}
                  {p.uf ? `/${p.uf}` : ""} · {VERIF_LABEL[p.verificationLevel]}
                </p>
                {p.headline && <p className="mt-1 line-clamp-1 text-sm text-ink-soft">{p.headline}</p>}
              </div>
              <a
                href={`/profissionais/${p.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-green-ink hover:underline"
              >
                ver perfil <ExternalLink size={11} />
              </a>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-3">
              <form action={actSetVerification} className="flex items-center gap-1.5">
                <input type="hidden" name="proId" value={p.id} />
                <select
                  name="level"
                  defaultValue={p.verificationLevel}
                  className="rounded-btn border border-border-strong bg-surface px-2 py-1.5 text-xs"
                >
                  {VERIF_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {VERIF_LABEL[l]}
                    </option>
                  ))}
                </select>
                <button className="btn btn-secondary btn-sm">
                  Salvar selo
                </button>
              </form>

              {p.bannedAt ? (
                <form action={actUnbanUser}>
                  <input type="hidden" name="userId" value={p.userId} />
                  <button className="inline-flex items-center gap-1 text-xs font-bold text-green-ink hover:underline">
                    Reativar conta
                  </button>
                </form>
              ) : (
                <form action={actBanUser} className="flex items-center gap-1.5">
                  <input type="hidden" name="userId" value={p.userId} />
                  <input
                    name="reason"
                    placeholder="motivo do banimento"
                    className="rounded-btn border border-border-strong bg-surface px-2 py-1.5 text-xs outline-none"
                  />
                  <button className="inline-flex items-center gap-1 text-xs font-bold text-crit hover:underline">
                    <Ban size={12} /> Banir
                  </button>
                </form>
              )}

              <form action={actDeleteProfessional}>
                <input type="hidden" name="proId" value={p.id} />
                <button className="inline-flex items-center gap-1 text-xs font-bold text-ink-soft hover:text-crit">
                  <Trash2 size={12} /> Excluir perfil
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
