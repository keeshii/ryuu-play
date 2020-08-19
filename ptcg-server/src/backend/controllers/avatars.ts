import { Request, Response } from 'express';
import { readdir, unlink } from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import { read } from 'jimp';

import { AuthToken, Validate, check } from '../services';
import { Avatar, User } from '../../storage';
import { AvatarInfo, AvatarAddRequest } from '../interfaces/avatar.interface';
import { Controller, Get, Post } from './controller';
import { Errors } from '../common/errors';
import { config } from '../../config';

export class Avatars extends Controller {

  @Get('/list')
  @AuthToken()
  public async onList(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const user = await User.findOne(userId, { relations: ['avatars'] });

    if (user === undefined) {
      res.send({error: Errors.PROFILE_INVALID});
      return;
    }

    const avatars: AvatarInfo[] = user.avatars.map(avatar => ({
      id: avatar.id,
      name: avatar.name,
      fileName: avatar.fileName
    }));

    res.send({ok: true, avatars});
  }

  @Post('/add')
  @AuthToken()
  @Validate({
    name: check().minLength(3).maxLength(32),
    imageBase64: check().required()
  })
  public async onAdd(req: Request, res: Response) {
    const body: AvatarAddRequest = req.body;

    const userId: number = req.body.userId;
    const user = await User.findOne(userId);

    if (user === undefined) {
      res.status(400);
      res.send({error: Errors.PROFILE_INVALID});
      return;
    }

    let avatar = new Avatar();
    avatar.name = body.name;

    try {
      avatar.fileName = await this.createAvatarFile(body.imageBase64);
    } catch (error) {
      res.status(400);
      res.send({error: Errors.VALIDATION_INVALID_PARAM, param: 'imageBase64'});
      return;
    }

    try {
      avatar = await avatar.save();
    } catch (error) {
      res.status(400);
      res.send({error: Errors.NAME_DUPLICATE});
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
  public async onDelete(req: Request, res: Response) {
    const body: { id: number } = req.body;

    const userId: number = req.body.userId;
    const user = await User.findOne(userId);

    if (user === undefined) {
      res.status(400);
      res.send({error: Errors.PROFILE_INVALID});
      return;
    }

    const avatar = await Avatar.findOne(body.id, { relations: ['user'] });

    if (avatar === undefined || avatar.user.id !== user.id) {
      res.status(400);
      res.send({error: Errors.AVATAR_INVALID});
      return;
    }

    await this.removeAvatarFile(avatar.fileName);
    await avatar.remove();

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
      res.send({error: Errors.PROFILE_INVALID});
      return;
    }

    let avatar = await Avatar.findOne(body.id, { relations: ['user'] });

    if (avatar === undefined || avatar.user.id !== user.id) {
      res.status(400);
      res.send({error: Errors.AVATAR_INVALID});
      return;
    }

    try {
      avatar.name = body.name;
      avatar = await avatar.save();
    } catch (error) {
      res.status(400);
      res.send({error: Errors.NAME_DUPLICATE});
      return;
    }

    res.send({ok: true, deck: {
      id: avatar.id,
      name: avatar.name,
      fileName: avatar.fileName
    }});
  }

  private async removeAvatarFile(fileName: string): Promise<void> {
    const unlinkAsync = promisify(unlink);
    const path = join(config.backend.avatarsDir, fileName);
    return unlinkAsync(path);
  }

  private async createAvatarFile(base64: string): Promise<string> {
    const buf = Buffer.from(base64, 'base64');
    if (buf.length > config.backend.avatarFileSize) {
      throw new Error('Image size exceeded.');
    }

    const image = await read(buf);
    if (!image || !image.bitmap) {
      throw new Error('Could not decode image.');
    }

    const minSize = config.backend.avatarMinSize;
    const maxSize = config.backend.avatarMaxSize;
    if (image.bitmap.width <= minSize || image.bitmap.height <= minSize
      || image.bitmap.width >= maxSize || image.bitmap.height >= maxSize) {
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
