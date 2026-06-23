import React from "react";
import { useCartStore } from "../store/useCartStore";

/**
 * CartPage Component
 * 
 * Peran State & Aliran (Flow):
 * 
 * 1. STATE LOKAL (Local State):
 *    - Tidak ada state lokal untuk data keranjang. Semua data ditarik dari store global.
 *    - Kita menggunakan local state hanya jika ada status UI internal (misalnya: animasi checkout, pop-up konfirmasi).
 * 
 * 2. STATE GLOBAL (Zustand Flow):
 *    - Membaca state `cart` dengan `useCartStore(state => state.cart)`. Komponen terdaftar untuk re-render secara otomatis
 *      saat `cart` di store berubah.
 *    - Mengambil fungsi aksi: `addToCart`, `decrementQty`, `removeFromCart`, `clearCart` untuk memodifikasi keranjang.
 *    - Aliran Aksi:
 *      * Klik tombol "+": Memanggil `addToCart(item)` -> Store mengupdate kuantitas -> `cart` berubah -> Halaman terupdate.
 *      * Klik tombol "-": Memanggil `decrementQty(item.id)` -> Store mengurangi kuantitas/menghapus -> Halaman terupdate.
 *      * Klik "Remove": Memanggil `removeFromCart(item.id)` -> Item dibuang dari array `cart` -> Halaman terupdate.
 *      * Klik "Clear Cart": Memanggil `clearCart()` -> `cart` menjadi `[]` -> Halaman terupdate.
 */
export default function CartPage({ setActiveTab }) {
  // 1. Membaca data state global dari Zustand
  const cart = useCartStore((state) => state.cart);

  // 2. Mengambil fungsi-fungsi aksi dari store
  const { addToCart, decrementQty, removeFromCart, clearCart } = useCartStore();

  // Menghitung subtotal secara dinamis dari data global
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 200 || subtotal === 0 ? 0 : 15;
  const total = subtotal + shipping;

  // Tampilan jika keranjang kosong
  if (cart.length === 0) {
    return (
      <div className="cart-empty-container animate-fade-in">
        <div className="empty-cart-card">
          <div className="empty-cart-icon">🛒</div>
          <h2 className="empty-cart-title">Your cart is empty</h2>
          <p className="empty-cart-text">Looks like you haven't added anything to your cart yet.</p>
          <button 
            className="continue-shopping-btn"
            onClick={() => setActiveTab("products")}
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container animate-fade-in">
      <header className="section-header">
        <h2 className="section-title">Your Shopping Cart</h2>
        <p className="section-subtitle">Review your premium selection before checking out.</p>
      </header>

      <div className="cart-layout">
        {/* Daftar Barang di Keranjang */}
        <div className="cart-items-column">
          <div className="cart-items-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-image-wrapper">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                </div>
                
                <div className="cart-item-details">
                  <div className="cart-item-header">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <button 
                      className="remove-item-btn"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <p className="cart-item-category">{item.category}</p>
                  
                  <div className="cart-item-footer">
                    <span className="cart-item-price">${item.price} each</span>
                    
                    {/* KONTROL KUANTITAS (Mengubah State Global via Aksi Zustand) */}
                    <div className="qty-controls">
                      <button 
                        className="qty-btn"
                        onClick={() => decrementQty(item.id)}
                      >
                        －
                      </button>
                      <span className="qty-value">{item.qty}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => addToCart(item)}
                      >
                        ＋
                      </button>
                    </div>

                    <span className="cart-item-total-price">
                      ${item.price * item.qty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-actions">
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
            <button className="back-btn" onClick={() => setActiveTab("products")}>
              ← Continue Shopping
            </button>
          </div>
        </div>

        {/* Ringkasan Belanja (Summary Card) */}
        <div className="cart-summary-column">
          <div className="summary-card">
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "FREE" : `$${shipping}`}</span>
            </div>
            
            {shipping > 0 && (
              <p className="shipping-notice">Add ${(200 - subtotal)} more for free shipping!</p>
            )}

            <div className="summary-divider"></div>
            
            <div className="summary-row total-row">
              <span>Total</span>
              <span>${total}</span>
            </div>

            <button 
              className="checkout-btn"
              onClick={() => alert("Checkout flow simulation. Cart will clear.") || clearCart()}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
