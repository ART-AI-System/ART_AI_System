# Hướng dẫn Kiểm thử Thủ công (Postman) & Danh mục Dữ liệu Seed

Tài liệu này cung cấp chi tiết về **bộ dữ liệu mẫu đã seed sẵn trong MongoDB** (bằng lệnh `node scripts.js`) và **quy trình thực hiện thủ công trên Postman** tương ứng với từng bước kiểm thử luồng nghiệp vụ từ Module 1 đến Module 9.

> [!TIP]
> Trước khi thực hiện các bước dưới đây, bạn hãy chạy lệnh `node scripts.js` tại thư mục gốc để làm sạch và seed dữ liệu mẫu ban đầu vào MongoDB.

---

## 1. DANH MỤC DỮ LIỆU ĐÃ SEED SẴN (MONGODB REFERENCE)

Sau khi chạy `node scripts.js`, các thông tin dưới đây sẽ được nạp sẵn vào database để phục vụ kiểm thử:

### 1.1. Tài khoản Người dùng mẫu (M1 - M2)
Tất cả các tài khoản dưới đây đều sử dụng chung mật khẩu: **`Password123!`**

| Vai trò | Email đăng nhập | Tên hiển thị | MSSV (studentCode) | Trạng thái xác thực |
| :--- | :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@art-ai.com` | System Admin | *Không có* | VERIFIED (1) |
| **LECTURER** | `lecturer@art-ai.com` | Dr. Alan Turing | *Không có* | VERIFIED (1) |
| **STUDENT (A)** | `student.a@art-ai.com` | Alice Smith | `ST001` | VERIFIED (1) |
| **STUDENT (B)** | `student.b@art-ai.com` | Bob Jones | `ST002` | VERIFIED (1) |
| **STUDENT (C)** | `student.c@art-ai.com` | Charlie Brown | `ST003` | VERIFIED (1) |
| **STUDENT (D)** | `student.d@art-ai.com` | David Miller | `ST004` | VERIFIED (1) |
| **STUDENT (E)** | `student.e@art-ai.com` | Emma Watson | `ST005` | VERIFIED (1) |
| **STUDENT (F)** | `student.f@art-ai.com` | Frank Wright | `ST006` | VERIFIED (1) |

---

### 1.2. Kịch bản 1: Lớp học chưa có điểm (Scenario 1)
* **Lớp học**: Mã lớp `CS101` - Tên môn: *Introduction to Software Engineering* (Giảng viên: `Dr. Alan Turing`)
* **Thành viên**: Sinh viên `Alice Smith` (`ST001`) đã được enroll vào lớp.
* **Cột điểm (Grade Items)**:
  * Proposal (Trọng số 20%)
  * Literature Review (Trọng số 20%)
  * Methodology (Trọng số 20%)
  * Final Report (Trọng số 40%)
* **Bài nộp (Submissions) của Alice (ST001)**:
  1. **Proposal**: Đã nộp thành công (`status: "reviewed"`), đã có Review đánh giá từ giảng viên (`reviewStatus: "REVIEWED"`, Comment: *"Excellent proposal structure, very clear..."*) nhưng **chưa chấm điểm**.
  2. **Literature Review**: Đã nộp thành công (`status: "submitted"`), chưa được đánh giá và chưa chấm điểm.

---

### 1.3. Kịch bản 2: Lớp học đã được chấm điểm & xếp loại (Scenario 2)
* **Lớp học**: Mã lớp `CS102` - Tên môn: *Advanced Software Design* (Giảng viên: `Dr. Alan Turing`)
* **Thành viên**: Sinh viên B, C, D, E, F đã được enroll.
* **Cột điểm**: 4 cột điểm giống lớp `CS101` với trọng số (20%, 20%, 20%, 40%).
* **Điểm số & Xếp loại đã chấm sẵn (Grades & Final Results)**:
  
| Sinh viên | Điểm các cột (Proposal, Lit Review, Methodology, Final Report) | Điểm tổng kết (Final Score) | Phân loại học lực (Classification) |
| :--- | :--- | :--- | :--- |
| **Student B (Bob)** | `[4.0, 4.0, 4.0, 4.0]` | **`4.0`** | `poor` (0.0 - 4.9) |
| **Student C (Charlie)** | `[6.0, 6.0, 6.0, 6.0]` | **`6.0`** | `average` (5.0 - 6.4) |
| **Student D (David)** | `[7.0, 7.0, 7.0, 7.0]` | **`7.0`** | `good` (6.5 - 7.9) |
| **Student E (Emma)** | `[8.0, 7.5, 8.5, 9.0]` (Tính: $1.6 + 1.5 + 1.7 + 3.6$) | **`8.4`** | `very_good` (8.0 - 8.9) |
| **Student F (Frank)** | `[9.5, 9.5, 9.5, 9.5]` | **`9.5`** | `excellent` (9.0 - 10.0) |

---

## 2. QUY TRÌNH THAO TÁC KIỂM THỬ TRÊN POSTMAN

Tạo môi trường trên Postman (Environment) và nạp `base_url` là `http://localhost:4000/api`. Sử dụng tính năng **Tests script** (xem Phần 3 bên dưới) để tự động bắt Token.

