import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { IdentityForm } from "./_components/identity-form";

export default function IdentityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="-ml-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aparência</h1>
          <p className="text-gray-600">Personalize a aparência do seu catálogo</p>
        </div>
      </div>
      <IdentityForm />
    </div>
  );
}
