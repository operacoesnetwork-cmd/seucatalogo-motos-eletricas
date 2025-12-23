"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { ColorPicker } from "@/components/ui/color-picker";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/components/ui/toast";
import { ExternalLink, Save, Palette, Image as ImageIcon } from "lucide-react";

interface StoreData {
  id: string;
  slug: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
}

export function IdentityForm() {
  const { showToast } = useToast();
  const [store, setStore] = React.useState<StoreData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [formData, setFormData] = React.useState({
    logoUrl: "",
    bannerUrl: "",
    primaryColor: "#22c55e",
    secondaryColor: "#16a34a",
    backgroundColor: "#f8fafc",
  });

  React.useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await fetch("/api/stores");
        const data = await response?.json?.();
        if (data?.store) {
          setStore(data.store);
          setFormData({
            logoUrl: data.store?.logoUrl ?? "",
            bannerUrl: data.store?.bannerUrl ?? "",
            primaryColor: data.store?.primaryColor ?? "#22c55e",
            secondaryColor: data.store?.secondaryColor ?? "#16a34a",
            backgroundColor: data.store?.backgroundColor ?? "#f8fafc",
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/stores", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response?.ok) {
        throw new Error("Erro ao salvar");
      }

      showToast?.("Identidade visual atualizada!", "success");
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
      {/* Logo e Banner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Logo e Banner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <ImageUpload
              label="Logo da Loja"
              value={formData?.logoUrl ?? ''}
              onChange={(url) => setFormData((prev) => ({ ...(prev ?? {}), logoUrl: url }))}
              onRemove={() => setFormData((prev) => ({ ...(prev ?? {}), logoUrl: "" }))}
              aspectRatio="square"
            />
            <ImageUpload
              label="Banner (Capa)"
              value={formData?.bannerUrl ?? ''}
              onChange={(url) => setFormData((prev) => ({ ...(prev ?? {}), bannerUrl: url }))}
              onRemove={() => setFormData((prev) => ({ ...(prev ?? {}), bannerUrl: "" }))}
              aspectRatio="banner"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Cores do Catálogo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <ColorPicker
              label="Cor Primária"
              value={formData?.primaryColor ?? '#22c55e'}
              onChange={(color) => setFormData((prev) => ({ ...(prev ?? {}), primaryColor: color }))}
            />
            <ColorPicker
              label="Cor Secundária"
              value={formData?.secondaryColor ?? '#16a34a'}
              onChange={(color) => setFormData((prev) => ({ ...(prev ?? {}), secondaryColor: color }))}
            />
            <ColorPicker
              label="Cor de Fundo"
              value={formData?.backgroundColor ?? '#f8fafc'}
              onChange={(color) => setFormData((prev) => ({ ...(prev ?? {}), backgroundColor: color }))}
            />
          </div>
          
          {/* Prévia */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Prévia das cores</p>
            <div 
              className="p-4 rounded-2xl border"
              style={{ backgroundColor: formData?.backgroundColor ?? '#f8fafc' }}
            >
              <div 
                className="p-4 rounded-xl text-white mb-3"
                style={{ backgroundColor: formData?.primaryColor ?? '#22c55e' }}
              >
                <p className="font-medium">Cor primária (cabeçalho)</p>
              </div>
              <div 
                className="p-4 rounded-xl text-white"
                style={{ backgroundColor: formData?.secondaryColor ?? '#16a34a' }}
              >
                <p className="font-medium">Cor secundária</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleSave} isLoading={isSaving}>
          <Save className="h-4 w-4" />
          Salvar Alterações
        </Button>
        {store?.slug && (
          <Link href={`/${store.slug}`} target="_blank">
            <Button variant="outline">
              <ExternalLink className="h-4 w-4" />
              Ver Meu Catálogo
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
