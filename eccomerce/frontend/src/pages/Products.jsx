import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import ProductFilter from "../components/product/ProductFilter";
import { products } from "../data/products";

export default function Products({ onAddToCart }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(
    ["men", "female", "kids"].includes(categoryFromUrl)
      ? categoryFromUrl
      : "all",
  );

  const selectCategory = (category) => {
    setSelectedCategory(category);
    if (category === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <main className="container py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h2 className="fw-bold text-dark mb-1 h3">Our Products</h2>
            <p className="text-muted small mb-0">Explore our catalog</p>
          </div>

          <ProductFilter
            selectedCategory={selectedCategory}
            onSelectCategory={selectCategory}
            totalCount={products ? products.length : 0}
          />
        </div>

        <div className="row g-4">
          {filteredProducts &&
            filteredProducts.map((item) => (
              <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <ProductCard product={item} onAddToCart={onAddToCart} />
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
