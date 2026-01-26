"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/components/ui/toast";
import { Save, Store, Phone, Instagram, MapPin, Copy, Check } from "lucide-react";

const STATES = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

interface StoreData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  whatsapp: string;
  instagram: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
}

export function SettingsForm() {
  const { showToast } = useToast();
  const [store, setStore] = React.useState<StoreData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    whatsapp: "",
    instagram: "",
    city: "",
    state: "",
    address: "",
  });

  const handleCopyLink = () => {
    if (!store?.slug) return;
    const link = `${window.location.origin}/${store.slug}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    showToast("Link copiado para a área de transferência!", "success");
    setTimeout(() => setIsCopied(false), 2000);
  };

  React.useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await fetch("/api/stores");
        const data = await response?.json?.();
        if (data?.store) {
          setStore(data.store);
          setFormData({
            name: data.store?.name ?? "",
            description: data.store?.description ?? "",
            whatsapp: formatPhone(data.store?.whatsapp ?? ""),
            instagram: data.store?.instagram ?? "",
            city: data.store?.city ?? "",
            state: data.store?.state ?? "",
            address: data.store?.address ?? "",
          });
        }
      } catch (error) {
        console.error("Error fetching store:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStore();
  }, []);

  const formatPhone = (value: string) => {
    const numbers = value?.replace(/\D/g, "") ?? '';
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e?.target ?? {};
    if (name === "whatsapp") {
      setFormData((prev) => ({ ...(prev ?? {}), whatsapp: formatPhone(value ?? '') }));
    } else {
      setFormData((prev) => ({ ...(prev ?? {}), [name ?? '']: value ?? '' }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/stores", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          whatsapp: formData?.whatsapp?.replace(/\D/g, "") ?? '',
        }),
      });

      if (!response?.ok) {
        throw new Error("Erro ao salvar");
      }

      showToast?.("Configurações atualizadas!", "success");
    } catch (error) {
      showToast?.("Erro ao salvar alterações", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading size="lg" text="Carregando..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Informações da Loja
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Nome da Loja"
            name="name"
            value={formData?.name ?? ''}
            onChange={handleChange}
            placeholder="Nome da sua loja"
          />
          <Textarea
            label="Descrição"
            name="description"
            value={formData?.description ?? ''}
            onChange={handleChange}
            placeholder="Descreva sua loja em poucas palavras..."
          />
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-700 block mb-0.5">Seu link</p>
              <p className="text-sm text-primary font-medium truncate">
                {typeof window !== 'undefined' ? window.location.origin : ''}/{store?.slug ?? ''}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 min-w-[90px]"
              onClick={handleCopyLink}
              type="button"
            >
              {isCopied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copiar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="WhatsApp"
            name="whatsapp"
            value={formData?.whatsapp ?? ''}
            onChange={handleChange}
            placeholder="(11) 99999-9999"
            icon={<Phone className="h-5 w-5" />}
          />
          <Input
            label="Instagram (opcional)"
            name="instagram"
            value={formData?.instagram ?? ''}
            onChange={handleChange}
            placeholder="@sualoja"
            icon={<Instagram className="h-5 w-5" />}
          />
        </CardContent>
      </Card>

      {/* Localização */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Localização
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Cidade"
              name="city"
              value={formData?.city ?? ''}
              onChange={handleChange}
              placeholder="Sua cidade"
            />
            <Select
              label="Estado"
              name="state"
              value={formData?.state ?? ''}
              onChange={handleChange}
              options={STATES}
              placeholder="Selecione o estado"
            />
          </div>
          <Textarea
            label="Endereço Completo (opcional)"
            name="address"
            value={formData?.address ?? ''}
            onChange={handleChange}
            placeholder="Rua, número, bairro..."
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <Button onClick={handleSave} isLoading={isSaving}>
        <Save className="h-4 w-4" />
        Salvar Alterações
      </Button>
    </div>
  );
}
