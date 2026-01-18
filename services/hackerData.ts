
import { Hacker, CTFChallenge } from '../types';

export const hackerDatabase: Hacker[] = [
  {
    id: 'kevin-mitnick',
    alias: 'Condor',
    name: 'Kevin Mitnick',
    country: 'AQSH',
    period: '1980-1995',
    description: 'Tarixdagi eng mashhur "social engineer" va hackerlardan biri. U 12 yoshida avtobus biletlarini soxtalashtirishdan boshlagan.',
    notoriety: 10,
    majorExploits: [
      { year: 1982, target: 'NORAD', method: 'Social Engineering', impact: 'AQSH havo hujumidan mudofaa tizimiga kirish' },
      { year: 1989, target: 'Digital Equipment Corp', method: 'Network Intrusion', impact: 'Dasturiy ta\'minot o\'g\'irlanishi' }
    ]
  },
  {
    id: 'anonymous',
    alias: 'Anonymous',
    name: 'Noma\'lum Guruh',
    country: 'Global',
    period: '2003-Hozir',
    description: 'Hacktivizm bilan shug\'ullanuvchi global decentralizatsiya qilingan guruh. Ularning shiori: "Biz legionmiz".',
    notoriety: 9,
    majorExploits: [
      { year: 2011, target: 'PayPal/Visa/MasterCard', method: 'DDoS', impact: 'WikiLeaks\'ni bloklagani uchun javob zarbasi' },
      { year: 2022, target: 'Rossiya Davlat Saytlari', method: 'Cyber Warfare', impact: 'Urushga qarshi kiber-hujumlar' }
    ]
  },
  {
    id: 'gary-mckinnon',
    alias: 'Solo',
    name: 'Gary McKinnon',
    country: 'Buyuk Britaniya',
    period: '2001-2002',
    description: 'NASA va Pentagon kompyuterlariga kirib, NUJ (UFO) haqidagi ma\'lumotlarni qidirgan.',
    notoriety: 8,
    majorExploits: [
      { year: 2002, target: 'US Military & NASA', method: 'Weak Passwords', impact: '24 soatga qurolli kuchlar tarmog\'ini o\'chirib qo\'ydi' }
    ]
  },
  {
    id: 'adrian-lamo',
    alias: 'Homeless Hacker',
    name: 'Adrian Lamo',
    country: 'AQSH',
    period: '2001-2004',
    description: 'Katta kompaniyalar (NYT, Yahoo) xavfsizlik tizimlarini buzib kirib, keyin ularga bu haqda xabar bergan.',
    notoriety: 7,
    majorExploits: [
      { year: 2002, target: 'The New York Times', method: 'Proxy Servers', impact: 'Maxfiy ma\'lumotlar bazasiga kirish' }
    ]
  },
  {
    id: 'jonathan-james',
    alias: 'c0mrade',
    name: 'Jonathan James',
    country: 'AQSH',
    period: '1999',
    description: '15 yoshida NASA va Mudofaa vazirligi tizimlariga kirgan birinchi o\'smir.',
    notoriety: 8,
    majorExploits: [
      { year: 1999, target: 'NASA / Defense Threat Reduction Agency', method: 'Backdoor', impact: 'Xalqaro fazo stansiyasining hayotiy ta\'minot dasturini o\'g\'irlash' }
    ]
  },
  {
    id: 'hamza-bendelladj',
    alias: 'BX1',
    name: 'Hamza Bendelladj',
    country: 'Jazoir',
    period: '2009-2013',
    description: '"Smiling Hacker" nomi bilan mashhur. U o\'g\'irlangan pullarni xayriya ishlariga sarflagani aytiladi.',
    notoriety: 9,
    majorExploits: [
      { year: 2011, target: '217 Bank Tizimlari', method: 'SpyEye Botnet', impact: 'Yuzlab million dollar o\'g\'irlanishi' }
    ]
  }
];

// Helper to generate 100 CTF challenges
const generateChallenges = (): CTFChallenge[] => {
  const categories: ('Web' | 'Crypto' | 'OSINT' | 'Reverse')[] = ['Web', 'Crypto', 'OSINT', 'Reverse'];
  const list: CTFChallenge[] = [
    {
      id: 'ctf-1',
      title: 'Boshlang\'ich Kod',
      description: 'Sayt kodidan "FLAG{...}" ni qidiring.',
      category: 'Web',
      points: 50,
      answer: 'FLAG{welcome_to_cyber_world}'
    },
    {
      id: 'ctf-2',
      title: 'Sezar Shifri',
      description: 'KHOOR (Shift: 3)',
      category: 'Crypto',
      points: 50,
      answer: 'HELLO'
    }
  ];

  // Adding 98 more programmatically to reach 100
  for (let i = 3; i <= 100; i++) {
    const cat = categories[i % 4];
    let title = "";
    let desc = "";
    let ans = "";
    let pts = 10 * (i % 10 + 1);

    if (cat === 'Crypto') {
      const cryptoTasks = [
        { q: "42 69 6e 61 72 79", a: "Binary", d: "Hex matnni o'qing" },
        { q: "SGVsbG8=", a: "Hello", d: "Base64 shifrini yeching" },
        { q: "01000001 01000010", a: "AB", d: "Ikkilik kodni harfga aylantiring" },
        { q: "... --- ...", a: "SOS", d: "Morze alifbosi" },
        { q: "ROT13: Guvf vf n fgevat", a: "This is a string", d: "ROT13 algoritmi" }
      ];
      const task = cryptoTasks[i % cryptoTasks.length];
      title = `Kripto Missiya #${i}`;
      desc = task.d + ": " + task.q;
      ans = task.a;
    } else if (cat === 'Web') {
      title = `Veb Qidiruv #${i}`;
      desc = `HTTP Status 404 nimani anglatadi? (Kichik harflarda)`;
      ans = "not found";
      if (i % 3 === 0) {
        desc = "Veb-saytning robotlar uchun mo'ljallangan fayli nomi?";
        ans = "robots.txt";
      } else if (i % 5 === 0) {
        desc = "Cookie fayllari qayerda saqlanadi? (server/brauzer)";
        ans = "brauzer";
      }
    } else if (cat === 'OSINT') {
      title = `Razvedka #${i}`;
      desc = "Linux operatsion tizimining yaratuvchisi kim? (Ism Familiya)";
      ans = "Linus Torvalds";
      if (i % 2 === 0) {
        desc = "Birinchi kompyuter virusi nomi?";
        ans = "creeper";
      }
    } else {
      title = `Mantiqiy Reverse #${i}`;
      desc = `Agar X + Y = 10 va X - Y = 2 bo'lsa, X nechaga teng?`;
      ans = "6";
    }

    list.push({
      id: `ctf-${i}`,
      title,
      description: desc,
      category: cat,
      points: pts,
      answer: ans
    });
  }
  return list;
};

export const ctfChallenges: CTFChallenge[] = generateChallenges();
