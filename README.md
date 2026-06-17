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

## Arsitektur & Fitur Unggulan

### 1. Autentikasi Robust Berbasis JWT
Sistem mengamankan rute sensitif menggunakan `JwtAuthGuard`. Berkat integrasi dengan registry global Passport.js, strategi validasi token dilaunch secara efisien. Pengguna tidak perlu mengirimkan `authorId` atau `userId` secara manual di dalam *request body* pada endpoint terproteksi; data identitas ditarik secara aman langsung dari dekripsi payload JWT di sisi server.

### 2. Nested Routing (Rute Bertingkat)
Untuk merepresentasikan relasi entitas secara logis dalam protokol RESTful, pembuatan komentar baru diimplementasikan menggunakan rute bertingkat:
`POST /api/posts/:postId/comments`
Hal ini memastikan bahwa setiap komentar baru secara eksplisit terikat pada ID postingan yang valid melalui parameter URL.

### 3. Database Cascade Delete
Sistem memanfaatkan fitur *Cascade* pada relasi entitas TypeORM. Ketika sebuah rute penghapusan postingan (`DELETE /api/posts/:id`) dieksekusi, database secara otomatis akan menghapus seluruh data komentar yang terelasi dengan postingan tersebut guna menjaga integritas data dan mencegah adanya *orphan data*.

### 4. Validasi Global (Validation Pipe)
Seluruh data yang masuk melalui rute *write* (`POST`/`PATCH`) divalidasi secara ketat menggunakan `ValidationPipe` global. Setiap parameter dipetakan melalui *Data Transfer Object* (DTO) untuk memastikan tipe data sesuai dan mencegah malformed request yang dapat memicu *unhandled server error*.

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
