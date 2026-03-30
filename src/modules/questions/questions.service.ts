import { Injectable } from '@nestjs/common';
import { QuestionRepository } from './infrastructure/persistence/question.repository';
import { Question } from './domain/question';
import { IPaginationOptions } from '../../utils/types/pagination-options';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    return this.questionRepository.create(createQuestionDto as Question);
  }

  async findAll({
    paginationOptions,
    tryoutId,
    search,
  }: {
    paginationOptions: IPaginationOptions;
    tryoutId?: string;
    search?: string;
  }): Promise<[Question[], number]> {
    return this.questionRepository.findAllWithPagination({
      paginationOptions,
      tryoutId,
      search,
    });
  }

  async findOne(id: Question['id']): Promise<Question | null> {
    return this.questionRepository.findById(id);
  }

  async update(
    id: Question['id'],
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question | null> {
    return this.questionRepository.update(id, updateQuestionDto as Question);
  }

  async remove(id: Question['id']): Promise<void> {
    await this.questionRepository.remove(id);
  }
}
