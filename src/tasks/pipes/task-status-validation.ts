import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { TaskStatus } from "../task-status-enum";

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuces = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.Open,
  ];
  transform(value: any, metadata: ArgumentMetadata) {
    if (this.isStatusValid(value.toUpperCase())) {
      return value.toUpperCase();
    } else {
      throw new BadRequestException(`${value} is an invalid Status`);
    }
  }

  private isStatusValid(status: any): boolean {
    const ind = this.allowedStatuces.indexOf(status);
    return ind !== -1;
  }
}
