import React from "react";
import { PRODUCTS } from "../data/products";
import { useCartStore } from "../store/useCartStore";

/**
 * ProductList Component
 * 
 * Peran State & Aliran (Flow):
 * 
 * 1. STATE LOKAL:
 *    - Tidak ada state lokal untuk keranjang belanja di sini.
 *    - Komponen ini tidak perlu menyimpan status barang-barang yang sudah dimasukkan ke keranjang
 *      karena data tersebut dikelola secara terpusat oleh Zustand (Global Store).
 * 
 * 2. STATE GLOBAL (Zustand Flow):
 *    - Kita menggunakan `useCartStore` untuk mendapatkan fungsi aksi (action) `addToCart`.
 *    - Saat tombol "Add to Cart" diklik:
 *      a. Aksi `addToCart(product)` dipicu.
 *      b. Zustand memproses produk tersebut (menambah kuantitas atau menambahkan item baru).
 *      c. State global `cart` diperbarui.
 *      d. Komponen lain yang berlangganan `cart` (seperti Navbar) akan mendeteksi perubahan ini
 *         dan melakukan re-render secara instan untuk memperbarui UI mereka.
 */
export default function ProductList() {
  // Mengambil fungsi aksi 'addToCart' dari store global Zustand.
  // Kita tidak perlu mengambil state 'cart' di sini karena komponen ini hanya bertugas
  // mengirimkan data (write-only) ke store, sehingga tidak perlu re-render saat isi keranjang berubah.
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="product-list-container">
      <header className="section-header">
        <h2 className="section-title">Premium Catalog</h2>
        <p className="section-subtitle">Discover our curated list of minimalist productivity gear.</p>
      </header>

      <div className="product-grid">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-wrapper">
              <img 
                src={product.image} 
                alt={product.name} 
                className="product-image"
                loading="lazy"
              />
              <span className="product-category">{product.category}</span>
            </div>

            <div className="product-info">
              <div className="product-meta">
                <h3 className="product-name">{product.name}</h3>
                <span className="product-price">${product.price}</span>
              </div>
              
              <p className="product-description">{product.description}</p>
              
              {/* 
                INTERAKSI STATE GLOBAL:
                Memicu aksi addToCart dengan melewatkan data produk sebagai parameter.
              */}
              <button 
                className="add-to-cart-btn"
                onClick={() => addToCart(product)}
              >
                <span className="btn-icon">＋</span> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
