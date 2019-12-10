## CLI

`npm install -g @nest/cli`
asuming "tasks" is the module name pleasae see examples of how to use the cli

### generate module with cli

`nest g module tasks`

### generate controller with cli

`nest g controller tasks --no-spec`

### generate service with cli

`nest g service tasks --no-spec`

- add the service to the controller

```typescript
@Controller("tasks")
export class TasksController {
  constructor(private taskService: TasksService) {}
}
```

- add method to the service

```typescript
 private tasks = [];
  getAllTasks() {
    return this.tasks;
  }
```

- add method to the controller

```typescript
@Controller("tasks")
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getAllTasks() {
    return this.taskService.getAllTasks();
  }
}
```

### define a model/interface

under tasks folder
`mkdir tasks.model.ts`

```typescript
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export enum TaskStatus {
  Open = "OPEN",
  InProgress = "INPROGRESS",
  DONE = "DONE",
}
```

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
