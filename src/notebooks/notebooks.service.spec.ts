import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksService } from './notebooks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notebook } from './entities/notebook.entity';
import { NotFoundException } from '@nestjs/common';

describe('NotebooksService', () => {
  let service: NotebooksService;

  // Mock del repositorio que simula una conexión real a la base de datos
  const mockRepo = {
    find: jest.fn().mockResolvedValue([{ id: 1, title: 'Test', content: '' }]),
    findOneBy: jest.fn().mockResolvedValue({ id: 1, title: 'Test', content: '' }),
     create: jest.fn().mockImplementation(dto => ({ id: 2, ...dto })),
    save: jest.fn().mockImplementation(entity => entity),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotebooksService,
        { provide: getRepositoryToken(Notebook), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<NotebooksService>(NotebooksService);
  });
  // test 

  it('debería devolver una lista de notebooks', async () => {
    const result = await service.findAll();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('debería crear y devolver un nuevo notebook', async () => {
    const newNotebook = { title: 'Nueva Nota', content: 'Contenido' };
    const created = await service.create(newNotebook);
    // El mock crea el objeto, por lo que esperamos que el id se mantenga en 2
    expect(created.id).toBe(2); 
    expect(created.title).toBe('Nueva Nota');
  }, 1000); // Añadido el timeout

  it('debería actualizar y devolver un notebook', async () => {
    const updatedNotebook = { title: 'Lista actualizada' };
    const result = await service.update(1, updatedNotebook);
    expect(result.id).toBe(1);
    expect(result.title).toBe('Lista actualizada');
  });

  it('debería eliminar un notebook', async () => {
    const result = await service.remove(1);
    expect(result.affected).toBe(1);
  });

  // En caso de no encontrar notebook 
  it('debería lanzar una excepción si el notebook no es encontrado', async () => {
    // Configura el mock para que devuelva 'null' para esta prueba específica
    jest.spyOn(mockRepo, 'findOneBy').mockResolvedValue(null);

    // Espera que la promesa sea rechazada y lance la excepción.
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });
});