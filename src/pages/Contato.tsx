import { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/layout/Layout";
import { siteConfig } from "@/config/site";

export default function ContatoPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `*Contato - BWK Utilidades*%0A%0A*Nome:* ${form.name}%0A*Email:* ${form.email}%0A*Tel:* ${form.phone}%0A*Assunto:* ${form.subject}%0A%0A*Mensagem:* ${form.message}`;
    window.open(`${siteConfig.contact.whatsapp}?text=${message}`, "_blank");
  };
  
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-muted py-16 md:py-24 border-b border-border">
        <div className="container-bwk">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Fale <span className="text-primary">Conosco</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Estamos prontos para atender você. Entre em contato para tirar dúvidas, 
              solicitar orçamentos ou conhecer mais sobre nossos produtos.
            </p>
          </div>
        </div>
      </section>
      
      <section className="section-padding bg-background">
        <div className="container-bwk">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
              
              <div className="space-y-6">
                <a
                  href={siteConfig.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-muted border border-border rounded-xl hover:bg-background transition-colors"
                >
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">WhatsApp</h3>
                    <p className="text-muted-foreground">{siteConfig.contact.phone}</p>
                    <p className="text-sm text-muted-foreground mt-1">Atendimento rápido e personalizado</p>
                  </div>
                </a>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Telefone</h3>
                    <p className="text-muted-foreground">{siteConfig.contact.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">E-mail</h3>
                    <a href={`mailto:${siteConfig.contact.email}`} className="text-muted-foreground hover:text-primary">
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Endereço</h3>
                    <p className="text-muted-foreground">
                      {siteConfig.contact.address.street}, {siteConfig.contact.address.neighborhood}<br />
                      {siteConfig.contact.address.city} - {siteConfig.contact.address.state}, {siteConfig.contact.address.zip}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Horário de Funcionamento</h3>
                    <p className="text-muted-foreground">{siteConfig.contact.businessHours}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Envie uma Mensagem</h2>
              
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="(11) 99999-9999"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    placeholder="Ex: Dúvida sobre produto, orçamento..."
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem *</Label>
                  <Textarea
                    id="message"
                    required
                    rows={5}
                    placeholder="Como podemos ajudar?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full">
                  Enviar via WhatsApp
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
