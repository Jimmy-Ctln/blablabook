import { db } from './db';
import { category, keyword, book } from './db/schema';
import { eq } from 'drizzle-orm';

// Compute OpenLibrary cover URL from ISBN (guaranteed to match the correct book)
const coverFromIsbn = (isbn: string): string =>
  `https://covers.openlibrary.org/b/isbn/${isbn.replace(/-/g, '')}-L.jpg`;

// Catégories
const CATEGORIES = [
  { name: 'Unknown', isActive: true },
  { name: 'Horreur', isActive: true },
  { name: 'Romance', isActive: true },
  { name: 'Aventure', isActive: true },
  { name: 'Fantasy', isActive: true },
  { name: 'Science-Fiction', isActive: true },
  { name: 'Mystère', isActive: true },
  { name: 'Thriller', isActive: true },
];

// Keywords par catégorie (liste complète, tous mots-clés fusionnés)
const KEYWORDS_BY_CATEGORY: Record<string, string[]> = {
  Horreur: [
    'horror',
    'scary',
    'terror',
    'haunted',
    'supernatural',
    'creepy',
    'dark',
    'evil',
    'curse',
    'monster',
    'ghost',
    'zombie',
    'vampire',
    'possessed',
    'psycho',
    'gore',
    'blood',
    'death',
    'murder',
    'killer',
    'horror fiction',
    'horror stories',
    'occult',
    'paranormal',
    'nightmare',
    'demon',
    'demonic',
    'possession',
    'exorcism',
    'slasher',
    'serial killer',
    'macabre',
    'fear',
    'frightening',
    'body horror',
    'psychological horror',
    'folk horror',
    'gothic horror',
    'haunting',
    'cannibal',
    'werewolf',
    'undead',
    'eldritch',
    'cosmic horror',
    'apocalypse horror',
    'survival horror',
    'satanic',
    'ritual',
    'haunted house',
    'monster fiction',
    'horror novel',
    'creature feature',
  ],
  Romance: [
    'love',
    'romance',
    'passionate',
    'relationship',
    'couple',
    'heart',
    'emotion',
    'feelings',
    'romance novel',
    'happy ending',
    'destiny',
    'soulmate',
    'chemistry',
    'attraction',
    'intimate',
    'tender',
    'yearning',
    'longing',
    'affection',
    'beloved',
    'romantic',
    'romantic fiction',
    'romantic novel',
    'contemporary romance',
    'historical romance',
    'new adult',
    'young adult romance',
    'slow burn',
    'enemies to lovers',
    'friends to lovers',
    'second chance romance',
    'forbidden love',
    'marriage of convenience',
    'first love',
    'romantic suspense',
    'heartbreak',
    'reunion',
    'wedding',
    'dating',
    'courtship',
    'breakup',
    'devotion',
    'desire',
    'flirt',
    'drama romantique',
    'histoire d amour',
    'romance contemporaine',
    'romance historique',
    'triangle amoureux',
    'romance paranormale',
    'chick lit',
    'feel good romance',
  ],
  Aventure: [
    'adventure',
    'quest',
    'journey',
    'explore',
    'exploration',
    'treasure',
    'discovery',
    'danger',
    'risk',
    'action',
    'thrilling',
    'expedition',
    'survival',
    'challenge',
    'daring',
    'brave',
    'heroic',
    'wild',
    'nature',
    'adventure travel',
    'adventure fiction',
    'sea adventure',
    'pirates',
    'wilderness',
    'expedition fiction',
    'travel',
    'voyage',
    'island',
    'jungle',
    'mountain',
    'explorer',
    'hero',
    'heroine',
    'odyssey',
    'sea voyage',
    'naval adventure',
    'historical adventure',
    'swashbuckling',
    'coming of age adventure',
    'adventure stories',
    'quest fantasy',
    'road trip',
    'trek',
    'perseverance',
    'hunt',
    'escape adventure',
    'rescue mission',
    'dangerous mission',
    'exploration fiction',
    'epic journey',
    'adventure novel',
  ],
  Fantasy: [
    'fantasy',
    'magic',
    'magical',
    'wizard',
    'sorcery',
    'enchanted',
    'mythical',
    'creature',
    'dragon',
    'spell',
    'mystical',
    'realm',
    'kingdom',
    'quest',
    'epic',
    'legendary',
    'supernatural',
    'ancient',
    'prophecy',
    'power',
    'high fantasy',
    'epic fantasy',
    'urban fantasy',
    'dark fantasy',
    'grimdark',
    'sword and sorcery',
    'mythology',
    'fae',
    'elves',
    'dwarves',
    'necromancy',
    'runes',
    'worldbuilding',
    'chosen one',
    'magic school',
    'magic system',
    'portal fantasy',
    'fantasy romance',
    'medieval fantasy',
    'legend',
    'myth',
    'saga',
    'artefact',
    'enchantement',
    'royaume',
    'dragon rider',
    'sorcier',
    'sorciere',
    'creatures fantastiques',
    'dark lord',
    'heroic fantasy',
    'fantasy novel',
  ],
  'Science-Fiction': [
    'science fiction',
    'sci-fi',
    'futuristic',
    'space',
    'alien',
    'robot',
    'technology',
    'advanced technology',
    'dystopian',
    'utopian',
    'time travel',
    'parallel universe',
    'cyberpunk',
    'post-apocalyptic',
    'android',
    'artificial intelligence',
    'ai',
    'genetic',
    'mutation',
    'extraterrestrial',
    'science fiction novel',
    'space opera',
    'hard science fiction',
    'soft science fiction',
    'military science fiction',
    'speculative fiction',
    'future',
    'futurism',
    'spaceship',
    'interstellar',
    'colonization',
    'planetary',
    'virtual reality',
    'nanotechnology',
    'biotech',
    'cyborg',
    'automation',
    'machine learning',
    'singularity',
    'clone',
    'space travel',
    'first contact',
    'alien invasion',
    'posthuman',
    'dystopia',
    'utopia',
    'anticipation',
    'retrofuturism',
    'time loop',
    'multiverse',
    'science fantasy',
    'sf',
  ],
  Mystère: [
    'mystery',
    'puzzle',
    'clue',
    'detective',
    'investigation',
    'crime',
    'secret',
    'hidden',
    'unknown',
    'suspicious',
    'conspiracy',
    'murder mystery',
    'whodunit',
    'enigma',
    'riddle',
    'evidence',
    'suspect',
    'revelation',
    'twist',
    'confession',
    'mystery fiction',
    'detective fiction',
    'crime fiction',
    'private investigator',
    'police procedural',
    'cold case',
    'forensic',
    'investigator',
    'interrogation',
    'alibi',
    'witness',
    'crime scene',
    'true crime inspired',
    'locked room mystery',
    'cozy mystery',
    'amateur sleuth',
    'missing person',
    'disappearance',
    'blackmail',
    'betrayal',
    'secret society',
    'twists and turns',
    'murder investigation',
    'who done it',
    'investigation criminelle',
    'roman policier',
    'intrigue',
    'indice',
    'suspicion',
    'mystere',
    'detective novel',
    'case file',
  ],
  Thriller: [
    'thriller',
    'suspense',
    'suspenseful',
    'tension',
    'intense',
    'dangerous',
    'perilous',
    'threat',
    'risk',
    'chase',
    'escape',
    'plot twist',
    'shocking',
    'breathtaking',
    'page-turner',
    'unputdownable',
    'edge of your seat',
    'climax',
    'action packed',
    'pulse pounding',
    'psychological thriller',
    'crime thriller',
    'legal thriller',
    'spy thriller',
    'political thriller',
    'medical thriller',
    'techno thriller',
    'conspiracy thriller',
    'action thriller',
    'cat and mouse',
    'manhunt',
    'high stakes',
    'race against time',
    'hostage',
    'kidnapping',
    'assassin',
    'undercover',
    'espionage',
    'black ops',
    'intelligence',
    'double life',
    'sleeper agent',
    'revenge thriller',
    'mind game',
    'twisty thriller',
    'roman a suspense',
    'thriller psychologique',
    'course poursuite',
    'pression',
    'urgent',
    'cliffhanger',
  ],
};

