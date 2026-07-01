# Ringkasan Proses Sistem PadiBuy API

Dokumen ini menjelaskan bagaimana sistem bekerja dari sisi admin dan user, serta daftar endpoint yang bisa digunakan untuk testing.

## Gambaran Umum Alur Sistem

1. Admin login terlebih dahulu melalui endpoint `/auth/login`.
2. Admin mengupload dataset CSV atau Excel melalui endpoint `/admin/datasets/upload`.
3. Sistem menyimpan dataset ke folder `datasets` dengan nama file berisi timestamp.
4. Sistem melakukan validasi dataset dan menghitung informasi awal seperti jumlah baris, jumlah kolom, dan status validitas.
5. Admin dapat melihat daftar dataset melalui `/admin/datasets`.
6. Admin dapat menganalisis dataset terbaru melalui `/admin/datasets/analyze`.
7. Admin melakukan training model melalui `/admin/models/train`.
8. Sistem membangun fitur dari dataset, membagi data latih dan uji, mencari parameter terbaik, melatih model Random Forest, lalu menyimpan artifact model ke file `.joblib`.
9. User login melalui `/auth/login`.
10. User mengirim data perilaku belanja melalui `/predict/predict`.
11. Sistem membangun vektor fitur dari input user, memuat model terbaru, melakukan prediksi, dan menyimpan riwayat prediksi.
12. User dapat melihat riwayat prediksinya melalui `/predict/history`.

---

## Metode dan Komponen Teknis yang Digunakan

### 1. Backend API

Sistem menggunakan **FastAPI** sebagai framework backend. FastAPI dipilih karena ringan, cepat, dan mendukung dokumentasi API otomatis melalui Swagger UI.

Komponen utama backend:

- `app/main.py` sebagai titik masuk aplikasi.
- `app/auth` untuk registrasi, login, dan validasi token JWT.
- `app/admin` untuk upload dataset, analisis dataset, dan training model.
- `app/predict` untuk menerima input user dan melakukan prediksi.
- `app/database.py` untuk koneksi dan inisialisasi database SQLite.
- `app/config.py` untuk membaca konfigurasi dari `.env`.

API endpoint tersedia di root aplikasi:

```http
GET /
```

Dokumentasi interaktif tersedia di:

```http
GET /docs
```

---

### 2. Autentikasi dan Authorization

Sistem menggunakan **JWT** dengan library `python-jose`.

#### Registrasi

Endpoint:

```http
POST /auth/register
```

Proses:

1. Menerima email, username, dan password.
2. Mengecek apakah email sudah terdaftar.
3. Mengecek apakah username sudah digunakan.
4. Meng-hash password menggunakan `passlib` bcrypt.
5. Menyimpan user ke database.

#### Login

Endpoint:

```http
POST /auth/login
```

Proses:

1. Menerima username dan password melalui OAuth2 password form.
2. Mencari user berdasarkan email.
3. Memverifikasi password dengan bcrypt.
4. Membuat JWT token berisi email dan id user.
5. Mengembalikan token akses.

#### Authorization

Sistem membedakan akses berdasarkan token JWT:

- User biasa dapat mengakses endpoint prediksi dan riwayat pribadi.
- Admin dapat mengakses endpoint admin jika emailnya terdaftar di `ADMIN_EMAILS`.

Konfigurasi admin ada di `.env`:

```text
ADMIN_EMAILS=admin@example.com
```

---

### 3. Database

Sistem menggunakan **SQLite** melalui SQLAlchemy.

Model utama:

- `User`: menyimpan data akun user dan admin.
- `PadiBuyHistory`: menyimpan riwayat prediksi user.

Riwayat prediksi menyimpan:

- id user
- umur
- pendapatan
- skor diskon/promosi
- skor emosi negatif
- hasil prediksi
- confidence rate
- versi model
- input JSON asli
- waktu prediksi dibuat

---

### 4. Dataset Admin

Admin dapat mengupload dataset dengan format:

- CSV
- XLS
- XLSX

Dataset disimpan di folder:

```text
datasets/
```

Nama file disimpan dengan timestamp:

```text
YYYYMMDDHHMMSS-namafile.csv
```

Contoh:

```text
20260622120000-dataset.csv
```

#### Validasi Dataset

Dataset dianggap valid jika memiliki kolom berikut:

