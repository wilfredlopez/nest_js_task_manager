import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/createTaskDTO";
import { TaskStatus } from "./task-status-enum";
import { GetTaskFilterDto } from "./dto/getTaskFilterDto";
import { User } from "src/auth/user.entity";
import { InternalServerErrorException, Logger } from "@nestjs/common";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger("TaskRepository");
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = Task.create({
      ...createTaskDto,
      status: TaskStatus.Open,
    });

    task.user = user;

    try {
      await task.save();

      // just deleting here but not saving changes. its just to not return the user info
      delete task.user;

      return task;
    } catch (error) {
      this.logger.error(
        `Failed create task for user ${user.email}. Data: ${JSON.stringify(
          createTaskDto,
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getTasks(filterData: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { search, status } = filterData;
    // query builder

    const query = this.createQueryBuilder("task");

    query.andWhere("task.user = :id", { id: user.id });

    if (status) {
      query.andWhere("task.status = :status", { status });
    }

    if (search) {
      // In Parenthesis for both arguments to be true, abd search betweeen % so it can be a partial substring search
      query.andWhere(
        "(task.description LIKE :search OR task.title LIKE :search)",
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();

      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user ${user.email}, Filters: ${JSON.stringify(
          filterData,
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
