import { Request, Response } from 'express';
import { readdir, unlink } from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import { read } from 'jimp';

import { AuthToken, Validate, check } from '../services';
import { Avatar, User } from '../../storage';
import { AvatarInfo, AvatarAddRequest } from '../interfaces/avatar.interface';
import { Controller, Get, Post } from './controller';
import { ApiErrorEnum } from '../common/errors';
import { config } from '../../config';
import {Transaction, TransactionManager, EntityManager} from 'typeorm';

export class Avatars extends Controller {

  @Get('/list/:id?')
  @AuthToken()
  public async onList(req: Request, res: Response) {
    const userId: number = parseInt(req.params.id, 10) || req.body.userId;
    const user = await User.findOne(userId, { relations: ['avatars'] });

    if (user === undefined) {
      res.send({error: ApiErrorEnum.PROFILE_INVALID});
      return;
    }

    const avatars: AvatarInfo[] = user.avatars.map(avatar => ({
      id: avatar.id,
      name: avatar.name,
      fileName: avatar.fileName
    }));

    res.send({ok: true, avatars});
  }

  @Get('/get/:id')
  @AuthToken()
  public async onGet(req: Request, res: Response) {
    const avatarId: number = parseInt(req.params.id, 10);
    const avatar = await Avatar.findOne(avatarId);
    if (avatar === undefined) {
      res.send({error: ApiErrorEnum.AVATAR_INVALID});
      return;
    }
    const avatarInfo: AvatarInfo = {
      id: avatar.id,
      name: avatar.name,
      fileName: avatar.fileName
    };
    res.send({ok: true, avatar: avatarInfo});
  }

  @Post('/find')
  @AuthToken()
  @Validate({
    id: check().isNumber(),
    name: check().minLength(3).maxLength(32)
  })
  public async onFind(req: Request, res: Response) {
    const body: { id: number, name: string } = req.body;

    const avatars = await Avatar.find({
      where: { user: { id: body.id }, name: body.name.trim() }
    });

    if (avatars.length !== 1) {
      res.send({error: ApiErrorEnum.AVATAR_INVALID});
      return;
    }
    const avatar = avatars[0];
    const avatarInfo: AvatarInfo = {
      id: avatar.id,
      name: avatar.name,
      fileName: avatar.fileName
    };
    res.send({ok: true, avatar: avatarInfo});
  }

  @Post('/add')
  @AuthToken()
  @Validate({
    name: check().minLength(3).maxLength(32),
    imageBase64: check().required()
  })
  @Transaction()
  public async onAdd(req: Request, res: Response, @TransactionManager() manager: EntityManager) {
    const body: AvatarAddRequest = req.body;

    const userId: number = req.body.userId;
    const user = await User.findOne(userId);

    if (user === undefined) {
      res.status(400);
      res.send({error: ApiErrorEnum.PROFILE_INVALID});
      return;
    }

    let avatar = new Avatar();
    avatar.name = body.name.trim();
    avatar.user = user;

    try {
      avatar.fileName = await this.createAvatarFile(body.imageBase64);
    } catch (error) {
      res.status(400);
      res.send({
        error: ApiErrorEnum.VALIDATION_INVALID_PARAM,
        param: 'imageBase64',
        message: error instanceof Error ? error.message : ''
      });
      return;
    }

    try {
      avatar = await manager.save(avatar);
      // Set default avatar, if previously not set
      if (!user.avatarFile) {
        await manager.update(User, user.id, { avatarFile: avatar.fileName });
        user.avatarFile = avatar.fileName;
        this.core.emit(c => c.onUsersUpdate([ user ]));
      }
    } catch (error) {
      res.status(400);
      res.send({error: ApiErrorEnum.NAME_DUPLICATE});
      return;
    }

    res.send({ok: true, avatar: {
      id: avatar.id,
      name: avatar.name,
      fileName: avatar.fileName
    }});
  }

