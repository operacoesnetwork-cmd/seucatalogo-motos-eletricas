import { SettingsForm } from "./_components/settings-form";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie as informações da sua loja</p>
      </div>
      <SettingsForm />
    </div>
  );
}
