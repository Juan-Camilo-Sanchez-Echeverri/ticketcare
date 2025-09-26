import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(async () => {
    usersService = {
      findOneBy: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return access and refresh tokens when credentials are valid', async () => {
      const loginDto = { email: 'test@gmail.com', password: 'plain' };
      const hashedPassword = await bcrypt.hash('plain', 10);
      const mockUser = {
        _id: 'user1',
        password: hashedPassword,
        roles: ['user'],
        institution: { _id: 'inst1' },
      };

      usersService.findOneBy!.mockResolvedValue(mockUser);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync!.mockResolvedValueOnce('access_token');
      jwtService.signAsync!.mockResolvedValueOnce('refresh_token');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
      expect(usersService.findOneBy).toHaveBeenCalledWith({
        email: 'test@gmail.com',
      });
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      usersService.findOneBy!.mockResolvedValue(null);

      await expect(
        service.login({ email: 'test@gmail.com', password: 'plain' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const mockUser = { password: 'hashed' };
      usersService.findOneBy!.mockResolvedValue(mockUser);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@gmail.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('should return new access token if refresh token is valid', async () => {
      const mockUser = {
        _id: 'user1',
        roles: ['user'],
        institution: { _id: 'inst1' },
      };

      jwtService.verifyAsync!.mockResolvedValue({ sub: 'user1' });
      usersService.findOneBy!.mockResolvedValue(mockUser);
      jwtService.signAsync!.mockResolvedValue('new_access_token');

      const result = await service.refresh('valid_refresh_token');

      expect(jwtService.verifyAsync).toHaveBeenCalledWith(
        'valid_refresh_token',
      );
      expect(usersService.findOneBy).toHaveBeenCalledWith({ _id: 'user1' });
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: mockUser._id,
          roles: mockUser.roles,
          institution: mockUser.institution._id,
        },
        { expiresIn: '1h' },
      );
      expect(result).toEqual({ accessToken: 'new_access_token' });
    });

    it('should throw UnauthorizedException if user not found during refresh', async () => {
      jwtService.verifyAsync!.mockResolvedValue({ sub: 'user1' });
      usersService.findOneBy!.mockResolvedValue(null);

      await expect(service.refresh('token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
