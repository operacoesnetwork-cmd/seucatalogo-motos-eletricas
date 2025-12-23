import { ProductForm } from "../_components/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Novo Produto</h1>
        <p className="text-gray-600">Adicione um novo veículo ao seu catálogo</p>
      </div>
      <ProductForm />
    </div>
  );
}
