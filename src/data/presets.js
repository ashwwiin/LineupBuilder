export const SQUAD_PRESETS = [
  {
    id: 'barcelona-2011',
    name: 'FC Barcelona (Prime Tiki-Taka 2011)',
    teamName: 'FC Barcelona',
    managerName: 'Pep Guardiola',
    matchInfo: 'Wembley UCL Final 2011',
    formationId: '4-3-3',
    kitStyle: {
      primaryColor: '#1e3a8a',
      secondaryColor: '#991b1b',
      sleeveColor: '#1e3a8a',
      collarColor: '#edbb00',
      pattern: 'stripes',
      numberColor: '#edbb00'
    },
    gkKitStyle: {
      primaryColor: '#eab308',
      secondaryColor: '#854d0e',
      pattern: 'solid',
      numberColor: '#ffffff'
    },
    players: [
      { id: 1, name: 'Víctor Valdés', number: 1, pos: 'GK', isGoalkeeper: true, isCaptain: false, photo: '' },
      { id: 2, name: 'Dani Alves', number: 2, pos: 'RB', isCaptain: false, photo: '' },
      { id: 3, name: 'Gerard Piqué', number: 3, pos: 'CB', isCaptain: false, photo: '' },
      { id: 4, name: 'Javier Mascherano', number: 14, pos: 'CB', isCaptain: false, photo: '' },
      { id: 5, name: 'Éric Abidal', number: 22, pos: 'LB', isCaptain: false, photo: '' },
      { id: 6, name: 'Sergio Busquets', number: 16, pos: 'CDM', isCaptain: false, photo: '' },
      { id: 7, name: 'Xavi Hernández', number: 6, pos: 'CM', isCaptain: true, photo: '' },
      { id: 8, name: 'Andrés Iniesta', number: 8, pos: 'CM', isCaptain: false, photo: '' },
      { id: 9, name: 'Pedro Rodríguez', number: 17, pos: 'RW', isCaptain: false, photo: '' },
      { id: 10, name: 'Lionel Messi', number: 10, pos: 'ST', isCaptain: false, photo: '' },
      { id: 11, name: 'David Villa', number: 7, pos: 'LW', isCaptain: false, photo: '' }
    ],
    bench: [
      { id: 101, name: 'Carles Puyol', number: 5, pos: 'CB' },
      { id: 102, name: 'Seydou Keita', number: 15, pos: 'CM' },
      { id: 103, name: 'Thiago Alcântara', number: 30, pos: 'CM' },
      { id: 104, name: 'Ibrahim Afellay', number: 20, pos: 'LW' }
    ]
  },
  {
    id: 'rm-2017',
    name: 'Real Madrid (3-Peat 2017)',
    teamName: 'Real Madrid CF',
    managerName: 'Zinedine Zidane',
    matchInfo: 'Cardiff UCL Final 2017',
    formationId: '4-3-3',
    kitStyle: {
      primaryColor: '#ffffff',
      secondaryColor: '#38bdf8',
      sleeveColor: '#ffffff',
      collarColor: '#38bdf8',
      pattern: 'solid',
      numberColor: '#1e293b'
    },
    gkKitStyle: {
      primaryColor: '#10b981',
      secondaryColor: '#047857',
      pattern: 'solid',
      numberColor: '#ffffff'
    },
    players: [
      { id: 1, name: 'Keylor Navas', number: 1, pos: 'GK', isGoalkeeper: true, isCaptain: false, photo: '' },
      { id: 2, name: 'Dani Carvajal', number: 2, pos: 'RB', isCaptain: false, photo: '' },
      { id: 3, name: 'Raphaël Varane', number: 5, pos: 'CB', isCaptain: false, photo: '' },
      { id: 4, name: 'Sergio Ramos', number: 4, pos: 'CB', isCaptain: true, photo: '' },
      { id: 5, name: 'Marcelo', number: 12, pos: 'LB', isCaptain: false, photo: '' },
      { id: 6, name: 'Casemiro', number: 14, pos: 'CDM', isCaptain: false, photo: '' },
      { id: 7, name: 'Luka Modrić', number: 19, pos: 'CM', isCaptain: false, photo: '' },
      { id: 8, name: 'Toni Kroos', number: 8, pos: 'CM', isCaptain: false, photo: '' },
      { id: 9, name: 'Isco', number: 22, pos: 'RW', isCaptain: false, photo: '' },
      { id: 10, name: 'Karim Benzema', number: 9, pos: 'ST', isCaptain: false, photo: '' },
      { id: 11, name: 'Cristiano Ronaldo', number: 7, pos: 'LW', isCaptain: false, photo: '' }
    ],
    bench: [
      { id: 101, name: 'Gareth Bale', number: 11, pos: 'RW' },
      { id: 102, name: 'Marco Asensio', number: 20, pos: 'LW' },
      { id: 103, name: 'Mateo Kovačić', number: 16, pos: 'CM' },
      { id: 104, name: 'Nacho Fernández', number: 6, pos: 'CB' }
    ]
  },
  {
    id: 'mancity-2023',
    name: 'Man City (Treble Winners 2023)',
    teamName: 'Manchester City',
    managerName: 'Pep Guardiola',
    matchInfo: 'UEFA Champions League Final 2023',
    formationId: '3-5-2',
    kitStyle: {
      primaryColor: '#38bdf8',
      secondaryColor: '#ffffff',
      sleeveColor: '#38bdf8',
      collarColor: '#0f172a',
      pattern: 'solid',
      numberColor: '#ffffff'
    },
    gkKitStyle: {
      primaryColor: '#10b981',
      secondaryColor: '#047857',
      pattern: 'solid',
      numberColor: '#ffffff'
    },
    players: [
      { id: 1, name: 'Ederson', number: 31, pos: 'GK', isGoalkeeper: true, isCaptain: false, photo: '' },
      { id: 2, name: 'Manuel Akanji', number: 25, pos: 'CB', isCaptain: false, photo: '' },
      { id: 3, name: 'Rúben Dias', number: 3, pos: 'CB', isCaptain: false, photo: '' },
      { id: 4, name: 'Nathan Aké', number: 6, pos: 'CB', isCaptain: false, photo: '' },
      { id: 5, name: 'John Stones', number: 5, pos: 'CDM', isCaptain: false, photo: '' },
      { id: 6, name: 'Rodri', number: 16, pos: 'CDM', isCaptain: false, photo: '' },
      { id: 7, name: 'Bernardo Silva', number: 20, pos: 'RM', isCaptain: false, photo: '' },
      { id: 8, name: 'Kevin De Bruyne', number: 17, pos: 'CM', isCaptain: true, photo: '' },
      { id: 9, name: 'Ilkay Gündogan', number: 8, pos: 'CM', isCaptain: false, photo: '' },
      { id: 10, name: 'Jack Grealish', number: 10, pos: 'LM', isCaptain: false, photo: '' },
      { id: 11, name: 'Erling Haaland', number: 9, pos: 'ST', isCaptain: false, photo: '' }
    ],
    bench: [
      { id: 101, name: 'Stefan Ortega', number: 18, pos: 'GK' },
      { id: 102, name: 'Phil Foden', number: 47, pos: 'CAM' },
      { id: 103, name: 'Riyad Mahrez', number: 26, pos: 'RW' },
      { id: 104, name: 'Julián Álvarez', number: 19, pos: 'ST' }
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
      primaryColor: '#38bdf8',
      secondaryColor: '#ffffff',
      sleeveColor: '#38bdf8',
      collarColor: '#000000',
      pattern: 'stripes',
      numberColor: '#1e293b'
    },
    gkKitStyle: {
      primaryColor: '#ef4444',
      secondaryColor: '#991b1b',
      pattern: 'solid',
      numberColor: '#ffffff'
    },
    players: [
      { id: 1, name: 'Emiliano Martínez', number: 23, pos: 'GK', isGoalkeeper: true, isCaptain: false, photo: '' },
      { id: 2, name: 'Nahuel Molina', number: 26, pos: 'RB', isCaptain: false, photo: '' },
      { id: 3, name: 'Cristian Romero', number: 13, pos: 'CB', isCaptain: false, photo: '' },
      { id: 4, name: 'Nicolas Otamendi', number: 19, pos: 'CB', isCaptain: false, photo: '' },
      { id: 5, name: 'Nicolas Tagliafico', number: 3, pos: 'LB', isCaptain: false, photo: '' },
      { id: 6, name: 'Rodrigo De Paul', number: 7, pos: 'CDM', isCaptain: false, photo: '' },
      { id: 7, name: 'Enzo Fernández', number: 24, pos: 'CM', isCaptain: false, photo: '' },
      { id: 8, name: 'Alexis Mac Allister', number: 20, pos: 'CM', isCaptain: false, photo: '' },
      { id: 9, name: 'Ángel Di María', number: 11, pos: 'RW', isCaptain: false, photo: '' },
      { id: 10, name: 'Lionel Messi', number: 10, pos: 'ST', isCaptain: true, photo: '' },
      { id: 11, name: 'Julián Álvarez', number: 9, pos: 'LW', isCaptain: false, photo: '' }
    ],
    bench: [
      { id: 101, name: 'Franco Armani', number: 1, pos: 'GK' },
      { id: 102, name: 'Gonzalo Montiel', number: 4, pos: 'RB' },
      { id: 103, name: 'Leandro Paredes', number: 5, pos: 'CM' },
      { id: 104, name: 'Lautaro Martínez', number: 22, pos: 'ST' }
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
      primaryColor: '#ef4444',
      secondaryColor: '#ffffff',
      sleeveColor: '#ffffff',
      collarColor: '#ffffff',
      pattern: 'solid',
      numberColor: '#ffffff'
    },
    gkKitStyle: {
      primaryColor: '#3b82f6',
      secondaryColor: '#1d4ed8',
      pattern: 'solid',
      numberColor: '#ffffff'
    },
    players: [
      { id: 1, name: 'Jens Lehmann', number: 1, pos: 'GK', isGoalkeeper: true, isCaptain: false, photo: '' },
      { id: 2, name: 'Lauren', number: 12, pos: 'RB', isCaptain: false, photo: '' },
      { id: 3, name: 'Sol Campbell', number: 23, pos: 'CB', isCaptain: false, photo: '' },
      { id: 4, name: 'Kolo Touré', number: 28, pos: 'CB', isCaptain: false, photo: '' },
      { id: 5, name: 'Ashley Cole', number: 3, pos: 'LB', isCaptain: false, photo: '' },
      { id: 6, name: 'Freddie Ljungberg', number: 8, pos: 'RM', isCaptain: false, photo: '' },
      { id: 7, name: 'Patrick Vieira', number: 4, pos: 'CM', isCaptain: true, photo: '' },
      { id: 8, name: 'Gilberto Silva', number: 19, pos: 'CM', isCaptain: false, photo: '' },
      { id: 9, name: 'Robert Pires', number: 7, pos: 'LM', isCaptain: false, photo: '' },
      { id: 10, name: 'Dennis Bergkamp', number: 10, pos: 'ST', isCaptain: false, photo: '' },
      { id: 11, name: 'Thierry Henry', number: 14, pos: 'ST', isCaptain: false, photo: '' }
    ],
    bench: [
      { id: 101, name: 'Martin Keown', number: 5, pos: 'CB' },
      { id: 102, name: 'Ray Parlour', number: 15, pos: 'CM' },
      { id: 103, name: 'Edu Gaspar', number: 17, pos: 'CM' },
      { id: 104, name: 'Nwankwo Kanu', number: 25, pos: 'ST' }
    ]
  }
];
