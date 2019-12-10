import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "reflect-metadata";
import { Logger } from "@nestjs/common";
// const PORT = process.env.PORT || 8000;

import * as config from "config";
const allowedOrigins = ["http://localhost:3000"];

async function bootstrap() {
  const serverConfig = config.get("server");
  const logger = new Logger("main|bootstrap");
  const port = process.env.PORT || serverConfig.port;
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV !== "production") {
    app.enableCors();
    logger.debug("Cors is enabled for all");
  } else {
    app.enableCors({ origin: allowedOrigins });
    logger.debug(
      `Cors is enabled for all ${JSON.stringify(allowedOrigins, null, 2)}`,
    );
  }
  await app.listen(port);
  logger.log(`Server Running on http://localhost:${port}`);
}
bootstrap();
