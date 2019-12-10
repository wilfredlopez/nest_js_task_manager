import { Injectable, NotFoundException } from "@nestjs/common";

import { CreateTaskDto } from "./dto/createTaskDTO";
import { GetTaskFilterDto } from "./dto/getTaskFilterDto";
import { TaskStatus } from "./task-status-enum";
import { TaskRepository } from "./task.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { User } from "src/auth/user.entity";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  getTasks(filterData: GetTaskFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterData, user);
  }

  // getAllTasks(): Promise<Task[]> {
  //   return this.taskRepository.find();
  // }
  // async getTaksWithFilter(filterData: GetTaskFilterDto): Promise<Task[]> {
  //   const { search, status } = filterData;

  //   return new Promise(async (resolve, _) => {
  //     let tasks = await this.getAllTasks();

  //     if (status) {
  //       tasks = tasks.filter(t => t.status === status);
  //     }

  //     if (search) {
  //       tasks = tasks.filter(
  //         t => t.title.includes(search) || t.description.includes(search),
  //       );
  //     }
  //     resolve(tasks);
  //   });
  // }
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });
    if (found) {
      return found;
    } else {
      throw new NotFoundException(`Task with id ${id} Not Found.`);
    }
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;
    await task.save();
    return task;
  }

  async deleteTask(id: number, user: User): Promise<boolean> {
    const found = await this.taskRepository.delete({ user, id });

    if (found.affected > 0) {
      return true;
    } else {
      throw new NotFoundException(`Task with id ${id} Not Found.`);
    }
  }
}
