"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Mail, Lock } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e?.target ?? {};
    setFormData((prev) => ({ ...(prev ?? {}), [name ?? '']: value ?? '' }));
    setErrors((prev) => ({ ...(prev ?? {}), [name ?? '']: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData?.email) newErrors.email = "Email é obrigatório";
    if (!formData?.password) newErrors.password = "Senha é obrigatória";
    setErrors(newErrors);
    return Object.keys(newErrors ?? {}).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: formData?.email ?? '',
        password: formData?.password ?? '',
        redirect: false,
      });

      if (result?.error) {
        showToast?.(result.error, "error");
      } else {
        showToast?.("Login realizado com sucesso!", "success");
        router.replace("/dashboard");
      }
    } catch (error) {
      showToast?.("Erro ao fazer login", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="seu@email.com"
        value={formData?.email ?? ''}
        onChange={handleChange}
        error={errors?.email}
        icon={<Mail className="h-5 w-5" />}
      />
      <Input
        label="Senha"
        name="password"
        type="password"
        placeholder="••••••••"
        value={formData?.password ?? ''}
        onChange={handleChange}
        error={errors?.password}
        icon={<Lock className="h-5 w-5" />}
      />
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Entrar
      </Button>
    </form>
  );
}
