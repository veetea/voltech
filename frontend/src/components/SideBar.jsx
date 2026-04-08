import React from "react"

const SideBar = ({categories, selectedCategory, onSelectCategory}) => {
    return (
        <div className="sidebar">
            <h3>Categories</h3>
            <ul>
                <li 
                    className={selectedCategory === null ? "active" : ""}
                    onClick={() => onSelectCategory(null)}
                >
                    All
                </li>
                {categories.map(category => (
                    <li 
                        key={category} 
                        className={selectedCategory === category ? "active" : ""}
                        onClick={() => onSelectCategory(category)}
                    >
                        {category}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SideBar  