```text
Gender
E-Paylater User Status
Educational Background
Year of Birth
Job Status
Monthly Income
Average monthly expenditure for online shopping in relation to monthly income
IBB1
IBB2
IBB3
IBB4
P1
P2
P3
P4
SI1
SI2
SI3
SI4
SI5
SI6
H1
H2
H3
H4
SC1
SC2
SC3
SC4
SC5
NE1
NE2
NE3
NE4
NE5
Impulsive_Target
```

Kolom `Impulsive_Target` digunakan sebagai label target.

Target yang digunakan:

| Nilai | Makna |
|---|---|
| 0 | Wise Buyer |
| 1 | Impulsive Buyer |

---

### 5. Transformasi Fitur Dataset

Dataset mentah tidak langsung dipakai untuk training. Sistem melakukan transformasi fitur terlebih dahulu.

Transformasi dilakukan di `app/predict/features.py`.

#### Mapping Kolom Dataset ke Fitur Model

| Kolom Dataset | Fitur Model | Keterangan |
|---|---|---|
| `Gender` | `gender` | Nilai kategori numerik |
| `E-Paylater User Status` | `paylater_status` | Status penggunaan paylater |
| `Educational Background` | `education` | Latar belakang pendidikan |
| `Year of Birth` | `umur` | Dihitung dari tahun sekarang dikurangi tahun lahir |
| `Job Status` | `job_status` | Status pekerjaan |
| `Monthly Income` | `monthly_income` | Pendapatan bulanan |
| `Average monthly expenditure for online shopping in relation to monthly income` | `avg_expenditure_ratio` | Rasio pengeluaran belanja online |
| `IBB1` sampai `IBB4` | `skor_ibb` | Rata-rata skor IBB |
| `P1` sampai `P4` | `skor_promosi` | Rata-rata skor promosi |
| `SI1` sampai `SI6` | `skor_social_influence` | Rata-rata skor pengaruh sosial |
| `H1` sampai `H4` | `skor_hedonic` | Rata-rata skor hedonic |
| `SC1` sampai `SC5` | `skor_self_control` | Rata-rata skor kontrol diri |
| `NE1` sampai `NE5` | `skor_negative_emotion` | Rata-rata skor emosi negatif |

Urutan fitur model:

```text
gender
paylater_status
education
umur
job_status
monthly_income
avg_expenditure_ratio
skor_ibb
skor_promosi
skor_social_influence
skor_hedonic
skor_self_control
skor_negative_emotion
```

---

### 6. Analisis Dataset

Endpoint:

```http
POST /admin/datasets/analyze
```

Endpoint ini menggunakan dataset terbaru di folder `datasets`.

Analisis yang dilakukan:

#### Distribusi Kelas

Menghitung jumlah target:

```text
Impulsive_Target = 1
Impulsive_Target = 0
```

Output:

```json
{
  "impulsive": 45,
  "wise": 55,
  "total": 100
}
```

#### Statistik Fitur

Untuk setiap fitur model, sistem menghitung:

- mean
- std
- min
- max
- median

#### Distribusi Skor Likert

Kolom skor seperti `skor_ibb`, `skor_promosi`, dan lainnya dibulatkan dan dihitung frekuensinya berdasarkan skala 1 sampai 5.

#### Distribusi Kategori

Sistem menghitung distribusi untuk:

- gender
- paylater_status
- education
- job_status

#### Statistik Pendapatan

Sistem menghitung:

- mean
- median
- min
- max
- std

---

### 7. Metode Training Model

Endpoint:

```http
POST /admin/models/train
```

Model yang digunakan adalah **Random Forest Classifier**.

#### Pipeline

Sistem menggunakan pipeline dari scikit-learn:

```text
StandardScaler -> RandomForestClassifier
```

Pipeline terdiri dari:

1. **StandardScaler**
   - Menstandarisasi fitur agar memiliki mean 0 dan standar deviasi 1.
   - Berguna untuk menjaga skala fitur tetap konsisten.

2. **RandomForestClassifier**
   - Model ensemble berbasis banyak decision tree.
   - Menggunakan banyak pohon keputusan untuk mengambil keputusan akhir.
   - Cocok untuk klasifikasi tabular.

Konfigurasi awal model:

```text
class_weight=balanced
random_state=42
n_jobs=-1
```

Keterangan:

- `class_weight=balanced` membantu menangani ketidakseimbangan kelas.
- `random_state=42` membuat hasil training lebih konsisten.
- `n_jobs=-1` memanfaatkan semua core CPU yang tersedia.

---

### 8. Pembagian Data Latih dan Uji

Dataset dibagi menjadi:

| Bagian | Rasio |
|---|---|
| Data latih | 80% |
| Data uji | 20% |

