import { db } from './db';
import { category, keyword, book } from './db/schema';
import { eq } from 'drizzle-orm';
import KEYWORDS_BY_CATEGORY from './keywords.json';

// Compute OpenLibrary cover URL from ISBN (guaranteed to match the correct book)
const coverFromIsbn = (isbn: string): string =>
  `https://covers.openlibrary.org/b/isbn/${isbn.replace(/-/g, '')}-L.jpg`;

// Catégories
const CATEGORIES = [
  { name: 'unknown', isActive: true },
  { name: 'horreur', isActive: true },
  { name: 'romance', isActive: true },
  { name: 'aventure', isActive: true },
  { name: 'fantasy', isActive: true },
  { name: 'science-fiction', isActive: true },
];

// Livres d'exemple pour chaque catégorie avec ISBN-13 valides OpenLibrary
const BOOKS_BY_CATEGORY: Record<
  string,
  Array<{
    name: string;
    author: string;
    description: string;
    isbn: string;
    publishingHouse: string;
    publishedAt: Date;
  }>
> = {
  horreur: [
    {
      name: 'Maison des morts',
      author: 'Robert Lawrence Stine',
      description:
        'Amanda et Josh emménagent dans une maison étrange et découvrent que la ville de Dark Falls cache un secret inquiétant lié à ses habitants.',
      isbn: '9782747002356',
      publishingHouse: 'Bayard',
      publishedAt: new Date('2001-05-01'),
    },
    {
      name: 'La trahison',
      author: 'Janice Harrell',
      description: '',
      isbn: '9782762579307',
      publishingHouse: 'Héritage',
      publishedAt: new Date('1995'),
    },
    {
      name: "L'invasion des ténèbres",
      author: 'Skip Moën',
      description: '',
      isbn: '9782921463584',
      publishingHouse: "L'Interligne",
      publishedAt: new Date('2001'),
    },
    {
      name: 'Le labyrinthe du cyclope',
      author: 'Richard Petit',
      description: '',
      isbn: '9782895950523',
      publishingHouse: 'Boomerang éditeur jeunesse',
      publishedAt: new Date('2004'),
    },
    {
      name: 'Le prof cannibale',
      author: 'Richard Petit',
      description: '',
      isbn: '9781552250280',
      publishingHouse: "Presses d'or",
      publishedAt: new Date('1997'),
    },
    {
      name: 'Sekhmet, la déesse sauvage',
      author: 'François Gravel',
      description:
        'Un groupe d’élèves enquête sur des événements inquiétants liés à une figure mystérieuse associée à la déesse égyptienne Sekhmet.',
      isbn: '9782764403907',
      publishingHouse: 'Québec Amérique',
      publishedAt: new Date('2005'),
    },
    {
      name: 'Le piège',
      author: 'Gaëtan Picard',
      description: '',
      isbn: '9782896330485',
      publishingHouse: 'Éditions P. Tisseyre',
      publishedAt: new Date('2007'),
    },
    {
      name: 'La route de Woodbury',
      author: 'Robert Kirkman',
      description:
        'Lilly Caul se réfugie dans la ville fortifiée de Woodbury dirigée par le Gouverneur, mais découvre que ce havre de paix cache une réalité plus sombre.',
      isbn: '9782253134831',
      publishingHouse: 'Le Livre de Poche',
      publishedAt: new Date('2012'),
    },
    {
      name: 'La bibliothèque de minuit',
      author: 'Shaun Hutson',
      description: '',
      isbn: '9782092513507',
      publishingHouse: 'Nathan',
      publishedAt: new Date('2006'),
    },
  ],
  romance: [
    {
      name: 'Orgueil et préjugés',
      author: 'Jane Austen',
      description:
        'Elizabeth Bennet découvre les conséquences des jugements hâtifs et apprend à distinguer les apparences de la véritable nature des personnes, dans une société anglaise où le mariage est une obligation sociale et économique.',
      isbn: '9782352875109',
      publishingHouse: 'Archipoche',
      publishedAt: new Date('2013-01-01T00:00:00.000Z'),
    },
    {
      name: 'Trois rêves. La Blessure de Laura, tome 3',
      author: 'Nora Roberts',
      description:
        'Laura Templeton, après un divorce douloureux et la perte de sa sécurité financière, doit reconstruire sa vie et redécouvrir qui elle est en tant que femme indépendante.',
      isbn: '9782290145852',
      publishingHouse: "J'ai lu",
      publishedAt: new Date('1999-04-01T00:00:00.000Z'),
    },
    {
      name: 'Le château de mes rêves',
      author: 'Lucy Maud Montgomery',
      description:
        'Valancy Stirling, 29 ans et célibataire, vit une vie étouffante jusqu’à ce qu’un diagnostic médical la pousse à changer radicalement de destin et à chercher le bonheur et l’amour.',
      isbn: '9782724266627',
      publishingHouse: 'France Loisirs',
      publishedAt: new Date('1992-01-01T00:00:00.000Z'),
    },
    {
      name: 'Hadès et Perséphone - Tome 02 : A touch of ruin',
      author: 'Scarlett St. Clair',
      description:
        'La relation entre Perséphone et Hadès est mise à l’épreuve par des révélations, des pertes et des choix difficiles qui pourraient déterminer son destin en tant que future reine des Enfers.',
      isbn: '9782755696301',
      publishingHouse: 'Hugo Roman',
      publishedAt: new Date('2022-05-31T00:00:00.000Z'),
    },
    {
      name: 'Cinquante nuances plus sombres',
      author: 'E. L. James',
      description:
        'Anastasia Steele retrouve Christian Grey malgré leurs démons personnels et tente de naviguer entre désir, passé traumatique et relations complexes.',
      isbn: '9782298065367',
      publishingHouse: 'Editions de Noyelles',
      publishedAt: new Date('2013-01-01T00:00:00.000Z'),
    },
    {
      name: "L'espion de la couronne",
      author: 'Celeste Bradley',
      description:
        'Une romance historique où intrigues, secrets et attirance se mêlent dans un contexte de complots et d’espionnage autour de la Couronne.',
      isbn: '9782290094730',
      publishingHouse: "J'ai lu",
      publishedAt: new Date('2014-01-01T00:00:00.000Z'),
    },
    {
      name: "L'île des Trois Soeurs - 1 : Nell",
      author: 'Nora Roberts',
      description:
        'Nell, en fuite après une vie violente, tente de se reconstruire sur une île mystérieuse où elle découvre l’amour, le danger et une ancienne malédiction.',
      isbn: '9782744187305',
      publishingHouse: 'Editions France Loisirs',
      publishedAt: new Date('2005-10-01T00:00:00.000Z'),
    },
    {
      name: 'La promesse de Noël',
      author: 'Nora Roberts',
      description:
        'Une romance où deux caractères opposés s’affrontent avant de découvrir l’amour malgré les blessures du passé et les résistances émotionnelles.',
      isbn: '9782280812207',
      publishingHouse: 'Harlequin',
      publishedAt: new Date('2009-01-01T00:00:00.000Z'),
    },
  ],
  aventure: [
    {
      name: "Peter et la poussière d'étoiles",
      author: 'Dave Barry, Ridley Pearson, Jim Dale',
      description:
        'Peter et ses amis embarquent de force sur le Never Land, où ils découvrent une malle contenant de la poussière d’étoiles capable de faire voler. Ils doivent protéger ce secret du pirate Black Stache.',
      isbn: '9782226186287',
      publishingHouse: 'Albin Michel',
      publishedAt: new Date('2008-01-01'),
    },
    {
      name: 'Le Symbole Perdu',
      author: 'Dan Brown',
      description:
        'Le symbologiste Robert Langdon est entraîné dans une enquête à Washington D.C. autour de la franc-maçonnerie et de secrets enfouis liés à une société occulte.',
      isbn: '9782253134176',
      publishingHouse: 'JC Lattès',
      publishedAt: new Date('2009-09-15'),
    },
    {
      name: 'Le royaume des loups',
      author: 'Kathryn Lasky',
      description:
        'Un louveteau rejeté survit dans la nature sauvage et tente de trouver sa place parmi les siens après avoir été élevé par une ourse.',
      isbn: '9782266211512',
      publishingHouse: 'Pocket Jeunesse',
      publishedAt: new Date('2011-01-01'),
    },
    {
      name: 'La tombe du chaman',
      author: 'Sylvie Desrosiers',
      description:
        'Une découverte étrange dans les bois entraîne plusieurs habitants dans une enquête mêlant archéologie, mystère et mythologie amérindienne.',
      isbn: '9782896512676',
      publishingHouse: 'La Courte Échelle',
      publishedAt: new Date('2009-01-01'),
    },
    {
      name: 'Les parchemins égarés',
      author: 'Paul Stewart, Chris Riddell',
      description:
        'Quatre récits issus de parchemins anciens retrouvés dans une bibliothèque mystérieuse, explorant des personnages de l’univers des Chroniques du bout du monde.',
      isbn: '9782745933942',
      publishingHouse: 'Éditions Milan',
      publishedAt: new Date('2008-01-01'),
    },
    {
      name: 'Méto - tome 1 : La Maison',
      author: 'Yves Grevet, Thomas Ehretsmann',
      description:
        'Des adolescents vivent enfermés dans une Maison régie par des règles strictes et commencent à découvrir la vérité sur leur monde.',
      isbn: '9782748506884',
      publishingHouse: 'Syros Jeunesse',
      publishedAt: new Date('2008-04-03'),
    },
    {
      name: "Les collégiens mènent l'enquête",
      author: 'Chrystine Brouillet',
      description:
        'Des collégiens utilisent leur sens de l’observation pour résoudre diverses enquêtes mystérieuses dans leur environnement scolaire.',
      isbn: '9782266088527',
      publishingHouse: 'Pocket Jeunesse',
      publishedAt: new Date('2000-01-01'),
    },
  ],
  fantasy: [
    {
      name: 'Le Seigneur des Anneaux, Intégrale',
      author: 'J.R.R. Tolkien',
      description:
        'Une quête épique pour détruire un anneau magique et sauver le monde de la domination du mal.',
      isbn: '9782266286268',
      publishingHouse: 'Le Livre de Poche',
      publishedAt: new Date('1954-07-29'),
    },
    {
      name: "Le puits de l'ascension",
      author: 'Brandon Sanderson',
      description:
        "La suite de Mistborn : l'héroïne doit apprendre à maîtriser ses nouveaux pouvoirs.",
      isbn: '9782253023616',
      publishingHouse: 'Bragelonne',
      publishedAt: new Date('2007-08-29'),
    },
    {
      name: 'Le Trône de Fer (L’intégrale 3)',
      author: 'George R. R. Martin',
      description:
        "Les intrigues politiques et guerres s'intensifient dans le monde de Westeros.",
      isbn: '9782290022160',
      publishingHouse: "J'ai Lu",
      publishedAt: new Date('1996-08-06'),
    },
    {
      name: 'Le Nom du Vent',
      author: 'Patrick Rothfuss',
      description:
        "L'histoire d'un magicien légendaire racontée par lui-même dans un monde époustouflant.",
      isbn: '9782352942832',
      publishingHouse: 'Bragelonne',
      publishedAt: new Date('2007-08-29'),
    },
    {
      name: 'Bilbo le Hobbit',
      author: 'J.R.R. Tolkien',
      description:
        "L'aventure d'un petit hobbit qui part à la quête d'un trésor gardé par un dragon.",
      isbn: '9782253177104',
      publishingHouse: 'Le Livre de Poche',
      publishedAt: new Date('1937-09-21'),
    },
    {
      name: 'Harry Potter à l’école des sorciers',
      author: 'J. K. Rowling',
      description:
        'Un jeune sorcier découvre un monde magique caché et fait face aux menaces du mal.',
      isbn: '9782070643028',
      publishingHouse: 'Gallimard Jeunesse',
      publishedAt: new Date('1997-06-26'),
    },
    {
      name: 'Harry Potter et l’Ordre du Phénix',
      author: 'J. K. Rowling',
      description:
        'Harry grandit et affronte les manipulations du ministère tandis que le mal revient.',
      isbn: '9782070556854',
      publishingHouse: 'Gallimard',
      publishedAt: new Date('2003-12-01'),
    },
    {
      name: 'Le secret du chevalier',
      author: 'Tamora Pierce',
      description:
        "L'histoire d'un jeune chevalier face à des défis magiques et politiques.",
      isbn: '9782012015883',
      publishingHouse: 'Hachette Jeunesse',
      publishedAt: new Date('2001-01-01'),
    },
    {
      name: 'Ténèbres sur Sethanon',
      author: 'Raymond E. Feist',
      description:
        "Le dernier livre de la Saga de Valdez : le final d'une épopée fantasy majeure.",
      isbn: '9782290320365',
      publishingHouse: "J'ai Lu",
      publishedAt: new Date('2002-11-04'),
    },
  ],
  'science-fiction': [
    {
      name: 'Seul sur Mars',
      author: 'Andy Weir',
      publishingHouse: 'BRAGELONNE',
      publishedAt: new Date('2015-10-16'),
      isbn: '9782811215729',
      description:
        'Un astronaute américain se retrouve seul sur Mars et doit improviser pour survivre après avoir été laissé pour mort.',
    },
    {
      name: 'Dune 1',
      author: 'Frank Herbert',
      publishingHouse: 'Presses Pocket',
      publishedAt: new Date('1980-01-01'),
      isbn: '2266008552',
      description:
        'Sur la planète désertique Arrakis, Paul Atreides devient le centre d’un conflit autour de l’épice, ressource la plus précieuse de l’univers.',
    },
    {
      name: 'La Mort immortelle',
      author: 'Cixin Liu',
      publishingHouse: 'Actes Sud',
      publishedAt: new Date('2021-01-01'),
      isbn: '9782330143190',
      description:
        'Après des décennies de stabilité fragile entre humains et Trisolariens, une nouvelle crise menace l’équilibre des civilisations.',
    },
    {
      name: 'Fondation',
      author: 'Isaac Asimov',
      publishingHouse: 'Denoël',
      publishedAt: new Date('2009-03-26'),
      isbn: '9782070360536',
      description:
        'Hari Seldon crée la Fondation pour préserver le savoir humain face à l’effondrement de l’Empire galactique.',
    },
    {
      name: "La Porte d'Abaddon",
      author: 'James S. A. Corey',
      publishingHouse: 'Actes Sud',
      publishedAt: new Date('2016-09-07'),
      isbn: '9782330064228',
      description:
        'Une mystérieuse porte extraterrestre apparaît au-delà d’Uranus, déclenchant une crise politique et scientifique interstellaire.',
    },
    {
      name: "L'espace d'un an",
      author: 'Becky Chambers',
      publishingHouse: 'Lgf',
      publishedAt: new Date('2020-01-01'),
      isbn: '9782841727667',
      description:
        'Une jeune recrue rejoint un vaisseau spatial multiculturel et découvre la vie en équipage à travers des voyages interstellaires.',
    },
    {
      name: 'Terre et Fondation',
      author: 'Isaac Asimov',
      publishingHouse: 'Denoël',
      publishedAt: new Date('2009-03-26'),
      isbn: '9782070379668',
      description:
        'Golan Trevize et ses compagnons partent à la recherche de la Terre pour comprendre le destin ultime de l’humanité.',
    },
  ],
};

