import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/organisms/Navbar";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api.js"; 
import Button from "../components/atoms/Button.jsx";
import { ValueContext } from "../context/ValueContext";

export const AdminProductManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 9


  // จำลองการโหลดข้อมูลจาก backend
  useEffect(() => {
    //setProducts(mockProducts);
    const fetchProduct = async () => {
          try {
      const productResponse = await api.get("/products", {
      params: {
        page
      },
      })

      setTotalItems(productResponse.data.total);
      setProducts(productResponse.data.items)
            
    } catch (error) {
      console.error("error: ", error)
    }
    }

    fetchProduct()

  }, [page]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // ลบจาก state (mock)
  const handleDelete = async (id) => {
    if (!window.confirm("คุณแน่ใจว่าจะลบสินค้านี้?")) return;

    await api.delete(`/products/${id}`)
    setProducts(products.filter((p) => p._id !== id));
  };

  //console.log(products)
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="flex justify-center">
        <div className="w-full max-w-6xl bg-white p-12 rounded-3xl shadow-xl border border-gray-100 mt-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-light text-gray-800 tracking-wide">
              Product Management
            </h2>
            <button
              onClick={() => navigate("/products/add")}
              className="bg-[#B29674] text-white font-semibold px-6 py-3 rounded-2xl shadow hover:bg-[#a18c6a] transition-colors"
            >
              + Add Product
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B29674]"
            />
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#E7E2D8] text-gray-800 text-left">
                  <th className="p-4 rounded-tl-xl">Image</th>
                  <th className="p-4">Product ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 rounded-tr-xl text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <tr
                      key={p._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <img
                          src={p.thumbnails?.[0]?.url}
                          alt={p.name}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                      </td>
                      <td className="p-4">{p._id}</td>
                      <td className="p-4">{p.name}</td>
                      <td className="p-4">{p.category}</td>
                      <td className="p-4 flex justify-center space-x-3">
                        <Button onClick={() => navigate(`/products/edit/${p._id}`)}>Edit</Button>
                        <Button
                          onClick={() => handleDelete(p._id)}
                          className=" hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 py-6 italic">
                      ไม่พบสินค้า
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
<div className="flex justify-center mt-8">
  {Array.from({ length: totalPages }, (_, index) => (
    <button
      key={index}
      onClick={() => setPage(index + 1)}
      // Apply conditional classes for active vs. inactive buttons
      className={`
        px-4 py-2 mx-1
        text-sm font-medium
        rounded-md transition-colors duration-200
        ${
          page === index + 1
            ? 'bg-sage-green text-white shadow-md' // Active button styles
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300' // Inactive button styles
        }
      `}
    >
      {index + 1}
    </button>
  ))}
</div>
        </div>

      </div>
    </div>
  );
};
