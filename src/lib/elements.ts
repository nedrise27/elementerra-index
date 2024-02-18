export function cleanAndOrderRecipe(recipe: string[]): string[] {
  const r = recipe.map((e) => e.replaceAll(' ', '').toLowerCase());
  r.sort();
  return r;
}

export enum ElementName {
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

export const ELEMENTS_IDS = {
  '11111111111111111111111111111111': 'NOTHING',
  Bw4iN1gCvzmdiY9WfuEG1QJaxheTXif2fxuqQ5KQR2zT: 'Water',
  DyYYN86vMZy6E8MVYEcrRTHwMJk5z66iDTPhHBYAafc2: 'Earth',
  AqLM9JqF5wv5DZynY8CducahkB7JWPxWpDL29TPRwmNV: 'Air',
  H1PLKchzLBgMNMnHLV15NScrMoXJXkgbCog2WnLxzjHn: 'Fire',
  '3MmjYjFg9aB3br1mcfkToWSZH5o8jPSsursmUjgyy9F4': 'Steam',
  '8B3cmtrNHzJi2z9HowdEuRowHoRXoVmpyMdytruDvJD5': 'Mud',
  '9buezJaSwJy4jBoi7PPnmuKvuuUNxboZ8WMZH4ZjFdPh': 'Smoke',
  HGkChvYGKSgGSt9fvtQmg8w6LEhKfhrNNVJL8YiSDbGs: 'Heat',
  J5BuNGjzFoiPshShhWw5UoQDe7Uh5fXkebYuJn9QPtQY: 'Fog',
  HjVoDDKz5VtzDTVDBNhWMGUhxG4MnNNRNtnZ6eHDcqyN: 'Dust',
  '94cdHPXm5Rv5TCMg4YD5f9zXXXkmtX9suehAEHk8qkAA': 'Energy',
  GA9jgGMRyr4n9UufmhQQqokztPjrDabcv5MYMGaR2fst: 'Lava',
  '9uMzGd7onhKSJrhXvR5mca3XPMwZwx4PzooCVFkDNX9U': 'Pressure',
  G6XyoAP5Tdz5WQPba995zhqddx8UVnJrRXG8W8P1S9fj: 'Life',
  '7t75yYTPccVXj8sUenJKmEuM9gvncisyPTs5B13jdteG': 'Wind',
  AQ7wz5m6sq25QTTWHcNPzR6SueBoQK4oGVqYhRizt6id: 'Rain',
  FNVYqGvw6aDT15kQ3VUCpLvSnJLgQvGFzAt258MZTrBc: 'Mountain',
  DieM3wCppu9EWjCw7wC7KGFtXuFz4w3WiyJJJChvhWY2: 'Seed',
  EXKd8ZUxo24eXNLcwTStEiJH9RzFLrMTBQ2isYqZrTUT: 'Hot Springs',
  CyXVDUA7BZktv47C57HjJPhpyfgm97SJ5DwF9yfyJkJx: 'Time',
  GA5cPSrYX6jooTkYyiDPxE8P5vBo47yu61s6P6vVrZAu: 'Pond',
  '4R3yxdiCxnaBGF39jfXh2Q4iBNFm2DZMBotgUQpBECri': 'Sun',
  AvfdrjvZ7BbjvpbStnt2vnV9E8Sfftzoz2zULvMhGaXP: 'Coal',
  '4eTiHoeVGGFiU4CXfFjpbnAw5uZAqCgTvYqMscMddPYy': 'Fossil',
  EQ8HPyhBB3ydbEz6kcBzYJUowaf1oxfY4BVqReydPCY2: 'Tornado',
  '6bPKCgkdGgLSbvgeK1N96PKb5yZTKFAAEkn1Go4aGznZ': 'Swamp',
  E6H62J4Dc4Pdg3SvmLT9jEEr4RiVxae5UNWT9prvBscJ: 'Glass',
  '4cqqhRdUo31vtFJ6ntAvhBCu2XX5fNih7YRbVJJcESyB': 'Sand',
  GCS2XqRiwMQTrQmixVeGW8Baw5vtchGvz94aPXQf2x6a: 'River',
  BM1hmtBKMRsu86Qr8zCp2apLaYBffbz8Pd6fF3DJJrin: 'Metal',
  EqNfCMEDCu7VgnvRjdHNA5K3XZp2UrX25aWucbypv9pB: 'Frost',
  BJr1atzAntztrxe7ybF2BaStWaf6PBXmRm2q3Fo3xsfC: 'Cloud',
  G7rcTo7CZixMRBt2ESpajhCTA5rRYV9Wo9NnM9wS6AX2: 'Magnet',
  '4Dyo7bLPe6h8hYdokHkYGrXXkpv81cLmCDWjtZZkuQ81': 'Oil',
  BLXAGYyQf6Y27cgxzyXV9Hmgs2ZtvN4tGD1NtzazBEcm: 'Clay',
  '4bsJxjy3VwYJr8opafB7PaebPsuTuPkbBLqzX8D1DkmU': 'Ocean',
  E3WQQBwTs5zwzJLE4YCR9ddLQMLSphbJZrFhEfdPp1hE: 'Worm',
  '4uakH9eP6prVhMUWEo6bnyFLMszzv1uEBW5RRF2xAVsY': 'Snow',
  GibnswwWKKnrb6RnL8BLm5ACmEYG2DGebHSvfo6sw6YD: 'Wave',
  ASoB6UKv46ta7hUyamAGDAuCVDhmRLo6Wv9psjKPP7BZ: 'Ash',
  CkrtWvNQ6CAYhtMLupAs3VxXWnyN2C4qnSZ3YW7wdznv: 'Stone',
  Ateg9mfDeHNN956k7v7bqU7QuGYdZkx8vEtJWviWLTKY: 'Storm',
  '9uVafvVHc3axupwXraUMjgeQF64W9CKTSWmdeiQ7qTgY': 'Paint',
  DtCo7UbULMnkJCHgf5iNHAWaHbF9DZjSBvDqF1JeiL4T: 'Dam',
  '96rJpByuWXnzxT1gPvf8u8Pz9CE3fzCh5L323GbwGyV2': 'Gasoline',
  jSiiGafD19RmxriAsKDHB1oWxfGugMaUvsKFtgREDGW: 'Alcohol',
  '8Ut1nez6UuNAqr4dbMojqZQqFULrMdM8ZD6svTNH83BB': 'Plant',
  FgeDexGkmFiUT6gjJE3P7hRTwY7ggw1C6r8coMpuxGSz: 'Gas',
  AnFjJ8JxGRiEjnTwyjryrx63MTJcT4Y3wHtdUD6XedDe: 'Solar Panel',
  ErcpVHWjge8iiqtUsdpVf1vnhnLD5LNUvWR55HE45YHg: 'Desert',
  GZxjXx9Nq72TVNVp5SRXatp2ykeQPzYB5BcjqCwQ2ZAN: 'Bottle',
  '4apGySpNYbbGQDQdMk3LK7HcttuA5sxcTuHvdqKwS7CN': 'Coral',
  WhCc614Ja7YPeF1YQVJ7MHvTvmfChEDTtig7MgqQn7T: 'Volcano',
  Brci1cUALcMpb6aPCpzqrxYpK6LRza6KtoMGxjCZuiA4: 'Nail',
  '4BBKuBxSAPJW1Ew1GT1YBVu4CyjcLHg5kfWxKwk5dKVU': 'Furnace',
  '4eUG77yrhNiETCHH4dLn2x87sqWf4YVSY6GddbuMWhhH': 'Squid',
  '88pZ1uii9SgHM596JNXKfbUQVSbnbz9yR8Yn8TaTXYsr': 'Telescope',
  '85zYDe99HP1EPzP8kji9ZyyWuPnieh8J2e5WdhhGcYuQ': 'Plastic',
  AhWaSxPLyBDQgrBdYuFb9yNMG63P7QfhxZRGt1HB8qJK: 'Sky',
  AAnKWqXFkvhpxxf1vUxiysUVdjUE7JpwKy3vJdzkYfEA: 'Fire Extinguisher',
  '8reMp7L3yQrxJScfZoYEbJyy35gfAmLjBcp2tsXsxqy2': 'Sound',
  '3LZiaK8zz24xsqdm2WeayJgSgpAcWuurojQLTG2AyPca': 'Tree',
  FJJ2WtgHmnBVmUPT1BTAftD8F8vTYzQM8ipk3xdZ6AAG: 'Windmill',
  '8wfBfYP79aUgtvhQqPLYQscBsZTp7LVHrYeQbzMaUoq9': 'Umbrella',
  '3CaE6wEo9FNCcbCAomhybe3cBJLHdmWo1JmFP35LZGK5': 'Wire',
  DFkgZEPac7RE5fWDpAjoW3mgESx9uC7pSMecDnPtJuWv: 'Apple',
  '6u3upjYaKZ7dbGbussBgH8dymvhFXubK5ezzUQUndzfo': 'Cloth',
  CVebn1dMzEzXZYSL5rqUk4CHUdr7mGF9KQEYwdqhuJeF: 'Cactus',
  '7FgPFgukiwUpWohs9oMHheUvmZXSnx4RoVf441psuNVU': 'Antenna',
  '35wx7NFpkDXFMj48A6qzY4nnGnJtWXGnUH7d89EM3oQ9': 'Dolphin',
  E11serm1bsXBzEhJvKkUB2Wy5dQdqfpbHzAi1oCEzRK3: 'Ink',
  EMga9t1N42gVPTkU4VGiqB8LMimB8cW2DcSdotUbpXU9: 'Explosion',
  '5aqsZfV2PYVQu6QTvQEFtskeFbCKJxfghuUN7fDGUeKw': 'Music',
  '7QxmAo92fPcpDADEVHxFAfd1BsdyZjhwUbh8wPLHbUVN': 'Island',
  '29nme3KdLnYw1EBTgMBZXLxz8AfVBPJh68HBZGj73L4j': 'Wood',
  BaNCDmKixZDBcC3nDNgYEiCwLUCH6wdvNW2vzTyb8cc5: 'Bean',
  '2r8endBMp6jhc9JeBmyvnx8xoZN8MmqeX1uPixasP3bM': 'Electricity',
  a3QvganvQ8Pdg2Czvhbp1R9R82FZ8u2Rk4VrF5UNLJw: 'Balloon',
  C8U9VkxDZ9U85AV9FbHcW81x3KVFWWwpXgeRDabd3Yvm: 'Blizzard',
  AsM2DKsLuDG1gYJEgxBbXUByqFXQeUGBLzF2MEpMkcNf: 'Paper',
  '7kK6QKQYeST1yoskEq4QsxRh8dSFZRUQyajdZ8AbLKs4': 'Ice',
  '68MmavdwYeGhwT4ADe8WcXzcqjk8EXPKQ36P9r79T5kj': 'Sugar',
  '9bU4fJd6r1y5xaREi9ryMrtSVmet4UPwnf8HXjDMxP4T': 'Meteor',
  AH3WV4iegL9TNedBD43sok2YKwV6g8E2h6WMNT8TaBpz: 'Art',
  GW3G1KUaEUguvNRxwWv7JryNFbtaGSoziQMP5erMLmbB: 'Blueprint',
  DPWmuzMaTYMJE35ka3X3XBRZUkP2AZ3QoWybP34EHhnG: 'Hail',
  '6rKGq1E3k8t5eiUtAzfapGTMtvfLcmZe4jz3S6Ao5gfa': 'Tequila',
  B4WBw6sikztikGu9PUqjS5rUoCjJfgS7eEaoLzTnVPoi: 'Coffee',
  GdpTQSVfPEwtDx2sz6rbd9jD75WTK6rsnSXZbnedXU9V: 'Rod',
  '6cwyx3Xn91n1k6gxRn61ihmjDNqzdPnSDnnJVW47WZt5': 'Hammer',
  EL6NpwrApY4xji616XVsHXeUs7TSrkW3GLvvJWhTByhp: 'Fireworks',
  DinReJZBbhjHc71SCk5zakJU1xoCm1ZLexdBSf82g6f5: 'Lightning',
  C1PgMZxqeAHEuPgF3DETCnjp4b5qGEVnNf8urxKNsyB7: 'Beach',
  GsTfxoMrBPpDFpc2x5i3ZXiRKSTYmzhSTXtYzsjDRDcv: 'Party',
  eQVxSBvdpnFgGXZDu5LcAtgZu7WKS1QvvrgaPo1QT8A: 'Fish',
  '2FAbvaZgyUcmKQnYG2GFKw763oc97ASrdxe8UUroL96Q': 'Ice Storm',
  D2JbuYtzcYpK6oPqQD7NHQLDRSeUJ2RVYzUDfs66xZum: 'T Shirt',
  '3kVJif6Z9ZfHCN1pZzAnif3p1adHXqtfnDuMbxy65G2t': 'Coin',
  '6Jj9Ys3GLbQGPgXW3vj3rF4LSEAMvJ6SNH7ai9zHH1sm': 'Yacht',
  uYR4GQ8Tf2m8eog2ApABZUYUmcGypgg2McSfyFHvVxH: 'Whale',
};

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
] as { name: ElementName; tier: number }[];
