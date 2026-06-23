import React, { useState } from "react";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import CartPage from "./components/CartPage";

/**
 * App Component
 * 
 * Peran State & Aliran (Flow):
 * 
 * 1. STATE LOKAL (React useState):
 *    - `activeTab` (nilai default: "products"): Menyimpan informasi tab mana yang sedang dibuka oleh pengguna.
 *    - Kenapa menggunakan State Lokal di sini? Karena tab navigasi halaman adalah state UI yang terisolasi.
 *      Hanya Navbar dan bagian konten utama di App.jsx yang perlu mengetahui tab mana yang aktif.
 *      Komponen-komponen dalam katalog produk atau item keranjang tidak perlu mengakses data tab ini secara global.
 * 
 * 2. STATE GLOBAL (Zustand):
 *    - Tidak secara langsung dideklarasikan di file ini.
 *    - Namun, data keranjang diakses oleh `Navbar` dan `CartPage` secara terpusat dari store Zustand.
 * 
 * Aliran Integrasi:
 *    - Pengguna klik "Cart" di `Navbar` -> memicu `setActiveTab("cart")` (mengubah state lokal App.jsx).
 *    - App.jsx ter-render ulang, menyembunyikan `ProductList` dan menampilkan `CartPage`.
 *    - `CartPage` memuat data `cart` global dari Zustand untuk menampilkan barang belanjaan.
 */
export default function App() {
  // Mendefinisikan STATE LOKAL untuk mengontrol halaman/tab aktif
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="app-container">
      {/* 
        Navbar menerima activeTab (untuk styling tombol aktif) dan 
        setActiveTab (untuk mengubah halaman aktif) sebagai props.
      */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        {/*
          Tampilan Bersyarat (Conditional Rendering):
          Merender halaman yang sesuai dengan STATE LOKAL activeTab.
        */}
        {activeTab === "products" ? (
          <ProductList />
        ) : (
          <CartPage setActiveTab={setActiveTab} />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 AeroShop Inc. Designed with React & Zustand.</p>
      </footer>
    </div>
  );
}
