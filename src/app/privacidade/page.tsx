import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { LegalArticle, LegalUpdated } from "@/components/legal-content";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como o Patrinu coleta, usa e protege os seus dados pessoais, em conformidade com a LGPD.",
};

export default function PrivacidadePage() {
  return (
    <>
      <PageHero eyebrow="Seus dados" title="Política de Privacidade">
        Como coletamos, usamos e protegemos seus dados pessoais no Patrinu, em conformidade com
        a Lei Geral de Proteção de Dados (Lei 13.709/2018 — LGPD).
      </PageHero>

      <LegalArticle>
        <LegalUpdated date="1 de setembro de 2026" />

        <section>
          <h2>1. Quem somos</h2>
          <p>
            O <strong>Patrinu</strong> é uma plataforma independente que reúne conservação e
            restauro do patrimônio cultural brasileiro — projetos, profissionais, vagas, editais,
            notícias e cursos. Esta política explica, em linguagem simples, quais dados
            tratamos, para quê e quais são os seus direitos como titular.
          </p>
        </section>

        <section>
          <h2>2. Quais dados coletamos</h2>
          <p>Coletamos apenas o que é necessário para o funcionamento da plataforma:</p>
          <ul>
            <li>
              <strong>Dados de cadastro:</strong> nome, e-mail e senha (armazenada apenas como
              hash criptográfico — nunca em texto puro).
            </li>
            <li>
              <strong>Perfil profissional (opcional):</strong> nome de exibição, apresentação,
              cidade/UF, especialidades, registros profissionais, foto e portfólio, quando você
              cria um perfil de profissional.
            </li>
            <li>
              <strong>Conteúdo que você publica:</strong> projetos, vagas, candidaturas,
              propostas, mensagens trocadas com outros usuários e imagens/vídeos enviados.
            </li>
            <li>
              <strong>Dados de contato:</strong> quando você envia formulários (financiamento,
              cursos, suporte), coletamos os dados que você mesmo informa.
            </li>
            <li>
              <strong>Dados técnicos e de navegação:</strong> endereço IP, tipo de navegador e
              cookies estritamente necessários ao funcionamento do site (veja nossa{" "}
              <Link href="/cookies">Política de Cookies</Link>).
            </li>
          </ul>
          <p>
            <strong>Não coletamos</strong> dados sensíveis (saúde, biometria, origem racial,
            convicção religiosa etc.) e não usamos cookies de publicidade ou rastreamento de
            terceiros.
          </p>
        </section>

        <section>
          <h2>3. Para que usamos os seus dados</h2>
          <p>Tratamos dados pessoais com as seguintes finalidades e bases legais (art. 7º da LGPD):</p>
          <ul>
            <li>
              <strong>Execução de contrato:</strong> criar e manter sua conta, publicar seu
              conteúdo, viabilizar candidaturas e propostas, processar assinaturas do Patrinu Pro.
            </li>
            <li>
              <strong>Consentimento:</strong> envio da newsletter e comunicações de marketing —
              você pode se descadastrar a qualquer momento.
            </li>
            <li>
              <strong>Legítimo interesse:</strong> prevenção a fraude e abuso, moderação de
              conteúdo, segurança da plataforma e melhoria dos nossos serviços.
            </li>
            <li>
              <strong>Cumprimento de obrigação legal:</strong> quando exigido por autoridade
              competente.
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Com quem compartilhamos</h2>
          <p>
            Não vendemos seus dados. Compartilhamos o mínimo necessário com prestadores de
            serviço que operam a infraestrutura do Patrinu, todos sob obrigações contratuais de
            confidencialidade e segurança:
          </p>
          <ul>
            <li>
              <strong>Vercel</strong> — hospedagem da aplicação e armazenamento de mídia
              (imagens/vídeos enviados).
            </li>
            <li>
              <strong>Neon</strong> — banco de dados onde as informações da plataforma ficam
              armazenadas.
            </li>
            <li>
              <strong>Resend</strong> — envio de e-mails transacionais (confirmações, avisos de
              proposta/candidatura).
            </li>
            <li>
              <strong>Mercado Pago</strong> — processamento de pagamento das assinaturas Pro; o
              Patrinu não armazena dados de cartão.
            </li>
          </ul>
          <p>
            Alguns desses provedores podem processar dados fora do Brasil, sempre com garantias
            de proteção equivalentes às exigidas pela LGPD.
          </p>
        </section>

        <section>
          <h2>5. Por quanto tempo guardamos seus dados</h2>
          <p>
            Mantemos seus dados enquanto sua conta estiver ativa. Ao excluir sua conta, seus
            dados de cadastro são removidos; conteúdo publicado que já tenha se tornado público
            (ex.: um projeto na vitrine) pode ser mantido de forma anonimizada, salvo pedido
            expresso de remoção. Dados podem ser retidos por prazo adicional quando exigido por
            lei (ex.: obrigações fiscais sobre pagamentos).
          </p>
        </section>

        <section>
          <h2>6. Seus direitos (art. 18 da LGPD)</h2>
          <p>Você pode, a qualquer momento e gratuitamente, solicitar:</p>
          <ul>
            <li>confirmação de que tratamos os seus dados;</li>
            <li>acesso aos dados que temos sobre você;</li>
            <li>correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
            <li>portabilidade dos seus dados a outro fornecedor;</li>
            <li>eliminação dos dados tratados com o seu consentimento;</li>
            <li>informação sobre com quem compartilhamos os seus dados;</li>
            <li>revogação do consentimento e oposição a tratamentos indevidos.</li>
          </ul>
          <p>
            A maioria desses pedidos pode ser feita direto no seu{" "}
            <Link href="/painel">painel</Link>. Para os demais, fale com a gente pelo contato
            abaixo.
          </p>
        </section>

        <section>
          <h2>7. Segurança</h2>
          <p>
            Senhas são armazenadas com hash criptográfico (scrypt), a conexão com o site é
            criptografada (HTTPS) e os cookies de sessão são <strong>httpOnly</strong> — não
            acessíveis por scripts no navegador. Apesar dos nossos esforços, nenhum sistema é
            100% invulnerável; caso identifiquemos um incidente de segurança relevante, você será
            notificado conforme exige a LGPD.
          </p>
        </section>

        <section>
          <h2>8. Crianças e adolescentes</h2>
          <p>
            O Patrinu não é direcionado a menores de 18 anos e não coleta intencionalmente dados
            de crianças ou adolescentes.
          </p>
        </section>

        <section>
          <h2>9. Alterações desta política</h2>
          <p>
            Podemos atualizar esta política para refletir mudanças no produto ou na legislação.
            Alterações relevantes serão comunicadas na plataforma antes de entrarem em vigor.
          </p>
        </section>

        <section>
          <h2>10. Contato e encarregado de dados</h2>
          <p>
            Dúvidas, solicitações ou reclamações sobre o tratamento dos seus dados podem ser
            enviadas para{" "}
            <a href="mailto:contato@patrinu.com">contato@patrinu.com</a>. Você também pode
            registrar reclamação junto à Autoridade Nacional de Proteção de Dados (ANPD).
          </p>
        </section>
      </LegalArticle>
    </>
  );
}
