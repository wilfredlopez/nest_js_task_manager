import { Module } from "@nestjs/common";
import { TasksModule } from "./tasks/tasks.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeormConfig } from "./db/typeorm.config";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), TasksModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
