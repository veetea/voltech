import React, {createContext, useContext, useEffect, useState, useCallback} from "react"
import {getCartItems, addToCart, updateCartItem, removeCartItem, clearCart} from "../services/api"
import {useToast} from "./ToastContext"

const CartContext = createContext()

//generating or getting an existing session id for the cart
function getSessionId() {

    const user = localStorage.getItem('user')
    if (user) {
        const parsed = JSON.parse(user)
        return parsed._id || parsed.id 
    }

    let sessionId = localStorage.getItem('sessionId')
    if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2)
        localStorage.setItem('sessionId', sessionId)
    }
    return sessionId
}

export const CartProvider = ({children}) => {
    const [cartItems, setCartItems] = useState([])
    const [cartOpen, setCartOpen] = useState(false)
    const {showToast} = useToast()
    const sessionId = getSessionId()

//loading cart from backend
    const loadCart = useCallback(() => {
        getCartItems(sessionId)
            .then(data => setCartItems(data))
            .catch(() => showToast("Failed to load cart", "error"))
    }, [sessionId])

    useEffect(() => {
        loadCart()
    }, [loadCart])

async function addItem(productId, productName, quantity) {
    try {
        await addToCart(sessionId, productId, quantity)
        showToast(`Item added to cart: ${productName}`)
        loadCart()
    } catch {
        showToast("Failed to add item", "error")
    }
}

async function updateItem(productId, quantity) {
    try {
        await updateCartItem(sessionId, productId, quantity)
        showToast("Cart updated")
        loadCart()
    } catch {
        showToast("Failed to update cart", "error")
    }
}

async function removeItem(productId) {
    try {
        await removeCartItem(sessionId, productId)
        showToast("Item removed from cart")
        loadCart()
    } catch {
        showToast("Failed to remove item", "error")
    }
}

async function handleClearCart() {
    try {
        await clearCart(sessionId)
        showToast("Cart cleared")
        loadCart()
    } catch {
        showToast("Failed to clear cart", "error")
    }
}

//total number of items in the cart
const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

return (
    <CartContext.Provider value={{
        cartItems, cartOpen, setCartOpen,addItem, updateItem, removeItem, handleClearCart, totalItems}}>
        {children}
    </CartContext.Provider>
)
}

export const useCart = () => {
    return useContext(CartContext)
}