import React, { useState } from "react"
import SideBar from "./components/SideBar";
import NaviBar from "./components/NaviBar";
import CartDrawer from "./components/CartDrawer";
import ProductForm from "./components/ProductForm";
import ProductModal from "./components/ProductModal";
import LoginPage from "./pages/LoginPage";  //added
import RegisterPage from "./pages/RegisterPage"; //added
import { ToastProvider } from "./context/ToastContext";
import { CartProvider, useCart } from "./context/CartContext";
import { createProduct, updateProduct, deleteProduct } from "./services/api";
import useProducts from "./hooks/useProducts";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminPage from "./pages/Admin";
import ProductCard from "./components/ProductCard";

//categories in sidebar
const CATEGORIES = ["Audio", "Laptops", "Accessories", "Cameras", "Gaming", "Phones"]

function Shop({ onNavigate }) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [viewingProduct, setViewingProduct] = useState(null);
    const [adminMode, setAdminMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const { products, loading, error, fetchProducts } = useProducts(search, category);
    const { user } = useAuth();

    //handles add and edit product
    async function handleSave(formData) {
        try {
            if (editingProduct) {
                await updateProduct(editingProduct._id, formData);
            } else {
                await createProduct(formData);
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setFormOpen(false);
            setEditingProduct(null);
            fetchProducts();
        }
    }

    //delete product with alert confirmation
    async function handleDelete(productId) {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await deleteProduct(productId);
        } catch (err) {
            alert(err.message);
        } finally {
            setViewingProduct(null);
            fetchProducts();
        }
    }

    return (
        <div>
            <NaviBar 
            search={search} onSearch={setSearch} onNavigate={onNavigate} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />
            <div className="main-content">
                {/* sidebar oepns and close with toggle button */}
                {sidebarOpen && (
                    <SideBar
                        categories={CATEGORIES}
                        selectedCategory={category}
                        onSelectCategory={setCategory}
                    />
                )}

                <div className="content">
                    <div className="product-list">
                        {/* admin controls, only admin can access */}
                        {adminMode && (
                            <button
                                className="add-product-btn"
                                onClick={() => { setEditingProduct(null); setFormOpen(true) }}
                            >
                                + Add Product
                            </button>
                        )}

                    {loading && <p>Loading products...</p>}
                    {error && <p className="error">{error}</p>}
                    {!loading && !error && products.length === 0 && <p>No products found.</p>}
                    {!loading && !error && products.map(product => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onView={() => setViewingProduct(product)}
                            adminMode={adminMode}
                            onEdit={() => {
                                setEditingProduct(product);
                                setViewingProduct(null);
                                setFormOpen(true);
                            }}
                            onDelete={() => handleDelete(product._id)}
                        />
                    ))}
                </div>
            </div>

            {/* admin mode button */}
            {user && user.role === 'admin' &&(
            <div className="admin-toggle">
                <button onClick={() => setAdminMode(v => !v)}>
                    {adminMode ? "Exit Admin" : "Admin Mode"}
                </button>
            </div>
            )}

            <CartDrawer />
            {formOpen && (
                <ProductForm
                    product={editingProduct}
                    onSave={handleSave}
                    onClose={() => {
                        setFormOpen(false);
                        setEditingProduct(null);
                    }}
                />
            )}

            {/* product details modal */}
            {viewingProduct && (
                <ProductModal
                product={viewingProduct}
                onClose={() => setViewingProduct(null)}
                onEdit={adminMode ? () => {
                    setEditingProduct(viewingProduct);
                    setViewingProduct(null);
                    setFormOpen(true);
                } : null}
            onDelete={adminMode ? () => handleDelete(viewingProduct._id) : null}
        />
    )}
    </div>
    </div>
    )
}

//main component
function Main() {
    const [currentPage, setCurrentPage] = useState('shop');
    const { user, loading } = useAuth();

    function handleNavigate(page) {
        setCurrentPage(page);
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    //if not logged in, show login and register page
    if (!user) {
        return currentPage === 'register' 
        ? <RegisterPage onNavigate={handleNavigate} /> 
        : <LoginPage onNavigate={handleNavigate} />;
    }

    //show admin page
    if (currentPage === 'admin') {
        return <AdminPage onNavigate={handleNavigate} />;
    }
    return <Shop onNavigate={handleNavigate} />;
}

export default function App() {
    return (
        <ToastProvider>
            <AuthProvider> 
            <CartProvider>
                <Main />
            </CartProvider>
            </AuthProvider>
        </ToastProvider>
    )
}