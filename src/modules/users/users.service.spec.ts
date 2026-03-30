import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { FilesService } from '../files/files.service';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import { RoleEnum } from '../roles/roles.enum';
import { StatusEnum } from '../statuses/statuses.enum';
import { ApiException } from '../../utils/exceptions/api.exception';

jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest
    .fn()
    .mockImplementation((password: string) => `hashed-${password}`),
}));

describe('UsersService', () => {
  let service: UsersService;
  const userRepository = {
    create: jest.fn(),
    findManyWithPagination: jest.fn(),
    findById: jest.fn(),
    findByIds: jest.fn(),
    findByEmail: jest.fn(),
    findBySocialIdAndProvider: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const filesService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: userRepository,
        },
        {
          provide: FilesService,
          useValue: filesService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create user with hashed password and normalized relations', async () => {
      const dto = {
        email: 'user@example.com',
        password: 'secret',
        firstName: 'John',
        lastName: 'Doe',
        role: { id: RoleEnum.user },
        status: { id: StatusEnum.active },
      };
      const createdUser = {
        id: 1,
        email: dto.email,
      };

      userRepository.findByEmail.mockResolvedValue(null);
      filesService.findById.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(createdUser);

      const result = await service.create(dto as any);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: dto.email,
          password: 'hashed-secret',
          role: { id: dto.role.id },
          status: { id: dto.status.id },
          provider: AuthProvidersEnum.email,
        }),
      );
      expect(result).toEqual(createdUser);
    });

    it('should throw when email already exists', async () => {
      const dto = {
        email: 'existing@example.com',
        password: 'secret',
        firstName: 'John',
        lastName: 'Doe',
      };
      userRepository.findByEmail.mockResolvedValue({ id: 1 });

      await expect(service.create(dto as any)).rejects.toBeInstanceOf(
        ApiException,
      );
    });
  });

  describe('update', () => {
    it('should hash password when updating existing user', async () => {
      const id = '1';
      const dto = {
        password: 'new-secret',
      };

      userRepository.findById.mockResolvedValue({ id, password: 'old' });
      userRepository.update.mockResolvedValue({ id });

      const result = await service.update(id, dto as any);

      expect(userRepository.update).toHaveBeenCalledWith(
        id,
        expect.objectContaining({
          password: 'hashed-new-secret',
        }),
      );
      expect(result).toEqual({ id });
    });

    it('should throw when updating email that belongs to another user', async () => {
      const id = '1';
      const dto = {
        email: 'taken@example.com',
      };

      userRepository.findByEmail.mockResolvedValue({ id: '2' });

      await expect(service.update(id, dto as any)).rejects.toBeInstanceOf(
        ApiException,
      );
    });
  });

  describe('remove', () => {
    it('should delegate removal to repository', async () => {
      const id = '123';
      userRepository.remove.mockResolvedValue(undefined);

      await service.remove(id as any);

      expect(userRepository.remove).toHaveBeenCalledWith(id);
    });
  });
});
