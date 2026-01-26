import { OnboardingForm } from "./_components/onboarding-form";
import { Zap } from "lucide-react";
import Image from "next/image";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white flex flex-col">
      <header className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 relative flex items-center justify-center">
            <Image src="/brand/icon.svg" alt="Logo" fill className="object-contain" />
          </div>
          <span className="text-xl font-bold text-gray-900">EletroMoto</span>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image src="/brand/icon.svg" alt="App Icon" width={32} height={32} className="object-contain" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Configure sua loja</h1>
              <p className="text-gray-600">Vamos criar seu catálogo digital em poucos passos</p>
            </div>
            <OnboardingForm />
          </div>
        </div>
      </main>
    </div>
  );
}
