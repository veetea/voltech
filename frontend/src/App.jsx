import React, { useState } from "react"
import SideBar from "./components/SideBar";
import NaviBar from "./components/NaviBar";
import CartDrawer from "./components/CartDrawer";
import ProductForm from "./components/ProductForm";
import ProductModal from "./components/ProductModal";
import { ToastProvider } from "./context/ToastContext";
import { CartProvider, useCart } from "./context/CartContext";
import { createProduct, updateProduct, deleteProduct } from "./services/api";
import useProducts from "./hooks/useProducts";

const CATEGORIES = ["Audio", "Laptops", "Accessories", "Cameras", "Gaming", "Phones"]

function Shop() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [viewingProduct, setViewingProduct] = useState(null);
    const [adminMode, setAdminMode] = useState(false);
    const { products, loading, error, fetchProducts } = useProducts(search, category);
    const { addItem } = useCart()

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
            <NaviBar search={search} onSearch={setSearch} />
            <div className="main-content">
                <SideBar
                    categories={CATEGORIES}
                    selectedCategory={category}
                    onSelectCategory={setCategory}
                />
                <div className="product-list">
                    {/* admin controls */}
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
                        <div key={product._id} className="product-card">
                            <div onClick={() => setViewingProduct(product)}>
                                <img src={product.image} alt={product.name} />
                                <h3>{product.name}</h3>
                                <p>${product.price}</p>
                            </div>
                            <button onClick={() => addItem(product._id, product.name, 1)}>
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* admin toggle button fixed at bottom left */}
            <div className="admin-toggle">
                <button onClick={() => setAdminMode(v => !v)}>
                    {adminMode ? "Exit Admin" : "Admin Mode"}
                </button>
            </div>

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
    )
}

export default function App() {
    return (
        <ToastProvider>
            <CartProvider>
                <Shop />
            </CartProvider>
        </ToastProvider>
    )
}