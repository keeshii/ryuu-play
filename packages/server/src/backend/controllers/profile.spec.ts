import { Application, Request, Response } from 'express';
import { Profile } from './profile';
import { Core } from '../../game/core/core';
import { Storage } from '../../storage';
import { User, Match } from '../../storage/model/index';
import { generateToken } from '../services';
import { ApiErrorEnum, GameWinner } from '@ptcg/common';

describe('Profile', () => {
  let profile: Profile;
  let req: jasmine.SpyObj<Request>;
  let res: jasmine.SpyObj<Response>;
  let app: jasmine.SpyObj<Application>;
  let db: jasmine.SpyObj<Storage>;
  let core: jasmine.SpyObj<Core>;
  let validToken: string;
  let testUser: User;

  beforeEach(() => {
    req = jasmine.createSpyObj('Request', ['body', 'header', 'params']);
    res = jasmine.createSpyObj('Response', ['send']);
    app = jasmine.createSpyObj('Application', ['get', 'post']);
    db = jasmine.createSpyObj('Storage', ['findOne', 'save']);
    core = jasmine.createSpyObj('Core', ['connect', 'disconnect']);

    testUser = new User();
    testUser.id = 1;
    testUser.name = 'testuser';
    testUser.email = 'test@example.com';

    validToken = generateToken(testUser.id);
    req.header.and.returnValue(validToken);
    
    core.clients = [
        { id: 1, name: 'testuser', user: testUser} as any,
    ];

    profile = new Profile('/profile', app, db, core);
  });

  describe('onMe', () => {
    it('should return user profile when valid token is provided', async () => {
      spyOn(User, 'findOneById').and.returnValue(Promise.resolve(testUser));

      await profile.onMe(req, res);

      expect(User.findOneById).toHaveBeenCalledWith(testUser.id);
      expect(res.send).toHaveBeenCalledWith({
        ok: true,
        user: jasmine.objectContaining({
          userId: testUser.id,
          name: testUser.name,
          email: testUser.email
        })
      });
    });

    it('should return error when user not found', async () => {
      req.header.and.returnValue(generateToken(999));
      spyOn(User, 'findOneById').and.returnValue(Promise.resolve(null));

      await profile.onMe(req, res);

      expect(User.findOneById).toHaveBeenCalledWith(999);
      expect(res.send).toHaveBeenCalledWith({
        error: ApiErrorEnum.PROFILE_INVALID
      });
    });
  });

  describe('onGet', () => {
    it('should return user profile by id', async () => {
      req.params = { id: testUser.id.toString() };
      spyOn(User, 'findOneById').and.returnValue(Promise.resolve(testUser));

      await profile.onGet(req, res);

      expect(User.findOneById).toHaveBeenCalledWith(testUser.id);
      expect(res.send).toHaveBeenCalledWith({
        ok: true,
        user: jasmine.objectContaining({
          userId: testUser.id,
          name: testUser.name,
          email: testUser.email
        })
      });
    });

    it('should return error when user id is invalid', async () => {
      req.params = { id: '999' };
      spyOn(User, 'findOneById').and.returnValue(Promise.resolve(null));

      await profile.onGet(req, res);

      expect(User.findOneById).toHaveBeenCalledWith(999);
      expect(res.send).toHaveBeenCalledWith({
        error: ApiErrorEnum.PROFILE_INVALID
      });
    });
  });

  describe('onMatchHistory', () => {
    let testMatch: Match;

    beforeEach(() => {
      testMatch = new Match();
      testMatch.id = 1;
      testMatch.player1 = testUser;
      testMatch.player2 = new User();
      testMatch.player2.id = 2;
      testMatch.winner = GameWinner.PLAYER_1;
    });

    it('should return match history for specific user', async () => {
      req.params = { 
        userId: testUser.id.toString(),
        page: '0',
        pageSize: '10'
      };

      spyOn(Match, 'findAndCount').and.returnValue(Promise.resolve([[testMatch], 1]));

      await profile.onMatchHistory(req, res);

      expect(Match.findAndCount).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        ok: true,
        matches: [jasmine.objectContaining({
          matchId: testMatch.id,
          player1Id: testUser.id,
          player2Id: testMatch.player2.id,
          winner: GameWinner.PLAYER_1
        })],
        users: [
          jasmine.objectContaining({
            userId: testUser.id,
            name: testUser.name,
            email: testUser.email
          }),
          jasmine.objectContaining({
            userId: testMatch.player2.id,
            name: '',
            email: ''
          })
        ],
        total: 1
      });
    });

    it('should use default page size when not specified', async () => {
      req.params = { 
        userId: testUser.id.toString()
      };

      spyOn(Match, 'findAndCount').and.returnValue(Promise.resolve([[testMatch], 1]));

      await profile.onMatchHistory(req, res);

      expect(Match.findAndCount).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        ok: true,
        matches: [jasmine.objectContaining({
          matchId: testMatch.id,
          player1Id: testUser.id,
          player2Id: testMatch.player2.id,
          winner: GameWinner.PLAYER_1
        })],
        users: [
          jasmine.objectContaining({
            userId: testUser.id,
            name: testUser.name,
            email: testUser.email
          }),
          jasmine.objectContaining({
            userId: testMatch.player2.id,
            name: '',
            email: ''
          })
        ],
        total: 1
      });
    });
  });
});