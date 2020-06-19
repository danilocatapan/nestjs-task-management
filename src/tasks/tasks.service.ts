import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as faker from 'faker';
import { CreateTaskDto } from './dto/create-task-dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAll(): Task[] {
    return this.tasks;
  }

  getById(id: string): Task {
    return this.tasks.find(task => task.id === id)
  }

  create(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

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
