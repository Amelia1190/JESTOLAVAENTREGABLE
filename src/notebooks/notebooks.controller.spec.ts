import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksController } from './notebooks.controller';
import { NotebooksService } from './notebooks.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';

describe('NotebooksController', () => {
  let controller: NotebooksController;
  
  const mockService = {
    findAll: () => [{ id: 1, title: 'Notebook mock', content: '' }],
    findOne: (id: number) => ({ id, title: 'Notebook ' + id, content: '' }),
    create: (dto: CreateNotebookDto) => ({ id: 2, ...dto }),
    update: (id: number, dto: UpdateNotebookDto) => ({ id, ...dto }),
    remove: () => ({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotebooksController],
      providers: [NotebooksService],
    })
      .overrideProvider(NotebooksService)
      .useValue(mockService)
      .compile();

    controller = module.get<NotebooksController>(NotebooksController);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería retornar todos los notebooks', async () => {
    expect(await controller.findAll()).toHaveLength(1);
    expect(await controller.findAll()).toEqual([{ id: 1, title: 'Notebook mock', content: '' }]);
  });

  it('debería retornar un notebook por id', async () => {
    expect(await controller.findOne('1')).toEqual({ id: 1, title: 'Notebook 1', content: '' });
  });

  it('debería crear un notebook correctamente', async () => {
    const createDto = { title: 'Nuevo notebook', content: '' };
    expect(await controller.create(createDto)).toEqual({ id: 2, ...createDto });
  });

  it('debería actualizar un notebook correctamente', async () => {
    const updateDto = { title: 'Notebook actualizado' };
    expect(await controller.update('1', updateDto)).toEqual({ id: 1, ...updateDto });
  });

  it('debería eliminar un notebook correctamente', async () => {
    expect(await controller.remove('1')).toEqual({ affected: 1 });
  });
});
