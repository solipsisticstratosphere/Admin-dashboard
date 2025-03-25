# Epharmacy Dashboard Server

Серверная часть панели администратора для приложения Epharmacy.

## Требования

- Node.js >= 16
- npm >= 8
- PostgreSQL >= 13

## Настройка проекта

### Локальная разработка

1. Установите зависимости:

```bash
npm install
```

2. Скопируйте файл `.env.example` в `.env`:

```bash
cp .env.example .env
```

3. Настройте переменные окружения в `.env` файле.

4. Создайте и примените миграции базы данных:

```bash
npm run prisma:migrate:dev
```

5. Заполните базу данных начальными данными:

```bash
npm run prisma:seed
```

6. Запустите сервер в режиме разработки:

```bash
npm run start:dev
```

### Deployment на Supabase и Render

#### 1. Создание проекта в Supabase

1. Зарегистрируйтесь или войдите в [Supabase](https://supabase.com/)
2. Создайте новый проект
3. Скопируйте строку подключения (Connection string) из раздела "Settings" > "Database"

#### 2. Настройка переменных окружения для Supabase

1. Скопируйте файл `.env.example` в `.env.supabase`:

```bash
cp .env.example .env.supabase
```

2. Обновите `DATABASE_URL` в `.env.supabase` используя строку подключения из Supabase.

   - Для предотвращения проблем с IPv6, используйте строку подключения через pooler:

   ```
   DATABASE_URL=postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

3. Установите безопасные значения для JWT ключей и других секретов.

4. Настройте разрешенные IP-адреса в Supabase:
   - Перейдите в раздел "Project Settings" > "Database" > "Network Restrictions"
   - Добавьте свой IP-адрес для локальной разработки
   - Добавьте IP-адрес Render для продакшн-деплоя (можно найти в настройках инстанса)

#### 3. Миграция схемы базы данных в Supabase

```bash
npm run prisma:migrate:supabase
```

#### 4. Заполнение базы данных в Supabase

```bash
npm run prisma:seed:supabase
```

#### 5. Деплой на Render

1. Зарегистрируйтесь или войдите в [Render](https://render.com/)
2. Подключите ваш GitHub репозиторий
3. Создайте новый Web Service, указав директорию `server`
4. Установите следующие настройки:
   - Build Command: `npm ci && npx prisma generate && npm run build`
   - Start Command: `npm run start:prod`
5. Добавьте все необходимые переменные окружения:

   - `DATABASE_URL` (строка подключения из Supabase)
   - `NODE_ENV=production`
   - `PORT=8080`
   - `JWT_SECRET` и `JWT_REFRESH_SECRET`
   - `ADMIN_EDIT_PASSWORD`
   - `PROD_CLIENT_URL` (URL вашего фронтенда)

6. Дождитесь завершения деплоя

#### 6. Обновление клиентской части

В файле `.env` клиентского приложения укажите:

```
VITE_API_URL=https://your-render-service-url.onrender.com/graphql
```

## Доступные скрипты

- `npm run build` - сборка проекта
- `npm run start:dev` - запуск в режиме разработки
- `npm run start:prod` - запуск в production-режиме
- `npm run prisma:studio` - запуск Prisma Studio
- `npm run prisma:generate` - генерация Prisma клиента
- `npm run prisma:migrate:dev` - создание и применение миграций
- `npm run prisma:migrate:supabase` - применение миграций к Supabase
- `npm run prisma:seed` - заполнение локальной базы данных
- `npm run prisma:seed:supabase` - заполнение базы данных в Supabase

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
