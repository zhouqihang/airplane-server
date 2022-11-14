import { Test, TestingModule } from '@nestjs/testing';
import { PageConfigsController } from './page-configs.controller';
import { PageConfigsService } from './page-configs.service';

describe('PageConfigsController', () => {
  let controller: PageConfigsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PageConfigsController],
      providers: [PageConfigsService],
    }).compile();

    controller = module.get<PageConfigsController>(PageConfigsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
