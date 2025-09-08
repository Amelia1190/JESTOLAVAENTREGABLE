import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notebook } from './entities/notebook.entity';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';

@Injectable()
export class NotebooksService {    // MÉTODO 

  constructor(
    @InjectRepository(Notebook)
    private readonly notebookRepo: Repository<Notebook>,
  ) {}

  async findAll(): Promise<Notebook[]> {
    return this.notebookRepo.find();
  }

  async findOne(id: number): Promise<Notebook> {
    const notebook = await this.notebookRepo.findOneBy({ id });
    if (!notebook) {
      throw new NotFoundException(`Notebook ${id} no encontrado`);
    }
    return notebook;
  }

  async create(dto: CreateNotebookDto): Promise<Notebook> {
    const notebook = this.notebookRepo.create(dto);
    return this.notebookRepo.save(notebook);
  }

  async update(id: number, dto: UpdateNotebookDto): Promise<Notebook> {
    const notebook = await this.findOne(id); // reutilizamos findOne
    Object.assign(notebook, dto);
    return this.notebookRepo.save(notebook);
  }

  async remove(id: number): Promise<{ affected: number }> {
    const result = await this.notebookRepo.delete(id);
    return { affected: result.affected || 0 };
  }
}
