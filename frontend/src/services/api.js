const BASE = '/api'

async function fetchProducts(path, options = {}) {
    const response = await fetch(`${BASE}${path}`, { 
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options

    })
    if (!response.ok) {
        const msg = await response.text().catch(() => 'Unknown error')
        throw new Error(msg)
    }
    if (response.status === 204) return null
    return response.json()
}

// Product API functions
export function getProducts(search, category) {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    const query = params.toString()
    return fetchProducts(`/products${query ? `?${query}` : ''}`)
}

export function createProduct(body) {
    return fetchProducts('/products', {
        method: 'POST',
        body: JSON.stringify(body)
    })
}

export function updateProduct(id, body) {
    return fetchProducts(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body)
    })
}

export function deleteProduct(id) {
    return fetchProducts(`/products/${id}`, {
        method: 'DELETE'
    })
}

export function getCartItems(sessionId) {
    return fetchProducts(`/cart/${sessionId}`)
}

export function addToCart(sessionId,productId, quantity) {
    return fetchProducts(`/cart/${sessionId}`, {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity })
    })
}

export function updateCartItem(sessionId, productId, quantity) {
    return fetchProducts(`/cart/${sessionId}/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
    })
}

export function removeCartItem(sessionId, productId) {
    return fetchProducts(`/cart/${sessionId}/${productId}`, {
        method: 'DELETE'
    })
}   

export function clearCart(sessionId) {
    return fetchProducts(`/cart/${sessionId}`, {
        method: 'DELETE'
    })
}