  @Post('/delete')
  @AuthToken()
  @Validate({
    id: check().isNumber()
  })
  @Transaction()
  public async onDelete(req: Request, res: Response, @TransactionManager() manager: EntityManager) {
    const body: { id: number } = req.body;

    const userId: number = req.body.userId;
    const user = await User.findOne(userId, { relations: ['avatars'] });

    if (user === undefined) {
      res.status(400);
      res.send({error: ApiErrorEnum.PROFILE_INVALID});
      return;
    }

    const avatar = await Avatar.findOne(body.id, { relations: ['user'] });

    if (avatar === undefined || avatar.user.id !== user.id) {
      res.status(400);
      res.send({error: ApiErrorEnum.AVATAR_INVALID});
      return;
    }

    await this.removeAvatarFile(avatar.fileName);
    await manager.remove(avatar);

    // Set new avatar if deleted the default one
    if (user.avatarFile === avatar.fileName) {
      const newAvatar = user.avatars.find(a => a.fileName !== avatar.fileName);
      const avatarFile = newAvatar ? newAvatar.fileName : '';
      await manager.update(User, user.id, { avatarFile });
      user.avatarFile = avatarFile;
      this.core.emit(c => c.onUsersUpdate([ user ]));
    }

    res.send({ok: true});
  }

  @Post('/rename')
  @AuthToken()
  @Validate({
    id: check().isNumber(),
    name: check().minLength(3).maxLength(32),
  })
  public async onRename(req: Request, res: Response) {
    const body: { id: number, name: string } = req.body;

    const userId: number = req.body.userId;
    const user = await User.findOne(userId);

    if (user === undefined) {
      res.status(400);
      res.send({error: ApiErrorEnum.PROFILE_INVALID});
      return;
    }

    let avatar = await Avatar.findOne(body.id, { relations: ['user'] });

    if (avatar === undefined || avatar.user.id !== user.id) {
      res.status(400);
      res.send({error: ApiErrorEnum.AVATAR_INVALID});
      return;
    }

    try {
      avatar.name = body.name.trim();
      avatar = await avatar.save();
    } catch (error) {
      res.status(400);
      res.send({error: ApiErrorEnum.NAME_DUPLICATE});
      return;
    }

    res.send({ok: true, avatar: {
      id: avatar.id,
      name: avatar.name,
      fileName: avatar.fileName
    }});
  }

  @Post('/markAsDefault')
  @AuthToken()
  @Validate({
    id: check().isNumber()
  })
  public async onMarkAsDefault(req: Request, res: Response) {
    const body: { id: number, name: string } = req.body;

    const userId: number = req.body.userId;
    let user = await User.findOne(userId);

    if (user === undefined) {
      res.status(400);
      res.send({error: ApiErrorEnum.PROFILE_INVALID});
      return;
    }

    const avatar = await Avatar.findOne(body.id, { relations: ['user'] });

    if (avatar === undefined || avatar.user.id !== user.id) {
      res.status(400);
      res.send({error: ApiErrorEnum.AVATAR_INVALID});
      return;
    }

    if (user.avatarFile === avatar.fileName) {
      res.send({ ok: true });
      return;
    }

    try {
      user.avatarFile = avatar.fileName;
      user = await user.save();
      this.core.emit(c => c.onUsersUpdate([ user as User ]));
    } catch (error) {
      res.status(400);
      res.send({error: ApiErrorEnum.AVATAR_INVALID});
      return;
    }

    res.send({ ok: true });
  }

  private async removeAvatarFile(fileName: string): Promise<void> {
    const unlinkAsync = promisify(unlink);
    const path = join(config.backend.avatarsDir, fileName);
    return unlinkAsync(path);
  }

  private async createAvatarFile(imageData: string): Promise<string> {
    const base64pattern = /^data:image\/([a-zA-Z]*);base64,/;
    const base64Data = imageData.replace(base64pattern, '');
    const buf = Buffer.from(base64Data, 'base64');

    if (buf.length > config.backend.avatarFileSize) {
      throw new Error('Image size exceeded.');
    }

    const image = await read(buf);
    if (!image || !image.bitmap) {
      throw new Error('Could not decode image.');
    }

    const minSize = config.backend.avatarMinSize;
    const maxSize = config.backend.avatarMaxSize;
    if (image.bitmap.width < minSize || image.bitmap.height < minSize
      || image.bitmap.width > maxSize || image.bitmap.height > maxSize) {
      throw new Error('Invalid image size');
    }

    const extension = image.getExtension();
    const readDirAsync = promisify(readdir);
    const files: string[] = await readDirAsync(config.backend.avatarsDir);
    let num = Math.round(10000 * Math.random());
    let fileName: string;
    let maxRetries = 1000;
    do {
      num++;
      if (num >= 10000) {
        num = 0;
      }
      maxRetries--;
      if (maxRetries === 0) {
        throw new Error('Could not generate a file name.');
      }
      fileName = String(num).padStart(5, '0') + '.' + extension;
    } while (files.includes(fileName));

    await image.writeAsync(join(config.backend.avatarsDir, fileName));
    return fileName;
  }

}
