import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as faker from 'faker';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAll(): Task[] {
    return this.tasks;
  }

  getWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search} = filterDto
    let tasks = this.getAll();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(task =>
        task.title.includes(search) ||
        task.description.includes(search)
      );
    }

    return tasks;
  }

  getById(id: string): Task {
    const found = this.tasks.find(task => task.id === id)

    if (!found) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    return found
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

  updateStatus(id: string, status: TaskStatus): Task {
    const task = this.getById(id);
    task.status = status;
    return task;
  }

  delete(id: string): void {
    const found = this.getById(id);
    this.tasks = this.tasks.filter(task => task.id !== found.id);
  }
}
