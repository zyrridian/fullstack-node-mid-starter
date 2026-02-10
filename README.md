# Fullstack Take-Home Starter (Node.js Mid) — 120 menit

Starter repo ini dibuat untuk **mengurangi waktu setup**, tapi tetap membiarkan kandidat mengerjakan bagian inti (API, transaksi, validasi, UI).
Silakan fork / clone repo ini dan kerjakan sesuai instruksi.

## Struktur

- `backend/` — Node.js (Express) + SQLite
- `frontend/` — React (Vite)

## Requirement ringkas

Backend:

- `GET /products` (pagination + search `q`)
- `POST /orders` (validasi + **transaction atomic** + stock tidak boleh minus)
- `GET /orders/:id`
- Error format konsisten

Frontend:

- Product list + search + pagination
- Cart (update qty, remove) + total
- Checkout (customer_name + submit) + loading/error/success

Testing:

- minimal 3 test sesuai README backend

---

## Cara Menjalankan (lokal)

### Backend

```bash
cd backend
cp .env.example .env
npm i
npm run migrate
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm i
npm run dev
```

---

## Catatan Penilaian (untuk kandidat)

- Fokus: **kualitas kode**, integritas data, error handling, dan kemampuan menjelaskan keputusan.
- Boleh pakai AI/tools, tapi **wajib tulis di README** apa yang dipakai dan untuk apa.

---

## Pertanyaan Wajib di README kandidat

Jawab singkat (4–6 kalimat per poin):

1. Di mana potensi race condition pada `POST /orders`, dan bagaimana approach kamu mengatasinya?
2. Kenapa perlu `price_snapshot`?
3. Kalau ini production: apa yang kamu ubah untuk scaling & keamanan?
4. Kalau search produk jadi lambat, apa 2 langkah pertama yang kamu lakukan?

---

## Jawaban

1. Race condition dapat terjadi ketika 2 request membaca stok yang sama ketika stok sisa 1, dan keduanya akan berhasil membuat order karena stock masih cukup. Approach yang digunakan adalah dengan menerapkan BEGIN IMMEDIATE yang mengunci database lebih awal untuk mencegah concurrent write. Lalu saya menggunakan atomic UPDATE jika stock sudah berkurang oleh request lain ketika (WHERE stock >= qty), UPDATE akan langsung throw conflict. Hal ini untuk memastikan stock tidak akan pernah minus.

2. `price_snapshot` berfungsi untuk menyimpan harga saat transaksi terjadi. Hal ini dibutuhkan karena harga dapat berubah-ubah, misalnya ketika ada promo atau kenaikan harga. Jika hanya menyimpan `product_id` tanpa `price_snapshot`, semua harga pada riwayat transaksi akan berubah ketika terjadi perubahan harga produk. Dengan demikian, riwayat order tetap akurat.

3. Ganti SQLite dengan PostgreSQL/MySQL yang mendukung concurrent connections, tambahkan caching layer (Redis) untuk product list. Untuk keamanan, implementasikan JWT auth, rate limiting untuk mencegah abuse, validasi CORS yang ketat, input HTTP only, helmet.js untuk security headers, dll. Bisa juga menambahkan logging & monitoring untuk mendekteksi anomali.

4. Pertama, tambahkan database index pada kolom `name` jika belum ada, yang digunakan untuk search (`CREATE INDEX idx_products_name ON products(name)`). Pastikan index sudah ada di schema dan query menggunakan index tersebut via `EXPLAIN QUERY PLAN`. Selanjutnya, implementasikan caching untuk query yang sering diakes. Misalnya menggunakan Redis atau in-memory cache dengan TTL pendek (30-60 detik) untuk search populer. Jika masih lambat, gunakan full-text search engine seperti Elasticsearch atau PostgreSQL FTS.

---

## Tools yang Digunakan

- **GitHub Copilot (Claude)** — untuk analisa artsitektur project, implementasi API endpoints, dan mengembangkan fitur tambahan (Order History page, Swagger documentation, UI improvements).
- **Gemini AI / ChatGPT** — untuk menjelaskan dan memberikan summary dari potongan atau file kode yang belum dimengerti. Digunakan agar tidak menghabiskan token dan kecepatan respon cukup cepat.
- Semua kode di-review dan dipahami sebelum digunakan.

## Fitur Tambahan yang Diimplementasi

1. **Order History Page** — Halaman untuk melihat detail order berdasarkan ID menggunakan `GET /orders/:id`
2. **Swagger API Documentation** — Dokumentasi API interaktif di `/api-docs` menggunakan OpenAPI 3.0
3. **Improved UI Design** — Swiss-inspired minimal design dengan konsistensi styling, spacing yang lebih baik, dan error handling yang lebih informatif
4. **Better UX** — Loading states, error messages yang lebih jelas, disabled states pada buttons, dan visual feedback yang lebih baik
