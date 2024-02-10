import { Element } from 'src/models';

export function cleanAndOrderRecipe(recipe: Element[]): string[] {
  const r = recipe.map((e) => e.name.replaceAll(' ', '').toLowerCase());
  r.sort();
  return r;
}

export enum ElementNames {
  air = 'air',
  water = 'water',
  fire = 'fire',
  earth = 'earth',
  lava = 'lava',
  rain = 'rain',
  smoke = 'smoke',
  energy = 'energy',
  steam = 'steam',
  mud = 'mud',
  pressure = 'pressure',
  life = 'life',
  dust = 'dust',
  fog = 'fog',
  wind = 'wind',
  heat = 'heat',
  ocean = 'ocean',
  pond = 'pond',
  stone = 'stone',
  ash = 'ash',
  river = 'river',
  time = 'time',
  cloud = 'cloud',
  coal = 'coal',
  metal = 'metal',
  tornado = 'tornado',
  worm = 'worm',
  hotsprings = 'hotsprings',
  sun = 'sun',
  mountain = 'mountain',
  frost = 'frost',
  swamp = 'swamp',
  clay = 'clay',
  oil = 'oil',
  fossil = 'fossil',
  sand = 'sand',
  wave = 'wave',
  seed = 'seed',
  magnet = 'magnet',
  glass = 'glass',
  snow = 'snow',
  solarpanel = 'solarpanel',
  windmill = 'windmill',
  bottle = 'bottle',
  alcohol = 'alcohol',
  gasoline = 'gasoline',
  telescope = 'telescope',
  furnace = 'furnace',
  dam = 'dam',
  storm = 'storm',
  squid = 'squid',
  nail = 'nail',
  gas = 'gas',
  paint = 'paint',
  volcano = 'volcano',
  coral = 'coral',
  sound = 'sound',
  sky = 'sky',
  tree = 'tree',
  desert = 'desert',
  fireextinguisher = 'fireextinguisher',
  plastic = 'plastic',
  plant = 'plant',
  antenna = 'antenna',
  balloon = 'balloon',
  blizzard = 'blizzard',
  wood = 'wood',
  umbrella = 'umbrella',
  electricity = 'electricity',
  apple = 'apple',
  cloth = 'cloth',
  meteor = 'meteor',
  cactus = 'cactus',
  sugar = 'sugar',
  wire = 'wire',
  explosion = 'explosion',
  music = 'music',
  ice = 'ice',
  ink = 'ink',
  island = 'island',
  paper = 'paper',
  dolphin = 'dolphin',
  bean = 'bean',
  lightning = 'lightning',
  fireworks = 'fireworks',
  beach = 'beach',
  tequila = 'tequila',
  hail = 'hail',
  blueprint = 'blueprint',
  hammer = 'hammer',
  rod = 'rod',
  coffee = 'coffee',
  art = 'art',
  tshirt = 'tshirt',
  icestorm = 'icestorm',
  fish = 'fish',
  yacht = 'yacht',
  party = 'party',
  coin = 'coin',
  whale = 'whale',
}