### Kịch bản 1: Đăng nhập & Quản lý Người dùng (M1 - M2)

#### 1. Đăng nhập Admin
* **Method**: `POST`
* **URL**: `{{base_url}}/auth/login`
* **Body (JSON)**:
  ```json
  {
    "email": "admin@art-ai.com",
    "password": "Password123!"
  }
  ```
* **Mục tiêu**: Postman tự động lưu `access_token` vào biến `admin_token`.

#### 2. Admin tạo Người dùng mới (Giảng viên & Sinh viên mới để test)
* **Method**: `POST`
* **URL**: `{{base_url}}/users`
* **Headers**: `Authorization: Bearer {{admin_token}}`
* **Body (JSON)**:
  * *Tạo giảng viên*:
    ```json
    {
      "fullName": "QA Lecturer",
      "email": "qa.lecturer@art-ai.com",
      "password": "Password123!",
      "role": "LECTURER"
    }
    ```
  * *Tạo sinh viên*:
    ```json
    {
      "fullName": "QA Student",
      "email": "qa.student@art-ai.com",
      "password": "Password123!",
      "role": "STUDENT",
      "studentCode": "QA_ST_001"
    }
    ```
* **Mục tiêu**: Lưu lại `_id` của Giảng viên và Sinh viên vừa tạo từ Response để điền vào các bước tiếp theo.

---

### Kịch bản 2: Quản lý Lớp học & Cột điểm (M3)

#### 1. Đăng nhập Admin để tạo Lớp học
* **Method**: `POST`
* **URL**: `{{base_url}}/classes`
* **Headers**: `Authorization: Bearer {{admin_token}}`
* **Body (JSON)**:
  ```json
  {
    "classCode": "CS_QA_101",
    "subjectName": "Software Quality Assurance",
    "semester": "HK1-2024",
    "academicYear": "2024-2025",
    "lecturer": {
      "lecturerId": "<Điền ID giảng viên vừa tạo>",
      "fullName": "QA Lecturer",
      "email": "qa.lecturer@art-ai.com"
    },
    "students": []
  }
  ```
* **Mục tiêu**: Lưu lại `_id` của lớp vừa tạo vào biến môi trường `class_id`.

#### 2. Đăng nhập bằng Giảng viên mới tạo
* **Method**: `POST`
* **URL**: `{{base_url}}/auth/login`
* **Body (JSON)**:
  ```json
  {
    "email": "qa.lecturer@art-ai.com",
    "password": "Password123!"
  }
  ```
* **Mục tiêu**: Token tự động lưu vào biến `lecturer_token`.

