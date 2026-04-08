import React from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({products, loading, error}) {
    if (loading) {
        return <div className="loading">Loading products...</div>;
    }

    if (error) {
        return <div className="error">Something's Wrong Here: {error}</div>;
    }

    if (products.length === 0) {
        return <div className="no-products">No products found. Sorry. </div>;
    }

    return (
        <div className="product-grid">
            {products.map(product => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    )
}  