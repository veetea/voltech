import React from "react"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import AdminPage from "../pages/Admin";

export default function Navibar({search, onSearch, onNavigate}) {
    const { totalItems, setCartOpen } = useCart()
    const { user, logout } = useAuth();

    function handleLogout() {
        logout();
        onNavigate('login');
    }

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

            <div className="nav-actions">
                {user && user.role === 'admin' && (
                    <button className="nav-btn" onClick={() => onNavigate('admin')}>
                        Admin Dashboard
                    </button>
                )}
                {user && (
                    <span className="nav-username">Hi, {user.username}</span>
                )}

            <button 
            className="cart-icon"
            onClick={() => setCartOpen(true)}
            >
            Cart ({totalItems > 0 ? totalItems : 'Empty'})
            </button>
            {user ? (
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            ) : (
                <>
                    <button className="nav-btn" onClick={() => onNavigate('login')}>
                        Login
                    </button>
                    <button className="nav-btn" onClick={() => onNavigate('register')}>
                        Register
                    </button>
                </>
            )}
            </div>
        </nav>
    )
}   