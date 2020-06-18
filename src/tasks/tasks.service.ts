import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  private tasks = [];

  getAll(): string[] {
    return this.tasks;
  }
}
