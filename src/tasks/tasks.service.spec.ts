import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import * as faker from 'faker';

const mockUser = { 
  username: faker.fake.name
};

const mockTasks = {
  title: faker.lorem.word(),
  description: faker.lorem.words()
}

const mockTaskRepository = () => ({
  getTasks: jest.fn()
});

describe('TasksService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository }
      ]
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });



  describe('getTasks', () => {
    test('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue(mockTasks);
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: faker.lorem.word() };
      const result = await tasksService.getTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    })
  })
})
