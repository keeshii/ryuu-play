import { SimpleTacticList } from './simple-tactics/simple-tactics';
import { PromptResolverList } from './prompt-resolver/prompt-resolver';
import { AttachEnergyTactic } from './simple-tactics/attach-energy-tactic';
import { AttachToolTactic } from './simple-tactics/attach-tool-tactic';
import { AttackTactic } from './simple-tactics/attack-tactic';
import { RetreatTactic } from './simple-tactics/retreat-tactic';
import { EvolveTactic } from './simple-tactics/evolve-tactic';
import { PlayBasicTactic } from './simple-tactics/play-basic-tactic';
import { PlayStadiumTactic } from './simple-tactics/play-stadium-tactic';
import { PlaySupporterTactic } from './simple-tactics/play-supporter-tactic';
import { PlayTrainerTactic } from './simple-tactics/play-trainer-tactic';
import { UseAbilityTactic } from './simple-tactics/use-ability-tactic';
import { UseStadiumTactic } from './simple-tactics/use-stadium-tactic';
import { AlertPromptResolver } from './prompt-resolver/alert-prompt-resolver';
import { AttachEnergyPromptResolver } from './prompt-resolver/attach-energy-prompt-resolver';
import { ChooseCardsPromptResolver } from './prompt-resolver/choose-cards-prompt-resolver';
import { ChooseEnergyPromptResolver } from './prompt-resolver/choose-energy-prompt-resolver';
import { ChoosePokemonPromptResolver } from './prompt-resolver/choose-pokemon-prompt-resolver';
import { ChoosePrizePromptResolver } from './prompt-resolver/choose-prize-prompt-resolver';
import { ConfirmPromptResolver } from './prompt-resolver/confirm-prompt-resolver';
import { OrderCardsPromptResolver } from './prompt-resolver/order-cards-prompt-resolver';
import { SelectPromptResolver } from './prompt-resolver/select-prompt-resolver';

export const allPromptResolvers: PromptResolverList = [
  AlertPromptResolver,
  AttachEnergyPromptResolver,
  ChooseCardsPromptResolver,
  ChooseEnergyPromptResolver,
  ChoosePokemonPromptResolver,
  ChoosePrizePromptResolver,
  ConfirmPromptResolver,
  OrderCardsPromptResolver,
  SelectPromptResolver
];

export const allSimpleTactics: SimpleTacticList = [
  EvolveTactic,
  PlayBasicTactic,
  AttachEnergyTactic,
  AttachToolTactic,
  PlayTrainerTactic,
  PlayStadiumTactic,
  PlaySupporterTactic,
  UseAbilityTactic,
  UseStadiumTactic,
  RetreatTactic,
  AttackTactic
];