async function seed() {
  console.log('🌱 Début du seeding...\n');

  try {
    // Verify and create categories one by one (idempotent)
    console.log('📚 Création des catégories...');
    let createdCategories = 0;
    for (const cat of CATEGORIES) {
      const [existingCategory] = await db
        .select({ id: category.id })
        .from(category)
        .where(eq(category.name, cat.name));

      if (existingCategory) {
        continue;
      }

      await db.insert(category).values(cat);
      createdCategories++;
      console.log(`  ✅ Catégorie créée: ${cat.name}`);
    }
    if (createdCategories === 0) {
      console.log('  ⏭️  Toutes les catégories existent déjà');
    }

    // Récupérer les catégories avec leurs IDs
    const allCategories = await db.select().from(category);
    const categoryMap = new Map(allCategories.map((c) => [c.name, c.id]));

    // Create keywords per category (idempotent)
    console.log('\n🔑 Création des keywords...');
    let createdKeywordCount = 0;
    for (const [catName, baseKeywords] of Object.entries(
      KEYWORDS_BY_CATEGORY,
    )) {
      const catId = categoryMap.get(catName);
      if (!catId) {
        console.log(`  ❌ Catégorie ${catName} non trouvée`);
        continue;
      }

      const candidateKeywords = baseKeywords.map((kw) => kw.trim());
      const normalizedCandidates = Array.from(
        new Set(candidateKeywords.map((kw) => kw.toLowerCase())),
      );

      const existingForCategory = await db
        .select({ name: keyword.name })
        .from(keyword)
        .where(eq(keyword.categoryId, catId));
      const existingSet = new Set(
        existingForCategory.map((k) => k.name.toLowerCase()),
      );

      let createdForCategory = 0;
      for (const kw of normalizedCandidates) {
        if (existingSet.has(kw)) continue;

        await db.insert(keyword).values({
          name: kw,
          categoryId: catId,
        });
        createdKeywordCount++;
        createdForCategory++;
      }

      if (createdForCategory > 0) {
        console.log(
          `  ✅ ${createdForCategory} keywords ajoutés pour ${catName}`,
        );
      } else {
        console.log(`  ⏭️  Aucun nouveau keyword pour ${catName}`);
      }
    }
    console.log(`  📊 Total nouveaux keywords: ${createdKeywordCount}`);

    // Create books per category based on ISBN uniqueness (idempotent)
    console.log('\n📖 Création des livres...');
    let createdBookCount = 0;
    for (const [catName, books] of Object.entries(BOOKS_BY_CATEGORY)) {
      const catId = categoryMap.get(catName);
      if (!catId) {
        console.log(`  ❌ Catégorie ${catName} non trouvée`);
        continue;
      }

      let createdForCategory = 0;
      for (const b of books) {
        const [existingBook] = await db
          .select({ id: book.id })
          .from(book)
          .where(eq(book.isbn, b.isbn));

        if (existingBook) {
          continue;
        }

        await db.insert(book).values({
          name: b.name,
          cover_url: coverFromIsbn(b.isbn),
          author: b.author,
          description: b.description,
          isbn: b.isbn,
          publishingHouse: b.publishingHouse,
          publishedAt: b.publishedAt.toISOString().slice(0, 10),
          categoryId: catId,
        });
        createdBookCount++;
        createdForCategory++;
      }

      if (createdForCategory > 0) {
        console.log(
          `  ✅ ${createdForCategory} livres ajoutés pour ${catName}`,
        );
      } else {
        console.log(`  ⏭️  Aucun nouveau livre pour ${catName}`);
      }
    }
    console.log(`  📊 Total nouveaux livres: ${createdBookCount}`);

    console.log('\n✨ Seeding terminé avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    process.exit(1);
  }
}

seed();
