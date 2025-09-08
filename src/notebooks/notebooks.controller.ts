import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { NotebooksService } from './notebooks.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';
import { Notebook } from './entities/notebook.entity';

@Controller('notebooks')
export class NotebooksController {
  constructor(private readonly notebooksService: NotebooksService) {}

  @Get()
  async findAll(): Promise<Notebook[]> {
    return this.notebooksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Notebook> {
    return this.notebooksService.findOne(+id);
  }

  @Post()
  async create(@Body() createNotebookDto: CreateNotebookDto): Promise<Notebook> {
    return this.notebooksService.create(createNotebookDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNotebookDto: UpdateNotebookDto,
  ): Promise<Notebook> {
    return this.notebooksService.update(+id, updateNotebookDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ affected: number }> {
    return this.notebooksService.remove(+id);
  }
}
