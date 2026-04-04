import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';

import { Question } from './domain/question';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiJSendResponse } from '../../utils/swagger-jsend.decorator';
import { AdminController } from '../../utils/decorators/api-controllers.decorator';

@AdminController('questions')
export class QuestionsAdminController {
  constructor(private readonly questionsService: QuestionsService) {}

  @ApiJSendResponse(Question)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createQuestionDto: CreateQuestionDto): Promise<Question> {
    return this.questionsService.create(createQuestionDto);
  }

  @ApiJSendResponse(Question)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: string): Promise<Question | null> {
    return this.questionsService.findOne(id);
  }

  @ApiJSendResponse(Question)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question | null> {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<{ id: string }> {
    await this.questionsService.remove(id);
    return { id };
  }
}
