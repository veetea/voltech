#backend using FastAPI and MongoDB

#importing libraries
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend dev server
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

#connection to MongoDB
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["volt_database"]

products_collection = db["products"]
cart_collection = db["cart"]

#mongodb returns _id as ObjectId so I convert it to string here
def fix_id(document):
    if document and "_id" in document:
        document["_id"] = str(document["_id"])
    return document

#converting string if from url to ObjectId
def parse_object_id(id_str):
    try:
        return ObjectId(id_str)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
#product model
class Product(BaseModel):
    name: str
    category: str
    price: float
    original_price: Optional[float] = None
    description: str
    image: str
    badge: Optional[str] = None
    stock: int = 100

#cart item model
class CartItem(BaseModel):
    product_id: str
    quantity: int = Field(ge=1)

class CartItemUpdate(BaseModel):
    quantity: int = Field(ge=1)

#initial product data
PRODUCTS = [
    {
        "name": "Apple Airpods Pro (3rd Gen)",
        "category": "Audio",
        "price": 330.00,
        "original_price": 429.00,
        "description": "Experience immersive sound with the Apple Airpods Pro (3rd Gen). Featuring active noise cancellation, adaptive EQ, and a customizable fit for all-day comfort. Perfect for music, calls, and more.",
        "image": "/images/airpods.png",
        "badge": "DEAL",
        "stock": 50
    },
    {
        "name": "Sony XM6 Headphones",
        "category": "Audio",
        "price": 999.99,
        "original_price": 1299.99,
        "description": "Immerse yourself in crystal-clear sound with the Sony XM6 Headphones. Featuring advanced noise cancellation and premium comfort for hours of listening pleasure.",
        "image": "/images/sonyxm6.png",
        "badge": "NEW",
        "stock": 30
    },
    {
        "name": "MacBook Air M5",
        "category": "Laptops",
        "price": 1950.00,
        "original_price": 2100.00,
        "description": "A compact and powerful laptop for all your computing needs.",
        "image": "/images/macbookair.png",
        "badge": "BEST SELLER",
        "stock": 20
    },
    {
        "name": "Apple Iphone 17 Pro Max",
        "category": "Phones",
        "price": 1199.00,
        "original_price": 1299.00,
        "description": "The latest iPhone with a powerful A17 Pro chip and an advanced camera system.",
        "image": "/images/iphonepromax.png",
        "badge": "NEW",
        "stock": 10
    },
    {
        "name": "Apple Iphone 17 Pro",
        "category": "Phones",
        "price": 999.00,
        "original_price": 1099.00,
        "description": "The latest iPhone with a powerful A17 Pro chip and an advanced camera system.",
        "image": "/images/iphone17.png",
        "badge": "NEW",
        "stock": 15
},
{
        "name": "Fujifilm X1000",
        "category": "Cameras",
        "price": 1500.00,
        "original_price": 1700.00,
        "description": "A compact camera with a large sensor for stunning photos.",
        "image": "/images/fujifilmx1000.png",   
        "badge": "DEAL",
        "stock": 25 
},
{
        "name": "Steam Deck",
        "category": "Gaming",
        "price": 599.99,
        "original_price": 699.99,
        "description": "A portable gaming console that runs Steam games on the go.",
        "image": "/images/steamdeck.png",
        "badge": "NEW",
        "stock": 20
},
]

#seeding the database with initial products if collection is empty 
@app.on_event("startup")
async def startup_event():
    count = await products_collection.count_documents({})
    if count == 0:
        await products_collection.insert_many(PRODUCTS) 
        print("Products added to the database")

#get all products, can also be filtered by category or search
@app.get("/api/products")
async def list_products(search: Optional[str] = None, category: Optional[str] = None):
    query = {}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    if category:
        query["category"] = category
    
    docs = await products_collection.find(query).to_list(length=100)
    return [fix_id(doc) for doc in docs]

#get single product
@app.get("/api/products/{product_id}")
async def get_product(product_id: str):
    doc = await products_collection.find_one({"_id": parse_object_id(product_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return fix_id(doc)

#creating a new product
@app.post("/api/products", status_code=201)
async def create_product(product: Product):
    result = await products_collection.insert_one(product.dict())
    new_product = await products_collection.find_one({"_id": result.inserted_id})
    return fix_id(new_product)

#updating a product
@app.put("/api/products/{product_id}")
async def update_product(product_id: str, product: Product):
    result = await products_collection.update_one(
        {"_id": parse_object_id(product_id)},
        {"$set": product.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    updated_product = await products_collection.find_one({"_id": parse_object_id(product_id)})
    return fix_id(updated_product)

#deleting a product
@app.delete("/api/products/{product_id}", status_code=204)
async def delete_product(product_id: str):
    result = await products_collection.delete_one({"_id": parse_object_id(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
#getting cart items for a user
@app.get("/api/cart/{session_id}")
async def get_cart(session_id: str):
    cart_items = await cart_collection.find({"session_id": session_id}).to_list(length=200)
    return [fix_id(item) for item in cart_items]

#adding item to cart & and if product already in cart, update the quantity
@app.post("/api/cart/{session_id}", status_code=201)
async def add_to_cart(session_id: str, item: CartItem):
    existing_item = await cart_collection.find_one({
        "session_id": session_id,
        "product_id": item.product_id
    })

    if existing_item:
        new_quantity = existing_item["quantity"] + item.quantity
        await cart_collection.update_one(
            {"_id": existing_item["_id"]},
            {"$set": {"quantity": new_quantity}}
        )
        updated_item = await cart_collection.find_one({"_id": existing_item["_id"]})
        return fix_id(updated_item)
    
    else:
        #to get product details to save in cart item
        product = await products_collection.find_one({"_id": parse_object_id(item.product_id)})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        cart_item = {
            "session_id": session_id,
            "product_id": item.product_id,
            "name": product["name"],
            "price": product["price"],
            "image": product["image"],
            "quantity": item.quantity
        }
        result = await cart_collection.insert_one(cart_item)
        new_cart_item = await cart_collection.find_one({"_id": result.inserted_id})
        return fix_id(new_cart_item)
    
#updating cart item quantity
@app.put("/api/cart/{session_id}/{item_id}")
async def update_cart_item(session_id: str, item_id: str, item_update: CartItemUpdate):
    result = await cart_collection.update_one(
        {"_id": parse_object_id(item_id), "session_id": session_id},
        {"$set": {"quantity": item_update.quantity}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Cart item not found")
    updated_item = await cart_collection.find_one({"_id": parse_object_id(item_id)})
    return fix_id(updated_item)

#removing item from cart
@app.delete("/api/cart/{session_id}/{item_id}", status_code=204)
async def remove_cart_item(session_id: str, item_id: str):
    result = await cart_collection.delete_one({"_id": parse_object_id(item_id), "session_id": session_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
#clearing the cart for a user
@app.delete("/api/cart/{session_id}", status_code=204)
async def clear_cart(session_id: str):
    await cart_collection.delete_many({"session_id": session_id})