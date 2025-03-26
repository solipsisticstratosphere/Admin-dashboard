# E-Pharmacy Admin Dashboard - Server

[English](#english) | [Українська](#ukrainian)

<a name="english"></a>

## E-Pharmacy Admin Dashboard - Backend

### Overview

This is the backend server for the E-Pharmacy Admin Dashboard, a comprehensive system designed for managing pharmacy operations. The server provides GraphQL APIs for managing products, orders, customers, and suppliers while also handling authentication and authorization.

### Features

- **GraphQL API** - Flexible and efficient API for data operations
- **Authentication** - JWT-based authentication and authorization
- **Database ORM** - Prisma for type-safe database access
- **Data Validation** - Request validation using NestJS pipes and DTOs
- **Data Seeding** - Scripts for initializing the database with test data

### Tech Stack

- **NestJS** - Progressive Node.js framework for building server-side applications
- **GraphQL** - Query language for APIs
- **Prisma** - Next-generation ORM for Node.js and TypeScript
- **PostgreSQL** - Advanced open-source relational database
- **JWT** - JSON Web Token for secure authentication

### Project Structure

```
server/
├── prisma/                 # Prisma schema and migrations
├── src/
│   ├── auth/               # Authentication logic
│   ├── common/             # Shared utilities and decorators
│   ├── config/             # Application configuration
│   ├── customers/          # Customer management module
│   ├── dashboard/          # Dashboard data and analytics
│   ├── graphql/            # GraphQL schema and resolvers
│   ├── orders/             # Order processing module
│   ├── prisma/             # Prisma service
│   ├── products/           # Product management module
│   ├── suppliers/          # Supplier management module
│   ├── users/              # User management module
│   ├── app.module.ts       # Main application module
│   └── main.ts             # Application entry point
└── temp/                   # Temporary utility scripts
```

### Getting Started

#### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database

#### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

- Copy `.env.example` to `.env` and update the database connection string

3. Initialize the database:

```bash
npm run prisma:migrate:dev
npm run prisma:seed
```

4. Start the server:

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

### Available Scripts

- `npm run build` - Build the application
- `npm run format` - Format code with Prettier
- `npm run start` - Start the server
- `npm run start:dev` - Start in development mode (with watch)
- `npm run start:prod` - Start in production mode
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate:dev` - Run development migrations
- `npm run prisma:migrate:prod` - Run production migrations
- `npm run prisma:seed` - Seed the database

### API Documentation

The GraphQL API is available at `/graphql` when the server is running. The GraphQL Playground provides interactive documentation of all available queries and mutations.

---

<a name="ukrainian"></a>

## Адміністративна панель E-Pharmacy - Серверна частина

### Огляд

Це серверна частина Адміністративної панелі E-Pharmacy, комплексної системи, розробленої для управління аптечними операціями. Сервер надає GraphQL API для управління продуктами, замовленнями, клієнтами та постачальниками, а також забезпечує аутентифікацію та авторизацію.

### Функції

- **GraphQL API** - Гнучкий та ефективний API для операцій з даними
- **Аутентифікація** - Аутентифікація та авторизація на основі JWT
- **ORM для бази даних** - Prisma для типобезпечного доступу до бази даних
- **Валідація даних** - Валідація запитів за допомогою NestJS pipes та DTO
- **Заповнення даних** - Скрипти для ініціалізації бази даних тестовими даними

### Технічний стек

- **NestJS** - Прогресивний Node.js фреймворк для побудови серверних додатків
- **GraphQL** - Мова запитів для API
- **Prisma** - ORM нового покоління для Node.js та TypeScript
- **PostgreSQL** - Розширена реляційна база даних з відкритим кодом
- **JWT** - JSON Web Token для безпечної аутентифікації

### Структура проєкту

```
server/
├── prisma/                 # Prisma схема та міграції
├── src/
│   ├── auth/               # Логіка аутентифікації
│   ├── common/             # Спільні утиліти та декоратори
│   ├── config/             # Конфігурація додатку
│   ├── customers/          # Модуль управління клієнтами
│   ├── dashboard/          # Дані панелі приладів та аналітика
│   ├── graphql/            # GraphQL схема та резолвери
│   ├── orders/             # Модуль обробки замовлень
│   ├── prisma/             # Prisma сервіс
│   ├── products/           # Модуль управління продуктами
│   ├── suppliers/          # Модуль управління постачальниками
│   ├── users/              # Модуль управління користувачами
│   ├── app.module.ts       # Головний модуль додатку
│   └── main.ts             # Точка входу до додатку
└── temp/                   # Тимчасові утилітарні скрипти
```

### Початок роботи

#### Передумови

- Node.js (v16 або вище)
- npm або yarn
- База даних PostgreSQL

#### Встановлення

1. Встановіть залежності:

```bash
npm install
```

2. Налаштуйте змінні середовища:

- Скопіюйте `.env.example` до `.env` і оновіть рядок підключення до бази даних

3. Ініціалізуйте базу даних:

```bash
npm run prisma:migrate:dev
npm run prisma:seed
```

4. Запустіть сервер:

```bash
# Режим розробки
npm run start:dev

# Режим роботи
npm run start:prod
```

### Доступні скрипти

- `npm run build` - Збірка додатку
- `npm run format` - Форматування коду за допомогою Prettier
- `npm run start` - Запуск сервера
- `npm run start:dev` - Запуск у режимі розробки (з перезавантаженням)
- `npm run start:prod` - Запуск у виробничому режимі
- `npm run prisma:generate` - Створення Prisma клієнта
- `npm run prisma:migrate:dev` - Запуск міграцій для розробки
- `npm run prisma:migrate:prod` - Запуск міграцій для виробництва
- `npm run prisma:seed` - Заповнення бази даних

### Документація API

GraphQL API доступне за адресою `/graphql` при запущеному сервері. GraphQL Playground надає інтерактивну документацію всіх доступних запитів та мутацій.
