import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

/**
 * O banco só é exigido quando uma rota realmente consulta dados. Enquanto o
 * Radar e o Marketplace rodam com mocks (ver src/lib/mock), a ausência de
 * DATABASE_URL não deve quebrar o build nem o `next dev`.
 */
export const db = connectionString
  ? drizzle(neon(connectionString), { schema, casing: "snake_case" })
  : (new Proxy(
      {},
      {
        get() {
          throw new Error(
            "DATABASE_URL não configurada. Rode `npx vercel@latest env pull .env.local` ou preencha .env.local.",
          );
        },
      },
    ) as ReturnType<typeof drizzle<typeof schema>>);

export { schema };
