import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Logger,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";

import { CreateTaskDto } from "./dto/createTaskDTO";
import { GetTaskFilterDto } from "./dto/getTaskFilterDto";
import { TaskStatusValidationPipe } from "./pipes/task-status-validation";
import { Task } from "./task.entity";
import { TaskStatus } from "./task-status-enum";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/decorators/getUser.decorator";
import { User } from "src/auth/user.entity";

@Controller("tasks")
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger("TasksController");
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterData: GetTaskFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User ${user.email} retreiving all tasks. Filters: ${JSON.stringify(
        filterData,
      )}`,
    );
    return this.taskService.getTasks(filterData, user);
  }

  @Get("/:id")
  getTasksById(
    @Param("id", ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(`User ${user.email} retreiving task with id: ${id}`);
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe) // this validates the data using the class validator package
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.email} creating task with title: ${createTaskDto.title}`,
    );
    return this.taskService.createTask(createTaskDto, user);
  }

  @Patch("/:id/status")
  updateTaskStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status", TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(`User ${user.email} updating status for taskId  ${id}`);
    return this.taskService.updateTaskStatus(id, status, user);
  }

  @Delete("/:id")
  deleteTask(
    @Param("id", ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<boolean> {
    this.logger.verbose(`User ${user.email} deleting task id: ${id}`);
    return this.taskService.deleteTask(id, user);
  }
}
