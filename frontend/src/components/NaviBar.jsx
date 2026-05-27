import React from "react"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"

export default function Navibar({search, onSearch, onNavigate, onToggleSidebar}) {
    const { totalItems, setCartOpen } = useCart()
    const { user, logout } = useAuth();
    
    function handleLogout() {
        logout();
        onNavigate('login');
    }

    return(
        <nav className="navbar">
            <div className="logo" onClick={() => onNavigate('home')} style={{ cursor: 'pointer'}}>
              Voltech<span>.</span>
            </div>

            <button className="navbar-btn sidebar-toggle" onClick={onToggleSidebar}>
                = Categories
            </button>

            <div className="search-bar">
                <div className="search-input-wrap">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="nav-actions">
                {/* show admin dashboard to admin only */}
                {user && user.role === 'admin' && (
                    <button className="nav-btn" onClick={() => onNavigate('admin')}>
                        Admin Dashboard
                    </button>
                )}
                {user ? (
                    <>
                        <span className="nav-btn">
                            Hello, {user.username}
                        </span>   
                        <button className="cart-icon" onClick={() => setCartOpen(true)}>
                            Cart ({totalItems > 0 ? totalItems : 'Empty'})
                        </button>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
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