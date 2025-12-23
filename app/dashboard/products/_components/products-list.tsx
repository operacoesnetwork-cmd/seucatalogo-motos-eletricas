"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loading, TableSkeleton } from "@/components/ui/loading";
import { useToast } from "@/components/ui/toast";
import { CATEGORY_LABELS, type ProductCategory } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Search,
  Filter,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  mainImageUrl: string;
  basePrice: number | null;
  discountPrice: number | null;
  showPrice: boolean;
  isActive: boolean;
}

interface SortableProductItemProps {
  product: Product;
  onToggleActive: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
}

function SortableProductItem({ product, onToggleActive, onDelete }: SortableProductItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product?.id ?? '' });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Drag Handle */}
            <button
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 shrink-0"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-5 w-5" />
            </button>

            {/* Image */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden relative shrink-0">
              {product?.mainImageUrl && (
                <Image
                  src={product.mainImageUrl}
                  alt={product?.name ?? ''}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-1">
                <h3 className="font-medium text-gray-900 truncate">
                  {product?.name ?? 'Sem nome'}
                </h3>
                <Badge variant={product?.category as any ?? 'default'} className="shrink-0">
                  {CATEGORY_LABELS[product?.category as ProductCategory] ?? product?.category ?? ''}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                {product?.showPrice
                  ? formatPrice(product?.discountPrice ?? product?.basePrice)
                  : "Sob consulta"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Switch
                checked={product?.isActive ?? false}
                onChange={(checked) => onToggleActive(product?.id ?? '', checked)}
              />
              <Link href={`/dashboard/products/${product?.id ?? ''}`}>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(product?.id ?? '')}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ProductsList() {
  const { showToast } = useToast();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterCategory, setFilterCategory] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response?.json?.();
      setProducts(data?.products ?? []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleActive = async (productId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });

      if (!response?.ok) throw new Error("Erro ao atualizar");

      setProducts((prev) =>
        (prev ?? []).map((p) =>
          p?.id === productId ? { ...p, isActive } : p
        )
      );
      showToast?.(isActive ? "Produto ativado" : "Produto desativado", "success");
    } catch (error) {
      showToast?.("Erro ao atualizar produto", "error");
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response?.ok) throw new Error("Erro ao excluir");

      setProducts((prev) => (prev ?? []).filter((p) => p?.id !== productId));
      showToast?.("Produto excluído", "success");
    } catch (error) {
      showToast?.("Erro ao excluir produto", "error");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = products.findIndex((p) => p?.id === active.id);
    const newIndex = products.findIndex((p) => p?.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Optimistically update UI
    const newProducts = arrayMove(products, oldIndex, newIndex);
    setProducts(newProducts);

    // Save new order to backend
    setIsSaving(true);
    try {
      const productIds = newProducts.map((p) => p?.id);
      const response = await fetch("/api/products/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds }),
      });

      if (!response?.ok) throw new Error("Erro ao salvar ordem");

      showToast?.("Ordem atualizada", "success");
    } catch (error) {
      // Revert on error
      showToast?.("Erro ao atualizar ordem", "error");
      fetchProducts();
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = (products ?? []).filter((product) => {
    const matchesSearch = (product?.name ?? '')
      .toLowerCase()
      .includes((searchTerm ?? '').toLowerCase());
    const matchesCategory = !filterCategory || product?.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return <TableSkeleton rows={5} />;
  }

  return (
    <div className="space-y-6">
      {/* Saving indicator */}
      {isSaving && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm">
          Salvando nova ordem...
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value ?? '')}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e?.target?.value ?? '')}
          className="h-10 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Todas categorias</option>
          {Object.entries(CATEGORY_LABELS ?? {}).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <Link href="/dashboard/products/new">
          <Button>
            <Plus className="h-4 w-4" />
            Novo Produto
          </Button>
        </Link>
      </div>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterCategory
                ? "Tente ajustar os filtros de busca"
                : "Comece adicionando seu primeiro veículo"}
            </p>
            {!searchTerm && !filterCategory && (
              <Link href="/dashboard/products/new">
                <Button>
                  <Plus className="h-4 w-4" />
                  Adicionar Produto
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredProducts.map((p) => p?.id ?? '')}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <SortableProductItem
                  key={product?.id ?? ''}
                  product={product}
                  onToggleActive={handleToggleActive}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
