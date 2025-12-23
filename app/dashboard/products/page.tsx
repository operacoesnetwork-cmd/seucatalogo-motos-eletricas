import { ProductsList } from "./_components/products-list";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <p className="text-gray-600">Gerencie os veículos do seu catálogo</p>
      </div>
      <ProductsList />
    </div>
  );
}
