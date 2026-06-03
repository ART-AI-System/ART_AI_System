# 🚀 Guide Code Module/API Mới

Mỗi module mới (Users, Tweets, Jobs, Packages,...) đều follow đúng luồng dưới đây:

## 📂 Cấu trúc Folder

```txt
src
├── models
│   ├── requests
│   └── schemas
│
├── middlewares
│
├── services
│
├── controllers
│
├── routes
│
└── index.ts
```

---

## 🔄 Luồng Code

```txt
Client Request
      ↓
Route
      ↓
Middleware (Validate)
      ↓
Controller
      ↓
Service
      ↓
Database Service
      ↓
MongoDB
```

---

## 1. Models

```txt
src/models/requests/[module].requests.ts
src/models/schemas/[module].schema.ts
```

* Request Interface: dữ liệu client gửi lên.
* Schema Class: dữ liệu lưu MongoDB.
* Dùng `Object.assign(this, data)` trong constructor.

---

## 2. Database Service

```txt
src/services/database.service.ts
```

Thêm collection mới:

```ts
get jobs() {
  return this.db.collection('jobs')
}
```

Nếu cần thì tạo index tại đây.

---

## 3. Middleware

```txt
src/middlewares/[module].middlewares.ts
```

* Validate dữ liệu đầu vào bằng `checkSchema()`.
* Tái sử dụng các rule dùng chung nếu có.

---

## 4. Service

```txt
src/services/[module].services.ts
```

* Chứa toàn bộ business logic.
* CRUD với database.
* Luôn dùng `await` khi gọi DB.

---

## 5. Controller

```txt
src/controllers/[module].controllers.ts
```

* Nhận request.
* Gọi service.
* Trả response.
* Không viết `try-catch`.

---

## 6. Route

```txt
src/routes/[module].routes.ts
```

* Khai báo endpoint.
* Gắn middleware validate.
* Bọc controller bằng:

```ts
wrapRequestHandler(controller)
```

---

## 7. Register Router

```txt
src/index.ts
```

```ts
app.use('/jobs', jobsRouter)
```

---

# 📌 Cheat Sheet

```txt
1. Models
   └─ requests + schemas

2. Database Service
   └─ collection + index

3. Middleware
   └─ validate request

4. Service
   └─ business logic + DB

5. Controller
   └─ call service

6. Route
   └─ endpoint + middleware

7. index.ts
   └─ app.use()
```

> Luồng code
> **Model → Middleware → Service → Controller → Route → index.ts**
>
