import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { LoginAuthDto } from './dto/';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockLoginResponse = {
    accessToken: 'access-token-example',
    refreshToken: 'refresh-token-example',
  };

  const mockService = {
    login: jest.fn().mockResolvedValue(mockLoginResponse),
    refresh: jest.fn().mockResolvedValue(mockLoginResponse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should login and return tokens', async () => {
    const dto: LoginAuthDto = {
      email: 'testuser@gmail.com',
      password: 'password123',
    };

    const spy = jest.spyOn(service, 'login');

    const result = await controller.login(dto);
    expect(result).toEqual(mockLoginResponse);
    expect(spy).toHaveBeenCalledWith(dto);
  });
});
