/**
 * molecules.js — Molecular structure data for the 3D viewer
 * Each molecule has: atoms (symbol, pos, color, radius),
 *                    bonds (index pairs),
 *                    meta  (display info & properties)
 */
const MOLECULES = {
  // ── 무기물 ───────────────────────────────────────────────
  H2O: {
    category: 'inorganic',
    name: '물 (Water)',
    nameEn: 'Water',
    formula: 'H₂O',
    mw: '18.02',
    atoms: [
      { symbol: 'O', pos: [ 0.00,  0.00,  0.00], color: 0xe84545, radius: 0.60 },
      { symbol: 'H', pos: [-0.76, -0.59,  0.00], color: 0xd0d8e8, radius: 0.35 },
      { symbol: 'H', pos: [ 0.76, -0.59,  0.00], color: 0xd0d8e8, radius: 0.35 },
    ],
    bonds: [[0,1],[0,2]],
    properties: {
      boiling: '100 °C', melting: '0 °C',
      shape: '굽은형 (Bent)', polarity: '극성 분자',
    },
    description: '물은 산소 원자 1개와 수소 원자 2개로 이루어진 분자로, 지구상의 생명체에게 필수적인 물질입니다. 굽은형(bent) 구조이며 H-O-H 결합각은 약 104.5°입니다. 극성 공유결합으로 이루어진 극성 분자이며, 수소결합을 형성합니다.',
  },

  CO2: {
    category: 'inorganic',
    name: '이산화탄소 (Carbon Dioxide)',
    nameEn: 'Carbon Dioxide',
    formula: 'CO₂',
    mw: '44.01',
    atoms: [
      { symbol: 'C', pos: [ 0.00, 0.00, 0.00], color: 0x555575, radius: 0.55 },
      { symbol: 'O', pos: [-1.16, 0.00, 0.00], color: 0xe84545, radius: 0.55 },
      { symbol: 'O', pos: [ 1.16, 0.00, 0.00], color: 0xe84545, radius: 0.55 },
    ],
    bonds: [[0,1],[0,2]],
    properties: {
      boiling: '-78.5 °C (승화)', melting: '-56.6 °C',
      shape: '직선형 (Linear)', polarity: '무극성 분자',
    },
    description: '이산화탄소는 탄소 원자 1개와 산소 원자 2개로 이루어진 선형 분자입니다. 온실가스의 대표적 물질로 광합성과 호흡에 핵심적인 역할을 합니다. 무극성 분자이며 이중결합 2개를 포함합니다.',
  },

  NH3: {
    category: 'inorganic',
    name: '암모니아 (Ammonia)',
    nameEn: 'Ammonia',
    formula: 'NH₃',
    mw: '17.03',
    atoms: [
      { symbol: 'N', pos: [ 0.000,  0.000,  0.000], color: 0x5577ff, radius: 0.58 },
      { symbol: 'H', pos: [ 0.940,  0.000, -0.333], color: 0xd0d8e8, radius: 0.35 },
      { symbol: 'H', pos: [-0.470,  0.814, -0.333], color: 0xd0d8e8, radius: 0.35 },
      { symbol: 'H', pos: [-0.470, -0.814, -0.333], color: 0xd0d8e8, radius: 0.35 },
    ],
    bonds: [[0,1],[0,2],[0,3]],
    properties: {
      boiling: '-33.4 °C', melting: '-77.7 °C',
      shape: '삼각뿔형 (Trigonal Pyramidal)', polarity: '극성 분자',
    },
    description: '암모니아는 질소 원자 1개와 수소 원자 3개로 이루어진 분자입니다. 삼각뿔 형태로 비공유 전자쌍의 반발로 인해 H-N-H 결합각이 약 107°입니다. 비료 원료로 중요하게 사용됩니다.',
  },

  NaCl: {
    category: 'inorganic',
    name: '염화나트륨 (Sodium Chloride)',
    nameEn: 'Sodium Chloride',
    formula: 'NaCl',
    mw: '58.44',
    atoms: [
      { symbol: 'Na', pos: [-1.00, 0.00, 0.00], color: 0xaa88ff, radius: 0.80 },
      { symbol: 'Cl', pos: [ 1.00, 0.00, 0.00], color: 0x55cc55, radius: 0.70 },
    ],
    bonds: [[0,1]],
    properties: {
      boiling: '1,413 °C', melting: '801 °C',
      shape: '선형 (Linear)', polarity: '이온 결합',
    },
    description: '염화나트륨은 나트륨 이온(Na⁺)과 염소 이온(Cl⁻)으로 이루어진 이온 화합물입니다. 일상적인 소금의 주성분으로 전형적인 이온 결합 화합물입니다. 물에 잘 용해되며 용액에서 전기를 전도합니다.',
  },

  HCl: {
    category: 'inorganic',
    name: '염화수소 (Hydrogen Chloride)',
    nameEn: 'Hydrogen Chloride',
    formula: 'HCl',
    mw: '36.46',
    atoms: [
      { symbol: 'H', pos: [-0.64, 0.00, 0.00], color: 0xd0d8e8, radius: 0.35 },
      { symbol: 'Cl', pos: [ 0.64, 0.00, 0.00], color: 0x55cc55, radius: 0.65 },
    ],
    bonds: [[0,1]],
    properties: {
      boiling: '-85.1 °C', melting: '-114.2 °C',
      shape: '선형 (Linear)', polarity: '극성 분자',
    },
    description: '염화수소는 수소 원자 1개와 염소 원자 1개로 이루어진 이원자 분자입니다. 물에 용해되면 강산인 염산(HCl aq)이 됩니다. 큰 쌍극자 모멘트를 가진 극성 분자입니다.',
  },

  // ── 유기물 ────────────────────────────────────────────────
  CH4: {
    category: 'organic',
    name: '메테인 (Methane)',
    nameEn: 'Methane',
    formula: 'CH₄',
    mw: '16.04',
    atoms: [
      { symbol: 'C', pos: [ 0.000,  0.000,  0.000], color: 0x9399b2, radius: 0.60 },
      { symbol: 'H', pos: [ 0.630,  0.630,  0.630], color: 0xd0d8e8, radius: 0.35 },
      { symbol: 'H', pos: [-0.630, -0.630,  0.630], color: 0xd0d8e8, radius: 0.35 },
      { symbol: 'H', pos: [ 0.630, -0.630, -0.630], color: 0xd0d8e8, radius: 0.35 },
      { symbol: 'H', pos: [-0.630,  0.630, -0.630], color: 0xd0d8e8, radius: 0.35 },
    ],
    bonds: [[0,1],[0,2],[0,3],[0,4]],
    properties: {
      boiling: '-161.5 °C', melting: '-182.5 °C',
      shape: '정사면체형 (Tetrahedral)', polarity: '무극성 분자',
    },
    description: '메테인은 가장 단순한 유기화합물로 탄소 원자 1개와 수소 원자 4개로 이루어집니다. 정사면체 구조이며 H-C-H 결합각은 109.5°입니다. 천연가스의 주성분이며 온실가스로 작용합니다.',
  },

  C2H6: {
    category: 'organic',
    name: '에테인 (Ethane)',
    nameEn: 'Ethane',
    formula: 'C₂H₆',
    mw: '30.07',
    atoms: [
      { symbol: 'C', pos: [-0.77,  0.00,  0.00], color: 0x9399b2, radius: 0.60 },
      { symbol: 'C', pos: [ 0.77,  0.00,  0.00], color: 0x9399b2, radius: 0.60 },
      { symbol: 'H', pos: [-1.17,  1.02,  0.00], color: 0xd0d8e8, radius: 0.35 },
      { symbol: 'H', pos: [-1.17, -0.51,  0.88], color: 0xd0d8e8, radius: 0.35 },
      { symbol: 'H', pos: [-1.17, -0.51, -0.88], color: 0xd0d8e8, radius: 0.35 },
      { symbol: 'H', pos: [ 1.17,  1.02,  0.00], color: 0xd0d8e8, radius: 0.35 },
      { symbol: 'H', pos: [ 1.17, -0.51,  0.88], color: 0xd0d8e8, radius: 0.35 },
      { symbol: 'H', pos: [ 1.17, -0.51, -0.88], color: 0xd0d8e8, radius: 0.35 },
    ],
    bonds: [[0,1],[0,2],[0,3],[0,4],[1,5],[1,6],[1,7]],
    properties: {
      boiling: '-88.6 °C', melting: '-183.3 °C',
      shape: '정사면체형 (Tetrahedral)', polarity: '무극성 분자',
    },
    description: '에테인은 탄소 2개와 수소 6개로 이루어진 알케인 계열 유기화합물입니다. C-C 단일결합을 가지며, 각 탄소는 정사면체 배열입니다. 천연가스에 소량 포함되어 있습니다.',
  },

  C2H4: {
    category: 'organic',
    name: '에틸렌 (Ethylene)',
    nameEn: 'Ethylene',
    formula: 'C₂H₄',
    mw: '28.05',
    atoms: [
      { symbol: 'C', pos: [-0.67,  0.00, 0.00], color: 0x9399b2, radius: 0.60 },
      { symbol: 'C', pos: [ 0.67,  0.00, 0.00], color: 0x9399b2, radius: 0.60 },
      { symbol: 'H', pos: [-1.23,  0.93, 0.00], color: 0xd0d8e8, radius: 0.35 },
      { symbol: 'H', pos: [-1.23, -0.93, 0.00], color: 0xd0d8e8, radius: 0.35 },
      { symbol: 'H', pos: [ 1.23,  0.93, 0.00], color: 0xd0d8e8, radius: 0.35 },
      { symbol: 'H', pos: [ 1.23, -0.93, 0.00], color: 0xd0d8e8, radius: 0.35 },
    ],
    bonds: [[0,1],[0,2],[0,3],[1,4],[1,5]],
    properties: {
      boiling: '-103.7 °C', melting: '-169.4 °C',
      shape: '평면형 (Planar)', polarity: '무극성 분자',
    },
    description: '에틸렌은 탄소 2개가 이중결합으로 연결된 가장 단순한 알켄입니다. 평면 구조이며 C=C 이중결합을 가집니다. 식물 호르몬 역할을 하며, 플라스틱(폴리에틸렌) 원료로 매우 중요합니다.',
  },

  C6H6: {
    category: 'organic',
    name: '벤젠 (Benzene)',
    nameEn: 'Benzene',
    formula: 'C₆H₆',
    mw: '78.11',
    atoms: [
      { symbol: 'C', pos: [ 1.40,  0.00, 0.00], color: 0x9399b2, radius: 0.55 },
      { symbol: 'C', pos: [ 0.70,  1.21, 0.00], color: 0x9399b2, radius: 0.55 },
      { symbol: 'C', pos: [-0.70,  1.21, 0.00], color: 0x9399b2, radius: 0.55 },
      { symbol: 'C', pos: [-1.40,  0.00, 0.00], color: 0x9399b2, radius: 0.55 },
      { symbol: 'C', pos: [-0.70, -1.21, 0.00], color: 0x9399b2, radius: 0.55 },
      { symbol: 'C', pos: [ 0.70, -1.21, 0.00], color: 0x9399b2, radius: 0.55 },
      { symbol: 'H', pos: [ 2.49,  0.00, 0.00], color: 0xd0d8e8, radius: 0.30 },
      { symbol: 'H', pos: [ 1.24,  2.15, 0.00], color: 0xd0d8e8, radius: 0.30 },
      { symbol: 'H', pos: [-1.24,  2.15, 0.00], color: 0xd0d8e8, radius: 0.30 },
      { symbol: 'H', pos: [-2.49,  0.00, 0.00], color: 0xd0d8e8, radius: 0.30 },
      { symbol: 'H', pos: [-1.24, -2.15, 0.00], color: 0xd0d8e8, radius: 0.30 },
      { symbol: 'H', pos: [ 1.24, -2.15, 0.00], color: 0xd0d8e8, radius: 0.30 },
    ],
    bonds: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]],
    properties: {
      boiling: '80.1 °C', melting: '5.5 °C',
      shape: '평면 육각형 (Planar Hexagonal)', polarity: '무극성 분자',
    },
    description: '벤젠은 탄소 6개가 정육각형 고리를 이루는 방향족 화합물입니다. π 전자가 고리 전체에 비편재화(delocalized)되어 있으며, 모든 C-C 결합 길이가 동일합니다. 유기화학의 핵심 구조입니다.',
  },

  CH3OH: {
    category: 'organic',
    name: '메탄올 (Methanol)',
    nameEn: 'Methanol',
    formula: 'CH₃OH',
    mw: '32.04',
    atoms: [
      { symbol: 'C', pos: [ 0.00,  0.00,  0.000], color: 0x9399b2, radius: 0.60 },
      { symbol: 'O', pos: [ 1.43,  0.00,  0.000], color: 0xe84545, radius: 0.55 },
      { symbol: 'H', pos: [ 1.83,  0.89,  0.000], color: 0xd0d8e8, radius: 0.30 },
      { symbol: 'H', pos: [-0.39,  1.03,  0.000], color: 0xd0d8e8, radius: 0.30 },
      { symbol: 'H', pos: [-0.39, -0.51,  0.890], color: 0xd0d8e8, radius: 0.30 },
      { symbol: 'H', pos: [-0.39, -0.51, -0.890], color: 0xd0d8e8, radius: 0.30 },
    ],
    bonds: [[0,1],[1,2],[0,3],[0,4],[0,5]],
    properties: {
      boiling: '64.7 °C', melting: '-97.6 °C',
      shape: '사면체형 (Tetrahedral)', polarity: '극성 분자',
    },
    description: '메탄올(목정)은 가장 간단한 알코올로 하이드록시기(-OH)를 갖습니다. 독성이 강하며 마시면 실명이나 사망을 초래할 수 있습니다. 연료, 용매, 화학 원료로 널리 사용됩니다.',
  },

  // ── 생체분자 ──────────────────────────────────────────────
  C6H12O6: {
    category: 'biomolecule',
    name: '포도당 (Glucose)',
    nameEn: 'Glucose',
    formula: 'C₆H₁₂O₆',
    mw: '180.16',
    atoms: [
      // Ring carbons
      { symbol: 'C', pos: [ 1.20,  0.50, 0.00], color: 0x9399b2, radius: 0.50 },
      { symbol: 'C', pos: [ 1.20, -0.80, 0.00], color: 0x9399b2, radius: 0.50 },
      { symbol: 'C', pos: [ 0.00, -1.50, 0.00], color: 0x9399b2, radius: 0.50 },
      { symbol: 'C', pos: [-1.20, -0.80, 0.00], color: 0x9399b2, radius: 0.50 },
      { symbol: 'C', pos: [-1.20,  0.50, 0.00], color: 0x9399b2, radius: 0.50 },
      // Ring oxygen
      { symbol: 'O', pos: [  0.00,  1.20, 0.00], color: 0xe84545, radius: 0.48 },
      // Hydroxyl oxygens
      { symbol: 'O', pos: [ 2.40,  0.50, 0.65], color: 0xe84545, radius: 0.45 },
      { symbol: 'O', pos: [ 2.40, -0.80,-0.65], color: 0xe84545, radius: 0.45 },
      { symbol: 'O', pos: [ 0.00, -2.70, 0.00], color: 0xe84545, radius: 0.45 },
      { symbol: 'O', pos: [-2.40, -0.80, 0.65], color: 0xe84545, radius: 0.45 },
      // CH2OH group
      { symbol: 'C', pos: [-2.40,  0.50, 0.00], color: 0x9399b2, radius: 0.50 },
      { symbol: 'O', pos: [-3.60,  0.50, 0.65], color: 0xe84545, radius: 0.45 },
    ],
    bonds: [
      [0,1],[1,2],[2,3],[3,4],[4,5],[5,0],   // ring
      [0,6],[1,7],[2,8],[3,9],[4,10],[10,11]  // substituents
    ],
    properties: {
      boiling: '분해됨', melting: '146 °C',
      shape: '육각고리형 (Pyranose)', polarity: '극성 분자',
    },
    description: '포도당은 세포 에너지의 주요 원료인 단당류입니다. 6탄소 육각고리(피라노스) 형태로 존재합니다. 광합성의 산물이며 세포호흡을 통해 ATP를 생성합니다. 혈당의 주성분입니다.',
  },

  C3H7NO2: {
    category: 'biomolecule',
    name: '알라닌 (Alanine)',
    nameEn: 'Alanine (Amino Acid)',
    formula: 'C₃H₇NO₂',
    mw: '89.09',
    atoms: [
      { symbol: 'C',  pos: [ 0.00,  0.00,  0.00], color: 0x9399b2, radius: 0.55 }, // alpha-C
      { symbol: 'N',  pos: [-1.30,  0.70,  0.00], color: 0x5577ff, radius: 0.55 }, // amino
      { symbol: 'C',  pos: [ 1.20,  0.80,  0.00], color: 0x9399b2, radius: 0.55 }, // carboxyl C
      { symbol: 'O',  pos: [ 1.05,  2.00,  0.00], color: 0xe84545, radius: 0.50 }, // =O
      { symbol: 'O',  pos: [ 2.40,  0.30,  0.00], color: 0xe84545, radius: 0.50 }, // -OH
      { symbol: 'C',  pos: [ 0.00, -1.50,  0.00], color: 0x9399b2, radius: 0.50 }, // methyl
      { symbol: 'H',  pos: [-1.30,  1.70,  0.00], color: 0xd0d8e8, radius: 0.28 },
      { symbol: 'H',  pos: [-1.80,  0.40,  0.80], color: 0xd0d8e8, radius: 0.28 },
      { symbol: 'H',  pos: [ 3.20,  0.90,  0.00], color: 0xd0d8e8, radius: 0.28 },
      { symbol: 'H',  pos: [ 0.00, -2.00,  1.03], color: 0xd0d8e8, radius: 0.28 },
      { symbol: 'H',  pos: [-1.03, -1.90,  0.00], color: 0xd0d8e8, radius: 0.28 },
      { symbol: 'H',  pos: [ 0.00, -2.00, -1.03], color: 0xd0d8e8, radius: 0.28 },
    ],
    bonds: [[0,1],[0,2],[2,3],[2,4],[0,5],[1,6],[1,7],[4,8],[5,9],[5,10],[5,11]],
    properties: {
      boiling: '분해됨', melting: '258 °C (분해)',
      shape: '사면체형 (Tetrahedral)', polarity: '극성 (쌍극성 이온)',
    },
    description: '알라닌은 가장 간단한 비필수 아미노산 중 하나입니다. 아미노기(-NH₂)와 카르복실기(-COOH), 그리고 메틸기(-CH₃) 곁사슬을 갖습니다. 단백질 구성에 매우 흔히 사용되며 포도당 신생합성에 관여합니다.',
  },
};

// Export for use in app.js
// (Using global variable since we're not using ES modules with external scripts)
window.MOLECULES = MOLECULES;