Metode:

```text
train_test_split
```

Konfigurasi:

```text
test_size=0.2
random_state=42
stratify=y
```

`stratify=y` digunakan agar proporsi kelas target pada data latih dan data uji tetap mirip dengan dataset asli.

---

### 9. Hyperparameter Tuning

Sistem menggunakan **GridSearchCV** untuk mencari kombinasi parameter terbaik.

Parameter yang dicoba:

```text
model__n_estimators: 100, 200, 300
model__max_depth: None, 10, 20
model__min_samples_split: 2, 5
```

Total kombinasi:

```text
3 x 3 x 2 = 18 kombinasi
```

Metrik optimasi:

```text
f1_weighted
```

Cross-validation:

- 5 fold jika target memiliki lebih dari satu kelas.
- 2 fold jika target hanya memiliki satu kelas.

---

### 10. Evaluasi Model

Setelah model terbaik ditemukan, sistem mengevaluasi model pada data uji.

Metrik yang digunakan:

| Metrik | Fungsi |
|---|---|
| Accuracy | Mengukur persentase prediksi benar secara umum |
| Precision | Mengukur ketepatan prediksi positif |
| Recall | Mengukur kemampuan menemukan kelas positif |
| F1 Score | Rata-rata harmonik precision dan recall |
| ROC AUC | Mengukur kemampuan memisahkan kelas |
| Log Loss | Mengukur error probabilitas klasifikasi |

Rumus umum:

```text
Accuracy = prediksi benar / total prediksi
```

```text
Precision = TP / (TP + FP)
```

```text
Recall = TP / (TP + FN)
```

```text
F1 = 2 x (Precision x Recall) / (Precision + Recall)
```

ROC AUC dan Log Loss hanya dihitung jika data uji memiliki dua kelas.

---

### 11. Feature Importance

Random Forest dapat menghitung tingkat kepentingan setiap fitur.

Sistem mengambil:

```text
model.feature_importances_
```

Kemudian mengurutkan fitur dari yang paling berpengaruh ke yang paling kecil.

Output disimpan dalam dictionary:

```json
{
  "skor_promosi": 0.18,
  "skor_self_control": 0.15,
  "monthly_income": 0.12
}
```

Artinya, semakin besar nilai feature importance, semakin besar pengaruh fitur tersebut terhadap prediksi model.

---

### 12. Penyimpanan Artifact Model

Setelah training selesai, sistem menyimpan model ke:

```text
models/model.joblib
```

File disimpan menggunakan `joblib.dump`.

Isi artifact berupa dictionary:

```text
pipeline
best_params
feature_columns
feature_importance
trained_at
dataset
metrics
```

Model cache di-reset setelah training:

```text
invalidate_model_cache()
```

Tujuannya agar endpoint prediksi user langsung memakai model terbaru, bukan model lama yang masih tersimpan di memori.

---

### 13. Prediksi User

Endpoint:

```http
POST /predict/predict
```

Proses prediksi:

1. User mengirim data input dalam JSON.
2. Sistem menghitung umur dari `year_of_birth`.
3. Sistem menyusun vektor fitur sesuai urutan model.
4. Sistem memuat model dari `models/model.joblib`.
5. Model melakukan prediksi kelas:
   - 1 = Impulsive Buyer
   - 0 = Wise Buyer
6. Jika model memiliki `predict_proba`, sistem mengambil probabilitas kelas hasil prediksi.
7. Probabilitas diubah menjadi persentase.
8. Sistem menyimpan riwayat prediksi ke database.
9. Sistem mengembalikan hasil ke user.

Contoh output:

```json
{
  "status": "success",
  "aplikasi": "PadiBuy Mobile",
  "data": {
    "id_riwayat": 1,
    "kesimpulan": "Impulsive Buyer",
    "persentase_kecenderungan": 87.5,
    "pesan": "Berdasarkan jawaban Anda, Anda cenderung melakukan pembelian impulsif. Perlu lebih bijak dalam mengelola keuangan."
  }
}
```

---

### 14. Model Versioning Sederhana

Sistem menggunakan waktu modifikasi file model sebagai versi model.

```text
model_version = timestamp file models/model.joblib
```

Jika model belum ada, versi dikembalikan sebagai:

```text
untrained
```

Setiap riwayat prediksi menyimpan `model_version`, sehingga dapat diketahui prediksi tersebut dibuat menggunakan model versi apa.

---

### 15. Keamanan

Keamanan yang diterapkan:

