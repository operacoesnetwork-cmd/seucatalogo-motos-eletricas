"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Mail, Lock, User } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e?.target ?? {};
    setFormData((prev) => ({ ...(prev ?? {}), [name ?? '']: value ?? '' }));
    setErrors((prev) => ({ ...(prev ?? {}), [name ?? '']: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData?.name) newErrors.name = "Nome é obrigatório";
    if (!formData?.email) newErrors.email = "Email é obrigatório";
    if (!formData?.password) newErrors.password = "Senha é obrigatória";
    if ((formData?.password?.length ?? 0) < 6) newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }
    setErrors(newErrors);
    return Object.keys(newErrors ?? {}).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData?.name ?? '',
          email: formData?.email ?? '',
          password: formData?.password ?? '',
        }),
      });

      const data = await response?.json?.();

      if (!response?.ok) {
        showToast?.(data?.error ?? "Erro ao criar conta", "error");
        return;
      }

      const signInResult = await signIn("credentials", {
        email: formData?.email ?? '',
        password: formData?.password ?? '',
        redirect: false,
      });

      if (signInResult?.error) {
        showToast?.("Conta criada! Faça login para continuar.", "success");
        router.replace("/login");
      } else {
        showToast?.("Conta criada com sucesso!", "success");
        router.replace("/onboarding");
      }
    } catch (error) {
      showToast?.("Erro ao criar conta", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome"
        name="name"
        type="text"
        placeholder="Seu nome"
        value={formData?.name ?? ''}
        onChange={handleChange}
        error={errors?.name}
        icon={<User className="h-5 w-5" />}
      />
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
      <Input
        label="Confirmar Senha"
        name="confirmPassword"
        type="password"
        placeholder="••••••••"
        value={formData?.confirmPassword ?? ''}
        onChange={handleChange}
        error={errors?.confirmPassword}
        icon={<Lock className="h-5 w-5" />}
      />
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Criar Conta
      </Button>
    </form>
  );
}