#### 3. Giảng viên enroll Sinh viên vào lớp học
* **Method**: `PUT`
* **URL**: `{{base_url}}/classes/{{class_id}}`
* **Headers**: `Authorization: Bearer {{lecturer_token}}`
* **Body (JSON)**:
  ```json
  {
    "students": [
      {
        "studentId": "<Điền ID sinh viên vừa tạo>",
        "studentCode": "QA_ST_001",
        "fullName": "QA Student",
        "email": "qa.student@art-ai.com"
      }
    ]
  }
  ```

#### 4. Giảng viên tạo Cột điểm (Grade Items)
* **Method**: `POST`
* **URL**: `{{base_url}}/classes/{{class_id}}/grade-items`
* **Headers**: `Authorization: Bearer {{lecturer_token}}`
* **Body (JSON)**:
  * *Tạo cột Proposal*:
    ```json
    {
      "title": "QA Proposal",
      "description": "Proposal doc",
      "weight": 30,
      "maxScore": 10,
      "deadline": "2026-12-31T23:59:59.000Z",
      "sequenceOrder": 1
    }
    ```
  * *Tạo cột Final Report*:
    ```json
    {
      "title": "QA Final Report",
      "description": "Final report doc",
      "weight": 70,
      "maxScore": 10,
      "deadline": "2026-12-31T23:59:59.000Z",
      "sequenceOrder": 2
    }
    ```
* **Mục tiêu**: Lấy `_id` của 2 Grade Items vừa tạo (ví dụ: `gradeItem1Id` và `gradeItem2Id`).

---

### Kịch bản 3: Sinh viên nộp bài (M4)

#### 1. Đăng nhập bằng Sinh viên mới tạo
* **Method**: `POST`
* **URL**: `{{base_url}}/auth/login`
* **Body (JSON)**:
  ```json
  {
    "email": "qa.student@art-ai.com",
    "password": "Password123!"
  }
  ```
* **Mục tiêu**: Token tự động lưu vào biến `student_token`.

#### 2. Sinh viên nộp File cho cột Proposal
* **Method**: `POST`
* **URL**: `{{base_url}}/grade-items/<gradeItem1Id>/submissions`
* **Headers**: `Authorization: Bearer {{student_token}}`
* **Body**: Chọn kiểu `form-data`, tạo key `file` (dạng File), nhấn Select Files và chọn một file PDF bất kỳ.
* **Mục tiêu**: Lưu lại `_id` bài nộp vào biến môi trường `submission_id`.

#### 3. Sinh viên xem danh sách bài nộp của bản thân
* **Method**: `GET`
* **URL**: `{{base_url}}/students/me/submissions`
* **Headers**: `Authorization: Bearer {{student_token}}`

---

### Kịch bản 4: Giảng viên Đánh giá & Chấm điểm (M5 - M6)

#### 1. Giảng viên xem Tổng quan bài nộp của lớp
* **Method**: `GET`
* **URL**: `{{base_url}}/lecturer/classes/{{class_id}}/submission-overview`
* **Headers**: `Authorization: Bearer {{lecturer_token}}`

#### 2. Giảng viên đánh giá trạng thái bài nộp thành REVIEWED
* **Method**: `PATCH`
* **URL**: `{{base_url}}/lecturer/submissions/{{submission_id}}/review-status`
* **Headers**: `Authorization: Bearer {{lecturer_token}}`
* **Body (JSON)**:
  ```json
  {
    "reviewStatus": "REVIEWED"
  }
  ```

#### 3. Giảng viên thêm Comment phản hồi
* **Method**: `POST`
* **URL**: `{{base_url}}/lecturer/submissions/{{submission_id}}/comments`
* **Headers**: `Authorization: Bearer {{lecturer_token}}`
* **Body (JSON)**:
  ```json
  {
    "comment": "Good research methodology proposed."
  }
  ```

