import { Request, Response } from 'express';

import { AuthToken, Validate, check } from '../services';
import { CardManager, DeckAnalyser } from '@ptcg/common';
import { Controller, Get, Post } from './controller';
import { DeckSaveRequest } from '@ptcg/common';
import { ApiErrorEnum } from '@ptcg/common';
import { User, Deck } from '../../storage';

export class Decks extends Controller {

  @Get('/list')
  @AuthToken()
  public async onList(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const user = await User.findOne({ where: { id: userId }, relations: ['decks'] });

    if (user === null) {
      res.send({error: ApiErrorEnum.PROFILE_INVALID});
      return;
    }

    const decks = user.decks.map(deck => ({
      id: deck.id,
      name: deck.name,
      isValid: deck.isValid,
      formatNames: JSON.parse(deck.formatNames),
      cardTypes: JSON.parse(deck.cardTypes)
    }));

    res.send({ok: true, decks});
  }

  @Get('/get/:id')
  @AuthToken()
  public async onGet(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const deckId: number = parseInt(req.params.id, 10);
    const entity = await Deck.findOne({ where: { id: deckId }, relations: ['user'] });

    if (entity === null || entity.user.id !== userId) {
      res.send({error: ApiErrorEnum.DECK_INVALID});
      return;
    }

    const deck = {
      id: entity.id,
      name: entity.name,
      isValid: entity.isValid,
      formatNames: JSON.parse(entity.formatNames),
      cardTypes: JSON.parse(entity.cardTypes),
      cards: JSON.parse(entity.cards)
    };

    res.send({ok: true, deck});
  }

  @Post('/save')
  @AuthToken()
  @Validate({
    name: check().minLength(3).maxLength(32),
    cards: check().required()
  })
  public async onSave(req: Request, res: Response) {
    const body: DeckSaveRequest = req.body;

    // optional id parameter, without ID new deck will be created
    if (body.id !== undefined && typeof body.id !== 'number') {
      res.status(400);
      res.send({error: ApiErrorEnum.VALIDATION_INVALID_PARAM, param: 'id'});
      return;
    }

    // check if all cards exist in our database
    if (!this.validateCards(body.cards)) {
      res.status(400);
      res.send({error: ApiErrorEnum.VALIDATION_INVALID_PARAM, param: 'cards'});
      return;
    }

    const userId: number = req.body.userId;
    const user = await User.findOneById(userId);

    if (user === null) {
      res.status(400);
      res.send({error: ApiErrorEnum.PROFILE_INVALID});
      return;
    }

    let deck = body.id !== undefined
      ? await Deck.findOne({ where: { id: body.id }, relations: ['user'] })
      : (() => { const d = new Deck(); d.user = user; return d; })();

    if (deck === null || deck.user.id !== user.id) {
      res.status(400);
      res.send({error: ApiErrorEnum.DECK_INVALID});
      return;
    }

    const deckUtils = new DeckAnalyser(body.cards);
    deck.name = body.name.trim();
    deck.cards = JSON.stringify(body.cards);
    deck.isValid = deckUtils.isValid();
    deck.formatNames = JSON.stringify(deckUtils.getDeckFormats().map(f => f.name));
    deck.cardTypes = JSON.stringify(deckUtils.getDeckType());

    try {
      deck = await deck.save();
    } catch (error) {
      res.status(400);
      res.send({error: ApiErrorEnum.NAME_DUPLICATE});
      return;
    }

    res.send({ok: true, deck: {
      id: deck.id,
      name: deck.name,
      cards: body.cards
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
    const user = await User.findOneById(userId);

    if (user === null) {
      res.status(400);
      res.send({error: ApiErrorEnum.PROFILE_INVALID});
      return;
    }

    const deck = await Deck.findOne({ where: { id: body.id }, relations: ['user'] });

    if (deck === null || deck.user.id !== user.id) {
      res.status(400);
      res.send({error: ApiErrorEnum.DECK_INVALID});
      return;
    }

    await deck.remove();

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
    const user = await User.findOneById(userId);

    if (user === null) {
      res.status(400);
      res.send({error: ApiErrorEnum.PROFILE_INVALID});
      return;
    }

    let deck = await Deck.findOne({ where: { id: body.id }, relations: ['user'] });

    if (deck === null || deck.user.id !== user.id) {
      res.status(400);
      res.send({error: ApiErrorEnum.DECK_INVALID});
      return;
    }

    try {
      deck.name = body.name.trim();
      deck = await deck.save();
    } catch (error) {
      res.status(400);
      res.send({error: ApiErrorEnum.NAME_DUPLICATE});
      return;
    }

    res.send({ok: true, deck: {
      id: deck.id,
      name: deck.name
    }});
  }

  @Post('/duplicate')
  @AuthToken()
  @Validate({
    id: check().isNumber(),
    name: check().minLength(3).maxLength(32),
  })
  public async onDuplicate(req: Request, res: Response) {
    const body: any = req.body;

    const userId: number = req.body.userId;
    const user = await User.findOneById(userId);

    if (user === null) {
      res.status(400);
      res.send({error: ApiErrorEnum.PROFILE_INVALID});
      return;
    }

    const deck = await Deck.findOne({ where: { id: body.id }, relations: ['user'] });

    if (deck === null || deck.user.id !== user.id) {
      res.status(400);
      res.send({error: ApiErrorEnum.DECK_INVALID});
      return;
    }

    delete body.id;
    body.cards = JSON.parse(deck.cards);
    return this.onSave(req, res);
  }

  private validateCards(deck: string[]) {
    if (!(deck instanceof Array)) {
      return false;
    }

    const cardManager = CardManager.getInstance();
    for (let i = 0; i < deck.length; i++) {
      if (typeof deck[i] !== 'string' || !cardManager.isCardDefined(deck[i])) {
        return false;
      }
    }

    return true;
  }

}
