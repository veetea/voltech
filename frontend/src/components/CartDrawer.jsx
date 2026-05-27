import React from "react";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
    const { cartItems, updateItem, removeItem, handleClearCart, totalItems, cartOpen, setCartOpen } = useCart()

    if (!cartOpen) return null

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const shippingPrice = totalPrice > 50 ? 0 : 5.99
    const grandTotal = totalPrice + shippingPrice

    return (
        <>
        <div className="cart-overlay" onClick={() => setCartOpen(false)}/>
        
        <div className="cart-drawer">
            <div className="cart-header">
                <h2>Your Cart</h2>
                <button onClick={() => setCartOpen(false)}>Close</button>
            </div>

            {cartItems.length === 0 ? (
                <div className="empty-cart">Your cart is empty.</div>
            ) : (
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item._id} className="cart-item">
                            <img src={item.image} alt={item.name} />
                            <div className="item-info">
                                <h4>{item.name}</h4>
                                <p>${item.price.toFixed(2)}</p>
                                <div className="quantity-controls">
                                    <button onClick={() => updateItem(item._id, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateItem(item._id, item.quantity + 1)}>+</button>
                                </div>
                                <button className="remove-button" onClick={() => removeItem(item._id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="cart-summary">
                <p>Total Items: {totalItems}</p>
                <p>Subtotal: ${totalPrice.toFixed(2)}</p>
                <p>Shipping: ${shippingPrice.toFixed(2)}</p>
                <h3>Grand Total: ${grandTotal.toFixed(2)}</h3>
                <button className="checkout-button" disabled={cartItems.length === 0}>Proceed to Checkout</button>
                <button className="clear-cart-button" onClick={handleClearCart} disabled={cartItems.length === 0}>Clear Cart</button>
            </div>
        </div>
    </>
    )
}