import { AlertPrompt } from "../store/prompts/alert-prompt";
import { Prompt } from "../store/prompts/prompt";
import { PromptSerializer } from "./prompt.serializer";
import { SerializerContext } from "./serializer.interface";

describe('PromptSerializer', () => {
  let promptSerializer: PromptSerializer;
  let context: SerializerContext;

  beforeEach(() => {
    promptSerializer = new PromptSerializer();
    context = { cards: [] };
  });

  it('Should restore prompt instance', () => {
    // given
    const prompt = new AlertPrompt(1, 'message');
    // when
    const serialized = promptSerializer.serialize(prompt, context);
    const restored = promptSerializer.deserialize(serialized, context) as AlertPrompt;
    // then
    expect(restored.playerId).toEqual(1);
    expect(restored.message).toEqual('message');
    expect(restored instanceof AlertPrompt).toBeTruthy();
    expect(restored instanceof Prompt).toBeTruthy();
  });

  it('Should throw exception when unknown object type', () => {
    // given
    const serialized = { _type: 'Unknown' };
    const message = 'Unknown prompt type \'Unknown\'.';
    // then
    expect(function() {
      promptSerializer.deserialize(serialized, context)
    }).toThrowError(message)
  });

});
