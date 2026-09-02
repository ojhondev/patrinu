import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser, isMasterSession } from "@/lib/auth";
import {
  interestsByUser,
  interestsForOwner,
  proposalsByUser,
  proposalsForOwner,
} from "@/lib/interactions";
import { cn } from "@/lib/cn";
import { ApplicantCard } from "@/components/painel/applicant-card";
import { ApplicationCard } from "@/components/painel/application-card";
import { ProposalThread } from "@/components/proposal-thread";

export const metadata: Metadata = { title: "Candidaturas · Painel" };

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function CandidaturasPage({ searchParams }: { searchParams: SP }) {
  if (await isMasterSession()) redirect("/master");
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/painel/candidaturas");

  const tabParam = (await searchParams).tab;
  const tab = (Array.isArray(tabParam) ? tabParam[0] : tabParam) === "enviadas" ? "enviadas" : "recebidas";

  const [received, sent, receivedProps, sentProps] = await Promise.all([
    interestsForOwner(user.id),
    interestsByUser(user.id),
    proposalsForOwner(user.id),
    proposalsByUser(user.id),
  ]);

  const tabs = [
    { key: "recebidas", label: `Recebidas (${received.length})`, href: "/painel/candidaturas" },
    {
      key: "enviadas",
      label: `Enviadas (${sent.length})`,
      href: "/painel/candidaturas?tab=enviadas",
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="display text-3xl text-ink">Candidaturas</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Quem se candidatou às suas publicações e as vagas em que você se candidatou.
        </p>
      </header>

      <div className="flex gap-2 border-b border-border">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-sm font-semibold",
              tab === t.key
                ? "border-brand text-ink"
                : "border-transparent text-muted hover:text-ink",
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {tab === "recebidas" ? (
        <div className="space-y-3">
          {received.length === 0 ? (
            <p className="rounded-card border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
              Ninguém se candidatou às suas publicações ainda.
            </p>
          ) : (
            received.map((i) => <ApplicantCard key={`${i.projectId}-${i.userId}`} i={i} />)
          )}
          {receivedProps.length > 0 && (
            <div className="space-y-3 pt-4">
              <h2 className="font-display text-sm font-bold text-muted">
                Propostas (formato antigo)
              </h2>
              {receivedProps.map((p) => (
                <ProposalThread key={p.id} proposal={p} viewer="owner" currentUserId={user.id} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {sent.length === 0 ? (
            <p className="rounded-card border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
              Você ainda não se candidatou a nenhuma vaga.{" "}
              <Link href="/vagas" className="font-semibold text-green-ink hover:underline">
                Ver vagas abertas
              </Link>
              .
            </p>
          ) : (
            sent.map((a) => <ApplicationCard key={a.projectId} a={a} />)
          )}
          {sentProps.length > 0 && (
            <div className="space-y-3 pt-4">
              <h2 className="font-display text-sm font-bold text-muted">
                Propostas (formato antigo)
              </h2>
              {sentProps.map((p) => (
                <ProposalThread
                  key={p.id}
                  proposal={p}
                  viewer="proponent"
                  currentUserId={user.id}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
