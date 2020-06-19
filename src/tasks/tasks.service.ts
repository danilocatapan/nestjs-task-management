import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as faker from 'faker';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAll(): Task[] {
    return this.tasks;
  }

  create(title: string, description: string): Task {
    const task: Task = {
      id: faker.random.uuid(),
      title,
      description,
      status: TaskStatus.OPEN
    }
    
    this.tasks.push(task)
    return task;
  }
}
