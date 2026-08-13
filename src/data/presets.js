export const SQUAD_PRESETS = [
  {
    id: 'real-madrid-2024',
    name: 'Real Madrid (UCL Winners 2024)',
    teamName: 'Real Madrid CF',
    managerName: 'Carlo Ancelotti',
    matchInfo: 'UEFA Champions League Final 2024',
    formationId: '4-3-3',
    kitStyle: {
      primaryColor: '#ffffff',
      secondaryColor: '#cca43b',
      sleeveColor: '#ffffff',
      collarColor: '#cca43b',
      pattern: 'solid',
      numberColor: '#1e293b'
    },
    gkKitStyle: {
      primaryColor: '#10b981',
      secondaryColor: '#047857',
      pattern: 'sleeves-accent',
      numberColor: '#ffffff'
    },
    players: [
      { id: 1, name: 'Thibaut Courtois', number: 1, pos: 'GK', rating: 90, isGoalkeeper: true, isCaptain: false, photo: '' },
      { id: 2, name: 'Dani Carvajal', number: 2, pos: 'RB', rating: 86, isCaptain: false, photo: '' },
      { id: 3, name: 'Antonio Rüdiger', number: 22, pos: 'CB', rating: 88, isCaptain: false, photo: '' },
      { id: 4, name: 'Nacho Fernández', number: 6, pos: 'CB', rating: 83, isCaptain: true, photo: '' },
      { id: 5, name: 'Ferland Mendy', number: 23, pos: 'LB', rating: 84, isCaptain: false, photo: '' },
      { id: 6, name: 'Fede Valverde', number: 15, pos: 'CDM', rating: 89, isCaptain: false, photo: '' },
      { id: 7, name: 'Eduardo Camavinga', number: 12, pos: 'CM', rating: 85, isCaptain: false, photo: '' },
      { id: 8, name: 'Toni Kroos', number: 8, pos: 'CM', rating: 90, isCaptain: false, photo: '' },
      { id: 9, name: 'Rodrygo', number: 11, pos: 'RW', rating: 86, isCaptain: false, photo: '' },
      { id: 10, name: 'Jude Bellingham', number: 5, pos: 'ST', rating: 92, isCaptain: false, photo: '' },
      { id: 11, name: 'Vinícius Jr.', number: 7, pos: 'LW', rating: 92, isCaptain: false, photo: '' },
    ],
    bench: [
      { id: 101, name: 'Kepa Arrizabalaga', number: 25, pos: 'GK' },
      { id: 102, name: 'Luka Modrić', number: 10, pos: 'CM' },
      { id: 103, name: 'Joselu', number: 14, pos: 'ST' },
      { id: 104, name: 'Brahim Díaz', number: 21, pos: 'RW' },
      { id: 105, name: 'Éder Militão', number: 3, pos: 'CB' },
    ]
  },
  {
    id: 'barcelona-2011',
    name: 'FC Barcelona (Prime Tiki-Taka 2011)',
    teamName: 'FC Barcelona',
    managerName: 'Pep Guardiola',
    matchInfo: 'Wembley 2011 Final',
    formationId: '4-3-3',
    kitStyle: {
      primaryColor: '#a50044',
      secondaryColor: '#004d98',
      sleeveColor: '#004d98',
      collarColor: '#edbb00',
      pattern: 'vertical-stripes',
      numberColor: '#edbb00'
    },
    gkKitStyle: {
      primaryColor: '#eab308',
      secondaryColor: '#854d0e',
      pattern: 'solid',
      numberColor: '#ffffff'
    },
    players: [
      { id: 1, name: 'Víctor Valdés', number: 1, pos: 'GK', rating: 86, isGoalkeeper: true, isCaptain: false, photo: '' },
      { id: 2, name: 'Dani Alves', number: 2, pos: 'RB', rating: 89, isCaptain: false, photo: '' },
      { id: 3, name: 'Gerard Piqué', number: 3, pos: 'CB', rating: 88, isCaptain: false, photo: '' },
      { id: 4, name: 'Javier Mascherano', number: 14, pos: 'CB', rating: 85, isCaptain: false, photo: '' },
      { id: 5, name: 'Éric Abidal', number: 22, pos: 'LB', rating: 84, isCaptain: false, photo: '' },
      { id: 6, name: 'Sergio Busquets', number: 16, pos: 'CDM', rating: 88, isCaptain: false, photo: '' },
      { id: 7, name: 'Xavi Hernández', number: 6, pos: 'CM', rating: 92, isCaptain: true, photo: '' },
      { id: 8, name: 'Andrés Iniesta', number: 8, pos: 'CM', rating: 92, isCaptain: false, photo: '' },
      { id: 9, name: 'Pedro Rodríguez', number: 17, pos: 'RW', rating: 85, isCaptain: false, photo: '' },
      { id: 10, name: 'Lionel Messi', number: 10, pos: 'ST', rating: 97, isCaptain: false, photo: '' },
      { id: 11, name: 'David Villa', number: 7, pos: 'LW', rating: 88, isCaptain: false, photo: '' },
    ],
    bench: [
      { id: 101, name: 'Oier Olazábal', number: 13, pos: 'GK' },
      { id: 102, name: 'Carles Puyol', number: 5, pos: 'CB' },
      { id: 103, name: 'Seydou Keita', number: 15, pos: 'CM' },
      { id: 104, name: 'Thiago Alcântara', number: 30, pos: 'CM' },
      { id: 105, name: 'Ibrahim Afellay', number: 20, pos: 'LW' },
    ]
  },
  {
    id: 'argentina-2022',
    name: 'Argentina (World Champions 2022)',
    teamName: 'Argentina National Team',
    managerName: 'Lionel Scaloni',
    matchInfo: 'FIFA World Cup Final 2022',
    formationId: '4-3-3',
    kitStyle: {
      primaryColor: '#75aadb',
      secondaryColor: '#ffffff',
      sleeveColor: '#75aadb',
      collarColor: '#000000',
      pattern: 'vertical-stripes',
      numberColor: '#1e293b'
    },
    gkKitStyle: {
      primaryColor: '#ef4444',
      secondaryColor: '#991b1b',
      pattern: 'solid',
      numberColor: '#ffffff'
    },
    players: [
      { id: 1, name: 'Emiliano Martínez', number: 23, pos: 'GK', rating: 88, isGoalkeeper: true, isCaptain: false, photo: '' },
      { id: 2, name: 'Nahuel Molina', number: 26, pos: 'RB', rating: 82, isCaptain: false, photo: '' },
      { id: 3, name: 'Cristian Romero', number: 13, pos: 'CB', rating: 86, isCaptain: false, photo: '' },
      { id: 4, name: 'Nicolas Otamendi', number: 19, pos: 'CB', rating: 84, isCaptain: false, photo: '' },
      { id: 5, name: 'Nicolas Tagliafico', number: 3, pos: 'LB', rating: 81, isCaptain: false, photo: '' },
      { id: 6, name: 'Rodrigo De Paul', number: 7, pos: 'CDM', rating: 86, isCaptain: false, photo: '' },
      { id: 7, name: 'Enzo Fernández', number: 24, pos: 'CM', rating: 85, isCaptain: false, photo: '' },
      { id: 8, name: 'Alexis Mac Allister', number: 20, pos: 'CM', rating: 84, isCaptain: false, photo: '' },
      { id: 9, name: 'Ángel Di María', number: 11, pos: 'RW', rating: 87, isCaptain: false, photo: '' },
      { id: 10, name: 'Lionel Messi', number: 10, pos: 'ST', rating: 96, isCaptain: true, photo: '' },
      { id: 11, name: 'Julián Álvarez', number: 9, pos: 'LW', rating: 86, isCaptain: false, photo: '' },
    ],
    bench: [
      { id: 101, name: 'Franco Armani', number: 1, pos: 'GK' },
      { id: 102, name: 'Gonzalo Montiel', number: 4, pos: 'RB' },
      { id: 103, name: 'Leandro Paredes', number: 5, pos: 'CM' },
      { id: 104, name: 'Lautaro Martínez', number: 22, pos: 'ST' },
      { id: 105, name: 'Paulo Dybala', number: 21, pos: 'CAM' },
    ]
  },
  {
    id: 'arsenal-2004',
    name: 'Arsenal (The Invincibles 2004)',
    teamName: 'Arsenal FC',
    managerName: 'Arsène Wenger',
    matchInfo: 'Premier League 2003-04',
    formationId: '4-4-2',
    kitStyle: {
      primaryColor: '#db0007',
      secondaryColor: '#ffffff',
      sleeveColor: '#ffffff',
      collarColor: '#ffffff',
      pattern: 'sleeves-accent',
      numberColor: '#ffffff'
    },
    gkKitStyle: {
      primaryColor: '#3b82f6',
      secondaryColor: '#1d4ed8',
      pattern: 'solid',
      numberColor: '#ffffff'
    },
    players: [
      { id: 1, name: 'Jens Lehmann', number: 1, pos: 'GK', rating: 87, isGoalkeeper: true, isCaptain: false, photo: '' },
      { id: 2, name: 'Lauren', number: 12, pos: 'RB', rating: 83, isCaptain: false, photo: '' },
      { id: 3, name: 'Sol Campbell', number: 23, pos: 'CB', rating: 89, isCaptain: false, photo: '' },
      { id: 4, name: 'Kolo Touré', number: 28, pos: 'CB', rating: 86, isCaptain: false, photo: '' },
      { id: 5, name: 'Ashley Cole', number: 3, pos: 'LB', rating: 88, isCaptain: false, photo: '' },
      { id: 6, name: 'Freddie Ljungberg', number: 8, pos: 'RM', rating: 86, isCaptain: false, photo: '' },
      { id: 7, name: 'Patrick Vieira', number: 4, pos: 'CM', rating: 91, isCaptain: true, photo: '' },
      { id: 8, name: 'Gilberto Silva', number: 19, pos: 'CM', rating: 86, isCaptain: false, photo: '' },
      { id: 9, name: 'Robert Pires', number: 7, pos: 'LM', rating: 89, isCaptain: false, photo: '' },
      { id: 10, name: 'Dennis Bergkamp', number: 10, pos: 'ST', rating: 92, isCaptain: false, photo: '' },
      { id: 11, name: 'Thierry Henry', number: 14, pos: 'ST', rating: 95, isCaptain: false, photo: '' },
    ],
    bench: [
      { id: 101, name: 'Graham Stack', number: 13, pos: 'GK' },
      { id: 102, name: 'Martin Keown', number: 5, pos: 'CB' },
      { id: 103, name: 'Ray Parlour', number: 15, pos: 'CM' },
      { id: 104, name: 'Edu Gaspar', number: 17, pos: 'CM' },
      { id: 105, name: 'Nwankwo Kanu', number: 25, pos: 'ST' },
    ]
  }
];
