import { FileText, CheckCircle, Phone, Mail, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { siteConfig } from "@/config/site";
import { categories } from "@/data/categories";

export default function LicitacoesPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-bwk">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">
              Licitações <span className="text-primary">Públicas</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              A BWK Utilidades está preparada para atender órgãos públicos e participar de 
              processos licitatórios com documentação completa e experiência comprovada.
            </p>
          </div>
        </div>
      </section>
      
      {/* What we supply */}
      <section className="section-padding bg-background">
        <div className="container-bwk">
          <h2 className="text-3xl font-bold text-center mb-12">O Que Fornecemos</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.slug} className="p-6 bg-muted rounded-xl">
                <h3 className="font-semibold text-lg mb-2">{cat.name}</h3>
                <p className="text-sm text-muted-foreground">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Credibility */}
      <section className="section-padding bg-muted">
        <div className="container-bwk">
          <h2 className="text-3xl font-bold text-center mb-4">Nossa Credibilidade</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Documentação em dia e experiência para atender processos licitatórios.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <FileText className="h-10 w-10 text-primary mx-auto mb-3" />
              <h4 className="font-semibold">CNPJ Ativo</h4>
              <p className="text-xs text-muted-foreground mt-1">Situação regular</p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <CheckCircle className="h-10 w-10 text-primary mx-auto mb-3" />
              <h4 className="font-semibold">Certidões Negativas</h4>
              <p className="text-xs text-muted-foreground mt-1">Federal, estadual e municipal</p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <Building2 className="h-10 w-10 text-primary mx-auto mb-3" />
              <h4 className="font-semibold">Contrato Social</h4>
              <p className="text-xs text-muted-foreground mt-1">Atualizado</p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <FileText className="h-10 w-10 text-primary mx-auto mb-3" />
              <h4 className="font-semibold">Atestados</h4>
              <p className="text-xs text-muted-foreground mt-1">Capacidade técnica</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="section-padding bg-primary">
        <div className="container-bwk text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Interessado em participar de uma licitação conosco?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Entre em contato para solicitar nossa documentação ou tirar dúvidas sobre fornecimento.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2 h-5 w-5" />
                WhatsApp
              </a>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <a href={`mailto:${siteConfig.contact.email}`}>
                <Mail className="mr-2 h-5 w-5" />
                E-mail
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
