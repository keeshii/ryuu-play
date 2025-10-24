import { Application, Request, Response } from 'express';
import { Messages } from './messages';
import { Core } from '../../game/core/core';
import { Storage } from '../../storage';
import { User, Message, Conversation } from '../../storage/model/index';
import { generateToken } from '../services';


describe('Messages', () => {
  let messages: Messages;
  let req: jasmine.SpyObj<Request>;
  let res: jasmine.SpyObj<Response>;
  let app: jasmine.SpyObj<Application>;
  let db: jasmine.SpyObj<Storage>;
  let core: jasmine.SpyObj<Core>;
  let validToken: string;
  let testUser: User;
  let otherUser: User;

  beforeEach(() => {
    req = jasmine.createSpyObj('Request', ['body', 'header', 'params']);
    res = jasmine.createSpyObj('Response', ['send']);
    app = jasmine.createSpyObj('Application', ['get', 'post']);
    const manager = {
      connection: {
        getRepository: jasmine.createSpy().and.returnValue({
          createQueryBuilder: jasmine.createSpy()
        })
      }
    };
    db = jasmine.createSpyObj('Storage', ['findOne', 'save'], {
      manager: manager
    });
    core = jasmine.createSpyObj('Core', ['connect', 'disconnect', 'clients']);

    testUser = new User();
    testUser.id = 1;
    testUser.name = 'testuser';
    testUser.email = 'test@example.com';

    otherUser = new User();
    otherUser.id = 2;
    otherUser.name = 'otheruser';
    otherUser.email = 'other@example.com';

    validToken = generateToken(testUser.id);
    req.header.and.returnValue(validToken);
    
    core.clients = [
        { id: 1, name: 'testuser', user: testUser} as any,
        { id: 2, name: 'otheruser', user: otherUser} as any,
    ];

    messages = new Messages('/messages', app, db, core);
  });

  describe('onList', () => {
    let testMessage: Message;
    let testConversation: Conversation;
    let queryBuilder: any;

    beforeEach(() => {
      testMessage = new Message();
      testMessage.id = 1;
      testMessage.sender = testUser;
      testMessage.text = 'Hello!';
      testMessage.created = Date.now();
      testMessage.isRead = false;
      testMessage.isDeletedByUser1 = false;
      testMessage.isDeletedByUser2 = false;

      testConversation = new Conversation();
      testConversation.id = 1;
      testConversation.user1 = testUser;
      testConversation.user2 = otherUser;
      testConversation.lastMessage = testMessage;

      queryBuilder = {
        innerJoinAndSelect: jasmine.createSpy().and.returnValue({ innerJoinAndSelect: jasmine.createSpy().and.returnValue({ innerJoinAndSelect: jasmine.createSpy().and.returnValue({ innerJoinAndSelect: jasmine.createSpy().and.returnValue({
          where: jasmine.createSpy().and.returnValue({
            orWhere: jasmine.createSpy().and.returnValue({
              orderBy: jasmine.createSpy().and.returnValue({
                getManyAndCount: jasmine.createSpy().and.returnValue(Promise.resolve([[testConversation], 1]))
              })
            })
          })
        }) }) }) })
      };

      (db.manager.connection.getRepository as jasmine.Spy)
        .and.returnValue({
          createQueryBuilder: jasmine.createSpy().and.returnValue(queryBuilder)
        });
    });

    it('should return user conversations', async () => {
      req.body = { userId: testUser.id };

      await messages.onList(req, res);

      expect(res.send).toHaveBeenCalledWith({
        ok: true,
        conversations: [jasmine.objectContaining({
          user1Id: testUser.id,
          user2Id: otherUser.id,
          lastMessage: {
            messageId: testMessage.id,
            senderId: testUser.id,
            created: testMessage.created,
            isRead: testMessage.isRead,
            text: testMessage.text
          }
        })],
        total: 1,
        users: [
          jasmine.objectContaining({
            userId: testUser.id,
            name: testUser.name
          }),
          jasmine.objectContaining({
            userId: otherUser.id,
            name: otherUser.name
          })
        ]
      });
    });

    it('should handle empty conversation list', async () => {
      req.body = { userId: testUser.id };
      queryBuilder.innerJoinAndSelect = jasmine.createSpy().and.returnValue({ innerJoinAndSelect: jasmine.createSpy().and.returnValue({ innerJoinAndSelect: jasmine.createSpy().and.returnValue({ innerJoinAndSelect: jasmine.createSpy().and.returnValue({
        where: jasmine.createSpy().and.returnValue({
          orWhere: jasmine.createSpy().and.returnValue({
            orderBy: jasmine.createSpy().and.returnValue({
              getManyAndCount: jasmine.createSpy().and.returnValue(Promise.resolve([[], 0]))
            })
          })
        })
      }) }) }) });

      await messages.onList(req, res);

      expect(res.send).toHaveBeenCalledWith({
        ok: true,
        conversations: [],
        total: 0,
        users: []
      });
    });
  });
});