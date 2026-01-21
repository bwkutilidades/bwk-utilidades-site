import { Target, Users, Truck, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { siteConfig } from "@/config/site";
import { Link } from "react-router-dom";
import bwkLogo from "@/assets/bwk-logo.png";

export default function SobrePage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-bwk">
          <div className="max-w-3xl">
            <img src={bwkLogo} alt="BWK Utilidades" className="h-16 w-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">
              Sobre a <span className="text-primary">BWK Utilidades</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Somos uma empresa brasileira especializada no fornecimento de insumos de limpeza, 
              higiene e utilidades para consumidores e empresas de todos os portes.
            </p>
          </div>
        </div>
      </section>
      
      {/* Mission/Values */}
      <section className="section-padding bg-background">
        <div className="container-bwk">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-card border border-border rounded-xl">
              <Target className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Missão</h3>
              <p className="text-sm text-muted-foreground">
                Fornecer produtos de qualidade com atendimento ágil e preços competitivos para 
                facilitar a rotina de nossos clientes.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-xl">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Valores</h3>
              <p className="text-sm text-muted-foreground">
                Transparência, agilidade, compromisso com a qualidade e foco na satisfação do cliente.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-xl">
              <Truck className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Entregas</h3>
              <p className="text-sm text-muted-foreground">
                Logística eficiente com entregas para todo o Brasil, garantindo que seu pedido 
                chegue no prazo.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-xl">
              <Building2 className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Estrutura</h3>
              <p className="text-sm text-muted-foreground">
                Estoque próprio e parcerias estratégicas para garantir disponibilidade e 
                variedade de produtos.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Operating Model */}
      <section className="section-padding bg-muted">
        <div className="container-bwk">
          <h2 className="text-3xl font-bold text-center mb-12">Como Operamos</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">B2B</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Empresas</h3>
              <p className="text-sm text-muted-foreground">
                Fornecimento recorrente para hotéis, restaurantes, indústrias, condomínios e mais.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary-foreground">E-com</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">E-commerce</h3>
              <p className="text-sm text-muted-foreground">
                Venda direta para consumidores finais através do nosso catálogo online.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary-foreground">Gov</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Licitações</h3>
              <p className="text-sm text-muted-foreground">
                Participação em processos licitatórios com documentação completa e experiência.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Location */}
      <section className="section-padding bg-background">
        <div className="container-bwk text-center">
          <h2 className="text-3xl font-bold mb-4">Localização</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Estamos localizados em {siteConfig.contact.address.city} - {siteConfig.contact.address.state}, 
            com capacidade para atender clientes em todo o território nacional.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/contato">Entre em Contato</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/catalogo">Ver Catálogo</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
