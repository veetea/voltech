import React, {useEffect, useState} from "react"

const CATEGORIES = ["Audio", "Laptops", "Accessories", "Cameras", "Gaming", "Phones"]

export default function ProductForm({product, onSave, onClose}) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        original_price: "",
        category: "Audio",
        image: "",
        badge: "",
        stock: 100
    })

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                description: product.description || "",
                price: product.price || "",
                original_price: product.original_price || "",
                category: product.category || "Audio",
                image: product.image || "",
                badge: product.badge || "",
                stock: product.stock || 100
            })
        }
    }, [product])

    function handleChange(e) {
        const {name, value} = e.target
        setFormData(prev => ({...prev, [name]: value}))
    }

    function handleSubmit(e) {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <div className="modal open" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <span className="close" onClick={onClose}>&times;</span>
                <h2>{product ? "Edit Product" : "Add Product"}</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Product Description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                    <input 
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                    <input 
                        type="number"
                        name="original_price"
                        placeholder="Original Price (optional)"
                        value={formData.original_price}
                        onChange={handleChange}
                    />
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <input 
                        type="text"
                        name="image"
                        placeholder="Image URL"
                        value={formData.image}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="badge"
                        placeholder="Badge (e.g. New, Sale)"
                        value={formData.badge}
                        onChange={handleChange}
                    />
                    <input 
                        type="number"
                        name="stock"
                        placeholder="Stock Quantity"
                        value={formData.stock}
                        onChange={handleChange}
                    />
                    <button type="submit">{product ? "Save Changes" : "Add Product"}</button>
                </form>
            </div>
        </div>
    )
} 