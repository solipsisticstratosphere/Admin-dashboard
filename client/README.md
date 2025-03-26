# E-Pharmacy Admin Dashboard - Client

[English](#english) | [Українська](#ukrainian)

<a name="english"></a>

## E-Pharmacy Admin Dashboard - Frontend

### Overview

This is the frontend application for the E-Pharmacy Admin Dashboard, a comprehensive system designed for managing pharmacy operations. The client application provides a user-friendly interface for managing products, orders, customers, and suppliers, along with interactive analytics dashboards.

### Features

- **Responsive UI** - Works on desktop, tablet, and mobile devices
- **Interactive Dashboard** - Real-time analytics and visualization
- **Product Management** - Inventory management with search and filtering
- **Order Processing** - Track and manage order statuses
- **Customer Management** - Customer profiles and purchase history
- **Authentication** - Secure login and user session management

### Tech Stack

- **React 19** - Latest version of the React library
- **TypeScript** - For type-safe code
- **Apollo Client** - GraphQL client for data fetching
- **React Router** - For application routing
- **React Hook Form** - Form validation and management
- **Vite** - Fast build tool and development server

### Project Structure

```
client/
├── public/                # Static assets
├── src/
│   ├── apollo/            # Apollo client configuration
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable UI components
│   ├── config/            # Application configuration
│   ├── context/           # React context providers
│   ├── graphql/           # GraphQL queries and mutations
│   ├── pages/             # Page components
│   ├── services/          # Service layer for API calls
│   ├── utils/             # Utility functions
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
└── vite.config.ts         # Vite configuration
```

### Getting Started

#### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

#### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

- Copy `.env.example` to `.env.development` for development or `.env.production` for production
- Update the GraphQL API endpoint URL

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build locally
- `npm run start:dev` - Start with development configuration
- `npm run start:prod` - Start with production configuration

### Deployment

The frontend application can be deployed to various platforms:

1. Build the application:

```bash
npm run build
```

2. Deploy the contents of the `dist` directory to any static hosting service like:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

---

<a name="ukrainian"></a>

## Адміністративна панель E-Pharmacy - Клієнтська частина

### Огляд

Це клієнтський додаток для Адміністративної панелі E-Pharmacy, комплексної системи, розробленої для управління аптечними операціями. Клієнтський додаток надає зручний інтерфейс для управління продуктами, замовленнями, клієнтами та постачальниками, а також інтерактивні панелі аналітики.

### Функції

- **Адаптивний інтерфейс** - Працює на комп'ютерах, планшетах та мобільних пристроях
- **Інтерактивна панель** - Аналітика та візуалізація в реальному часі
- **Управління продуктами** - Управління запасами з пошуком та фільтрацією
- **Обробка замовлень** - Відстеження та управління статусами замовлень
- **Управління клієнтами** - Профілі клієнтів та історія покупок
- **Аутентифікація** - Безпечний вхід та управління сесією користувача

### Технічний стек

- **React 19** - Найновіша версія бібліотеки React
- **TypeScript** - Для типобезпечного коду
- **Apollo Client** - GraphQL клієнт для отримання даних
- **React Router** - Для маршрутизації додатку
- **React Hook Form** - Валідація та управління формами
- **Vite** - Швидкий інструмент збірки та сервер розробки

### Структура проєкту

```
client/
├── public/                # Статичні активи
├── src/
│   ├── apollo/            # Конфігурація Apollo клієнта
│   ├── assets/            # Зображення, шрифти, тощо
│   ├── components/        # Повторно використовувані UI компоненти
│   ├── config/            # Конфігурація додатку
│   ├── context/           # Провайдери React контексту
│   ├── graphql/           # GraphQL запити та мутації
│   ├── pages/             # Компоненти сторінок
│   ├── services/          # Сервісний шар для API викликів
│   ├── utils/             # Службові функції
│   ├── main.tsx           # Точка входу додатку
│   └── index.css          # Глобальні стилі
├── index.html             # HTML шаблон
└── vite.config.ts         # Конфігурація Vite
```

### Початок роботи

#### Передумови

- Node.js (v16 або вище)
- npm або yarn

#### Встановлення

1. Встановіть залежності:

```bash
npm install
```

2. Налаштуйте змінні середовища:

- Скопіюйте `.env.example` до `.env.development` для розробки або `.env.production` для виробництва
- Оновіть URL-адресу GraphQL API

3. Запустіть сервер розробки:

```bash
npm run dev
```

4. Зберіть для виробництва:

```bash
npm run build
```

### Доступні скрипти

- `npm run dev` - Запуск сервера розробки
- `npm run build` - Збірка для виробництва
- `npm run lint` - Запуск ESLint
- `npm run preview` - Перегляд збірки виробництва локально
- `npm run start:dev` - Запуск з конфігурацією розробки
- `npm run start:prod` - Запуск з конфігурацією виробництва

### Розгортання

Клієнтський додаток можна розгорнути на різних платформах:

1. Зберіть додаток:

```bash
npm run build
```

2. Розгорніть вміст директорії `dist` на будь-якому сервісі статичного хостингу, як-от:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
