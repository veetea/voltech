import React, { useEffect, useState } from "react"

const ProductModal = ({product, onClose, onEdit, onDelete}) => {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        setIsOpen(!!product)
    }, [product])

    const handleClose = () => {
        setIsOpen(false)
        onClose()
    }

    if (!product) return null

    return (
        <div className={`modal ${isOpen ? "open" : ""}`} onClick={handleClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <span className="close" onClick={handleClose}>&times;</span>
                <h2>{product.name}</h2>
                <img src={product.image} alt={product.name} onError={e => e.target.src = "https://placehold.co/300x200/1e1e1e/888?text=No+Image"} />
                <p>{product.description}</p>
                <div className="price">
                    ${product.price.toFixed(2)}
                    {product.original_price && 
                    <span className="original-price">${product.original_price.toFixed(2)}</span>}
                </div>

                {/* admin buttons */}
                {(onEdit || onDelete) && (
                    <div className="modal-admin-btns">
                        {onEdit && (
                            <button className="edit-btn" onClick={onEdit}>Edit</button>
                        )}
                        {onDelete && (
                            <button className="delete-btn" onClick={onDelete}>Delete</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductModal