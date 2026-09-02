import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Coins,
  Inbox,
  Megaphone,
  Send,
  Sparkles,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";

import { getCurrentUser, isMasterSession } from "@/lib/auth";
import { getPlan } from "@/lib/membership";
import { projectsByOwner } from "@/lib/projects";
import { interestsByUser, interestsForOwner } from "@/lib/interactions";
import { creditStatus } from "@/lib/credits";
import { getMyProfile } from "@/lib/profile";
import { ApplicantCard } from "@/components/painel/applicant-card";
import { ApplicationCard } from "@/components/painel/application-card";

export const metadata: Metadata = { title: "Visão geral · Painel" };

const LIVE = ["aberto", "em_captacao", "vitrine", "em_execucao", "concluido"];

export default async function PainelHome() {
  if (await isMasterSession()) redirect("/master");
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/painel");

  const plan = await getPlan();
  const isPro = plan === "pro";

  const [myProjects, received, sent, credits, profile] = await Promise.all([
    projectsByOwner(user.id),
    interestsForOwner(user.id),
    interestsByUser(user.id),
    creditStatus(user.id, isPro),
    getMyProfile(user.id),
  ]);

  const live = myProjects.filter((p) => LIVE.includes(p.status)).length;
  const pending = myProjects.filter((p) => p.status === "em_analise").length;

  const todo: { done: boolean; label: string; href: string }[] = [
    {
      done: Boolean(profile),
      label: "Criar seu perfil no diretório de profissionais",
      href: "/painel/perfil",
    },
    {
      done: myProjects.length > 0,
      label: "Publicar sua primeira vaga ou projeto",
      href: "/projetos/novo",
    },
    {
      done: sent.length > 0,
      label: "Candidatar-se a uma vaga",
      href: "/vagas",
    },
  ];
  const openTodo = todo.filter((t) => !t.done);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm text-muted">Bem-vindo de volta,</p>
        <h1 className="display text-3xl text-ink sm:text-4xl">{user.name}</h1>
      </header>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={Megaphone}
          label="Publicações no ar"
          value={String(live)}
          hint={pending > 0 ? `${pending} em análise` : "vagas e projetos"}
          href="/painel/publicacoes"
        />
        <Stat
          icon={Inbox}
          label="Candidaturas recebidas"
          value={String(received.length)}
          hint="nas suas publicações"
          href="/painel/candidaturas"
        />
        <Stat
          icon={Send}
          label="Minhas candidaturas"
          value={String(sent.length)}
          hint="vagas em que me candidatei"
          href="/painel/candidaturas?tab=enviadas"
        />
        <Stat
          icon={Coins}
          label="Créditos do mês"
          value={isPro ? "∞" : `${credits.remaining}/${credits.limit}`}
          hint={isPro ? "plano Pro" : "renova todo mês"}
          href="/pro"
        />
      </div>

      {/* Comece por aqui */}
      {openTodo.length > 0 && (
        <section className="card p-5">
          <h2 className="inline-flex items-center gap-2 font-display text-base font-bold text-ink">
            <UserRoundCheck size={16} className="text-brand" />
            Comece por aqui
          </h2>
          <ul className="mt-3 space-y-2">
            {todo.map((t) => (
              <li key={t.label}>
                <Link
                  href={t.href}
                  className={
                    "flex items-center gap-2.5 text-sm " +
                    (t.done
                      ? "text-muted line-through"
                      : "font-medium text-ink hover:text-green-ink")
                  }
                >
                  <span
                    className={
                      "grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[10px] " +
                      (t.done
                        ? "border-green-ink bg-green-ink text-white"
                        : "border-border-strong")
                    }
                  >
                    {t.done ? "✓" : ""}
                  </span>
                  {t.label}
                  {!t.done && <ArrowRight size={13} className="text-muted" />}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* atividade */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Últimas candidaturas recebidas"
          href="/painel/candidaturas"
          empty="Ninguém se candidatou às suas publicações ainda."
          count={received.length}
        >
          {received.slice(0, 3).map((i) => (
            <ApplicantCard key={`${i.projectId}-${i.userId}`} i={i} />
          ))}
        </Panel>

        <Panel
          title="Minhas candidaturas"
          href="/painel/candidaturas?tab=enviadas"
          empty="Você ainda não se candidatou a nenhuma vaga."
          emptyHref="/vagas"
          emptyCta="Ver vagas abertas"
          count={sent.length}
        >
          {sent.slice(0, 3).map((a) => (
            <ApplicationCard key={a.projectId} a={a} />
          ))}
        </Panel>
      </div>

      {/* plano / créditos */}
      {isPro ? (
        <section className="card flex flex-wrap items-center gap-3 p-4">
          <Sparkles size={16} className="text-brand" />
          <span className="text-sm font-semibold text-ink">
            Membro Pro — publicações e candidaturas ilimitadas, contato dos contratantes
            visível e editais completos.
          </span>
        </section>
      ) : (
        <section className="rounded-card border border-brand/25 bg-green-weak/50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 font-display text-base font-bold text-ink">
              <Coins size={16} className="text-brand" />
              {credits.remaining} de {credits.limit} créditos neste mês
            </span>
            <Link href="/pro" className="btn btn-primary btn-sm">
              Seja Pro — sem limites
            </Link>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-pill bg-sunk">
            <span
              className="block h-full rounded-pill bg-brand"
              style={{ width: `${(credits.remaining / credits.limit) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            Publicar um projeto ou uma vaga e candidatar-se a uma vaga custam 1 crédito cada.
          </p>
        </section>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  href: string;
}) {
  return (
    <Link href={href} className="card card-hover p-4">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
        <Icon size={14} className="text-brand" />
        {label}
      </div>
      <p className="mt-2 font-display text-3xl font-extrabold tabular-nums text-ink">{value}</p>
      <p className="mt-0.5 text-xs text-muted">{hint}</p>
    </Link>
  );
}

function Panel({
  title,
  href,
  count,
  empty,
  emptyHref,
  emptyCta,
  children,
}: {
  title: string;
  href: string;
  count: number;
  empty: string;
  emptyHref?: string;
  emptyCta?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-base font-bold text-ink">
          {title}
          {count > 0 && <span className="ml-1.5 text-sm font-medium text-muted">({count})</span>}
        </h2>
        {count > 3 && (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-sm font-semibold text-green-ink hover:text-ink"
          >
            Ver todas <ArrowRight size={14} />
          </Link>
        )}
      </div>
      {count === 0 ? (
        <p className="rounded-card border border-dashed border-border bg-surface p-6 text-center text-sm text-muted">
          {empty}
          {emptyHref && emptyCta && (
            <>
              {" "}
              <Link href={emptyHref} className="font-semibold text-green-ink hover:underline">
                {emptyCta}
              </Link>
            </>
          )}
        </p>
      ) : (
        <div className="space-y-3">{children}</div>
      )}
    </section>
  );
}
