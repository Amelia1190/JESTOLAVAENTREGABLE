import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksController } from './notebooks.controller';
import { NotebooksService } from './notebooks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notebook } from './entities/notebook.entity';

describe('NotebooksController (Integration)', () => {
  let controller: NotebooksController;
  let service: NotebooksService;

  const mockRepository = {
    find: jest.fn().mockResolvedValue([{ id: 1, title: 'Real' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotebooksController],
      providers: [
        NotebooksService,
        {
          provide: getRepositoryToken(Notebook),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<NotebooksController>(NotebooksController);
    service = module.get<NotebooksService>(NotebooksService);
  });

  it('el controlador debería llamar al servicio findAll para obtener notebooks', async () => {
    const serviceSpy = jest.spyOn(service, 'findAll');
    await controller.findAll();
    expect(serviceSpy).toHaveBeenCalledTimes(1);
  });
});