- Password disimpan dalam bentuk hash bcrypt.
- Token login menggunakan JWT.
- Endpoint user dilindungi dengan bearer token.
- Endpoint admin hanya bisa diakses oleh email yang terdaftar di `ADMIN_EMAILS`.
- CORS diizinkan untuk semua origin karena saat ini ditujukan untuk development/testing.

Catatan:

Untuk production, sebaiknya:

- batasi `allow_origins`
- gunakan SECRET_KEY yang kuat
- gunakan database production
- tambahkan validasi ukuran file upload
- tambahkan sanitasi dan scanning file
- simpan artifact model dengan strategi versioning yang lebih jelas

---

## Alur Kerja Admin

### 1. Login Admin

Admin harus memiliki email yang terdaftar di konfigurasi `ADMIN_EMAILS` pada `.env`.

**Endpoint**

```http
POST /auth/login
```

**Body form-data**

```text
username=admin@example.com
password=password123
```

**Response**

```json
{
  "access_token": "jwt-token-admin",
  "token_type": "bearer"
}
```

Token dari response digunakan sebagai header Authorization pada semua endpoint admin.

```http
Authorization: Bearer <jwt-token-admin>
```

---

### 2. Upload Dataset

Admin mengupload dataset berisi data latih untuk model prediksi.

**Endpoint**

```http
POST /admin/datasets/upload
```

**Headers**

```http
Authorization: Bearer <jwt-token-admin>
```

**Format file**

Dataset dapat berupa:

- `.csv`
- `.xls`
- `.xlsx`

**Response**

```json
{
  "status": "success",
  "dataset": {
    "filename": "20260622120000-dataset.csv",
    "path": "datasets/20260622120000-dataset.csv",
    "size_bytes": 12345,
    "uploaded_at": "2026-06-22T05:00:00Z",
    "rows": 100,
    "columns": 37,
    "valid": true
  }
}
```

**Bagaimana sistem bekerja**

Sistem menerima file upload, mengecek ekstensi file, membuat folder `datasets` jika belum ada, menyimpan file dengan timestamp, lalu melakukan validasi kolom dataset.

Dataset dianggap valid jika memiliki semua kolom berikut:

```text
Gender
E-Paylater User Status
Educational Background
Year of Birth
Job Status
Monthly Income
Average monthly expenditure for online shopping in relation to monthly income
IBB1
IBB2
IBB3
IBB4
P1
P2
P3
P4
SI1
SI2
SI3
SI4
SI5
SI6
H1
H2
H3
H4
SC1
SC2
SC3
SC4
SC5
NE1
NE2
NE3
NE4
NE5
Impulsive_Target
```

---

### 3. Melihat Daftar Dataset

**Endpoint**

```http
GET /admin/datasets
```

**Headers**

```http
Authorization: Bearer <jwt-token-admin>
```

**Response**

```json
{
  "status": "success",
  "datasets": [
    {
      "filename": "20260622120000-dataset.csv",
      "path": "datasets/20260622120000-dataset.csv",
      "size_bytes": 12345,
      "uploaded_at": "2026-06-22T05:00:00Z",
      "rows": 100,
      "columns": 37,
      "valid": true
    }
  ]
}
```

**Bagaimana sistem bekerja**

Sistem membaca folder `datasets`, mengurutkan file berdasarkan waktu upload terbaru, lalu menampilkan informasi setiap dataset.

---

### 4. Melihat Detail Dataset

**Endpoint**

```http
POST /admin/datasets/{filename}/info
```

**Headers**

```http
Authorization: Bearer <jwt-token-admin>
```

**Contoh**

```http
POST /admin/datasets/20260622120000-dataset.csv/info
```

**Response**

```json
{
  "filename": "20260622120000-dataset.csv",
  "path": "datasets/20260622120000-dataset.csv",
  "size_bytes": 12345,
  "uploaded_at": "2026-06-22T05:00:00Z",
  "rows": 100,
  "columns": 37,
  "valid": true
}
```

---

### 5. Analisis Dataset

**Endpoint**

```http
POST /admin/datasets/analyze
```

**Headers**

```http
Authorization: Bearer <jwt-token-admin>
```

**Response**

```json
{
  "status": "success",
  "dataset": {
    "filename": "20260622120000-dataset.csv",
    "valid": true
  },
  "class_distribution": {
    "impulsive": 45,
    "wise": 55,
    "total": 100
  },
  "feature_stats": {},
  "score_distributions": {},
  "category_distributions": {},
  "income_stats": {}
}
```

