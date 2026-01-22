import { Layout } from "@/components/layout/Layout";

interface LegalPageProps {
  title: string;
  children: React.ReactNode;
}

function LegalPageWrapper({ title, children }: LegalPageProps) {
  return (
    <Layout>
      <div className="container-bwk py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">{title}</h1>
          <div className="prose prose-neutral max-w-none">
            {children}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export function EntregasPage() {
  return (
    <LegalPageWrapper title="Entregas e Prazos">
      <h2 className="text-xl font-semibold mt-6 mb-3">Prazos de Entrega</h2>
      <p className="text-muted-foreground mb-4">
        Os prazos de entrega variam de acordo com a região e o método de envio escolhido:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
        <li>Capitais e regiões metropolitanas: 3 a 7 dias úteis</li>
        <li>Interior: 5 a 12 dias úteis</li>
        <li>Regiões remotas: 10 a 20 dias úteis</li>
      </ul>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">Frete</h2>
      <p className="text-muted-foreground mb-4">
        O valor do frete é calculado no momento do checkout com base no CEP de destino e peso do pedido.
        Oferecemos frete grátis para pedidos acima de determinado valor (consulte condições atuais).
      </p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">Rastreamento</h2>
      <p className="text-muted-foreground">
        Após a postagem, você receberá um código de rastreamento por e-mail para acompanhar seu pedido.
      </p>
    </LegalPageWrapper>
  );
}

export function TrocasPage() {
  return (
    <LegalPageWrapper title="Trocas e Devoluções">
      <h2 className="text-xl font-semibold mt-6 mb-3">Política de Trocas</h2>
      <p className="text-muted-foreground mb-4">
        Você pode solicitar a troca de produtos em até 7 dias corridos após o recebimento, 
        desde que o produto esteja em sua embalagem original, sem uso e com todos os acessórios.
      </p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">Devoluções</h2>
      <p className="text-muted-foreground mb-4">
        Caso deseje devolver o produto e receber reembolso, o prazo é de 7 dias corridos após o recebimento,
        conforme o Código de Defesa do Consumidor.
      </p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">Como Solicitar</h2>
      <p className="text-muted-foreground">
        Entre em contato conosco pelo WhatsApp ou e-mail informando o número do pedido e o motivo da troca/devolução.
        Nossa equipe irá orientá-lo sobre os próximos passos.
      </p>
    </LegalPageWrapper>
  );
}

export function PagamentosPage() {
  return (
    <LegalPageWrapper title="Formas de Pagamento">
      <h2 className="text-xl font-semibold mt-6 mb-3">Métodos Aceitos</h2>
      <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
        <li>Cartão de Crédito (Visa, Mastercard, Elo, American Express)</li>
        <li>Cartão de Débito</li>
        <li>Pix</li>
        <li>Boleto Bancário</li>
      </ul>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">Parcelamento</h2>
      <p className="text-muted-foreground mb-4">
        Parcelamos em até 12x no cartão de crédito (consulte taxas de juros).
        Para compras B2B, oferecemos condições especiais de pagamento a prazo.
      </p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">Segurança</h2>
      <p className="text-muted-foreground">
        Todas as transações são processadas em ambiente seguro com criptografia SSL.
      </p>
    </LegalPageWrapper>
  );
}

export function PrivacidadePage() {
  return (
    <LegalPageWrapper title="Política de Privacidade">
      <p className="text-muted-foreground mb-6">
        A BWK Utilidades está comprometida em proteger a privacidade dos dados de seus clientes.
        Esta política descreve como coletamos, usamos e protegemos suas informações.
      </p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">Dados Coletados</h2>
      <p className="text-muted-foreground mb-4">
        Coletamos informações necessárias para processar pedidos e melhorar sua experiência:
        nome, e-mail, telefone, endereço de entrega e dados de pagamento.
      </p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">Uso das Informações</h2>
      <p className="text-muted-foreground mb-4">
        Utilizamos seus dados para: processar pedidos, enviar atualizações sobre entregas,
        responder dúvidas e, com sua autorização, enviar ofertas e novidades.
      </p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">Compartilhamento</h2>
      <p className="text-muted-foreground mb-4">
        Não vendemos nem compartilhamos seus dados com terceiros, exceto quando necessário
        para processar pagamentos e entregas (parceiros logísticos e gateways de pagamento).
      </p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">Seus Direitos</h2>
      <p className="text-muted-foreground">
        Você pode solicitar acesso, correção ou exclusão de seus dados a qualquer momento
        entrando em contato conosco.
      </p>
    </LegalPageWrapper>
  );
}

export function TermosPage() {
  return (
    <LegalPageWrapper title="Termos de Uso">
      <p className="text-muted-foreground mb-6">
        Ao utilizar o site da BWK Utilidades, você concorda com os termos descritos abaixo.
      </p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">Uso do Site</h2>
      <p className="text-muted-foreground mb-4">
        O site destina-se à venda de produtos de limpeza, higiene e utilidades.
        É proibido o uso para fins ilegais ou não autorizados.
      </p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">Produtos e Preços</h2>
      <p className="text-muted-foreground mb-4">
        Os preços e disponibilidade dos produtos estão sujeitos a alterações sem aviso prévio.
        Nos reservamos o direito de corrigir erros de precificação.
      </p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">Propriedade Intelectual</h2>
      <p className="text-muted-foreground mb-4">
        Todo o conteúdo do site (textos, imagens, logotipos) é propriedade da BWK Utilidades
        e não pode ser reproduzido sem autorização.
      </p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">Limitação de Responsabilidade</h2>
      <p className="text-muted-foreground">
        A BWK Utilidades não se responsabiliza por danos indiretos decorrentes do uso do site
        ou de problemas técnicos fora de nosso controle.
      </p>
    </LegalPageWrapper>
  );
}
