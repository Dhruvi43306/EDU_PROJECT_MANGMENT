# EDU_PROJECT_MANGMENT
# 🎓 Student Project Management System

> A modern full-stack web application for managing students, departments, academic projects, tasks, priorities, deadlines, and project progress through a centralized management platform!!

<p align="center">

![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=for-the-badge\&logo=dotnet\&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge\&logo=next.js\&logoColor=white)
![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge\&logo=typescript\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge\&logo=postgresql\&logoColor=white)
![Entity Framework](https://img.shields.io/badge/EF_Core-512BD4?style=for-the-badge\&logo=dotnet\&logoColor=white)

</p>

---

## 📌 About The Project

The **Student Project Management System** is a full-stack web application designed to simplify the management of academic projects and student activities.

The system provides a centralized platform where administrators and students can manage:

* 👨‍🎓 Students
* 🏢 Departments
* 📚 Academic information
* 📁 Projects
* ✅ Tasks
* 🎯 Priorities
* 📅 Start and due dates
* 📊 Project progress
* 👥 Student-project assignments
* 🔐 User authentication
* 📧 Email-based account workflows
* 📈 Task completion statistics

Instead of maintaining project information across spreadsheets, documents, and separate communication channels, the application brings everything together into one structured system.

---

# ✨ Key Features

## 🔐 Authentication & Authorization

The system provides secure user authentication using JWT-based authentication.

### Features

* User registration/login
* JWT authentication
* Role-based access
* Secure password hashing
* Protected API endpoints
* Token-based authorization
* Account setup workflow
* Email-based account setup functionality

### Security Technologies

* JWT Bearer Authentication
* BCrypt password hashing
* ASP.NET Core Authentication & Authorization

---

# 👨‍🎓 Student Management

Administrators can manage student information from a centralized interface.

### Student Information

* Enrollment Number
* Student Name
* Academic Year
* Department
* Semester
* CPI
* Project assignment
* Student status

The system also supports associating students with projects through the student-project relationship.

---

# 🏢 Department Management

Departments can be created and maintained through the department management module.

### Department Features

* Create department
* Update department
* View departments
* Activate/deactivate departments
* Associate students with departments

Example:

```text
Computer Engineering
Information Technology
Mechanical Engineering
Civil Engineering
Electrical Engineering
```

---

# 📁 Project Management

Projects are the central component of the system.

Each project can contain:

* Project name
* Description
* Students
* Tasks
* Start date
* Deadline
* Project status
* Task statistics

This allows project information to remain organized and connected with students and their assigned tasks.

---

# ✅ Task Management

Projects can be divided into multiple tasks.

Each task contains information such as:

```text
Task Name
Description
Priority
Start Date
Due Date
Actual Hours
Created Date
Updated Date
```

The system also maintains task progress information! and applyed by proper validation like start date alwayes grater enddate!

### Task Statistics

```text
Total Tasks
Completed Tasks
Pending Tasks
In-Progress Tasks
```

This makes it easier to understand the current state of a project.

---

# 🎯 Priority Management

Tasks can be assigned different priority levels.

Example:

```text
🔴 High
🟡 Medium
🟢 Low
```

Priority information helps students and project managers identify which tasks should be handled first.

---

# 👥 Student Project Assignment

Students can be associated with projects through a dedicated student-project relationship.

This allows the system to answer questions such as:

```text
Which students are working on this project?
Which project belongs to this student?
Which department does the student belong to?
What is the student's academic information?
```

---

# 📊 Project Progress Tracking

The application keeps track of task-level progress and provides project-level statistics.

For example:

```text
Project: Student Management Portal

Total Tasks      : 20
Completed Tasks  : 12
In Progress      : 5
Pending          : 3
```

This provides a simple way to understand project progress without manually calculating task counts.

---

# 📧 Email Integration

The backend uses **MailKit** for email-related functionality.

Email functionality can be used for workflows such as:

* Account setup
* Account activation
* Sending setup links
* System notifications

---

# 🎨 Frontend

The frontend is built using a modern React/Next.js architecture.

### Frontend Technologies

* Next.js
* React
* TypeScript
* Tailwind CSS
* Material UI
* Lucide React
* Framer Motion

The UI focuses on a modern SaaS-style experience with:

* Responsive layouts
* Modern cards
* Tables
* Forms
* Dialogs
* Animations
* Soft shadows
* Gradient elements
* Responsive navigation
* Interactive dashboards

---

# ⚙️ Backend

The backend is built using **ASP.NET Core Web API**.

### Backend Technologies

* C#
* ASP.NET Core
* Entity Framework Core
* MSSQL
* Npgsql
* BCrypt.Net-Next
* JWT Bearer Authentication
* MailKit
* Swagger / OpenAPI

The backend follows a structured architecture with separation between:

```text
Controllers
    ↓
Services
    ↓
Data Access / EF Core
    ↓
MSSQL
```

---

# 🗄️ Database

The application uses **MSSQL** as the primary relational database.

Entity Framework Core is used as the ORM.

### Main Entities

```text
Users
Students
Projects
Tasks
Priorities
Departments
StatusMaster
UserRoles
StudentProjects
AccountSetupTokens
```

### Relationship Overview

```text
                ┌──────────────┐
                │    Users     │
                └──────┬───────┘
                       │
                       │
                ┌──────▼───────┐
                │    Roles     │
                └──────────────┘


┌──────────────┐
│ Department   │
└──────┬───────┘
       │
       │
┌──────▼───────┐
│   Students   │
└──────┬───────┘
       │
       │
       │ Student Project
       │ Assignment
       │
┌──────▼───────┐
│   Projects   │
└──────┬───────┘
       │
       │
┌──────▼───────┐
│    Tasks     │
└──────┬───────┘
       │
       └──────────────► Priority
```

---

# 🏗️ System Architecture

```text
                    ┌────────────────────────┐
                    │      User Browser      │
                    └───────────┬────────────┘
                                │
                                │ HTTP / HTTPS
                                ▼
                    ┌────────────────────────┐
                    │     Next.js Frontend   │
                    │                        │
                    │ React + TypeScript     │
                    │ Tailwind + MUI         │
                    └───────────┬────────────┘
                                │
                                │ REST API
                                ▼
                    ┌────────────────────────┐
                    │   ASP.NET Core API     │
                    │                        │
                    │ Controllers             │
                    │ Services                │
                    │ Authentication          │
                    │ AutoMapper              │
                    └───────────┬────────────┘
                                │
                                │ Entity Framework Core
                                ▼
                    ┌────────────────────────┐
                    │      PostgreSQL        │
                    │                        │
                    │ Users                   │
                    │ Students                │
                    │ Projects                │
                    │ Tasks                   │
                    │ Departments             │
                    └────────────────────────┘
```

---

# 📂 Project Structure

A simplified project structure looks like:

```text
Student-Project-Management-System/
│
├── Backend/
│   │
│   ├── Controllers/
│   │   ├── StudentController.cs
│   │   ├── ProjectController.cs
│   │   ├── DepartmentController.cs
│   │   ├── TaskController.cs
│   │   └── ...
│   │
│   ├── Models/
│   │   ├── Users.cs
│   │   ├── Student.cs
│   │   ├── Project.cs
│   │   ├── Task.cs
│   │   ├── Priority.cs
│   │   ├── DepartmentMaster.cs
│   │   └── ...
│   │
│   ├── Services/
│   │   ├── StudentService.cs
│   │   ├── ProjectService.cs
│   │   ├── TaskService.cs
│   │   └── ...
│   │
│   ├── Data/
│   │   └── AppDbContext.cs
│   │
│   ├── DTOs/
│   │
│   ├── Migrations/
│   │
│   ├── Program.cs
│   └── appsettings.json
│
├── Frontend/
│   │
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── types/
│   ├── public/
│   ├── styles/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# 🔌 API Modules

The backend exposes REST APIs for the major system modules.

### Student

```text
/api/student
```

Responsible for student-related operations.

### Department

```text
/api/Department
```

Responsible for department management.

### Project

```text
/api/project
```

Responsible for project management.

### Student Project

```text
/api/StudentProject
```

Responsible for assigning and managing students within projects.

Additional APIs can be added for:

```text
Authentication
Tasks
Priorities
Statuses
Users
```

---

# 🧰 Technology Stack

## Frontend

| Technology    | Purpose            |
| ------------- | ------------------ |
| Next.js       | Frontend framework |
| React         | UI development     |
| TypeScript    | Type safety        |
| Tailwind CSS  | Styling            |
| Material UI   | UI components      |
| Framer Motion | Animations         |
| Lucide React  | Icons              |

## Backend

| Technology            | Purpose           |
| --------------------- | ----------------- |
| C#                    | Backend language  |
| ASP.NET Core          | REST API          |
| Entity Framework Core | ORM               |
| AutoMapper            | DTO mapping       |
| BCrypt                | Password hashing  |
| JWT                   | Authentication    |
| MailKit               | Email integration |
| Swagger               | API documentation |

## Database

| Technology         | Purpose                    |
| ------------------ | -------------------------- |
| PostgreSQL         | Relational database        |
| Npgsql             | PostgreSQL provider        |
| EF Core Migrations | Database schema management |

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/student-project-management-system.git

cd student-project-management-system
```

---

# ⚙️ Backend Setup

Navigate to the backend:

```bash
cd Backend
```

Restore dependencies:

```bash
dotnet restore
```

---

## 🗄️ Configure PostgreSQL

Create a PostgreSQL database.

Example:

```text
Database Name:
student_project_management
```

Update your backend connection string in:

```text
appsettings.json
```

Example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=student_project_management;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

---

# 🔐 JWT Configuration

Configure JWT settings in `appsettings.json`.

Example:

```json
{
  "Jwt": {
    "Key": "YOUR_SECRET_KEY",
    "Issuer": "StudentProjectManagement",
    "Audience": "StudentProjectManagementUsers"
  }
}
```

> For production, never commit real secrets or passwords to GitHub.

Use environment variables or a secure secret-management solution instead.

---

# 📧 Email Configuration

MailKit is used for email functionality.

Example configuration:

```json
{
  "EmailSettings": {
    "Host": "smtp.example.com",
    "Port": 587,
    "Username": "your-email@example.com",
    "Password": "YOUR_EMAIL_PASSWORD",
    "FromEmail": "your-email@example.com"
  }
}
```

---

# 🗃️ Run EF Core Migrations

If migrations already exist:

```bash
dotnet ef database update
```

To create a new migration:

```bash
dotnet ef migrations add InitialCreate
```

Then:

```bash
dotnet ef database update
```

---

# ▶️ Run Backend

```bash
dotnet run
```

The API will be available according to your configured ASP.NET Core launch settings.

For example:

```text
https://localhost:7151
```

or

```text
http://localhost:5016
```

Swagger can then be opened from:

```text
/swagger
```

---

# 💻 Frontend Setup

Open another terminal.

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

---

# 🔗 Configure Frontend API URL

Create:

```text
.env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5202
```

The frontend uses this base URL to communicate with the backend.

---

# ▶️ Run Frontend

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:3000
```

---

# 🔄 Application Flow

A typical workflow is:

```text
1. User opens application
          ↓
2. User logs in
          ↓
3. JWT token is generated
          ↓
4. Frontend stores authentication state
          ↓
5. User accesses authorized modules
          ↓
6. Frontend sends REST API request
          ↓
7. ASP.NET Core Controller receives request
          ↓
8. Service processes business logic
          ↓
9. Entity Framework Core communicates
   with PostgreSQL
          ↓
10. API returns response
          ↓
11. Next.js updates the UI
```

---

# 🔒 Security

The application includes several security practices:

* JWT-based authentication
* BCrypt password hashing
* Role-based authorization
* Protected API endpoints
* Database relationship constraints
* Input validation
* Separation between DTOs and database entities
* Secure configuration through environment variables

---

# 📱 Responsive Design

The frontend is designed to work across different screen sizes.

```text
Desktop
   ↓
Tablet
   ↓
Mobile
```

The interface uses responsive layouts and reusable components to maintain a consistent user experience.

---

# 🎯 Main Goals

The project was developed with the following goals:

### 1. Centralized Management

Keep student and project information in one system.

### 2. Better Project Organization

Break projects into manageable tasks.

### 3. Progress Tracking

Track completed, pending, and in-progress tasks.

### 4. Secure Access

Protect application resources using authentication and authorization.

### 5. Modern User Experience

Provide a clean and responsive interface.

### 6. Scalable Architecture

Keep frontend, backend, business logic, and database responsibilities separated.

---

# 📈 Future Improvements

Possible future enhancements include:

* 📊 Advanced project analytics
* 📈 Progress charts
* 🔔 Real-time notifications
* 💬 Project/team communication
* 📎 File and document attachments
* 📅 Calendar integration
* ⏰ Task reminders
* 📝 Project evaluation and marks
* 👨‍🏫 Faculty/mentor management
* 📑 Automated project reports
* 📤 Excel/PDF export
* 🔍 Advanced search and filtering
* 🌓 Dark mode
* 📱 Progressive Web App support
* 🔄 Real-time updates using SignalR

---

# 🧪 Development Practices

The project follows several software-development practices:

* RESTful API design
* Separation of concerns
* Dependency Injection
* DTO-based API communication
* Entity Framework Core migrations
* Reusable frontend components
* TypeScript type safety
* Environment-based configuration
* Authentication middleware
* Database relationship constraints

---

# 🧑‍💻 Development Environment

Recommended environment:

```text
Node.js
.NET SDK
PostgreSQL
Visual Studio / VS Code
Git
GitHub
```

---

# 📚 What This Project Demonstrates

This project demonstrates practical knowledge of:

```text
Full-Stack Development
        ↓
Frontend Development
        ↓
Backend API Development
        ↓
Database Design
        ↓
Authentication
        ↓
Authorization
        ↓
REST APIs
        ↓
ORM / Entity Framework
        ↓
Email Integration
        ↓
Responsive UI
        ↓
Project & Task Management
```

It combines frontend, backend, database, authentication, and application architecture into a single real-world application.

---

# 🤝 Contributing

Contributions are welcome.

### Steps

```bash
# Fork the repository

# Clone your fork
git clone https://github.com/YOUR_USERNAME/student-project-management-system.git

# Create a branch
git checkout -b feature/new-feature

# Make your changes

# Commit
git commit -m "Add new feature"

# Push
git push origin feature/new-feature

# Create a Pull Request
```

---

# 🐛 Issues

If you find a bug or have a feature request, please create an issue in the GitHub repository with:

* Clear description
* Steps to reproduce
* Expected behavior
* Actual behavior
* Screenshots if applicable

---

# 📄 License

This project is intended for educational and project-development purposes.

You can add a specific license such as MIT License if you decide to release the project as open source.

---

# 👨‍💻 Author

**Student Project Management System**

Built as a full-stack academic project using modern web technologies.

---

## ⭐ If You Like This Project

If this project helped you or you found it interesting, consider giving the repository a ⭐ on GitHub.

---

<p align="center">

### 🚀 Student Project Management System

**Manage Students • Manage Projects • Manage Tasks • Track Progress**

Built with ❤️ using **Next.js + ASP.NET Core + PostgreSQL**

</p>
