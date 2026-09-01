import { desc } from "drizzle-orm";

import { db } from "@/db";
import { financingRequests } from "@/db/schema";
import { formatDate } from "@/lib/taxonomy";

export default async function FinanciamentoPage() {
  const rows = await db
    .select()
    .from(financingRequests)
    .orderBy(desc(financingRequests.createdAt));

  return (
    <div className="space-y-6 [overflow-wrap:anywhere]">
      <div>
        <p className="kicker text-muted">Leads</p>
        <h1 className="display mt-1 text-3xl text-ink sm:text-4xl">Financiamento</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {rows.length} pedidos da trilha &ldquo;Quero financiamento de obra&rdquo;.
        </p>
      </div>

      <div className="space-y-3">
        {rows.length === 0 && (
          <p className="border border-dashed border-border bg-surface p-6 text-center text-sm text-muted">
            Nenhum pedido ainda.
          </p>
        )}
        {rows.map((f) => (
          <div key={f.id} className="card p-4">
            <p className="text-xs text-muted">
              {f.status} · {formatDate(f.createdAt.toISOString())}
            </p>
            <p className="mt-1 font-display font-bold text-ink">
              {f.assetName} — {f.organization}
            </p>
            <p className="text-sm text-ink-soft">
              {f.contactName} · {f.contactEmail}
              {f.city ? ` · ${f.city}` : ""}
              {f.uf ? `/${f.uf}` : ""}
            </p>
            <dl className="mt-2 grid gap-x-6 gap-y-1 text-sm text-ink-soft sm:grid-cols-3">
              {f.projectStage && (
                <div>
                  <dt className="inline text-muted">Estágio: </dt>
                  <dd className="inline">{f.projectStage}</dd>
                </div>
              )}
              {f.fundingGoal && (
                <div>
                  <dt className="inline text-muted">Meta: </dt>
                  <dd className="inline">{f.fundingGoal}</dd>
                </div>
              )}
              {f.mechanism && (
                <div>
                  <dt className="inline text-muted">Mecanismo: </dt>
                  <dd className="inline">{f.mechanism}</dd>
                </div>
              )}
            </dl>
            {f.summary && (
              <p className="mt-2 bg-sunk px-3 py-2 text-sm text-ink-soft">{f.summary}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
