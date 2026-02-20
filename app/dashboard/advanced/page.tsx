import { AdvancedForm } from "./_components/advanced-form";

export default function AdvancedPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Avançado</h1>
                <p className="text-gray-600">Integrações de Marketing e Analíticas</p>
            </div>
            <AdvancedForm />
        </div>
    );
}
