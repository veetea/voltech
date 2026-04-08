##(Assignemnt-1)
# Voltech — Electronics Store

A single-page e-commerce app for browsing and buying electronics. Built around products I'm genuinely interested in like the Steam Deck, Fujifilm cameras, and the latest phones and laptops.

## Tech Stack
- Frontend: React (Vite)
- Backend: FastAPI (Python)
- Database: MongoDB

## Features
- Browse electronics catalogue
- Search and filter by category
- Add to cart, update quantities, remove items
- Cart persists across session
- Admin mode — add, edit, delete products
- Toast notifications
- Error handling

## Folder Structure

```
voltech/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── public/
│   │   └── images/
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       ├── context/
│       ├── hooks/
│       └── services/
├── products.json
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
pip3 install -r requirements.txt
uvicorn main:app --reload
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Challenges

Getting the frontend and backend to communicate was tricky — CORS errors until I configured the Vite proxy. The cart was making infinite requests due to wrong useCallback dependencies. Category filter wasn't working because prop names didn't match between components.
