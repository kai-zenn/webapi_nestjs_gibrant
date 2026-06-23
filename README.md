# Dokumentasi Headless CMS REST API: Manajemen Blog dan Komentar Menggunakan NestJS

Projek ini merupakan implementasi backend berbasis REST API yang dibangun menggunakan framework **NestJS**, **TypeORM**, dan **Passport.js (JWT)**. Sistem ini dirancang untuk mengelola data pengguna (*User*), postingan (*Post*), dan komentar (*Comment*) dengan menerapkan prinsip arsitektur modular, enkapsulasi, serta pengamanan rute (*Guarded Endpoints*).

---

## Teknologi Utama

Aplikasi ini dikembangkan dengan memanfaatkan ekosistem teknologi berikut:
* **Framework Backend:** NestJS (v10.x) & TypeScript
* **Object-Relational Mapping (ORM):** TypeORM
* **Sistem Autentikasi:** Passport.js & `@nestjs/jwt`
* **Validasi Data:** `class-validator` & `class-transformer`
* **Database Platform:** PostgreSQL / MySQL

---

## Pola Arsitektur & Alasan Pemilihan

Projek ini menerapkan **Modular Layered Architecture** (bawaan industri NestJS) yang dikombinasikan dengan **Repository Pattern** dari TypeORM. Berikut adalah alasan teknis mengapa pattern ini dipilih untuk menyelesaikan kriteria tugas:

1. **Separation of Concerns (Pemisahan Tanggung Jawab Kode)**
   Dengan membagi kode menjadi 3 layer utama (Controller, Service, dan Repository), setiap berkas hanya fokus pada satu tugas:
   * **Controller:** Hanya mengurusi HTTP Request, HTTP Method, Validasi DTO, dan HTTP Response.
   * **Service:** Fokus 100% pada aturan bisnis (business logic) seperti enkripsi password dan pengecekan hak akses.
   * **Repository:** Mengisolasi query ke database SQL melalui TypeORM.
   * *Alasan:* Pemisahan ini memastikan kode tidak menjadi "Spaghetti Code" dan mempermudah pelacakan jika terjadi bug.

2. **Modularisasi Tinggi (High Encapsulation & Scalability)**
   Setiap modul (`AuthModule`, `UserModule`, `PostModule`, `CommentModule`) bersifat independen dan membungkus komponennya sendiri. 
   * *Alasan:* Memudahkan pengembangan paralel jika dikerjakan dalam tim. Jika fitur `Comment` membutuhkan perubahan, developer tidak akan mengganggu atau merusak modul `Auth`.

3. **Kemudahan Pengujian Otomatis (Testability - Menjawab Poin 1d)**
   Karena dependensi antar-layer disuntikkan secara dinamis menggunakan *Dependency Injection* (DI), modul-modul ini sangat mudah untuk diisolasi.
   * *Alasan:* Pola arsitektur ini yang melandasi mengapa fitur **E2E Testing** (`test/auth.e2e-spec.ts`) dalam projek ini dapat menguji alur token JWT dari hulu ke hilir dengan bersih tanpa merusak data asli atau bentrok dengan *lifecycle* aplikasi utama.

---

## Fitur Unggulan Implementasi Sistem

### 1. Autentikasi Robust Berbasis JWT
Sistem mengamankan rute sensitif menggunakan `JwtAuthGuard`. Berkat integrasi dengan registry global Passport.js, strategi validasi token dilaunch secara efisien. Pengguna tidak perlu mengirimkan `authorId` atau `userId` secara manual di dalam *request body*; data identitas ditarik secara aman langsung dari dekripsi payload JWT di sisi server.

### 2. Nested Routing (Rute Bertingkat) & Relasi (2 CRUD)
Terdapat 2 entitas utama yang saling berkaitan yaitu `Post` dan `Comment`. Pembuatan komentar diimplementasikan menggunakan rute bertingkat: `POST /api/posts/:postId/comments`. Hal ini memastikan bahwa setiap komentar baru secara eksplisit terikat pada ID postingan yang valid melalui parameter URL.

