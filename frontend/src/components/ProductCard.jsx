import React from 'react'
import { useCart } from '../context/CartContext'

export default function ProductCard({product, onView}) {
    const { addItem, cartItems, updateItem, removeItem } = useCart()

    //check if product is already in cart
    const cartItem = cartItems.find(item => item.productId === product._id)
    const quantity = cartItem ? cartItem.quantity : 0

    //to add item to cart for the first time
    function handleAddToCart(e) {
        e.stopPropagation()
        addItem(product._id, product.name, 1)
    }

    //to increase quantity by 1
     function handleIncrease(e) {
        e.stopPropagation()
        updateItem(product._id, quantity + 1)
    }

    //to decrease quantity, remove if it reaches 0
    function handleDecrease(e) {
        e.stopPropagation()
        if (quantity === 1) removeItem(product._id)
        else updateItem(product._id, quantity - 1)
    }
    return (
        <div className="product-card" onClick={onView}>
            <div className="product-image">
            <img 
                src={product.image} 
                alt={product.name}
                onError={e => e.target.src = "https://placehold.co/300x200/1e1e1e/888?text=No+Image"} 
            />

            {/* shows badges */}
            {product.badge && 
                <div className={`badge ${product.badge.toLowerCase()}`}>{product.badge}</div>
            }
            </div>

            <div className="product-info">
                <div className="product-title-row">
                    <h3>{product.name}</h3>
                    <span className="product-price">${product.price.toFixed(2)}</span>
                </div>

                {/* shows original price if product is on sale */}
                {product.original_price && 
                    <span className="original-price">was ${product.original_price.toFixed(2)}</span>
                    }


                <div className="card-action" onClick={e => e.stopPropagation()}>
                    {product.stock === 0 ? (
                        <button className="out-of-stock" disabled>Out of Stock</button>
                    ) : quantity > 0 ? (
                        <div className="qty-controls">
                            <button className="qty-btn" onClick={handleDecrease}>-</button>
                            <span>{quantity}</span>
                            <button className="qty-btn" onClick={handleIncrease}>+</button>
                        </div>
                    ) : (
                        <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
                    )}
                </div>
            </div>
        </div>  
    )
}