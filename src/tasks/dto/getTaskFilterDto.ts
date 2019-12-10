import { IsNotEmpty, IsOptional, IsIn } from "class-validator";
import { TaskStatus } from "../task-status-enum";

export class GetTaskFilterDto {
  @IsOptional()
  @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.Open])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