#### 4. Giảng viên chấm điểm cho cột Proposal (Ví dụ: 9.0/10)
* **Method**: `POST`
* **URL**: `{{base_url}}/submissions/{{submission_id}}/grade`
* **Headers**: `Authorization: Bearer {{lecturer_token}}`
* **Body (JSON)**:
  ```json
  {
    "studentId": "<ID sinh viên vừa tạo>",
    "classId": "{{class_id}}",
    "gradeItemId": "<gradeItem1Id>",
    "score": 9.0,
    "maxScore": 10,
    "feedback": "Great outline",
    "gradedBy": "<ID giảng viên>"
  }
  ```

---

### Kịch bản 5: Tính toán Kết quả tổng kết & Phân loại học lực (M7 - M8)

*Trước tiên, hãy lặp lại bước nộp bài và chấm điểm cho cột điểm 2 (QA Final Report) của sinh viên đó với điểm là `8.0`.*

#### 1. Giảng viên tính điểm tổng kết lớp học
* **Method**: `POST`
* **URL**: `{{base_url}}/classes/{{class_id}}/final-results/calculate`
* **Headers**: `Authorization: Bearer {{lecturer_token}}`

#### 2. Xem điểm tổng kết của Sinh viên
* **Method**: `GET`
* **URL**: `{{base_url}}/students/<ID sinh viên>/classes/{{class_id}}/final-result`
* **Headers**: `Authorization: Bearer {{lecturer_token}}`
* **Kết quả dự kiến**: 
  * `finalScore` = `8.3` (tính từ: $9.0 \times 30\% + 8.0 \times 70\%$)
  * `classification` = `"very_good"` (do điểm $\ge 8.0$ và $< 9.0$)

#### 3. Xem bảng xếp hạng sinh viên trong lớp
* **Method**: `GET`
* **URL**: `{{base_url}}/classes/{{class_id}}/rankings`
* **Headers**: `Authorization: Bearer {{lecturer_token}}`

---

### Kịch bản 6: Dashboards & Báo cáo (M9)

#### 1. Truy vấn Dashboard Sinh viên
* **Method**: `GET`
* **URL**: `{{base_url}}/dashboard/student`
* **Headers**: `Authorization: Bearer {{student_token}}`

#### 2. Truy vấn Dashboard Giảng viên
* **Method**: `GET`
* **URL**: `{{base_url}}/dashboard/lecturer`
* **Headers**: `Authorization: Bearer {{lecturer_token}}`

#### 3. Truy vấn Báo cáo Điểm số tổng kết lớp học
* **Method**: `GET`
* **URL**: `{{base_url}}/reports/classes/{{class_id}}/final-results`
* **Headers**: `Authorization: Bearer {{lecturer_token}}`

#### 4. Xuất bảng điểm lớp học ra file Excel
* **Method**: `GET`
* **URL**: `{{base_url}}/reports/classes/{{class_id}}/export-excel`
* **Headers**: `Authorization: Bearer {{lecturer_token}}`
* *Tip: Trên Postman, nhấn mũi tên cạnh nút Send -> chọn "Send and Download" để tải file Excel về.*

---

## 3. SCRIPT TỰ ĐỘNG LƯU TOKEN TRÊN POSTMAN

Hãy sao chép đoạn mã này dán vào mục **Tests** của request `POST {{base_url}}/auth/login` để tự động lưu Token ứng với từng vai trò:

```javascript
if (pm.response.code === 200) {
    const responseData = pm.response.json();
    const result = responseData.result;

    if (result && result.access_token) {
        const token = result.access_token;
        const body = JSON.parse(pm.request.body.raw);
        const email = body.email;

        if (email.includes('admin')) {
            pm.environment.set('admin_token', token);
            console.log('Saved admin_token successfully.');
        } else if (email.includes('lecturer')) {
            pm.environment.set('lecturer_token', token);
            console.log('Saved lecturer_token successfully.');
        } else if (email.includes('student')) {
            pm.environment.set('student_token', token);
            console.log('Saved student_token successfully.');
        }
    }
}
```
Để sử dụng Token này trong các request khác, trong tab **Authorization** chọn Type là `Bearer Token` và điền vào ô Token giá trị tương ứng: `{{admin_token}}`, `{{lecturer_token}}` hoặc `{{student_token}}`.
