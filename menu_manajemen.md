## Manajemen Menu (Menu Management)

Endpoint-endpoint ini memerlukan otentikasi JWT dan peran `ADMIN`.

### 1. Membuat Item Menu Baru
*   **Endpoint:** `POST /admin/menu-item`
*   **Deskripsi:** Menambahkan item menu baru.
*   **Request Body:**
    ```json
    {
      "name": "string",
      "category": "string",
      "price": "number",
      "description": "string",
      "MenuStatus": "AVAILABLE" | "UNAVAILABLE"
    }
    ```
*   **Response Sukses (201):**
    ```json
    {
      "id": "string",
      "name": "string",
      "category": "string",
      "price": "number",
      "description": "string",
      "status": "AVAILABLE" | "UNAVAILABLE",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
    ```

### 2. Mendapatkan Semua Item Menu
*   **Endpoint:** `GET /admin/menu-items`
*   **Deskripsi:** Mengambil daftar semua item menu.
*   **Response Sukses (200):**
    ```json
    [
      {
        "id": "string",
        "name": "string",
        "category": "string",
        "price": "number",
        "description": "string",
        "status": "AVAILABLE" | "UNAVAILABLE",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
    ```

### 3. Mendapatkan Detail Item Menu
*   **Endpoint:** `GET /admin/menu-item/:id`
*   **Deskripsi:** Mengambil detail item menu berdasarkan ID.
*   **Parameter Path:**
    *   `id` (string): ID item menu.
*   **Response Sukses (200):**
    ```json
    {
      "id": "string",
      "name": "string",
      "category": "string",
      "price": "number",
      "description": "string",
      "status": "AVAILABLE" | "UNAVAILABLE",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
    ```
*   **Response Error:**
    *   `404 Not Found`: Jika item menu dengan ID tersebut tidak ditemukan.

### 4. Memperbarui Item Menu
*   **Endpoint:** `PATCH /admin/menu-item/:id`
*   **Deskripsi:** Memperbarui detail item menu berdasarkan ID.
*   **Parameter Path:**
    *   `id` (string): ID item menu.
*   **Request Body (UpdateMenuItemDto):** Dapat berisi salah satu atau semua field berikut:
    ```json
    {
      "name": "string",
      "category": "string",
      "price": "number",
      "description": "string",
      "MenuStatus": "AVAILABLE" | "UNAVAILABLE"
    }
    ```
*   **Response Sukses (200):**
    ```json
    {
      "id": "string",
      "name": "string",
      "category": "string",
      "price": "number",
      "description": "string",
      "status": "AVAILABLE" | "UNAVAILABLE",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
    ```
*   **Response Error:**
    *   `404 Not Found`: Jika item menu dengan ID tersebut tidak ditemukan.

### 5. Menghapus Item Menu
*   **Endpoint:** `DELETE /admin/menu-item/:id`
*   **Deskripsi:** Menghapus item menu berdasarkan ID.
*   **Parameter Path:**
    *   `id` (string): ID item menu.
*   **Response Sukses (200):**
    ```json
    {
      "id": "string",
      "name": "string",
      "category": "string",
      "price": "number",
      "description": "string",
      "status": "AVAILABLE" | "UNAVAILABLE",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
    ```
*   **Response Error:**
    *   `404 Not Found`: Jika item menu dengan ID tersebut tidak ditemukan.

**Catatan Penting:**

*   Pastikan frontend mengirimkan token JWT yang valid dalam header `Authorization` sebagai `Bearer <token>` untuk setiap permintaan ke endpoint yang dilindungi.
*   Perhatikan bahwa pada `createMenuItem` dan `updateMenuItem`, DTO menggunakan `MenuStatus` sedangkan model Prisma dan respons menggunakan `status`. Ini mungkin perlu disesuaikan di backend atau frontend untuk konsistensi jika diperlukan.
