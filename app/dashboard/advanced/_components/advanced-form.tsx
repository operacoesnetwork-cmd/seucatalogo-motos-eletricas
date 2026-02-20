"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/components/ui/toast";
import { Save, LineChart, Code2 } from "lucide-react";

export function AdvancedForm() {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);

    const [formData, setFormData] = React.useState({
        metaPixelId: "",
        googleAdsId: "",
    });

    React.useEffect(() => {
        const fetchStore = async () => {
            try {
                const response = await fetch("/api/stores");
                const data = await response?.json?.();
                if (data?.store) {
                    setFormData({
                        metaPixelId: data.store?.metaPixelId ?? "",
                        googleAdsId: data.store?.googleAdsId ?? "",
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e?.target ?? {};
        setFormData((prev) => ({ ...(prev ?? {}), [name ?? '']: value ?? '' }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch("/api/stores", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                // if user sends empty string we can pass null or empty 
                body: JSON.stringify(formData),
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
            {/* Meta Pixel */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-5 w-5 text-blue-600" />
                        Meta Pixel (Facebook/Instagram)
                    </CardTitle>
                    <CardDescription>
                        Insira o ID do seu Pixel para rastrear conversões (ex: ViewContent, Lead).
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        label="ID do Pixel"
                        name="metaPixelId"
                        value={formData?.metaPixelId ?? ''}
                        onChange={handleChange}
                        placeholder="Ex: 123456789012345"
                        icon={<Code2 className="h-4 w-4 text-gray-400" />}
                    />
                </CardContent>
            </Card>

            {/* Google Ads */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-5 w-5 text-orange-600" />
                        Google Ads (Global Site Tag)
                    </CardTitle>
                    <CardDescription>
                        Insira o ID de acompanhamento do Google Ads para rastrear eventos.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        label="ID de Acompanhamento (AW-)"
                        name="googleAdsId"
                        value={formData?.googleAdsId ?? ''}
                        onChange={handleChange}
                        placeholder="Ex: AW-123456789"
                        icon={<Code2 className="h-4 w-4 text-gray-400" />}
                    />
                </CardContent>
            </Card>

            {/* Actions */}
            <Button onClick={handleSave} isLoading={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
            </Button>
        </div>
    );
}
