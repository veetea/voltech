import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext';

export default function AdminPage({ onNavigate }) {
    const { user, token } = useAuth();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [usersLoading, setUsersLoading] = useState(true);
    const [cartLoading, setCartLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState('');

    //load users on component mount
    useEffect(() => {
        fetch('/api/auth/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log("Fetched users:", data); // Debugging line
            setUsers(data);
            setUsersLoading(false);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            setError('Failed to load users');
            setUsersLoading(false);
        });
    }, []);
    
    //load cart items when a user is selected
    async function handleUserSelect(userId, username) {
        setSelectedUser({ id: userId, username });
        setCartItems([]);
        setCartLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/auth/users/${userId}/cart`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setCartItems(data);
            setCartLoading(false);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setError('Failed to load cart items');
            setCartLoading(false);
        }
    } 

    function getInitials(username) {
        return username.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    return (
        <div className="admin-page">
            <h2>Admin Dashboard</h2>
            {error && <p className="error">{error}</p>}
            
            <div className="admin-content">
               
               {/* User panel */}
                <div className="user-list">
                    <div className="panel-header">
                        <h3>Users</h3>
                        <span className="panel-count">{users.length}</span>
                    </div>
                    {usersLoading ? (
                        <p className="admin-loading">Loading users...</p>
                    ) : (
                        <ul>
                            {users.map(user => (
                                <li 
                                    key={user._id} 
                                    className={'user-item' + (selectedUser && selectedUser.id === user._id ? ' active' : '')}
                                    onClick={() => handleUserSelect(user._id, user.username)}
                                    >  

                                <div className="user-avatar">{getInitials(user.username)}</div>
                                <div className="user-info">
                                <div className="user-item-name">{user.username}</div>
                                <div className="user-item-email">{user.email}</div>
                                </div>
                                <span className={'role-pill ' + user.role}>{user.role}</span>
                            </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Cart panel */}
                <div className="cart-panel">
                    <div className="panel-header">
                    <h3>{selectedUser ? `${selectedUser.username}'s Cart` : 'Select a user to view cart'}</h3>
                        {selectedUser && !cartLoading && (
                            <span className="panel-count">{cartItems.length} items</span>
                        )}
                    </div>

                    <div className="cart-panel-body">
                        {!selectedUser && (
                            <p className="admin-empty-state">Select a user to view their cart items.</p>
                        )}

                        {cartLoading && (
                            <p className="admin-loading">Loading cart items...</p>
                        )}

                        {selectedUser && !cartLoading && cartItems.length === 0 && (
                            <p className="admin-empty-state">This user's cart is empty.</p>
                        )}

                        {!cartLoading && cartItems.map(item =>  (
                            <div key={item._id} className="admin-cart-item">
                                <img className="admin-cart-img" src={item.image} alt={item.name} />
                                <span className="admin-cart-name">{item.name}</span>
                                <span className="admin-qty-badge">x{item.quantity}</span>
                                <span className="admin-cart-price">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                        { selectedUser && !cartLoading && cartItems.length > 0 && (
                            <div className="cart-panel-footer">
                                <span>Total:</span>
                                    <strong>
                                        ${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                                    </strong>
                            </div>
                        )}
                </div>

            </div>
        </div>
    )
}