**Bagaimana sistem bekerja**

Sistem menggunakan dataset terbaru dari folder `datasets`. Jika dataset valid, sistem menghitung:

- distribusi kelas target `Impulsive_Target`
- statistik fitur seperti mean, median, min, max, dan std
- distribusi skor Likert
- distribusi kategori seperti gender, paylater, pendidikan, dan pekerjaan
- statistik pendapatan

---

### 6. Training Model

**Endpoint**

```http
POST /admin/models/train
```

**Headers**

```http
Authorization: Bearer <jwt-token-admin>
```

**Response**

```json
{
  "status": "success",
  "model_path": "models/model.joblib",
  "trained_at": "2026-06-22T05:05:00+00:00",
  "dataset": "datasets/20260622120000-dataset.csv",
  "best_params": {
    "model__max_depth": 20,
    "model__min_samples_split": 2,
    "model__n_estimators": 100
  },
  "feature_columns": [
    "gender",
    "paylater_status",
    "education",
    "umur",
    "job_status",
    "monthly_income",
    "avg_expenditure_ratio",
    "skor_ibb",
    "skor_promosi",
    "skor_social_influence",
    "skor_hedonic",
    "skor_self_control",
    "skor_negative_emotion"
  ],
  "feature_importance": {},
  "metrics": {
    "accuracy": 0.9,
    "precision": 0.9,
    "recall": 0.9,
    "f1": 0.9,
    "roc_auc": 0.95,
    "log_loss": 0.2
  },
  "class_distribution": {
    "impulsive": 45,
    "wise": 55,
    "total": 100
  },
  "split_info": {
    "train_size": 80,
    "test_size": 20,
    "test_ratio": 0.2
  }
}
```

**Bagaimana sistem bekerja**

Saat admin memanggil endpoint training, sistem melakukan langkah berikut:

1. Mengambil dataset terbaru dari folder `datasets`.
2. Memvalidasi kolom dataset.
3. Mengubah kolom dataset mentah menjadi fitur model:
   - `Gender` menjadi `gender`
   - `E-Paylater User Status` menjadi `paylater_status`
   - `Educational Background` menjadi `education`
   - `Year of Birth` diubah menjadi `umur`
   - `Monthly Income` menjadi `monthly_income`
   - rata-rata IBB1 sampai IBB4 menjadi `skor_ibb`
   - rata-rata P1 sampai P4 menjadi `skor_promosi`
   - rata-rata SI1 sampai SI6 menjadi `skor_social_influence`
   - rata-rata H1 sampai H4 menjadi `skor_hedonic`
   - rata-rata SC1 sampai SC5 menjadi `skor_self_control`
   - rata-rata NE1 sampai NE5 menjadi `skor_negative_emotion`
4. Membagi data menjadi data latih dan data uji dengan rasio 80:20.
5. Melatih pipeline berisi `StandardScaler` dan `RandomForestClassifier`.
6. Menggunakan `GridSearchCV` untuk mencari kombinasi parameter terbaik.
7. Mengevaluasi model menggunakan accuracy, precision, recall, F1, ROC AUC, dan log loss.
8. Menyimpan model ke file `.joblib`.
9. Mengosongkan cache model agar user langsung memakai model terbaru.

---

### 7. Melihat Struktur Tree Model

**Endpoint**

```http
GET /admin/model/trees
```

**Headers**

```http
Authorization: Bearer <jwt-token-admin>
```

**Query parameter opsional**

```http
?tree_limit=3&max_depth=4
```

**Response**

```json
{
  "status": "success",
  "total_trees": 100,
  "shown_trees": 3,
  "max_depth": 4,
  "trained_at": "2026-06-22T05:05:00+00:00",
  "feature_columns": [],
  "trees": []
}
```

---

## Alur Kerja User

### 1. Registrasi User

User baru dapat mendaftar melalui endpoint register.

**Endpoint**

```http
POST /auth/register
```

**Body**

```json
{
  "email": "user@example.com",
  "username": "testuser",
  "password": "password123"
}
```

