import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import * as faker from 'faker';
import { NotFoundException } from '@nestjs/common';

const mockUser = {
  id: faker.random.number,
  username: faker.fake.name
};

const mockTask = {
  title: faker.lorem.word(),
  description: faker.lorem.words()
}

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn()
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
      taskRepository.getTasks.mockResolvedValue(mockTask);
      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: faker.lorem.word() };
      const result = await tasksService.getTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();

      expect(result).toEqual(mockTask);
    });
  });

  describe('getTaskById', () => {
    test('calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
      taskRepository.findOne.mockResolvedValue(mockTask);

      const id = faker.random.number;
      const result = await tasksService.getTaskById(id, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({ 
        where: { 
          id, 
          userId: mockUser.id
        }
      })
    });

    test('throws an error as task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTask', () => {
    test('calls taskRepository.create() and returns the result', async () => {
      taskRepository.createTask.mockResolvedValue(mockTask)

      expect(taskRepository.createTask).not.toHaveBeenCalled();

      const result = await tasksService.createTask(mockTask, mockUser);
      expect(taskRepository.createTask).toHaveBeenCalledWith(mockTask, mockUser);

      expect(result).toEqual(mockTask);
    });
  });
  
  describe('deleteTask', () => {
    test('calls taskRepository.deleteTask() to delete a task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      expect(taskRepository.delete).not.toHaveBeenCalled();

      const id = faker.random.number;
      await tasksService.deleteTask(id, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({ id, userId: mockUser.id });
    })

    test('throws an error as task could not be found', () => {
      const id = faker.random.number;
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      expect(tasksService.deleteTask(id, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTaskStatus', () => {
    test('updates a task status', async () => {
      const save = jest.fn().mockResolvedValue(true);
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save
      });

      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();

      const id = faker.random.number;
      const result = await tasksService.updateTaskStatus(id, TaskStatus.DONE, mockUser);
      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
  
});
