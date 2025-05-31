# Dokumentasi API DineFlow admin

## Manajemen Pengguna (User Management)

Endpoint-endpoint ini memerlukan otentikasi JWT dan peran `ADMIN`.

### 1. Membuat Pengguna Baru
*   **Endpoint:** `POST /admin/users`
*   **Deskripsi:** Menambahkan pengguna baru ke sistem.
*   **Request Body:**
    ```json
    {
      "username": "string",
      "password": "string",
      "role": "ADMIN" | "CHEF" | "WAITER",
      "name": "string"
    }
    ```
*   **Response Sukses (201):**
    ```json
    {
      "id": "string",
      "username": "string",
      "role": "ADMIN" | "CHEF" | "WAITER",
      "name": "string",
      "status": "ACTIVE" | "INACTIVE",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
    ```
*   **Response Error:**
    *   `400 Bad Request`: Jika data yang dikirim tidak valid.
    *   `409 Conflict`: Jika username sudah ada.

### 2. Mendapatkan Semua Pengguna
*   **Endpoint:** `GET /admin/users`
*   **Deskripsi:** Mengambil daftar semua pengguna.
*   **Response Sukses (200):**
    ```json
    [
      {
        "id": "string",
        "username": "string",
        "role": "ADMIN" | "CHEF" | "WAITER",
        "name": "string",
        "status": "ACTIVE" | "INACTIVE",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
    ```

### 3. Mendapatkan Detail Pengguna
*   **Endpoint:** `GET /admin/user/:id`
*   **Deskripsi:** Mengambil detail pengguna berdasarkan ID.
*   **Parameter Path:**
    *   `id` (string): ID pengguna.
*   **Response Sukses (200):**
    ```json
    {
      "id": "string",
      "username": "string",
      "role": "ADMIN" | "CHEF" | "WAITER",
      "name": "string",
      "status": "ACTIVE" | "INACTIVE",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
    ```
*   **Response Error:**
    *   `404 Not Found`: Jika pengguna dengan ID tersebut tidak ditemukan.

### 4. Memperbarui Peran Pengguna
*   **Endpoint:** `PATCH /admin/user/:id/role`
*   **Deskripsi:** Memperbarui peran (role) pengguna berdasarkan ID.
*   **Parameter Path:**
    *   `id` (string): ID pengguna.
*   **Request Body:**
    ```json
    {
      "role": "ADMIN" | "CHEF" | "WAITER"
    }
    ```
*   **Response Sukses (200):**
    ```json
    {
      "id": "string",
      "username": "string",
      "role": "ADMIN" | "CHEF" | "WAITER",
      "name": "string",
      "status": "ACTIVE" | "INACTIVE",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
    ```
*   **Response Error:**
    *   `404 Not Found`: Jika pengguna dengan ID tersebut tidak ditemukan.

### 5. Menghapus Pengguna
*   **Endpoint:** `DELETE /admin/user/:id`
*   **Deskripsi:** Menghapus pengguna berdasarkan ID.
*   **Parameter Path:**
    *   `id` (string): ID pengguna.
*   **Response Sukses (200):**
    ```json
    {
      "id": "string",
      "username": "string",
      "role": "ADMIN" | "CHEF" | "WAITER",
      "name": "string",
      "status": "ACTIVE" | "INACTIVE",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
    ```
*   **Response Error:**
    *   `404 Not Found`: Jika pengguna dengan ID tersebut tidak ditemukan.


**Catatan Penting:**

*   Pastikan frontend mengirimkan token JWT yang valid dalam header `Authorization` sebagai `Bearer <token>` untuk setiap permintaan ke endpoint yang dilindungi.
*   Perhatikan bahwa pada `createMenuItem` dan `updateMenuItem`, DTO menggunakan `MenuStatus` sedangkan model Prisma dan respons menggunakan `status`. Ini mungkin perlu disesuaikan di backend atau frontend untuk konsistensi jika diperlukan.
