import { Controller, Get, Param,ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getById(id)
  }
}
 