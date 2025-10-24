import { Application, Request, Response } from 'express';
import { Login } from './login';
import { RateLimit } from '../common/rate-limit';
import { config } from '../../config';
import { Core } from '../../game/core/core';
import { Storage } from '../../storage';
import { User } from '../../storage/model/user';
import { generateToken } from '../services';

class RateLimitMock extends RateLimit {
  isLimitExceeded(ip: string): boolean {
    return false;
  }
  increment(ip: string): void {}
}

describe('Login', () => {
  let login: Login;
  let req: jasmine.SpyObj<Request>;
  let res: jasmine.SpyObj<Response>;
  let rateLimitMock: RateLimitMock;
  let app: jasmine.SpyObj<Application>;
  let db: jasmine.SpyObj<Storage>;
  let core: jasmine.SpyObj<Core>;
  let validToken: string;

  beforeEach(() => {
    req = jasmine.createSpyObj('Request', ['body', 'header']);
    res = jasmine.createSpyObj('Response', ['send', 'status']);
    app = jasmine.createSpyObj('Application', ['get', 'post']);
    db = jasmine.createSpyObj('Storage', ['findOne', 'save']);
    core = jasmine.createSpyObj('Core', ['connect', 'disconnect']);
    validToken = generateToken(1)
    rateLimitMock = new RateLimitMock();
    
    spyOn(RateLimit, 'getInstance').and.returnValue(rateLimitMock);
    login = new Login('/auth', app, db, core);
  });

  describe('onInfo', () => {
    it('should return server configuration', async () => {
      await login.onInfo(req, res);

      expect(res.send).toHaveBeenCalledWith({
        ok: true,
        config: {
          apiVersion: 4,
          defaultPageSize: config.backend.defaultPageSize,
          scansUrl: config.sets.scansUrl,
          avatarsUrl: config.backend.avatarsUrl,
          avatarFileSize: config.backend.avatarFileSize,
          avatarMinSize: config.backend.avatarMinSize,
          avatarMaxSize: config.backend.avatarMaxSize,
          replayFileSize: config.backend.replayFileSize
        }
      });
    });
  });

  describe('onLogout', () => {
    it('should return success response', async () => {
      req.header.and.returnValue(validToken);
      await login.onLogout(req, res);
      expect(res.send).toHaveBeenCalledWith({ ok: true });
    });
  });

  describe('onRegister', () => {
    let testUser: User;

    beforeEach(() => {
      req.body = {
        name: 'testuser',
        email: 'test@example.com',
        password: 'Password123!'
      };

      testUser = new User();
      testUser.id = 1;
      testUser.name = 'testuser';
      testUser.email = 'test@example.com';
    });

    it('should create a new user account', async () => {
      spyOn(User, 'findOne').and.returnValue(Promise.resolve(null)); // No existing user
      spyOn(User.prototype, 'save').and.returnValue(Promise.resolve(testUser));

      await login.onRegister(req, res, () => {});

      expect(User.findOne).toHaveBeenCalled();
      expect(User.prototype.save).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(jasmine.objectContaining({ ok: true }));
    });

    it('should fail if user already exists', async () => {
      spyOn(User, 'findOne').and.returnValue(Promise.resolve(testUser));
      spyOn(User.prototype, 'save');

      await login.onRegister(req, res, (error: any) => {
        expect(error.code).toBe('USER_ALREADY_EXISTS');
      });

      expect(User.findOne).toHaveBeenCalled();
      expect(User.prototype.save).not.toHaveBeenCalled();
    });
  });

});