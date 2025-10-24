import { TestBed } from '@angular/core/testing';
import { ApiService } from '../api.service';
import { AvatarService } from './avatar.service';
import { of } from 'rxjs';
import { Response } from '../interfaces/response.interface';
import { AvatarListResponse, AvatarResponse } from '../interfaces/avatar.interface';


describe('AvatarService', () => {
  let service: AvatarService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockListResponse: AvatarListResponse = {
    avatars: [
      { id: 1, name: 'avatar1', fileName: '' },
      { id: 2, name: 'avatar2', fileName: '' }
    ],
    ok: 0
  };

  const mockAvatarResponse: AvatarResponse = {
    avatar: { id: 1, name: 'avatar1', fileName: '' },
    ok: 0
  };

  const mockResponse: Response = {
    ok: 0
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['get', 'post']);
    TestBed.configureTestingModule({
      providers: [
        AvatarService,
        { provide: ApiService, useValue: spy }
      ]
    });
    service = TestBed.inject(AvatarService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getList', () => {
    it('should get avatar list without userId', (done) => {
      apiServiceSpy.get.and.returnValue(of(mockListResponse));

      service.getList().subscribe(response => {
        expect(response).toEqual(mockListResponse);
        done();
      });

      expect(apiServiceSpy.get).toHaveBeenCalledWith('/v1/avatars/list');
    });

    it('should get avatar list with userId', (done) => {
      apiServiceSpy.get.and.returnValue(of(mockListResponse));
      const userId = 123;

      service.getList(userId).subscribe(response => {
        expect(response).toEqual(mockListResponse);
        done();
      });

      expect(apiServiceSpy.get).toHaveBeenCalledWith('/v1/avatars/list/' + userId);
    });
  });

  describe('find', () => {
    it('should find avatar by userId and name', (done) => {
      apiServiceSpy.post.and.returnValue(of(mockAvatarResponse));
      const userId = 123;
      const name = 'test';

      service.find(userId, name).subscribe(response => {
        expect(response).toEqual(mockAvatarResponse);
        done();
      });

      expect(apiServiceSpy.post).toHaveBeenCalledWith('/v1/avatars/find', {
        id: userId,
        name
      });
    });
  });

  describe('addAvatar', () => {
    it('should add new avatar', (done) => {
      apiServiceSpy.post.and.returnValue(of(mockAvatarResponse));
      const name = 'test';
      const imageBase64 = 'base64string';

      service.addAvatar(name, imageBase64).subscribe(response => {
        expect(response).toEqual(mockAvatarResponse);
        done();
      });

      expect(apiServiceSpy.post).toHaveBeenCalledWith('/v1/avatars/add', {
        name,
        imageBase64
      });
    });
  });

  describe('deleteAvatar', () => {
    it('should delete avatar', (done) => {
      apiServiceSpy.post.and.returnValue(of(mockResponse));
      const avatarId = 123;

      service.deleteAvatar(avatarId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      expect(apiServiceSpy.post).toHaveBeenCalledWith('/v1/avatars/delete', {
        id: avatarId
      });
    });
  });

  describe('rename', () => {
    it('should rename avatar', (done) => {
      apiServiceSpy.post.and.returnValue(of(mockAvatarResponse));
      const avatarId = 123;
      const newName = 'newName';

      service.rename(avatarId, newName).subscribe(response => {
        expect(response).toEqual(mockAvatarResponse);
        done();
      });

      expect(apiServiceSpy.post).toHaveBeenCalledWith('/v1/avatars/rename', {
        id: avatarId,
        name: newName
      });
    });
  });

  describe('markAsDefault', () => {
    it('should mark avatar as default', (done) => {
      apiServiceSpy.post.and.returnValue(of(mockResponse));
      const avatarId = 123;

      service.markAsDefault(avatarId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      expect(apiServiceSpy.post).toHaveBeenCalledWith('/v1/avatars/markAsDefault', {
        id: avatarId
      });
    });
  });
});
