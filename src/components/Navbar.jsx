import React from "react";
import { useCartStore } from "../store/useCartStore";

/**
 * Navbar Component
 * 
 * Peran State:
 * 1. STATE LOKAL (Diterima sebagai Props):
 *    - `activeTab` & `setActiveTab` berasal dari local state `App.jsx`.
 *    - State ini mengontrol navigasi tampilan halaman aktif ("products" atau "cart").
 * 
 * 2. STATE GLOBAL (Diambil langsung dari Zustand):
 *    - `cart` diambil menggunakan hook `useCartStore(state => state.cart)`.
 *    - Ketika isi `cart` bertambah/berkurang, Navbar akan ter-render ulang secara otomatis.
 */
export default function Navbar({ activeTab, setActiveTab }) {
  // Langganan (Subscribe) ke state global 'cart' di store Zustand.
  // Komponen ini akan re-render otomatis setiap kali item ditambahkan/dihapus dari cart.
  const cart = useCartStore((state) => state.cart);

  // Menghitung jumlah total item di keranjang (sum of all item quantities)
  const totalItemsCount = cart.reduce((total, item) => total + item.qty, 0);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo / Brand */}
        <div className="navbar-brand" onClick={() => setActiveTab("products")}>
          <span className="logo-icon">🛒</span>
          <span className="logo-text">AeroShop</span>
        </div>

        {/* Menu Navigasi (Mengubah STATE LOKAL) */}
        <div className="navbar-links">
          <button
            className={`nav-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
          
          <button
            className={`nav-btn cart-badge-btn ${activeTab === "cart" ? "active" : ""}`}
            onClick={() => setActiveTab("cart")}
          >
            Cart
            {totalItemsCount > 0 && (
              <span className="badge-count animate-pop">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
