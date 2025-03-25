-- Сначала очищаем все таблицы (с учетом внешних ключей)
TRUNCATE TABLE "public"."transactions" CASCADE;
TRUNCATE TABLE "public"."orders" CASCADE;
TRUNCATE TABLE "public"."customers" CASCADE;
TRUNCATE TABLE "public"."products" CASCADE;
TRUNCATE TABLE "public"."suppliers" CASCADE;
TRUNCATE TABLE "public"."users" CASCADE;

-- Создание администратора (если не существует)
INSERT INTO "public"."users" ("email", "password", "firstName", "lastName", "refreshToken", "createdAt", "updatedAt")
VALUES ('admin@email.com', '$2b$10$3DAmrzZqoZqI5r/d0LCKe.z.JHRoFdmHyCfYyDt75SMI2xG5Td8r6', 'Admin', 'User', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Импорт тестовых клиентов
INSERT INTO "public"."customers" ("photo", "name", "email", "spent", "phone", "address", "registerDate", "country")
VALUES 
  ('/static/customers/1.jpg', 'John Doe', 'john.doe@example.com', '$2,500', '+1 (234) 567-8901', '123 Main St, New York, NY', CURRENT_TIMESTAMP, 'USA'),
  ('/static/customers/2.jpg', 'Jane Smith', 'jane.smith@example.com', '$1,800', '+1 (345) 678-9012', '456 Oak Ave, Chicago, IL', CURRENT_TIMESTAMP, 'USA'),
  ('/static/customers/3.jpg', 'Michael Brown', 'michael.brown@example.com', '$3,200', '+1 (456) 789-0123', '789 Pine Rd, Los Angeles, CA', CURRENT_TIMESTAMP, 'USA'),
  ('/static/customers/4.jpg', 'Emily Davis', 'emily.davis@example.com', '$950', '+1 (567) 890-1234', '101 Elm St, Boston, MA', CURRENT_TIMESTAMP, 'USA'),
  ('/static/customers/5.jpg', 'Oleksandr Petrov', 'oleksandr.p@example.com', '$3,750', '+380 (67) 123-4567', 'Khreschatyk St, 10, Kyiv', CURRENT_TIMESTAMP, 'Ukraine'),
  ('/static/customers/6.jpg', 'Natalia Koval', 'natalia.k@example.com', '$1,600', '+380 (50) 234-5678', 'Pushkinska St, 5, Kharkiv', CURRENT_TIMESTAMP, 'Ukraine'),
  ('/static/customers/7.jpg', 'Ivan Melnyk', 'ivan.m@example.com', '$2,200', '+380 (63) 345-6789', 'Deribasivska St, 15, Odesa', CURRENT_TIMESTAMP, 'Ukraine'),
  ('/static/customers/8.jpg', 'Maria Shevchenko', 'maria.s@example.com', '$1,100', '+380 (67) 456-7890', 'Svobody Ave, 25, Lviv', CURRENT_TIMESTAMP, 'Ukraine'),
  ('/static/customers/9.jpg', 'Sergey Ivanov', 'sergey.i@example.com', '$2,900', '+7 (903) 123-4567', 'Tverskaya St, 10, Moscow', CURRENT_TIMESTAMP, 'Russia'),
  ('/static/customers/10.jpg', 'Anna Smirnova', 'anna.s@example.com', '$1,750', '+7 (911) 234-5678', 'Nevsky Prospekt, 20, St Petersburg', CURRENT_TIMESTAMP, 'Russia')
ON CONFLICT (email) DO NOTHING;

-- Импорт тестовых продуктов
INSERT INTO "public"."products" ("photo", "name", "supplier", "stock", "price", "category", "createdAt", "updatedAt")
VALUES 
  ('/static/products/product1.jpg', 'Paracetamol 500mg', 'Pfizer', '150', '$5.99', 'Analgesics', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('/static/products/product2.jpg', 'Ibuprofen 200mg', 'Bayer', '200', '$6.50', 'Analgesics', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('/static/products/product3.jpg', 'Aspirin 325mg', 'Johnson & Johnson', '180', '$4.25', 'Analgesics', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('/static/products/product4.jpg', 'Amoxicillin 500mg', 'GlaxoSmithKline', '120', '$12.75', 'Antibiotics', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('/static/products/product5.jpg', 'Azithromycin 250mg', 'Novartis', '90', '$15.50', 'Antibiotics', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('/static/products/product6.jpg', 'Ciprofloxacin 500mg', 'Roche', '75', '$18.99', 'Antibiotics', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('/static/products/product7.jpg', 'Loratadine 10mg', 'Merck', '160', '$8.25', 'Antihistamines', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('/static/products/product8.jpg', 'Cetirizine 10mg', 'AstraZeneca', '140', '$7.50', 'Antihistamines', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('/static/products/product9.jpg', 'Omeprazole 20mg', 'Sanofi', '110', '$11.25', 'Antacids', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('/static/products/product10.jpg', 'Ranitidine 150mg', 'Abbott', '95', '$9.75', 'Antacids', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("name", "supplier") DO NOTHING;

-- Импорт тестовых поставщиков
INSERT INTO "public"."suppliers" ("name", "address", "company", "date", "amount", "status", "createdAt", "updatedAt")
VALUES 
  ('Pfizer', '235 E 42nd St, New York, NY 10017', 'Pfizer Inc.', CURRENT_TIMESTAMP, '$25,000', 'Approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Johnson & Johnson', 'One Johnson & Johnson Plaza, New Brunswick, NJ 08933', 'Johnson & Johnson', CURRENT_TIMESTAMP, '$32,500', 'Approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Roche', 'Grenzacherstrasse 124, 4070 Basel, Switzerland', 'F. Hoffmann-La Roche Ltd', CURRENT_TIMESTAMP, '$28,750', 'Pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Novartis', 'Lichtstrasse 35, 4056 Basel, Switzerland', 'Novartis International AG', CURRENT_TIMESTAMP, '$21,350', 'Approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Bayer', 'Kaiser-Wilhelm-Allee, 51368 Leverkusen, Germany', 'Bayer AG', CURRENT_TIMESTAMP, '$19,800', 'Pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Импорт тестовых заказов
INSERT INTO "public"."orders" ("photo", "name", "address", "products", "price", "status", "order_date")
VALUES 
  ('/static/products/product1.jpg', 'John Doe', '123 Main St, New York, NY', 'Paracetamol 500mg x2', '$11.98', 'Delivered', '2025-03-10'),
  ('/static/products/product3.jpg', 'Emily Davis', '101 Elm St, Boston, MA', 'Aspirin 325mg x1', '$4.25', 'Shipped', '2025-03-12'),
  ('/static/products/product5.jpg', 'Oleksandr Petrov', 'Khreschatyk St, 10, Kyiv', 'Azithromycin 250mg x3', '$46.50', 'Pending', '2025-03-15'),
  ('/static/products/product7.jpg', 'Natalia Koval', 'Pushkinska St, 5, Kharkiv', 'Loratadine 10mg x2', '$16.50', 'Processing', '2025-03-18'),
  ('/static/products/product9.jpg', 'Ivan Melnyk', 'Deribasivska St, 15, Odesa', 'Omeprazole 20mg x1', '$11.25', 'Delivered', '2025-03-20');

-- Импорт тестовых транзакций
INSERT INTO "public"."transactions" ("name", "amount", "type", "email", "customerId", "createdAt")
VALUES 
  ('Purchase - Paracetamol', '$11.98', 'income', 'john.doe@example.com', (SELECT id FROM customers WHERE email = 'john.doe@example.com'), CURRENT_TIMESTAMP),
  ('Purchase - Aspirin', '$4.25', 'income', 'emily.davis@example.com', (SELECT id FROM customers WHERE email = 'emily.davis@example.com'), CURRENT_TIMESTAMP),
  ('Purchase - Azithromycin', '$46.50', 'income', 'oleksandr.p@example.com', (SELECT id FROM customers WHERE email = 'oleksandr.p@example.com'), CURRENT_TIMESTAMP),
  ('Purchase - Loratadine', '$16.50', 'income', 'natalia.k@example.com', (SELECT id FROM customers WHERE email = 'natalia.k@example.com'), CURRENT_TIMESTAMP),
  ('Purchase - Omeprazole', '$11.25', 'income', 'ivan.m@example.com', (SELECT id FROM customers WHERE email = 'ivan.m@example.com'), CURRENT_TIMESTAMP),
  ('Supplier Payment - Pfizer', '$12,500', 'expense', NULL, NULL, CURRENT_TIMESTAMP),
  ('Supplier Payment - Johnson & Johnson', '$15,000', 'expense', NULL, NULL, CURRENT_TIMESTAMP),
  ('Rent Payment', '$2,500', 'expense', NULL, NULL, CURRENT_TIMESTAMP),
  ('Utilities', '$750', 'expense', NULL, NULL, CURRENT_TIMESTAMP),
  ('Staff Salary', '$8,500', 'expense', NULL, NULL, CURRENT_TIMESTAMP); 