export const ELEMENTS = [
  {
    name: 'water',
    tier: 0,
  },
  {
    name: 'fire',
    tier: 0,
  },
  {
    name: 'earth',
    tier: 0,
  },
  {
    name: 'air',
    tier: 0,
  },
  {
    name: 'dust',
    tier: 1,
  },
  {
    name: 'steam',
    tier: 1,
  },
  {
    name: 'smoke',
    tier: 1,
  },
  {
    name: 'wind',
    tier: 1,
  },
  {
    name: 'mud',
    tier: 1,
  },
  {
    name: 'lava',
    tier: 1,
  },
  {
    name: 'pressure',
    tier: 1,
  },
  {
    name: 'life',
    tier: 1,
  },
  {
    name: 'energy',
    tier: 1,
  },
  {
    name: 'heat',
    tier: 1,
  },
  {
    name: 'rain',
    tier: 1,
  },
  {
    name: 'fog',
    tier: 1,
  },
  {
    name: 'worm',
    tier: 2,
  },
  {
    name: 'clay',
    tier: 2,
  },
  {
    name: 'cloud',
    tier: 2,
  },
  {
    name: 'frost',
    tier: 2,
  },
  {
    name: 'mountain',
    tier: 2,
  },
  {
    name: 'pond',
    tier: 2,
  },
  {
    name: 'time',
    tier: 2,
  },
  {
    name: 'ash',
    tier: 2,
  },
  {
    name: 'metal',
    tier: 2,
  },
  {
    name: 'fossil',
    tier: 2,
  },
  {
    name: 'glass',
    tier: 2,
  },
  {
    name: 'ocean',
    tier: 2,
  },
  {
    name: 'sun',
    tier: 2,
  },
  {
    name: 'stone',
    tier: 2,
  },
  {
    name: 'sand',
    tier: 2,
  },
  {
    name: 'tornado',
    tier: 2,
  },
  {
    name: 'oil',
    tier: 2,
  },
  {
    name: 'magnet',
    tier: 2,
  },
  {
    name: 'river',
    tier: 2,
  },
  {
    name: 'hotsprings',
    tier: 2,
  },
  {
    name: 'coal',
    tier: 2,
  },
  {
    name: 'swamp',
    tier: 2,
  },
  {
    name: 'seed',
    tier: 2,
  },
  {
    name: 'snow',
    tier: 2,
  },
  {
    name: 'wave',
    tier: 2,
  },
  {
    name: 'tree',
    tier: 3,
  },
  {
    name: 'nail',
    tier: 3,
  },
  {
    name: 'volcano',
    tier: 3,
  },
  {
    name: 'telescope',
    tier: 3,
  },
  {
    name: 'sound',
    tier: 3,
  },
  {
    name: 'storm',
    tier: 3,
  },
  {
    name: 'desert',
    tier: 3,
  },
  {
    name: 'alcohol',
    tier: 3,
  },
  {
    name: 'sky',
    tier: 3,
  },
  {
    name: 'plastic',
    tier: 3,
  },
  {
    name: 'gas',
    tier: 3,
  },
  {
    name: 'dam',
    tier: 3,
  },
  {
    name: 'bottle',
    tier: 3,
  },
  {
    name: 'gasoline',
    tier: 3,
  },
  {
    name: 'windmill',
    tier: 3,
  },
  {
    name: 'coral',
    tier: 3,
  },
  {
    name: 'furnace',
    tier: 3,
  },
  {
    name: 'solarpanel',
    tier: 3,
  },
  {
    name: 'plant',
    tier: 3,
  },
  {
    name: 'fireextinguisher',
    tier: 3,
  },
  {
    name: 'paint',
    tier: 3,
  },
  {
    name: 'squid',
    tier: 3,
  },
  {
    name: 'ice',
    tier: 4,
  },
  {
    name: 'meteor',
    tier: 4,
  },
  {
    name: 'balloon',
    tier: 4,
  },
  {
    name: 'cactus',
    tier: 4,
  },
  {
    name: 'music',
    tier: 4,
  },
  {
    name: 'bean',
    tier: 4,
  },
  {
    name: 'sugar',
    tier: 4,
  },
  {
    name: 'explosion',
    tier: 4,
  },
  {
    name: 'island',
    tier: 4,
  },
  {
    name: 'electricity',
    tier: 4,
  },
  {
    name: 'wood',
    tier: 4,
  },
  {
    name: 'wire',
    tier: 4,
  },
  {
    name: 'apple',
    tier: 4,
  },
  {
    name: 'dolphin',
    tier: 4,
  },
  {
    name: 'antenna',
    tier: 4,
  },
  {
    name: 'cloth',
    tier: 4,
  },
  {
    name: 'umbrella',
    tier: 4,
  },
  {
    name: 'paper',
    tier: 4,
  },
  {
    name: 'blizzard',
    tier: 4,
  },
  {
    name: 'ink',
    tier: 4,
  },
  {
    name: 'rod',
    tier: 5,
  },
  {
    name: 'beach',
    tier: 5,
  },
  {
    name: 'blueprint',
    tier: 5,
  },
  {
    name: 'art',
    tier: 5,
  },
  {
    name: 'fireworks',
    tier: 5,
  },
  {
    name: 'tequila',
    tier: 5,
  },
  {
    name: 'hammer',
    tier: 5,
  },
  {
    name: 'lightning',
    tier: 5,
  },
  {
    name: 'hail',
    tier: 5,
  },
  {
    name: 'coffee',
    tier: 5,
  },
  {
    name: 'icestorm',
    tier: 6,
  },
  {
    name: 'fish',
    tier: 6,
  },
  {
    name: 'coin',
    tier: 6,
  },
  {
    name: 'yacht',
    tier: 6,
  },
  {
    name: 'party',
    tier: 6,
  },
  {
    name: 'tshirt',
    tier: 6,
  },
  {
    name: 'whale',
    tier: 7,
  },
];
