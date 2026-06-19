import { create } from "zustand";

/**
 * ============================================================================
 * GLOBAL ZUSTAND STORE: useCartStore
 * ============================================================================
 * 
 * Perbedaan Aliran State (State Flow):
 * 
 * 1. STATE LOKAL (Local State):
 *    - Dikelola di dalam satu komponen saja menggunakan React `useState`.
 *    - Contoh: State tab aktif di `App.jsx` atau status loading tombol.
 *    - Tidak dibagikan ke komponen lain kecuali dilewatkan via props.
 * 
 * 2. STATE GLOBAL (Global State via Zustand):
 *    - Dikelola di luar pohon komponen (outside component tree) oleh store ini.
 *    - Contoh: `cart` (daftar item belanja).
 *    - Dapat dibaca/ditulis oleh komponen mana pun secara langsung tanpa "prop drilling".
 * 
 * 3. ALIRAN STATE ZUSTAND (Zustand State Flow):
 *    - Komponen berlangganan (subscribe) ke store menggunakan hook: `useCartStore(state => state.cart)`.
 *    - Saat aksi (action) seperti `addToCart` dipanggil, store mengubah state secara immutable menggunakan `set()`.
 *    - Zustand mendeteksi perubahan state dan secara otomatis memberitahukan serta me-render ulang (re-render)
 *      hanya komponen-komponen yang berlangganan pada data yang berubah tersebut.
 */

export const useCartStore = create((set, get) => ({
  // --- STATE GLOBAL ---
  // cart menampung semua item yang dimasukkan pengguna ke keranjang belanja.
  // Struktur item: { id, name, price, qty, image, description }
  cart: [],

  // --- ACTIONS (AKSI / MUTASI STATE) ---

  /**
   * addToCart: Menambahkan produk ke keranjang atau menambah kuantitas jika sudah ada.
   * 
   * ALIRAN STATE (Flow):
   * 1. Komponen memanggil `addToCart(product)`.
   * 2. `get().cart` membaca data cart global saat ini.
   * 3. Cari apakah produk dengan `product.id` sudah ada di keranjang.
   * 4. Jika SUDAH ADA:
   *    - Update kuantitas (+1) secara immutable menggunakan `cart.map(...)`.
   *    - Panggil `set({ cart: ... })` untuk memperbarui state global.
   * 5. Jika BELUM ADA:
   *    - Tambahkan produk baru ke dalam array dengan kuantitas awal `qty: 1`.
   *    - Panggil `set({ cart: [...cart, newProduct] })`.
   * 6. Zustand memberitahu semua komponen langganan (Navbar, CartPage) untuk memperbarui UI.
   */
  addToCart: (product) => {
    const cart = get().cart; // Mengambil state cart terkini dari store global
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      // Mengubah kuantitas item yang sesuai, dan membiarkan item lainnya tetap sama.
      set({
        cart: cart.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        ),
      });
    } else {
      // Menambahkan item baru ke array cart global.
      set({
        cart: [...cart, { ...product, qty: 1 }],
      });
    }
  },

  /**
   * removeFromCart: Menghapus item dari keranjang berdasarkan ID produk.
   * 
   * ALIRAN STATE (Flow):
   * 1. Komponen memanggil `removeFromCart(id)`.
   * 2. `get().cart` membaca state cart terkini.
   * 3. Gunakan filter untuk membuang item yang memiliki `item.id === id`.
   * 4. `set()` memperbarui array `cart` global.
   * 5. UI CartPage dan Badge jumlah di Navbar langsung ter-render ulang secara otomatis.
   */
  removeFromCart: (id) => {
    set({
      cart: get().cart.filter((item) => item.id !== id),
    });
  },

  /**
   * clearCart: Mengosongkan seluruh isi keranjang belanja.
   * 
   * ALIRAN STATE (Flow):
   * 1. Komponen memanggil `clearCart()`.
   * 2. Panggil `set({ cart: [] })` untuk mereset array keranjang menjadi kosong.
   * 3. Seluruh UI yang bergantung pada keranjang akan langsung kosong.
   */
  clearCart: () => {
    set({ cart: [] });
  },
}));
