📝 Task Management API

A backend Task Management system built using FastAPI, PostgreSQL, SQLAlchemy, and Alembic.

This project demonstrates clean API design, nested relationships (Tasks → SubTasks → Comments), response shaping, and proper backend architecture using service layers.

🚀 Features

✅ Create, update, delete Tasks  
✅ Create, update, delete SubTasks  
✅ Add comments to Tasks and SubTasks  
✅ Get Tasks with nested SubTasks and Comments  
✅ Preview-based response (optimized payload)  
✅ Prevent duplicate task titles  
✅ Pagination for task list  
✅ Structured API responses (count + preview)  
✅ Environment variable configuration (`.env`)  
✅ Proper exception handling  
✅ Clean service-layer architecture  
✅ Relationship-based data modeling  
✅ Controlled delete logic (business rules enforced)  

🛠 Tech Stack

- Python  
- FastAPI  
- PostgreSQL  
- SQLAlchemy (ORM)  
- Alembic (Database migrations)  
- Pydantic  
- Uvicorn  

📁 Project Structure

app/
├── api/
│   ├── task1.py         # Task APIs
│   ├── subtasks.py      # SubTask APIs
│   └── comments.py      # Comment APIs
│
├── db/
│   ├── base.py          # SQLAlchemy Base
│   └── session.py       # Database connection
│
├── models/
│   ├── model_task.py
│   ├── model_subtasks.py
│   └── model_comment.py
│
├── schemas/
│   ├── schemas_task.py
│   ├── schemas_subtask.py
│   └── comment.py
│
├── services/
│   ├── services_task.py
│   ├── services_subtasks.py
│   └── services_comment.py
│
└── main.py              # Entry point

⚙️ Setup Instructions

1️⃣ Clone the repository

git clone <your-repo-link>
cd <project-folder>

2️⃣ Create virtual environment

python -m venv .venv

Activate:

Windows  
.venv\Scripts\activate

3️⃣ Install dependencies

pip install -r requirements.txt

4️⃣ Setup PostgreSQL

CREATE DATABASE task_management;

5️⃣ Configure `.env`

DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/task_management

6️⃣ Run migrations

alembic upgrade head

7️⃣ Run the server

uvicorn app.main:app --reload

📡 API Endpoints

Base URL:  
http://localhost:8000/api

✅ Task APIs

POST   /task1/        → Create task  
GET    /task1/        → Get all tasks (with pagination + preview)  
GET    /task1/{id}    → Get task by ID  
PATCH  /task1/{id}    → Update task  
DELETE /task1/{id}    → Delete task  

✅ SubTask APIs

POST   /tasks/{task_id}/subtasks  
GET    /tasks/{task_id}/subtasks  
PATCH  /subtasks/{id}  
DELETE /subtasks/{id}  

✅ Comment APIs

POST   /tasks/{task_id}/comments  
POST   /subtasks/{subtask_id}/comments  
GET    /tasks/{task_id}/comments  
GET    /subtasks/{subtask_id}/comments  

📘 API Documentation

Swagger UI:  
http://localhost:8000/docs

🧠 Concepts Implemented

- REST API design  
- Dependency Injection (`Depends`)  
- SQLAlchemy ORM relationships  
- Database session management  
- Pydantic validation  
- Service-layer architecture  
- Nested data relationships  
- Response shaping (preview + count)  
- Pagination (`skip`, `limit`)  
- Exception handling  
- Business-rule enforcement (deletion rules)  
- Alembic migrations  

⚠️ Notes

- Duplicate task titles are restricted  
- Tasks cannot be deleted if subtasks exist  
- Comments are deleted when parent entity is deleted  
- API responses are optimized using preview data  
- PATCH updates only provided fields (`exclude_unset=True`)  

✅ Future Improvements

- Advanced filtering (`?status=pending`)  
- Sorting support  
- Global exception handler  
- Logging system  
- Authentication (JWT)  
- Role-based access control  
- Pagination for comments  
- Query optimization (avoid N+1 problem)  