// Livres d'exemple pour chaque catégorie
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
  Horreur: [
    {
      name: 'The Shining',
      author: 'Stephen King',
      description:
        "Un homme, sa femme et son fils passent l'hiver isolés dans un hôtel montagneux hanté par des forces surnaturelles.",
      isbn: '978-0-385-12167-5',
      publishingHouse: 'Doubleday',
      publishedAt: new Date('1977-01-28'),
    },
    {
      name: 'It',
      author: 'Stephen King',
      description:
        "Un groupe d'enfants fait face à une créature ancienne et maléfique qui hante leur ville.",
      isbn: '978-0-670-81302-8',
      publishingHouse: 'Viking Press',
      publishedAt: new Date('1986-09-15'),
    },
    {
      name: 'The Exorcist',
      author: 'William Peter Blatty',
      description:
        "Le combat entre le bien et le mal lorsqu'une jeune fille est possédée par un démon.",
      isbn: '978-0-06-085242-8',
      publishingHouse: 'Harper & Row',
      publishedAt: new Date('1971-05-01'),
    },
    {
      name: 'The Ring',
      author: 'Koji Suzuki',
      description:
        'Une cassette vidéo maudite qui tue quiconque la regarde sept jours plus tard.',
      isbn: '978-4-06-203834-9',
      publishingHouse: 'Shogakukan',
      publishedAt: new Date('1991-01-01'),
    },
    {
      name: 'The Haunting of Hill House',
      author: 'Shirley Jackson',
      description:
        'Une équipe de chercheurs explore une maison maudite et découvre des phénomènes terrifiants.',
      isbn: '978-0-14-028329-9',
      publishingHouse: 'Viking Press',
      publishedAt: new Date('1959-10-01'),
    },
  ],
  Romance: [
    {
      name: 'Pride and Prejudice',
      author: 'Jane Austen',
      description:
        "L'histoire d'Elisabeth Bennet et de M. Darcy, deux âmes fortes qui découvrent l'amour au-delà de leurs préjugés.",
      isbn: '978-0-14-143951-8',
      publishingHouse: 'T. Egerton',
      publishedAt: new Date('1813-01-28'),
    },
    {
      name: 'The Notebook',
      author: 'Nicholas Sparks',
      description:
        "Une histoire d'amour intemporelle entre deux personnes séparées par les classes sociales.",
      isbn: '978-0-446-52058-4',
      publishingHouse: 'Warner Books',
      publishedAt: new Date('1996-10-01'),
    },
    {
      name: 'Outlander',
      author: 'Diana Gabaldon',
      description:
        "Une femme du 20e siècle voyage dans le temps et tombe amoureuse d'un guerrier écossais au 18e siècle.",
      isbn: '978-0-385-29595-2',
      publishingHouse: 'Delacorte Press',
      publishedAt: new Date('1991-06-01'),
    },
    {
      name: "The Time Traveler's Wife",
      author: 'Audrey Niffenegger',
      description:
        'Un homme qui voyage involontairement dans le temps et sa relation complexe avec sa femme.',
      isbn: '978-0-385-33312-0',
      publishingHouse: 'Scribner',
      publishedAt: new Date('2003-09-30'),
    },
  ],
  Aventure: [
    {
      name: 'The Adventures of Sherlock Holmes',
      author: 'Arthur Conan Doyle',
      description:
        'Les aventures du détective le plus célèbre du monde et de son ami Watson.',
      isbn: '978-0-14-143968-6',
      publishingHouse: 'George Newnes',
      publishedAt: new Date('1892-10-14'),
    },
    {
      name: 'Treasure Island',
      author: 'Robert Louis Stevenson',
      description:
        'Un jeune garçon embarque dans une quête périlleuse pour trouver un trésor caché.',
      isbn: '978-0-14-062470-4',
      publishingHouse: 'Cassell & Co.',
      publishedAt: new Date('1881-11-14'),
    },
    {
      name: 'Journey to the Center of the Earth',
      author: 'Jules Verne',
      description:
        'Une expédition extraordinaire au cœur de la Terre remplie de dangers et de découvertes.',
      isbn: '978-0-14-043953-3',
      publishingHouse: 'Pierre-Jules Hetzel',
      publishedAt: new Date('1864-11-25'),
    },
    {
      name: 'The Count of Monte Cristo',
      author: 'Alexandre Dumas',
      description:
        "Un homme injustement emprisonné s'échappe et se venge spectaculairement de ses ennemis.",
      isbn: '978-0-14-044930-3',
      publishingHouse: 'Journal des Débats',
      publishedAt: new Date('1844-08-28'),
    },
    {
      name: 'The Three Musketeers',
      author: 'Alexandre Dumas',
      description:
        "Les aventures d'un jeune homme et de trois mousquetaires dans la France du 17e siècle.",
      isbn: '978-0-14-043961-8',
      publishingHouse: 'Le Siècle',
      publishedAt: new Date('1844-03-14'),
    },
  ],
  Fantasy: [
    {
      name: 'The Lord of the Rings',
      author: 'J.R.R. Tolkien',
      description:
        'Une quête épique pour détruire un anneau magique et sauver le monde de la domination du mal.',
      isbn: '978-0-544-00001-7',
      publishingHouse: 'Allen & Unwin',
      publishedAt: new Date('1954-07-29'),
    },
    {
      name: "Harry Potter and the Philosopher's Stone",
      author: 'J.K. Rowling',
      description:
        'Un jeune sorcier découvre un monde magique caché et fait face aux menaces du mal.',
      isbn: '978-0-747-53269-9',
      publishingHouse: 'Bloomsbury',
      publishedAt: new Date('1997-06-26'),
    },
    {
      name: 'A Game of Thrones',
      author: 'George R.R. Martin',
      description:
        "Un monde fantasy complexe rempli d'intrigues politiques, de magie et de dragons.",
      isbn: '978-0-553-10354-1',
      publishingHouse: 'Bantam Books',
      publishedAt: new Date('1996-08-06'),
    },
    {
      name: 'The Name of the Wind',
      author: 'Patrick Rothfuss',
      description:
        "L'histoire d'un magicien légendaire racontée par lui-même dans un monde époustouflant.",
      isbn: '978-0-575-08141-9',
      publishingHouse: 'DAW Books',
      publishedAt: new Date('2007-08-29'),
    },
    {
      name: 'The Way of Kings',
      author: 'Brandon Sanderson',
      description:
        'Une épopée fantasy sur des guerriers, la magie et le destin dans un monde magnifique.',
      isbn: '978-0-7653-2635-5',
      publishingHouse: 'Tor Books',
      publishedAt: new Date('2010-08-31'),
    },
  ],
  'Science-Fiction': [
    {
      name: 'Dune',
      author: 'Frank Herbert',
      description:
        "Une épopée spatiale sur la politique, la religion et l'écologie sur une planète désertique.",
      isbn: '978-0-441-17271-9',
      publishingHouse: 'Ace Books',
      publishedAt: new Date('1965-06-01'),
    },
    {
      name: '1984',
      author: 'George Orwell',
      description:
        'Un roman dystopique sur un régime totalitaire contrôlant chaque aspect de la vie humaine.',
      isbn: '978-0-451-52494-2',
      publishingHouse: 'Secker & Warburg',
      publishedAt: new Date('1949-06-08'),
    },
    {
      name: 'The Martian',
      author: 'Andy Weir',
      description:
        'Un astronaute stranded sur Mars utilise son ingéniosité pour survivre et trouver son chemin de retour.',
      isbn: '978-0-553-41802-8',
      publishingHouse: 'Crown Publishers',
      publishedAt: new Date('2011-11-11'),
    },
    {
      name: 'Foundation',
      author: 'Isaac Asimov',
      description:
        "Un scientifique utilise la psychohistoire pour prédire l'avenir et sauver la civilisation.",
      isbn: '978-0-553-29438-0',
      publishingHouse: 'Gnome Press',
      publishedAt: new Date('1951-06-01'),
    },
    {
      name: 'Neuromancer',
      author: 'William Gibson',
      description:
        'Un hacker cyberpunk est engagé pour une dernière mission dans un futur dystopique.',
      isbn: '978-0-441-56959-4',
      publishingHouse: 'Ace Books',
      publishedAt: new Date('1984-07-01'),
    },
  ],
  Mystère: [
    {
      name: 'The Girl with the Dragon Tattoo',
      author: 'Stieg Larsson',
      description:
        "Un journaliste et une hacker brillante enquêtent sur la disparition d'une femme riche.",
      isbn: '978-0-307-26954-1',
      publishingHouse: 'Norstedts & Söner',
      publishedAt: new Date('2005-08-01'),
    },
    {
      name: 'The Da Vinci Code',
      author: 'Dan Brown',
      description:
        'Un symbologiste et une cryptographe résolvent un mystère ancien lié aux secrets religieux.',
      isbn: '978-0-385-50420-5',
      publishingHouse: 'Doubleday',
      publishedAt: new Date('2003-03-18'),
    },
    {
      name: 'Murder on the Orient Express',
      author: 'Agatha Christie',
      description:
        'Le détective Hercule Poirot enquête sur un meurtre dans un train luxueux bloqué dans la neige.',
      isbn: '978-0-062-07377-1',
      publishingHouse: "Christie's Estate",
      publishedAt: new Date('1934-01-01'),
    },
    {
      name: 'And Then There Were None',
      author: 'Agatha Christie',
      description:
        'Dix étrangers sont piégés sur une île et tués un par un selon une comptine mystérieuse.',
      isbn: '978-0-062-07338-2',
      publishingHouse: "Christie's Estate",
      publishedAt: new Date('1939-11-06'),
    },
    {
      name: 'The Big Sleep',
      author: 'Raymond Chandler',
      description:
        'Le détective privé Philip Marlowe enquête sur le chantage et le meurtre à Los Angeles.',
      isbn: '978-0-14-118423-3',
      publishingHouse: 'Knopf',
      publishedAt: new Date('1939-02-06'),
    },
  ],
  Thriller: [
    {
      name: 'The Silence of the Lambs',
      author: 'Thomas Harris',
      description:
        "Une jeune agent du FBI demande l'aide d'un tueur en série emprisonné pour attraper un autre tueur.",
      isbn: '978-0-312-92757-3',
      publishingHouse: "St. Martin's Press",
      publishedAt: new Date('1988-06-01'),
    },
    {
      name: 'The Girl on the Train',
      author: 'Paula Hawkins',
      description:
        "Une femme devient témoin d'un incident troublant depuis son train et se retrouve entraînée dans un mystère dangereux.",
      isbn: '978-0-345-54701-2',
      publishingHouse: 'Doubleday',
      publishedAt: new Date('2015-01-13'),
    },
    {
      name: 'Rogue Lawyer',
      author: 'John Grisham',
      description:
        'Un avocat criminaliste défend les sans-abri et les désespérés dans des cas périlleux.',
      isbn: '978-0-385-53861-9',
      publishingHouse: 'Doubleday',
      publishedAt: new Date('2015-10-20'),
    },
    {
      name: 'Gone Girl',
      author: 'Gillian Flynn',
      description:
        "Le mari d'une femme disparue devient suspect dans une affaire d'enlèvement remplie de rebondissements.",
      isbn: '978-0-307-58837-1',
      publishingHouse: 'Crown Publishers',
      publishedAt: new Date('2012-06-27'),
    },
    {
      name: 'The Bourne Identity',
      author: 'Robert Ludlum',
      description:
        "Un homme amnésique découvre qu'il est un agent secret et doit fuir pour sa vie.",
      isbn: '978-0-553-27595-0',
      publishingHouse: 'Random House',
      publishedAt: new Date('1980-03-01'),
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
