import { Test, TestingModule } from '@nestjs/testing';
import { PageConfigsService } from './page-configs.service';

describe('PageConfigsService', () => {
  let service: PageConfigsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PageConfigsService],
    }).compile();

    service = module.get<PageConfigsService>(PageConfigsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
