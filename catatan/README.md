# Panduan Testing Sistem PadiBuy API

## Deskripsi Umum
Sistem ini adalah API prediksi pembelian impulsif menggunakan FastAPI dengan fitur autentikasi JWT, ML prediction, dan panel admin.

## Persiapan Lingkungan

### 1. Instalasi Dependencies
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

### 2. Setup Environment Variables
Buat file `.env` dengan isi:
```
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./padibuy.db
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Jalankan Server
```bash
uvicorn app.main:app --reload --port 8000
```
Server akan berjalan di: http://localhost:8000

---

## Endpoint Testing

### Authentication API (`/auth`)

#### Register User
- **Endpoint**: `POST /auth/register`
- **Body**:
```json
{
  "email": "test@example.com",
  "username": "testuser",
  "password": "password123"
}
```
- **Response**: User object dengan id, email, username

#### Login
- **Endpoint**: `POST /auth/login`
- **Method**: OAuth2 Password (form-data)
- **Body** (form-data):
  - username: `test@example.com`
  - password: `password123`
- **Response**:
```json
{
  "access_token": "jwt-token-here",
  "token_type": "bearer"
}
```

#### Health Check
- **Endpoint**: `GET /health`
- **Response**:
```json
{
  "status": "healthy",
  "service": "PadiBuy API"
}
```

---

### Prediction API (`/predict`) - Perlu Authorization

#### Prediksi Pembelian Impulsif
- **Endpoint**: `POST /predict/predict`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "gender": 1,
  "paylater_status": 1,
  "education": 1,
  "year_of_birth": 1990,
  "job_status": 1,
  "monthly_income": 5000000,
  "avg_expenditure_ratio": 3,
  "skor_ibb": 3.5,
  "skor_promosi": 4.0,
  "skor_social_influence": 3.0,
  "skor_hedonic": 2.5,
  "skor_self_control": 3.0,
  "skor_negative_emotion": 2.0
}
```

#### Ambil Riwayat Prediksi
- **Endpoint**: `GET /predict/history`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: List riwayat prediksi user

---

### Admin API (`/admin`) - Perlu Admin Authorization

#### Health Check Admin
- **Endpoint**: `GET /admin/health`
- **Headers**: `Authorization: Bearer <admin-token>`

#### Daftar Dataset
- **Endpoint**: `GET /admin/datasets`
- **Headers**: `Authorization: Bearer <admin-token>`

#### Upload Dataset
- **Endpoint**: `POST /admin/datasets/upload`
- **Headers**: `Authorization: Bearer <admin-token>`
- **Body**: Form-data dengan file CSV/Excel

#### Training Model
- **Endpoint**: `POST /admin/models/train`
- **Headers**: `Authorization: Bearer <admin-token>`

---

## Langkah Testing Manual

### 1. Test Registrasi & Login
```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=password123"
```

### 2. Test Prediksi (gunakan token dari login)
```bash
curl -X POST http://localhost:8000/predict/predict \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"gender":1,"paylater_status":1,"education":1,"year_of_birth":1995,"job_status":3,"monthly_income":10000000,"avg_expenditure_ratio":3,"skor_ibb":3.5,"skor_promosi":4.0,"skor_social_influence":3.0,"skor_hedonic":2.5,"skor_self_control":3.0,"skor_negative_emotion":2.0}'
```

### 3. Test Swagger UI
Buka browser ke `http://localhost:8000/docs` untuk mengakses dokumentasi interaktif API.

---

## Import Field Reference

| Field | Nilai |
|-------|-------|
| gender | 1=Pria, 2=Wanita |
| paylater_status | 1=Menggunakan, 2=Tidak Menggunakan |
| education | 1=SD, 2=SMP, 3=SMA, 4=Kuliah |
| job_status | 1=Pelajar, 2=Mahasiswa, 3=Pekerja, 4=Wirausaha |
| avg_expenditure_ratio | 1-6 (skala rasio pengeluaran) |
| skor_* | 1.0 - 5.0 (skala Likert) |