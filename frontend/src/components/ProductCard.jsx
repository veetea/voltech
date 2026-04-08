import React from 'react'
import { useCart } from '../context/CartContext'

export default function ProductCard({product}) {
    const { addItem } = useCart()

    function handleAddToCart() {
        addItem(product._id, product.name, 1)
    }

    return (
        <div className="product-card">
            <div className="product-image">
            <img src={product.image} 
            alt={product.name}
            onError={e => e.target.src = "https://placehold.co/300x200/1e1e1e/888?text=No+Image"} 
            />

            {product.badge && 
            <div className={`badge ${product.badge.toLowerCase()}`}>{product.badge}</div>
            }
            </div>

            <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="price">
                    ${product.price.toFixed(2)}
                    {product.original_price && 
                    <span className="original-price">${product.original_price.toFixed(2)}</span>}
                </div>
                <button onClick={handleAddToCart} disabled={product.stock === 0}>
                    {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
            </div>
        </div>
    )
}       
