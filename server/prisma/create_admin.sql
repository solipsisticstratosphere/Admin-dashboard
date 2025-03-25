-- Сначала проверяем, существует ли пользователь
DO $$
BEGIN
    IF NOT EXISTS (SELECT * FROM "public"."users" WHERE "email" = 'admin@email.com') THEN
        -- Добавляем пользователя с захешированным паролем "admin123"
        INSERT INTO "public"."users" ("email", "password", "firstName", "lastName", "createdAt", "updatedAt")
        VALUES (
            'admin@email.com', 
            '$2b$10$KcH6orw/CG32gmzx9wR0Pey/29Z1gGqADzyMQ8Gwc8H0Y9V9Tm072', 
            'Admin', 
            'User', 
            CURRENT_TIMESTAMP, 
            CURRENT_TIMESTAMP
        );
        RAISE NOTICE 'Admin user created successfully';
    ELSE
        -- Обновляем пароль существующего пользователя
        UPDATE "public"."users" 
        SET "password" = '$2b$10$KcH6orw/CG32gmzx9wR0Pey/29Z1gGqADzyMQ8Gwc8H0Y9V9Tm072'
        WHERE "email" = 'admin@email.com';
        RAISE NOTICE 'Admin user password updated';
    END IF;
END $$; 
