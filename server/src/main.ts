import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Fix the CORS configuration
  app.enableCors({
    origin: "http://localhost:5173", // Exact origin instead of wildcard
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  console.log("Starting server on port 3001...");
  await app.listen(3001);
  console.log("Server running on port 3001");
}
bootstrap().catch((error) => {
  console.error("Server failed to start:", error);
});
