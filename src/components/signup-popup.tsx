"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Check } from "lucide-react";

import { AuthForm } from "@/components/auth-form";

const KEY = "patrinu_signup_dismissed";
const BULLETS = [
  "Busque oportunidades",
  "Publique projetos",
  "Encontre profissionais",
  "Editais, notícias e cursos",
];

export function SignupPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const onAuthRoute =
    pathname.startsWith("/entrar") ||
    pathname.startsWith("/cadastro") ||
    pathname.startsWith("/master");

  useEffect(() => {
    if (onAuthRoute) return;
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(KEY) === "1";
    } catch {}
    if (dismissed) return;
    const t = setTimeout(() => setOpen(true), 5000);
    return () => clearTimeout(t);
  }, [onAuthRoute]);

  if (!open) return null;

  const close = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/55 p-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="relative grid w-full max-w-3xl overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-pop)] sm:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Fechar"
          className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-surface/80 text-ink hover:bg-surface"
        >
          <X size={16} />
        </button>

        {/* esquerda — imagem + copy */}
        <div className="relative hidden min-h-[420px] flex-col justify-center p-8 text-white sm:flex">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/popup-artesao.jpg)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight">
              O patrimônio do Brasil{" "}
              <span className="accent text-accent">está aqui.</span>
            </h2>
            <ul className="mt-5 space-y-2.5">
              {BULLETS.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-white/90">
                  <Check size={16} className="shrink-0 text-accent" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* direita — formulário */}
        <div className="p-8">
          <h3 className="font-display text-2xl font-bold tracking-tight">Crie uma conta</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Já possui uma conta?{" "}
            <Link
              href="/entrar"
              onClick={close}
              className="font-semibold text-green-ink underline hover:no-underline"
            >
              Entre aqui
            </Link>
          </p>
          <AuthForm mode="signup" />
        </div>
      </div>
    </div>
  );
}
