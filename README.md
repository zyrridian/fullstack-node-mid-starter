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
- minimal 3 test sesuai README backend.

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
1) Di mana potensi race condition pada `POST /orders`, dan bagaimana approach kamu mengatasinya?
2) Kenapa perlu `price_snapshot`?
3) Kalau ini production: apa yang kamu ubah untuk scaling & keamanan?
4) Kalau search produk jadi lambat, apa 2 langkah pertama yang kamu lakukan?