### 3. Database Cascade Delete
Sistem memanfaatkan fitur *Cascade* pada relasi entitas TypeORM. Ketika sebuah rute penghapusan postingan (`DELETE /api/posts/:id`) dieksekusi, database secara otomatis akan menghapus seluruh data komentar yang terelasi dengan postingan tersebut guna menjaga integritas data dan mencegah adanya *orphan data*.

### 4. E2E Testing untuk Endpoint Token API
Projek ini dilengkapi dengan pengujian *End-to-End* (`test/auth.e2e-spec.ts`) yang memvalidasi alur registrasi, penerbitan JWT token saat login, dan pembatasan akses (*Unauthorized error*) pada endpoint yang dijaga oleh guard.

---

## Struktur Koleksi Postman

Untuk mempermudah proses peninjauan (*review*), koleksi request pada Postman dibagi secara terstruktur ke dalam beberapa folder berdasarkan fase pengembangannya:

1. **`User CRUD (basic)`**
   * Berisi operasi dasar manajemen user (Create, Read, Update, Delete) tanpa proteksi token.
2. **`Post CRUD (basic)` & `Comment CRUD (basic)`**
   * Merupakan riwayat teknik request polosan sebelum dipasang sistem keamanan. 
   * *Catatan: Endpoint manipulasi data (Write/Delete) di folder basic ini sudah tidak dapat digunakan dan dialihkan ke folder Guarded.*
3. **`Auth > Basic`**
   * Menyediakan rute `POST /api/auth/register` (dengan enkripsi password menggunakan Bcrypt) dan `POST /api/auth/login` untuk menghasilkan JWT Token.
4. **`Auth > Guarded Endpoint`**
   * Folder produksi utama yang berisi endpoint aktif (Post & Comment bertingkat) yang dilindungi oleh `JwtAuthGuard`. Setiap request di folder ini wajib melampirkan *Bearer Token* pada Authorization Header.

---

## Tautan Dokumentasi API

Dokumentasi lengkap yang memuat specifications rute, struktur skema request body, beserta contoh respons (*success* dan *error code*) dapat diakses secara daring melalui tautan berikut:

**[Halaman Dokumentasi Resmi Postman](https://documenter.getpostman.com/view/45183766/2sBXwtp9B7)**

---

## Konfigurasi Environment Variables

Sebelum menjalankan aplikasi, buatlah sebuah file bernama `.env` pada direktori utama (*root*) projek ini, kemudian lakukan penyesuaian nilai berdasarkan konfigurasi database lokal Anda:

```env
# Konfigurasi Server
PORT=3000

# Konfigurasi Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=rahasia_database_anda
DATABASE_NAME=nestjs_blog_db

# Konfigurasi Keamanan JWT
JWT_SECRET=kunci_rahasia_jwt_anda_yang_kompleks
JWT_EXPIRY=1d
```

---

## Langkah Instalasi & Penggunaan

Ikuti instruksi berikut untuk melakukan instalasi dan menjalankan projek ini di lingkungan lokal Anda:

### 1. Kloning Repositori
Unduh source code projek ini dari GitHub ke direktori lokal Anda:
```bash
git clone <https://github.com/kai-zenn/webapi_nestjs_gibrant>
cd <NAMA_FOLDER_PROJECT>
```

### 2. Inisialisasi Dependensi
Unduh dan pasang seluruh pustaka (*dependencies*) yang dibutuhkan oleh projek menggunakan Node Package Manager (NPM):
```bash
npm install
```

### 3. Konfigurasi Database & Environment
* Pastikan service database Anda (PostgreSQL/MySQL) sudah menyala di lokal.
* Buat database baru di platform database Anda sesuai dengan nama yang ditentukan di file `.env` (contoh: `nestjs_blog_db`).
* Pastikan isi file `.env` sudah disesuaikan dengan kredensial database lokal Anda.

### 4. Menjalankan Aplikasi
Eksekusi aplikasi dalam mode pengembangan (*development mode*). Fitur *hot-reload* akan aktif secara otomatis untuk memantau setiap perubahan kode tanpa perlu restart server manual:
```bash
npm run start:dev
```

Setelah berhasil dijalankan, server backend akan aktif dan siap menerima request pada alamat: `http://localhost:3000`. Anda dapat langsung melakukan pengujian rute menggunakan tautan dokumentasi Postman yang tertera di atas.

---
