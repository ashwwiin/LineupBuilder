// Standard Football Formations with normalized pitch coordinates (x: 0-100%, y: 0-100%)
// Pitch orientation: Top is Opponent Goal (y: 10-20%), Bottom is Own Goal/GK (y: 88%)

export const FORMATIONS = [
  {
    id: '4-3-3',
    name: '4-3-3 Classic',
    type: '11-a-side',
    description: 'Balanced formation with strong wing play and three central midfielders.',
    players: [
      { id: 1, pos: 'GK', label: 'GK', defaultNumber: 1, x: 50, y: 88, isGoalkeeper: true },
      { id: 2, pos: 'RB', label: 'RB', defaultNumber: 2, x: 84, y: 72 },
      { id: 3, pos: 'CB', label: 'R-CB', defaultNumber: 4, x: 62, y: 74 },
      { id: 4, pos: 'CB', label: 'L-CB', defaultNumber: 5, x: 38, y: 74 },
      { id: 5, pos: 'LB', label: 'LB', defaultNumber: 3, x: 16, y: 72 },
      { id: 6, pos: 'CDM', label: 'CDM', defaultNumber: 6, x: 50, y: 56 },
      { id: 7, pos: 'CM', label: 'R-CM', defaultNumber: 8, x: 70, y: 44 },
      { id: 8, pos: 'CM', label: 'L-CM', defaultNumber: 10, x: 30, y: 44 },
      { id: 9, pos: 'RW', label: 'RW', defaultNumber: 7, x: 84, y: 22 },
      { id: 10, pos: 'ST', label: 'ST', defaultNumber: 9, x: 50, y: 18 },
      { id: 11, pos: 'LW', label: 'LW', defaultNumber: 11, x: 16, y: 22 },
    ]
  },
  {
    id: '4-2-3-1',
    name: '4-2-3-1 Modern',
    type: '11-a-side',
    description: 'Double pivot midfielders with attacking midfield trio behind a striker.',
    players: [
      { id: 1, pos: 'GK', label: 'GK', defaultNumber: 1, x: 50, y: 88, isGoalkeeper: true },
      { id: 2, pos: 'RB', label: 'RB', defaultNumber: 2, x: 84, y: 72 },
      { id: 3, pos: 'CB', label: 'R-CB', defaultNumber: 4, x: 62, y: 74 },
      { id: 4, pos: 'CB', label: 'L-CB', defaultNumber: 5, x: 38, y: 74 },
      { id: 5, pos: 'LB', label: 'LB', defaultNumber: 3, x: 16, y: 72 },
      { id: 6, pos: 'CDM', label: 'R-CDM', defaultNumber: 6, x: 64, y: 55 },
      { id: 7, pos: 'CDM', label: 'L-CDM', defaultNumber: 8, x: 36, y: 55 },
      { id: 8, pos: 'RAM', label: 'RAM', defaultNumber: 7, x: 78, y: 34 },
      { id: 9, pos: 'CAM', label: 'CAM', defaultNumber: 10, x: 50, y: 35 },
      { id: 10, pos: 'LAM', label: 'LAM', defaultNumber: 11, x: 22, y: 34 },
      { id: 11, pos: 'ST', label: 'ST', defaultNumber: 9, x: 50, y: 18 },
    ]
  },
  {
    id: '4-4-2',
    name: '4-4-2 Flat',
    type: '11-a-side',
    description: 'Traditional English setup with two strikers and flat midfield four.',
    players: [
      { id: 1, pos: 'GK', label: 'GK', defaultNumber: 1, x: 50, y: 88, isGoalkeeper: true },
      { id: 2, pos: 'RB', label: 'RB', defaultNumber: 2, x: 84, y: 72 },
      { id: 3, pos: 'CB', label: 'R-CB', defaultNumber: 4, x: 62, y: 74 },
      { id: 4, pos: 'CB', label: 'L-CB', defaultNumber: 5, x: 38, y: 74 },
      { id: 5, pos: 'LB', label: 'LB', defaultNumber: 3, x: 16, y: 72 },
      { id: 6, pos: 'RM', label: 'RM', defaultNumber: 7, x: 84, y: 46 },
      { id: 7, pos: 'CM', label: 'R-CM', defaultNumber: 8, x: 62, y: 48 },
      { id: 8, pos: 'CM', label: 'L-CM', defaultNumber: 6, x: 38, y: 48 },
      { id: 9, pos: 'LM', label: 'LM', defaultNumber: 11, x: 16, y: 46 },
      { id: 10, pos: 'ST', label: 'R-ST', defaultNumber: 9, x: 62, y: 20 },
      { id: 11, pos: 'ST', label: 'L-ST', defaultNumber: 10, x: 38, y: 20 },
    ]
  },
  {
    id: '3-5-2',
    name: '3-5-2 Wing-Backs',
    type: '11-a-side',
    description: 'Three central defenders with energetic wing-backs and two forwards.',
    players: [
      { id: 1, pos: 'GK', label: 'GK', defaultNumber: 1, x: 50, y: 88, isGoalkeeper: true },
      { id: 2, pos: 'CB', label: 'R-CB', defaultNumber: 2, x: 72, y: 74 },
      { id: 3, pos: 'CB', label: 'C-CB', defaultNumber: 4, x: 50, y: 76 },
      { id: 4, pos: 'CB', label: 'L-CB', defaultNumber: 5, x: 28, y: 74 },
      { id: 5, pos: 'RWB', label: 'RWB', defaultNumber: 7, x: 88, y: 50 },
      { id: 6, pos: 'CDM', label: 'CDM', defaultNumber: 6, x: 50, y: 58 },
      { id: 7, pos: 'CM', label: 'R-CM', defaultNumber: 8, x: 65, y: 42 },
      { id: 8, pos: 'CM', label: 'L-CM', defaultNumber: 10, x: 35, y: 42 },
      { id: 9, pos: 'LWB', label: 'LWB', defaultNumber: 3, x: 12, y: 50 },
      { id: 10, pos: 'ST', label: 'R-ST', defaultNumber: 9, x: 62, y: 20 },
      { id: 11, pos: 'ST', label: 'L-ST', defaultNumber: 11, x: 38, y: 20 },
    ]
  },
  {
    id: '5-3-2',
    name: '5-3-2 Defensive',
    type: '11-a-side',
    description: 'Solid 5-man defensive barrier with counter-attacking focus.',
    players: [
      { id: 1, pos: 'GK', label: 'GK', defaultNumber: 1, x: 50, y: 88, isGoalkeeper: true },
      { id: 2, pos: 'RWB', label: 'RWB', defaultNumber: 2, x: 88, y: 68 },
      { id: 3, pos: 'CB', label: 'R-CB', defaultNumber: 4, x: 68, y: 75 },
      { id: 4, pos: 'CB', label: 'C-CB', defaultNumber: 5, x: 50, y: 77 },
      { id: 5, pos: 'CB', label: 'L-CB', defaultNumber: 6, x: 32, y: 75 },
      { id: 6, pos: 'LWB', label: 'LWB', defaultNumber: 3, x: 12, y: 68 },
      { id: 7, pos: 'CM', label: 'R-CM', defaultNumber: 8, x: 68, y: 48 },
      { id: 8, pos: 'CDM', label: 'CDM', defaultNumber: 10, x: 50, y: 52 },
      { id: 9, pos: 'CM', label: 'L-CM', defaultNumber: 7, x: 32, y: 48 },
      { id: 10, pos: 'ST', label: 'R-ST', defaultNumber: 9, x: 60, y: 20 },
      { id: 11, pos: 'ST', label: 'L-ST', defaultNumber: 11, x: 40, y: 20 },
    ]
  },
  {
    id: '3-4-3',
    name: '3-4-3 Attack',
    type: '11-a-side',
    description: 'All-out attacking system with wide forwards and aggressive pressing.',
    players: [
      { id: 1, pos: 'GK', label: 'GK', defaultNumber: 1, x: 50, y: 88, isGoalkeeper: true },
      { id: 2, pos: 'CB', label: 'R-CB', defaultNumber: 4, x: 74, y: 74 },
      { id: 3, pos: 'CB', label: 'C-CB', defaultNumber: 5, x: 50, y: 76 },
      { id: 4, pos: 'CB', label: 'L-CB', defaultNumber: 3, x: 26, y: 74 },
      { id: 5, pos: 'RM', label: 'RM', defaultNumber: 2, x: 86, y: 48 },
      { id: 6, pos: 'CM', label: 'R-CM', defaultNumber: 8, x: 62, y: 50 },
      { id: 7, pos: 'CM', label: 'L-CM', defaultNumber: 6, x: 38, y: 50 },
      { id: 8, pos: 'LM', label: 'LM', defaultNumber: 11, x: 14, y: 48 },
      { id: 9, pos: 'RW', label: 'RW', defaultNumber: 7, x: 82, y: 22 },
      { id: 10, pos: 'ST', label: 'ST', defaultNumber: 9, x: 50, y: 18 },
      { id: 11, pos: 'LW', label: 'LW', defaultNumber: 10, x: 18, y: 22 },
    ]
  },
  {
    id: '5-a-side',
    name: '5-a-side (1-2-1 Diamond)',
    type: '5-a-side',
    description: 'Compact small-sided formation with 1 Defender, 2 Midfielders, 1 Forward.',
    players: [
      { id: 1, pos: 'GK', label: 'GK', defaultNumber: 1, x: 50, y: 86, isGoalkeeper: true },
      { id: 2, pos: 'DEF', label: 'DEF', defaultNumber: 2, x: 50, y: 68 },
      { id: 3, pos: 'MID', label: 'R-MID', defaultNumber: 7, x: 76, y: 45 },
      { id: 4, pos: 'MID', label: 'L-MID', defaultNumber: 8, x: 24, y: 45 },
      { id: 5, pos: 'FWD', label: 'FWD', defaultNumber: 9, x: 50, y: 22 },
    ]
  },
  {
    id: '7-a-side',
    name: '7-a-side (2-3-1)',
    type: '7-a-side',
    description: 'Popular 7v7 layout with 2 defenders, 3 midfielders, and a lone striker.',
    players: [
      { id: 1, pos: 'GK', label: 'GK', defaultNumber: 1, x: 50, y: 86, isGoalkeeper: true },
      { id: 2, pos: 'CB', label: 'R-CB', defaultNumber: 4, x: 66, y: 70 },
      { id: 3, pos: 'CB', label: 'L-CB', defaultNumber: 5, x: 34, y: 70 },
      { id: 4, pos: 'RM', label: 'RM', defaultNumber: 7, x: 80, y: 45 },
      { id: 5, pos: 'CM', label: 'CM', defaultNumber: 8, x: 50, y: 48 },
      { id: 6, pos: 'LM', label: 'LM', defaultNumber: 11, x: 20, y: 45 },
      { id: 7, pos: 'ST', label: 'ST', defaultNumber: 9, x: 50, y: 20 },
    ]
  },
  {
    id: '9-a-side',
    name: '9-a-side (3-3-2)',
    type: '9-a-side',
    description: 'Balanced 9v9 layout with 3 backs, 3 midfielders, and 2 strikers.',
    players: [
      { id: 1, pos: 'GK', label: 'GK', defaultNumber: 1, x: 50, y: 86, isGoalkeeper: true },
      { id: 2, pos: 'CB', label: 'R-CB', defaultNumber: 2, x: 74, y: 72 },
      { id: 3, pos: 'CB', label: 'C-CB', defaultNumber: 4, x: 50, y: 74 },
      { id: 4, pos: 'CB', label: 'L-CB', defaultNumber: 3, x: 26, y: 72 },
      { id: 5, pos: 'RM', label: 'RM', defaultNumber: 7, x: 82, y: 46 },
      { id: 6, pos: 'CM', label: 'CM', defaultNumber: 8, x: 50, y: 48 },
      { id: 7, pos: 'LM', label: 'LM', defaultNumber: 11, x: 18, y: 46 },
      { id: 8, pos: 'ST', label: 'R-ST', defaultNumber: 9, x: 62, y: 20 },
      { id: 9, pos: 'ST', label: 'L-ST', defaultNumber: 10, x: 38, y: 20 },
    ]
  }
];
