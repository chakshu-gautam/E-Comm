import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Home() {
  const [products, setProducts] = useState([]);
  //   const products = [
  //     {
  //       id: 1,
  //       name: "Product 1",
  //       price: "$29.99",
  //       description: "This is a great product.",
  //       inStock: true,
  //     },
  //     {
  //       id: 2,
  //       name: "Product 2",
  //       price: "$19.99",
  //       description: "This product is out of stock.",
  //       inStock: false,
  //     },
  //   ];
  const path = "http://localhost:3000/api/v1/user/preview";
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${path}`);
      if (res.status === 200) {
        setProducts(res.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error fetching products:", error);
        toast.error(error.response.data.message || "Error fetching products");
      } else {
        toast.error("Error fetching products");
      }
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          {/* Logo */}
          <div className="flex items-center">
            <img src="./public/shopping.png" alt="Logo" className="w-8 h-8" />
          </div>

          {/* Search Bar */}
          <div className="flex flex-grow mx-4">
            <input
              type="text"
              placeholder="Search..."
              className="flex-grow p-2 rounded-l-md border border-gray-300"
            />
            <button className="bg-blue-500 text-white p-2 rounded-r-md">
              Search
            </button>
          </div>

          {/* Cart and Profile Links */}
          <div className="flex space-x-4">
            <a href="/cart" className="hover:underline">
              Cart
            </a>
            <a href="/profile" className="hover:underline">
              Profile
            </a>
          </div>
        </div>

        {/* Navigable Links */}
        <nav className="flex space-x-4 text-gray-300 justify-between">
          <a href="/all" className="hover:underline">
            All
          </a>
          <a href="/new-releases" className="hover:underline">
            New Releases
          </a>
          <a href="/books" className="hover:underline">
            Books
          </a>
          <a href="/electronics" className="hover:underline">
            Electronics
          </a>
          <a href="/accessories" className="hover:underline">
            Accessories
          </a>
          <a href="/toys-and-games" className="hover:underline">
            Toys and Games
          </a>
          <a href="/fashion" className="hover:underline">
            Fashion
          </a>
        </nav>
      </header>

      <main className="flex-grow p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 shadow-md bg-white transition-transform transform hover:scale-105 h-[250px] w-[200px] flex flex-col"
          >
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p className="text-gray-700 flex-grow">{product.description}</p>
            <p className="text-xl font-semibold">{product.price}</p>
            <p
              className={`text-sm ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>
            <button
              className={`mt-2 w-full p-2 rounded-md ${
                product.stock > 0
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={product.stock <= 0}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-4">
        Created with ❤️ by Chakshu
      </footer>
    </div>
  );
}

export default Home;