**Response**

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "testuser"
}
```

---

### 2. Login User

User login untuk mendapatkan token akses.

**Endpoint**

```http
POST /auth/login
```

**Body form-data**

```text
username=user@example.com
password=password123
```

**Response**

```json
{
  "access_token": "jwt-token-user",
  "token_type": "bearer"
}
```

Token dari response digunakan sebagai header Authorization pada semua endpoint user.

```http
Authorization: Bearer <jwt-token-user>
```

---

### 3. Melihat Profil User

**Endpoint**

```http
GET /auth/me
```

**Headers**

```http
Authorization: Bearer <jwt-token-user>
```

---

### 4. Melakukan Prediksi

User mengirim data perilaku belanja untuk mendapatkan hasil prediksi.

**Endpoint**

```http
POST /predict/predict
```

**Headers**

```http
Authorization: Bearer <jwt-token-user>
Content-Type: application/json
```

**Body**

```json
{
  "gender": 1,
  "paylater_status": 1,
  "education": 1,
  "year_of_birth": 1995,
  "job_status": 3,
  "monthly_income": 10000000,
  "avg_expenditure_ratio": 3,
  "skor_ibb": 3.5,
  "skor_promosi": 4.0,
  "skor_social_influence": 3.0,
  "skor_hedonic": 2.5,
  "skor_self_control": 3.0,
  "skor_negative_emotion": 2.0
}
```

**Response**

```json
{
  "status": "success",
  "aplikasi": "PadiBuy Mobile",
  "data": {
    "id_riwayat": 1,
    "kesimpulan": "Impulsive Buyer",
    "persentase_kecenderungan": 87.5,
    "pesan": "Berdasarkan jawaban Anda, Anda cenderung melakukan pembelian impulsif. Perlu lebih bijak dalam mengelola keuangan."
  }
}
```

**Bagaimana sistem bekerja**

Sistem menerima input user, lalu:

1. Menghitung umur dari `year_of_birth`.
2. Menyusun vektor fitur dengan urutan yang sama seperti model.
3. Memuat model `.joblib` terbaru.
4. Melakukan prediksi apakah user termasuk `Impulsive Buyer` atau `Wise Buyer`.
5. Mengambil probabilitas kelas hasil prediksi sebagai persentase kecenderungan.
6. Menyimpan riwayat prediksi ke database.
7. Mengembalikan hasil prediksi ke user.

---

### 5. Melihat Riwayat Prediksi

**Endpoint**

```http
GET /predict/history
```

**Headers**

```http
Authorization: Bearer <jwt-token-user>
```

**Response**

```json
{
  "status": "success",
  "riwayat_user": [
    {
      "id": 1,
      "user_id": 1,
      "umur": 31,
      "pendapatan": 10000000,
      "skor_diskon": 4.0,
      "skor_emosi": 2.0,
      "is_impulsive": 1,
      "confidence_rate": 87.5,
      "model_version": "2026-06-22T05:05:00+00:00",
      "input_json": {},
      "created_at": "2026-06-22T05:10:00Z"
    }
  ]
}
```

---

## Endpoint Testing

### Health Check

```http
GET /health
```

```json
{
  "status": "healthy",
  "service": "PadiBuy API"
}
```

---

### Authentication

```http
POST /auth/register
POST /auth/login
GET /auth/me
```

---

### Prediction

```http
POST /predict/predict
GET /predict/history
```

---

### Admin

```http
GET /admin/health
GET /admin/datasets
POST /admin/datasets/upload
POST /admin/datasets/{filename}/info
POST /admin/datasets/analyze
POST /admin/models/train
GET /admin/model/trees
```

---

## Ringkasan Endpoint Berdasarkan Peran

| Peran | Endpoint | Tujuan |
|---|---|---|
| Admin | `POST /admin/datasets/upload` | Mengupload dataset |
| Admin | `GET /admin/datasets` | Melihat daftar dataset |
| Admin | `POST /admin/datasets/{filename}/info` | Melihat detail dataset |
| Admin | `POST /admin/datasets/analyze` | Menganalisis dataset terbaru |
| Admin | `POST /admin/models/train` | Melatih model |
| Admin | `GET /admin/model/trees` | Melihat sebagian struktur tree model |
| User | `POST /predict/predict` | Melakukan prediksi |
| User | `GET /predict/history` | Melihat riwayat prediksi |
| Semua | `GET /health` | Cek status API |
| Semua | `POST /auth/register` | Daftar akun |
| Semua | `POST /auth/login` | Login akun |
| Semua | `GET /auth/me` | Lihat profil login |

---

## Catatan Penting

- Endpoint admin wajib menggunakan token dari akun yang emailnya terdaftar di `ADMIN_EMAILS`.
- Dataset harus memiliki kolom yang sesuai dengan format yang ditentukan.
- Training model akan menyimpan artifact ke `models/model.joblib`.
- Setelah training selesai, cache model di-reset agar prediksi user menggunakan model terbaru.
- Swagger UI tersedia di root API: `/`.
