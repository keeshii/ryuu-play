import { AttackEffect, Effect, Player, PokemonCard, State, StoreLike, TrainerCard, TrainerEffect } from '@ptcg/common';


export type CommonAttack<T extends unknown[] = []> = (
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) => {
  use: (attackEffect: AttackEffect, ...params: T) => State
};


export type CommonMarker<T extends unknown[] = []> = (
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) => {
  setMarker: (playerEffect: Effect & { player: Player }, ...params: T) => void,
  hasMarker: (playerEffect: Effect & { player: Player }, ...params: T) => boolean,
};


export type CommonTrainer<T extends unknown[] = []> = (
  self: TrainerCard,
  store: StoreLike,
  state: State,
  effect: Effect
) => {
  playCard: (trainerEffect: TrainerEffect, ...params: T) => State
};
