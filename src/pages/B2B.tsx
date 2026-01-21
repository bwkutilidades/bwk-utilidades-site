import { useState } from "react";
import { Building2, Package, Truck, FileText, CheckCircle, Users, Factory, Hotel, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/components/layout/Layout";
import { siteConfig } from "@/config/site";

const segments = [
  { icon: Hotel, name: "Hotéis e Pousadas" },
  { icon: Utensils, name: "Restaurantes e Bares" },
  { icon: Factory, name: "Indústrias" },
  { icon: Building2, name: "Escritórios" },
  { icon: Users, name: "Condomínios" },
];

const steps = [
  { icon: FileText, title: "Solicite Orçamento", description: "Preencha o formulário ou envie via WhatsApp" },
  { icon: Package, title: "Receba Proposta", description: "Analisamos sua demanda e enviamos condições especiais" },
  { icon: Truck, title: "Entrega Garantida", description: "Receba os produtos com prazo e qualidade BWK" },
];

export default function B2BPage() {
  const [formData, setFormData] = useState({
    company: "",
    segment: "",
    city: "",
    state: "",
    itemsOfInterest: "",
    estimatedVolume: "",
    urgency: "",
    contactName: "",
    email: "",
    phone: "",
    message: "",
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to an API
    const message = `*Solicitação B2B - BWK Utilidades*%0A%0A*Empresa:* ${formData.company}%0A*Segmento:* ${formData.segment}%0A*Cidade/UF:* ${formData.city} - ${formData.state}%0A*Itens:* ${formData.itemsOfInterest}%0A*Volume:* ${formData.estimatedVolume}%0A*Urgência:* ${formData.urgency}%0A%0A*Contato:* ${formData.contactName}%0A*Email:* ${formData.email}%0A*Tel:* ${formData.phone}%0A%0A*Mensagem:* ${formData.message}`;
    window.open(`${siteConfig.contact.whatsapp}?text=${message}`, "_blank");
  };
  
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-bwk">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">
              Soluções <span className="text-primary">B2B</span> para sua Empresa
            </h1>
            <p className="text-lg text-muted-foreground">
              Fornecimento de insumos de limpeza, higiene e utilidades com condições especiais 
              para empresas de todos os portes.
            </p>
          </div>
        </div>
      </section>
      
      {/* Who we serve */}
      <section className="section-padding bg-background">
        <div className="container-bwk">
          <h2 className="text-3xl font-bold text-center mb-4">Quem Atendemos</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Empresas de diversos segmentos confiam na BWK para o fornecimento de seus insumos.
          </p>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {segments.map((seg) => (
              <div key={seg.name} className="text-center p-6 bg-muted rounded-xl">
                <seg.icon className="h-10 w-10 mx-auto text-primary mb-3" />
                <span className="font-medium text-sm">{seg.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How it works */}
      <section className="section-padding bg-muted">
        <div className="container-bwk">
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Commercial Conditions */}
      <section className="section-padding bg-background">
        <div className="container-bwk">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Condições Comerciais</h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-6 bg-card border border-border rounded-xl">
                <CheckCircle className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-semibold mb-2">Pedido Mínimo</h4>
                <p className="text-sm text-muted-foreground">A partir de R$ 500,00 em produtos</p>
              </div>
              <div className="p-6 bg-card border border-border rounded-xl">
                <CheckCircle className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-semibold mb-2">Formas de Pagamento</h4>
                <p className="text-sm text-muted-foreground">Boleto, Pix ou cartão corporativo</p>
              </div>
              <div className="p-6 bg-card border border-border rounded-xl">
                <CheckCircle className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-semibold mb-2">Prazo de Entrega</h4>
                <p className="text-sm text-muted-foreground">De 3 a 10 dias úteis (consulte)</p>
              </div>
              <div className="p-6 bg-card border border-border rounded-xl">
                <CheckCircle className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-semibold mb-2">Nota Fiscal</h4>
                <p className="text-sm text-muted-foreground">NF-e para pessoa jurídica</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Lead Form */}
      <section className="section-padding bg-secondary">
        <div className="container-bwk">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-secondary-foreground">
              Solicite um Orçamento
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Preencha o formulário e entraremos em contato rapidamente.
            </p>
            
            <form onSubmit={handleSubmit} className="bg-card p-6 md:p-8 rounded-xl shadow-lg space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Nome da Empresa *</Label>
                  <Input
                    id="company"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="segment">Segmento *</Label>
                  <Input
                    id="segment"
                    required
                    placeholder="Ex: Restaurante, Hotel..."
                    value={formData.segment}
                    onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    required
                    placeholder="SP"
                    maxLength={2}
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="items">Itens de Interesse *</Label>
                <Textarea
                  id="items"
                  required
                  placeholder="Descreva os produtos que você precisa..."
                  value={formData.itemsOfInterest}
                  onChange={(e) => setFormData({ ...formData, itemsOfInterest: e.target.value })}
                />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="volume">Volume Estimado</Label>
                  <Input
                    id="volume"
                    placeholder="Ex: 100 unidades/mês"
                    value={formData.estimatedVolume}
                    onChange={(e) => setFormData({ ...formData, estimatedVolume: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgência</Label>
                  <Select value={formData.urgency} onValueChange={(v) => setFormData({ ...formData, urgency: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <hr className="border-border" />
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Seu Nome *</Label>
                  <Input
                    id="contactName"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem Adicional</Label>
                <Textarea
                  id="message"
                  placeholder="Informações adicionais..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              
              <Button type="submit" size="lg" className="w-full">
                Enviar Solicitação via WhatsApp
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
