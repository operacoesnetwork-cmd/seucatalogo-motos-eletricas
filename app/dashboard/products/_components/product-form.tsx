"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { MultiImageUpload } from "@/components/ui/multi-image-upload";
import { ColorSelector, type ColorOption } from "@/components/ui/color-selector";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/components/ui/toast";
import { CATEGORY_OPTIONS } from "@/lib/types";
import {
  Save,
  ArrowLeft,
  Package,
  DollarSign,
  Zap,
  Image as ImageIcon,
  Palette,
} from "lucide-react";

interface ProductFormProps {
  productId?: string;
}

export function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(!!productId);
  const [isSaving, setIsSaving] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    category: "moto_eletrica",
    mainImageKey: "",
    mainImageUrl: "",
    galleryKeys: [] as string[],
    galleryUrls: [] as string[],
    basePrice: "",
    discountPrice: "",
    showPrice: true,
    hasDiscount: false,
    motorPower: "",
    autonomy: "",
    battery: "",
    maxSpeed: "",
    chargeTime: "",
    maxWeight: "",
    availableColors: [] as ColorOption[],
    technicalDetails: "",
    isActive: true,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/products/${productId}`);
          const data = await response?.json?.();
          if (data?.product) {
            setFormData({
              name: data.product?.name ?? "",
              category: data.product?.category ?? "moto_eletrica",
              mainImageKey: data.product?.mainImageKey ?? "",
              mainImageUrl: data.product?.mainImageUrl ?? "",
              galleryKeys: data.product?.galleryKeys ?? [],
              galleryUrls: data.product?.galleryUrls ?? [],
              basePrice: data.product?.basePrice?.toString?.() ?? "",
              discountPrice: data.product?.discountPrice?.toString?.() ?? "",
              showPrice: data.product?.showPrice ?? true,
              hasDiscount: data.product?.hasDiscount ?? false,
              motorPower: data.product?.motorPower ?? "",
              autonomy: data.product?.autonomy ?? "",
              battery: data.product?.battery ?? "",
              maxSpeed: data.product?.maxSpeed ?? "",
              chargeTime: data.product?.chargeTime ?? "",
              maxWeight: data.product?.maxWeight ?? "",
              availableColors: data.product?.availableColors ?? [],
              technicalDetails: data.product?.technicalDetails ?? "",
              isActive: data.product?.isActive ?? true,
            });
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          showToast?.("Erro ao carregar produto", "error");
        } finally {
          setIsLoading(false);
        }
      };

      fetchProduct();
    }
  }, [productId, showToast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e?.target ?? {};
    setFormData((prev) => ({ ...(prev ?? {}), [name ?? '']: value ?? '' }));
    setErrors((prev) => ({ ...(prev ?? {}), [name ?? '']: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData?.name) newErrors.name = "Nome é obrigatório";
    if (!formData?.category) newErrors.category = "Categoria é obrigatória";
    if (!formData?.mainImageUrl) newErrors.mainImageUrl = "Imagem principal é obrigatória";
    setErrors(newErrors);
    return Object.keys(newErrors ?? {}).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const url = productId ? `/api/products/${productId}` : "/api/products";
      const method = productId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response?.json?.();

      if (!response?.ok) {
        showToast?.(data?.error ?? "Erro ao salvar produto", "error");
        return;
      }

      showToast?.(productId ? "Produto atualizado!" : "Produto criado!", "success");
      router.push("/dashboard/products");
    } catch (error) {
      showToast?.("Erro ao salvar produto", "error");
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados Básicos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Dados Básicos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Nome do Veículo *"
            name="name"
            value={formData?.name ?? ''}
            onChange={handleChange}
            placeholder="Ex: Scooter Elétrica X1000"
            error={errors?.name}
          />
          <Select
            label="Categoria *"
            name="category"
            value={formData?.category ?? ''}
            onChange={handleChange}
            options={[...CATEGORY_OPTIONS]}
            error={errors?.category}
          />
          <Checkbox
            label="Produto ativo (visível no catálogo)"
            checked={formData?.isActive ?? true}
            onChange={(checked) =>
              setFormData((prev) => ({ ...(prev ?? {}), isActive: checked }))
            }
          />
        </CardContent>
      </Card>

      {/* Imagens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Imagens
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUpload
            label="Imagem Principal *"
            value={formData?.mainImageUrl ?? ''}
            onChange={(url, key) =>
              setFormData((prev) => ({ 
                ...(prev ?? {}), 
                mainImageUrl: url,
                mainImageKey: key ?? ''
              }))
            }
            onRemove={() =>
              setFormData((prev) => ({ 
                ...(prev ?? {}), 
                mainImageUrl: "",
                mainImageKey: ""
              }))
            }
            aspectRatio="square"
            compact
            error={errors?.mainImageUrl}
          />
          <MultiImageUpload
            label="Galeria de Fotos (opcional)"
            values={formData?.galleryUrls ?? []}
            keys={formData?.galleryKeys ?? []}
            onChange={(urls, keys) =>
              setFormData((prev) => ({ 
                ...(prev ?? {}), 
                galleryUrls: urls,
                galleryKeys: keys ?? []
              }))
            }
            maxImages={6}
          />
        </CardContent>
      </Card>

      {/* Preços */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Preços
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Switch
            label="Exibir preço no catálogo"
            checked={formData?.showPrice ?? true}
            onChange={(checked) =>
              setFormData((prev) => ({ ...(prev ?? {}), showPrice: checked }))
            }
          />
          
          {formData?.showPrice && (
            <>
              <Input
                label="Preço Base (R$)"
                name="basePrice"
                type="number"
                step="0.01"
                min="0"
                value={formData?.basePrice ?? ''}
                onChange={handleChange}
                placeholder="0,00"
              />
              
              <Switch
                label="Ativar desconto"
                checked={formData?.hasDiscount ?? false}
                onChange={(checked) =>
                  setFormData((prev) => ({ ...(prev ?? {}), hasDiscount: checked }))
                }
              />
              
              {formData?.hasDiscount && (
                <Input
                  label="Preço com Desconto (R$)"
                  name="discountPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData?.discountPrice ?? ''}
                  onChange={handleChange}
                  placeholder="0,00"
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Especificações Técnicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Especificações Técnicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Potência do Motor"
              name="motorPower"
              value={formData?.motorPower ?? ''}
              onChange={handleChange}
              placeholder="Ex: 3000W"
            />
            <Input
              label="Autonomia"
              name="autonomy"
              value={formData?.autonomy ?? ''}
              onChange={handleChange}
              placeholder="Ex: 80-100 km"
            />
            <Input
              label="Bateria"
              name="battery"
              value={formData?.battery ?? ''}
              onChange={handleChange}
              placeholder="Ex: Lítio 72V 32Ah"
            />
            <Input
              label="Velocidade Máxima"
              name="maxSpeed"
              value={formData?.maxSpeed ?? ''}
              onChange={handleChange}
              placeholder="Ex: 80 km/h"
            />
            <Input
              label="Tempo de Carga"
              name="chargeTime"
              value={formData?.chargeTime ?? ''}
              onChange={handleChange}
              placeholder="Ex: 4-6 horas"
            />
            <Input
              label="Peso Máximo Suportado"
              name="maxWeight"
              value={formData?.maxWeight ?? ''}
              onChange={handleChange}
              placeholder="Ex: 150 kg"
            />
          </div>
          <Textarea
            label="Detalhes Técnicos Adicionais"
            name="technicalDetails"
            value={formData?.technicalDetails ?? ''}
            onChange={handleChange}
            placeholder="Outras informações técnicas relevantes..."
          />
        </CardContent>
      </Card>

      {/* Cores Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Cores Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ColorSelector
            selectedColors={formData?.availableColors ?? []}
            onChange={(colors) =>
              setFormData((prev) => ({ ...(prev ?? {}), availableColors: colors }))
            }
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button type="submit" isLoading={isSaving}>
          <Save className="h-4 w-4" />
          {productId ? "Salvar Alterações" : "Criar Produto"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/products")}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>
    </form>
  );
}
