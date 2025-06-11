import { Card } from '@ptcg/common';
import { Abra } from './abra';
import { Alakazam } from './alakazam';
import { Arcanine } from './arcanine';
import { Beedrill } from './beedrill';
import { Bill } from './bill';
import { Blastoise } from './blastoise';
import { Bulbasaur } from './bulbasaur';
import { Caterpie } from './caterpie';
import { Chansey } from './chansey';
import { Charizard } from './charizard';
import { Charmander } from './charmander';
import { Charmeleon } from './charmeleon';
import { Clefairy } from './clefairy';
import { ClefairyDoll } from './clefairy-doll';
import { ComputerSearch } from './computer-search';
import { Defender } from './defender';
import { DevolutionSpray } from './devolution-spray';
import { Dewgong } from './dewgong';
import { Diglett } from './diglett';
import { Doduo } from './doduo';
import { DoubleColorlessEnergy } from './double-colorless-energy';
import { Dragonair } from './dragonair';
import { Dratini } from './dratini';
import { Drowzee } from './drowzee';
import { Dugtrio } from './dugtrio';
import { Electabuzz } from './electabuzz';
import { Electrode } from './electrode';
import { EnergyRemoval } from './energy-removal';
import { EnergyRetrieval } from './energy-retrieval';
import { Farfetchd } from './farfetchd';
import { FightingEnergy } from './fighting-energy';
import { FireEnergy } from './fire-energy';
import { FullHeal } from './full-heal';
import { Gastly } from './gastly';
import { GrassEnergy } from './grass-energy';
import { Growlithe } from './growlithe';
import { GustOfWind } from './gust-of-wind';
import { Gyarados } from './gyarados';
import { Haunter } from './haunter';
import { Hitmonchan } from './hitmonchan';
import { ImpostorProfessorOak } from './impostor-professor-oak';
import { ItemFinder } from './item-finder';
import { Ivysaur } from './ivysaur';
import { Jynx } from './jynx';
import { Kadabra } from './kadabra';
import { Kakuna } from './kakuna';
import { Koffing } from './koffing';
import { Lass } from './lass';
import { LightningEnergy } from './lightning-energy';
import { Machamp } from './machamp';
import { Machoke } from './machoke';
import { Machop } from './machop';
import { Magikarp } from './magikarp';
import { Magmar } from './magmar';
import { Magnemite } from './magnemite';
import { Magneton } from './magneton';
import { Maintenance } from './maintenance';
import { Metapod } from './metapod';
import { Mewtwo } from './mewtwo';
import { Nidoking } from './nidoking';
import { NidoranMale } from './nidoran-male';
import { Nidorino } from './nidorino';
import { Ninetales } from './ninetales';
import { Onix } from './onix';
import { Pidgeotto } from './pidgeotto';
import { Pidgey } from './pidgey';
import { Pikachu } from './pikachu';
import { Pluspower } from './pluspower';
import { Pokedex } from './pokedex';
import { PokemonBreeder } from './pokemon-breeder';
import { PokemonCenter } from './pokemon-center';
import { PokemonFlute } from './pokemon-flute';
import { PokemonTrader } from './pokemon-trader';
import { Poliwag } from './poliwag';
import { Poliwhirl } from './poliwhirl';
import { Poliwrath } from './poliwrath';
import { Ponyta } from './ponyta';
import { Porygon } from './porygon';
import { Potion } from './potion';
import { ProfessorOak } from './professor-oak';
import { PsychicEnergy } from './psychic-energy';
import { Raichu } from './raichu';
import { Raticate } from './raticate';
import { Rattata } from './rattata';
import { Revive } from './revive';
import { Sandshrew } from './sandshrew';
import { ScoopUp } from './scoop-up';
import { Seel } from './seel';
import { Squirtle } from './squirtle';
import { Starmie } from './starmie';
import { Staryu } from './staryu';
import { SuperEnergyRemoval } from './super-energy-removal';
import { SuperPotion } from './super-potion';
import { Switch } from './switch';
import { Tangela } from './tangela';
import { Venusaur } from './venusaur';
import { Voltorb } from './voltorb';
import { Vulpix } from './vulpix';
import { Wartortle } from './wartortle';
import { WaterEnergy } from './water-energy';
import { Weedle } from './weedle';
import { Zapdos } from './zapdos';

export const setBase: Card[] = [
  new Abra(),
  new Alakazam(),
  new Arcanine(),
  new Beedrill(),
  new Bill(),
  new Blastoise(),
  new Bulbasaur(),
  new Caterpie(),
  new Chansey(),
  new Charizard(),
  new Charmander(),
  new Charmeleon(),
  new Clefairy(),
  new ClefairyDoll(),
  new ComputerSearch(),
  new Defender(),
  new DevolutionSpray(),
  new Dewgong(),
  new Diglett(),
  new Doduo(),
  new DoubleColorlessEnergy(),
  new Dragonair(),
  new Dratini(),
  new Drowzee(),
  new Dugtrio(),
  new Electabuzz(),
  new Electrode(),
  new EnergyRemoval(),
  new EnergyRetrieval(),
  new Farfetchd(),
  new FightingEnergy(),
  new FireEnergy(),
  new FullHeal(),
  new Gastly(),
  new GrassEnergy(),
  new Growlithe(),
  new GustOfWind(),
  new Gyarados(),
  new Haunter(),
  new Hitmonchan(),
  new ImpostorProfessorOak(),
  new ItemFinder(),
  new Ivysaur(),
  new Jynx(),
  new Kadabra(),
  new Kakuna(),
  new Koffing(),
  new Lass(),
  new LightningEnergy(),
  new Machamp(),
  new Machoke(),
  new Machop(),
  new Magikarp(),
  new Magmar(),
  new Magnemite(),
  new Magneton(),
  new Maintenance(),
  new Metapod(),
  new Mewtwo(),
  new Nidoking(),
  new NidoranMale(),
  new Nidorino(),
  new Ninetales(),
  new Onix(),
  new Pidgeotto(),
  new Pidgey(),
  new Pikachu(),
  new Pluspower(),
  new Pokedex(),
  new PokemonBreeder(),
  new PokemonCenter(),
  new PokemonFlute(),
  new PokemonTrader(),
  new Poliwag(),
  new Poliwhirl(),
  new Poliwrath(),
  new Ponyta(),
  new Porygon(),
  new Potion(),
  new ProfessorOak(),
  new PsychicEnergy(),
  new Raichu(),
  new Raticate(),
  new Rattata(),
  new Revive(),
  new Sandshrew(),
  new ScoopUp(),
  new Seel(),
  new Squirtle(),
  new Starmie(),
  new Staryu(),
  new SuperEnergyRemoval(),
  new SuperPotion(),
  new Switch(),
  new Tangela(),
  new Venusaur(),
  new Voltorb(),
  new Vulpix(),
  new Wartortle(),
  new WaterEnergy(),
  new Weedle(),
  new Zapdos(),
];
