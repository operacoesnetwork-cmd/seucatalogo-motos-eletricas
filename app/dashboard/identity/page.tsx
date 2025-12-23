import { IdentityForm } from "./_components/identity-form";

export default function IdentityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Identidade Visual</h1>
        <p className="text-gray-600">Personalize a aparência do seu catálogo</p>
      </div>
      <IdentityForm />
    </div>
  );
}
