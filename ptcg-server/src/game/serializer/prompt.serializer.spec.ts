import { AlertPrompt } from '../store/prompts/alert-prompt';
import { Prompt } from '../store/prompts/prompt';
import { PromptSerializer } from './prompt.serializer';
import { SerializerContext } from './serializer.interface';
import { GameError } from '../game-error';
import { GameMessage, GameCoreError } from '../game-message';

class UnknownPrompt extends Prompt<any> {
  public readonly type = 'Unknown';
}

describe('PromptSerializer', () => {
  let promptSerializer: PromptSerializer;
  let context: SerializerContext;

  beforeEach(() => {
    promptSerializer = new PromptSerializer();
    context = { cards: [] };
  });

  it('Should restore prompt instance', () => {
    // given
    const prompt = new AlertPrompt(1, GameMessage.CHOOSE_CARD_TO_HAND);
    // when
    const serialized = promptSerializer.serialize(prompt);
    const restored = promptSerializer.deserialize(serialized, context) as AlertPrompt;
    // then
    expect(restored.playerId).toEqual(1);
    expect(restored.message).toEqual(GameMessage.CHOOSE_CARD_TO_HAND);
    expect(restored instanceof AlertPrompt).toBeTruthy();
    expect(restored instanceof Prompt).toBeTruthy();
  });

  it('Should throw exception when unknown prompt type', () => {
    // given
    const prompt = new UnknownPrompt(1);
    const message = 'Unknown prompt type \'Unknown\'.';
    // then
    expect(function() {
      promptSerializer.serialize(prompt);
    }).toThrow(new GameError(GameCoreError.ERROR_SERIALIZER, message));
  });

  it('Should throw exception when unknown object type', () => {
    // given
    const serialized = { _type: 'Unknown' };
    const message = 'Unknown prompt type \'Unknown\'.';
    // then
    expect(function() {
      promptSerializer.deserialize(serialized, context);
    }).toThrow(new GameError(GameCoreError.ERROR_SERIALIZER, message));
  });

});
