# Voltech — Electronics Store (Assignment 2)

An advanced single-page e-commerce app extending Assignment 1 with user authentication, JWT security, and an admin dashboard.

## Tech Stack
- Frontend: React (Vite)
- Backend: FastAPI (Python)
- Database: MongoDB
- Auth: JWT tokens + bcrypt password hashing

## Features
- User registration and login with JWT authentication
- Password hashing with bcrypt
- Protected routes — must be logged in to shop
- Browse electronics catalogue
- Search and filter by category
- Add to cart, update quantities, remove items
- Cart linked to user account
- Admin dashboard — view all users and their carts
- Admin mode — add, edit, delete products
- Logout functionality
- Toast notifications
- Error handling

## Folder Structure

```
voltech/
├── backend/
│   ├── main.py            # all API routes + database logic
│   ├── auth.py            # JWT and password hashing functions
│   ├── requirements.txt   # Python dependencies
│   └── .env               # secret keys (not committed to git)
├── frontend/
│   ├── index.html         # single HTML entry point
│   ├── public/images/     # product images (airpods, macbook, etc.)
│   └── src/
│       ├── App.jsx        # main component, page routing
│       ├── index.css      # all styles
│       ├── pages/
│       │   ├── LoginPage.jsx      # login form with JWT auth
│       │   ├── RegisterPage.jsx   # registration form
│       │   └── Admin.jsx          # admin dashboard - view users and carts
│       ├── components/
│       │   ├── NaviBar.jsx        # navigation bar with search, cart, logout
│       │   ├── SideBar.jsx        # category filter sidebar
│       │   ├── CartDrawer.jsx     # slide-out cart with quantity controls
│       │   ├── ProductCard.jsx    # individual product card
│       │   ├── ProductForm.jsx    # add/edit product form (admin)
│       │   └── ProductModal.jsx   # product detail popup
│       ├── context/
│       │   ├── AuthContext.jsx    # global auth state (user, token, login, logout)
│       │   ├── CartContext.jsx    # global cart state linked to user ID
│       │   └── ToastContext.jsx   # global toast notifications
│       ├── hooks/
│       │   └── useProducts.js     # custom hook to fetch and filter products
│       └── services/
│           └── api.js             # all fetch calls to the backend
├── products.json          # exported products collection
├── users.json             # exported users collection
└── README.md
```

## How to Run

Start MongoDB:
```bash
brew services start mongodb-community
```

Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## How Authentication Works
1. User registers → password hashed with bcrypt → saved to MongoDB
2. User logs in → JWT token created → stored in localStorage
3. Token sent with every request in Authorization header
4. Cart is linked to user's MongoDB ID instead of random session ID
5. Admin users can view all users and their carts

## Workload Allocation
This assignment was completed individually by Vatsal Tadvi (26164362).

| File | Description |
|------|-------------|
| backend/main.py | All API routes — products, cart, auth, admin |
| backend/auth.py | JWT and bcrypt functions |
| frontend/src/App.jsx | Main component and page routing |
| frontend/src/pages/LoginPage.jsx | Login page |
| frontend/src/pages/RegisterPage.jsx | Register page |
| frontend/src/pages/Admin.jsx | Admin dashboard |
| frontend/src/context/AuthContext.jsx | Auth state management |
| frontend/src/context/CartContext.jsx | Cart state management |
| frontend/src/components/* | All UI components |

## Challenges
The trickiest part was linking the cart to the user account. Previously the cart used a random session ID stored in localStorage — I changed it to use the user's MongoDB `_id` so the admin can look up any user's cart. Another challenge was bcrypt compatibility with Python 3.14 which required pinning to version 4.0.1.
