# E-Pharmacy Admin Dashboard

[English](#english) | [Українська](#ukrainian)

<a name="english"></a>

## E-Pharmacy Admin Dashboard

### Overview

E-Pharmacy Admin Dashboard is a comprehensive web application designed for pharmacy management. It provides a complete solution for managing products, orders, customers, and suppliers in a pharmacy environment. The dashboard offers real-time analytics and reporting to help make data-driven decisions.

### Features

- **User Authentication** - Secure login and user management system
- **Product Management** - Add, edit, and manage pharmaceutical products
- **Order Processing** - Track and manage customer orders
- **Customer Management** - Maintain customer database and purchase history
- **Supplier Management** - Manage supplier relationships and inventory
- **Real-time Analytics** - Dashboard with key performance metrics

### Tech Stack

**Frontend:**

- React 19
- TypeScript
- Apollo Client for GraphQL
- React Router
- React Hook Form
- Vite

**Backend:**

- NestJS
- GraphQL
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Getting Started

#### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database

#### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/e-pharmacy-admin-dashboard.git
cd e-pharmacy-admin-dashboard
```

2. Set up the backend

```bash
cd server
npm install
```

3. Configure environment variables

- Copy `.env.example` to `.env` and update the database connection string

4. Initialize the database

```bash
npm run prisma:migrate:dev
npm run prisma:seed
```

5. Start the server

```bash
npm run start:dev
```

6. Set up the frontend

```bash
cd ../client
npm install
```

7. Configure frontend environment

- Copy `.env.example` to `.env` and update API URLs if needed

8. Start the client

```bash
npm run dev
```

### Deployment

The application can be deployed to various platforms:

- **Backend**: Render, Heroku, AWS, or any Node.js hosting service
- **Frontend**: Vercel, Netlify, or similar static hosting services
- **Database**: Any PostgreSQL provider like Supabase, AWS RDS, or ElephantSQL

---

<a name="ukrainian"></a>

## Адміністративна панель E-Pharmacy

### Огляд

Адміністративна панель E-Pharmacy - це комплексний веб-додаток, розроблений для управління аптекою. Він забезпечує повне рішення для управління продуктами, замовленнями, клієнтами та постачальниками в аптечному середовищі. Панель приладів пропонує аналітику та звітність в реальному часі для прийняття рішень на основі даних.

### Функції

- **Аутентифікація користувачів** - Безпечна система входу та управління користувачами
- **Управління продуктами** - Додавання, редагування та управління фармацевтичними продуктами
- **Обробка замовлень** - Відстеження та управління замовленнями клієнтів
- **Управління клієнтами** - Ведення бази даних клієнтів та історії покупок
- **Управління постачальниками** - Управління відносинами з постачальниками та запасами
- **Аналітика в реальному часі** - Панель з ключовими показниками ефективності

### Технічний стек

**Фронтенд:**

- React 19
- TypeScript
- Apollo Client для GraphQL
- React Router
- React Hook Form
- Vite

**Бекенд:**

- NestJS
- GraphQL
- Prisma ORM
- PostgreSQL
- JWT Аутентифікація

### Початок роботи

#### Передумови

- Node.js (v16 або вище)
- npm або yarn
- База даних PostgreSQL

#### Встановлення

1. Клонуйте репозиторій

```bash
git clone https://github.com/yourusername/e-pharmacy-admin-dashboard.git
cd e-pharmacy-admin-dashboard
```

2. Налаштуйте бекенд

```bash
cd server
npm install
```

3. Налаштуйте змінні середовища

- Скопіюйте `.env.example` до `.env` і оновіть рядок підключення до бази даних

4. Ініціалізуйте базу даних

```bash
npm run prisma:migrate:dev
npm run prisma:seed
```

5. Запустіть сервер

```bash
npm run start:dev
```

6. Налаштуйте фронтенд

```bash
cd ../client
npm install
```

7. Налаштуйте фронтенд середовище

- Скопіюйте `.env.example` до `.env` і оновіть URL API, якщо потрібно

8. Запустіть клієнт

```bash
npm run dev
```

### Розгортання

Додаток можна розгорнути на різних платформах:

- **Бекенд**: Render, Heroku, AWS або будь-який сервіс хостингу Node.js
- **Фронтенд**: Vercel, Netlify або подібні сервіси статичного хостингу
- **База даних**: Будь-який провайдер PostgreSQL, як-от Supabase, AWS RDS або ElephantSQL
