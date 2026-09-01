import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { LegalArticle, LegalUpdated } from "@/components/legal-content";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "As regras de uso da plataforma Patrinu.",
};

export default function TermosPage() {
  return (
    <>
      <PageHero eyebrow="Regras da plataforma" title="Termos de Uso">
        As condições para usar o Patrinu — leia antes de criar sua conta ou publicar conteúdo.
      </PageHero>

      <LegalArticle>
        <LegalUpdated date="1 de setembro de 2026" />

        <section>
          <h2>1. O que é o Patrinu</h2>
          <p>
            O Patrinu é uma plataforma independente que conecta profissionais, instituições,
            empresas e detentores de bens de patrimônio cultural — projetos, vagas, editais,
            notícias, cursos e financiamento. O Patrinu <strong>não é parte</strong> nas
            relações firmadas entre usuários (contratação de serviço, candidatura, proposta
            etc.) e <strong>não cobra comissão</strong> sobre essas relações: a plataforma é
            mantida pela assinatura dos seus membros.
          </p>
        </section>

        <section>
          <h2>2. Cadastro e conta</h2>
          <p>
            Para publicar conteúdo, candidatar-se a vagas ou acessar recursos de membro, é
            necessário criar uma conta com informações verdadeiras e mantê-las atualizadas. Você
            é responsável por manter sua senha em sigilo e por toda atividade realizada na sua
            conta. Contas podem ser suspensas ou banidas em caso de violação destes termos.
          </p>
        </section>

        <section>
          <h2>3. Conteúdo publicado por você</h2>
          <p>
            Você é o único responsável pelo conteúdo que publica (projetos, vagas, perfil
            profissional, mensagens, imagens). Ao publicar, você declara ter os direitos
            necessários sobre o material e concede ao Patrinu licença não exclusiva para exibi-lo
            na plataforma. Todo conteúdo passa por revisão da nossa equipe antes de ser publicado
            — a aprovação não representa endosso ou garantia de veracidade pelo Patrinu.
          </p>
          <p>É proibido publicar conteúdo que:</p>
          <ul>
            <li>seja falso, enganoso ou viole direitos de terceiros (autorais, de imagem etc.);</li>
            <li>seja discriminatório, ofensivo ou ilegal;</li>
            <li>tente coletar dados de outros usuários fora dos canais da plataforma;</li>
            <li>configure spam, fraude ou golpe.</li>
          </ul>
        </section>

        <section>
          <h2>4. Patrinu Pro e pagamentos</h2>
          <p>
            Alguns recursos (Radar de Editais, publicar e candidatar-se a vagas, propostas sem
            limite) exigem assinatura do <strong>Patrinu Pro</strong>. O pagamento é processado
            por um parceiro externo (Mercado Pago); o Patrinu não armazena dados do seu cartão. A
            assinatura pode ser cancelada a qualquer momento diretamente com o processador de
            pagamento; o acesso Pro permanece até o fim do período já pago.
          </p>
        </section>

        <section>
          <h2>5. Propriedade intelectual</h2>
          <p>
            A marca, o layout e o código do Patrinu pertencem à plataforma. O conteúdo que você
            publica continua sendo seu — o Patrinu apenas o exibe conforme a licença descrita no
            item 3.
          </p>
        </section>

        <section>
          <h2>6. Limitação de responsabilidade</h2>
          <p>
            O Patrinu é um ponto de encontro: não garantimos a conclusão de uma contratação, a
            qualidade de um serviço prestado por um profissional, nem a veracidade de editais ou
            notícias de terceiros divulgados na plataforma. Recomendamos verificar credenciais,
            registros profissionais e referências antes de fechar qualquer negócio.
          </p>
        </section>

        <section>
          <h2>7. Suspensão e encerramento de conta</h2>
          <p>
            Podemos suspender ou remover contas e conteúdo que violem estes termos, a lei ou
            direitos de terceiros, com ou sem aviso prévio conforme a gravidade. Você pode
            encerrar sua conta a qualquer momento pelo painel ou pedindo pelo contato abaixo.
          </p>
        </section>

        <section>
          <h2>8. Alterações destes termos</h2>
          <p>
            Podemos atualizar estes termos para refletir mudanças no produto ou na legislação.
            O uso continuado da plataforma após uma alteração relevante representa concordância
            com os novos termos.
          </p>
        </section>

        <section>
          <h2>9. Lei aplicável</h2>
          <p>
            Estes termos são regidos pela legislação brasileira. Fica eleito o foro do domicílio
            do usuário para dirimir eventuais controvérsias, salvo disposição legal em contrário.
          </p>
        </section>

        <section>
          <h2>10. Contato</h2>
          <p>
            Dúvidas sobre estes termos? Escreva para{" "}
            <a href="mailto:contato@patrinu.com">contato@patrinu.com</a>. Veja também a{" "}
            <Link href="/privacidade">Política de Privacidade</Link> e a{" "}
            <Link href="/cookies">Política de Cookies</Link>.
          </p>
        </section>
      </LegalArticle>
    </>
  );
}
