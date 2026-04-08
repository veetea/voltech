import React from "react"
import { useCart } from "../context/CartContext"

export default function Navibar({search, onSearch }) {
    const { totalItems, setCartOpen } = useCart() 
    
    return (
        <nav className="navbar">
            <div className="logo">Voltech 
              <span>.</span>
            </div>

            <div className="search-bar">
                <input 
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>

            <button 
            className="cart-icon"
            onClick={() => setCartOpen(true)}
            >
            Cart ({totalItems > 0 ? totalItems : 'Empty'})
            </button>
        </nav>
    )
}