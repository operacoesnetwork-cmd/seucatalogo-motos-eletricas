import { ProductForm } from "../_components/product-form";

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editar Produto</h1>
        <p className="text-gray-600">Atualize as informações do veículo</p>
      </div>
      <ProductForm productId={params?.id} />
    </div>
  );
}
