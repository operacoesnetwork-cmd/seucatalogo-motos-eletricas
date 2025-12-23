"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Store, Phone, ArrowRight } from "lucide-react";
import { PageLoading } from "@/components/ui/loading";

export function OnboardingForm() {
  const router = useRouter();
  const { data: session, status, update } = useSession() || {};
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    whatsapp: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
    if (status === "authenticated" && (session?.user as any)?.hasStore) {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e?.target ?? {};
    setFormData((prev) => ({ ...(prev ?? {}), [name ?? '']: value ?? '' }));
    setErrors((prev) => ({ ...(prev ?? {}), [name ?? '']: "" }));
  };

  const formatPhone = (value: string) => {
    const numbers = value?.replace(/\D/g, "") ?? '';
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e?.target?.value ?? '');
    setFormData((prev) => ({ ...(prev ?? {}), whatsapp: formatted }));
    setErrors((prev) => ({ ...(prev ?? {}), whatsapp: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData?.name) newErrors.name = "Nome da loja é obrigatório";
    const phoneNumbers = formData?.whatsapp?.replace(/\D/g, "") ?? '';
    if (!phoneNumbers) newErrors.whatsapp = "WhatsApp é obrigatório";
    else if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      newErrors.whatsapp = "WhatsApp inválido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors ?? {}).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData?.name ?? '',
          whatsapp: formData?.whatsapp?.replace(/\D/g, "") ?? '',
        }),
      });

      const data = await response?.json?.();

      if (!response?.ok) {
        showToast?.(data?.error ?? "Erro ao criar loja", "error");
        return;
      }

      await update?.({
        hasStore: true,
        storeSlug: data?.store?.slug ?? '',
      });

      showToast?.("Loja criada com sucesso!", "success");
      router.replace("/dashboard");
    } catch (error) {
      showToast?.("Erro ao criar loja", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return <PageLoading />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome da Loja"
        name="name"
        type="text"
        placeholder="Ex: EletroMotos São Paulo"
        value={formData?.name ?? ''}
        onChange={handleChange}
        error={errors?.name}
        icon={<Store className="h-5 w-5" />}
      />
      <Input
        label="WhatsApp"
        name="whatsapp"
        type="tel"
        placeholder="(11) 99999-9999"
        value={formData?.whatsapp ?? ''}
        onChange={handlePhoneChange}
        error={errors?.whatsapp}
        icon={<Phone className="h-5 w-5" />}
      />
      <p className="text-xs text-gray-500">
        Este será o número de contato exibido no seu catálogo
      </p>
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Criar Meu Catálogo
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
