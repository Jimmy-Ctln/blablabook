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
  { name: 'mystère', isActive: true },
  { name: 'thriller', isActive: true },
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
      name: 'The Shining',
      author: 'Stephen King',
      description:
        "Un homme, sa femme et son fils passent l'hiver isolés dans un hôtel montagneux hanté par des forces surnaturelles.",
      isbn: '9780385121675',
      publishingHouse: 'Doubleday',
      publishedAt: new Date('1977-01-28'),
    },
    {
      name: 'It',
      author: 'Stephen King',
      description:
        "Un groupe d'enfants fait face à une créature ancienne et maléfique qui hante leur ville.",
      isbn: '9780670813025',
      publishingHouse: 'Viking Press',
      publishedAt: new Date('1986-09-15'),
    },
    {
      name: 'The Exorcist',
      author: 'William Peter Blatty',
      description:
        "Le combat entre le bien et le mal lorsqu'une jeune fille est possédée par un démon.",
      isbn: '9780061785009',
      publishingHouse: 'Harper & Row',
      publishedAt: new Date('1971-05-01'),
    },
    {
      name: 'The Ring',
      author: 'Koji Suzuki',
      description:
        'Une cassette vidéo maudite qui tue quiconque la regarde sept jours plus tard.',
      isbn: '9780062059529',
      publishingHouse: 'Shogakukan',
      publishedAt: new Date('1991-01-01'),
    },
    {
      name: 'The Haunting of Hill House',
      author: 'Shirley Jackson',
      description:
        'Une équipe de chercheurs explore une maison maudite et découvre des phénomènes terrifiants.',
      isbn: '9781405280273',
      publishingHouse: 'Viking Press',
      publishedAt: new Date('1959-10-01'),
    },
    {
      name: 'The Bloody Chamber',
      author: 'Angela Carter',
      description:
        'Des contes de fées sinistres et sensuelstransformés en histoires sombres et envoûtantes.',
      isbn: '9780141162929',
      publishingHouse: 'Harper & Row',
      publishedAt: new Date('1979-06-08'),
    },
    {
      name: 'House of Leaves',
      author: 'Mark Z. Danielewski',
      description:
        'Un voyage labyrinthique dans une maison impossible qui défie les lois de la physique.',
      isbn: '9780375707469',
      publishingHouse: 'Pantheon Books',
      publishedAt: new Date('2000-03-02'),
    },
    {
      name: 'Mexican Gothic',
      author: 'Silvia Moreno-Garcia',
      description:
        "Une jeune femme découvre les secrets sombres d'une vieille mansarda gothique au Mexique.",
      isbn: '9780374204891',
      publishingHouse: 'Del Rey',
      publishedAt: new Date('2015-06-30'),
    },
  ],
  romance: [
    {
      name: 'Pride and Prejudice',
      author: 'Jane Austen',
      description:
        "L'histoire d'Elisabeth Bennet et de M. Darcy, deux âmes fortes qui découvrent l'amour au-delà de leurs préjugés.",
      isbn: '9780141439518',
      publishingHouse: 'T. Egerton',
      publishedAt: new Date('1813-01-28'),
    },
    {
      name: 'The Notebook',
      author: 'Nicholas Sparks',
      description:
        "Une histoire d'amour intemporelle entre deux personnes séparées par les classes sociales.",
      isbn: '9780553210583',
      publishingHouse: 'Warner Books',
      publishedAt: new Date('1996-10-01'),
    },
    {
      name: 'Outlander',
      author: 'Diana Gabaldon',
      description:
        "Une femme du 20e siècle voyage dans le temps et tombe amoureuse d'un guerrier écossais au 18e siècle.",
      isbn: '9780385295955',
      publishingHouse: 'Delacorte Press',
      publishedAt: new Date('1991-06-01'),
    },
    {
      name: "The Time Traveler's Wife",
      author: 'Audrey Niffenegger',
      description:
        'Un homme qui voyage involontairement dans le temps et sa relation complexe avec sa femme.',
      isbn: '9780385333126',
      publishingHouse: 'Scribner',
      publishedAt: new Date('2003-09-30'),
    },
    {
      name: 'Me Before You',
      author: 'Jojo Moyes',
      description:
        "Une jeune femme devient l'assistante d'un homme paralysé, ce qui crée une connexion inattendue.",
      isbn: '9780143124542',
      publishingHouse: 'Penguin Press',
      publishedAt: new Date('2012-01-01'),
    },
    {
      name: 'The Fault in Our Stars',
      author: 'John Green',
      description:
        "Deux jeunes gens atteints du cancer se rencontrent et vivent une histoire d'amour transformatrice.",
      isbn: '9780141349496',
      publishingHouse: 'Dutton',
      publishedAt: new Date('2012-01-10'),
    },
    {
      name: 'A Walk to Remember',
      author: 'Nicholas Sparks',
      description:
        "Un jeune homme tombe amoureux d'une fille pieuse et leur amour change à jamais sa vision de la vie.",
      isbn: '9780553294452',
      publishingHouse: 'Warner Books',
      publishedAt: new Date('1999-10-01'),
    },
    {
      name: 'Jane Eyre',
      author: 'Charlotte Brontë',
      description:
        "Une gouvernante sans fortune découvre l'amour vrai avec un homme mystérieux et complexe.",
      isbn: '9780141441146',
      publishingHouse: 'Smith, Elder & Co.',
      publishedAt: new Date('1847-10-16'),
    },
  ],
  aventure: [
    {
      name: 'The Adventures of Sherlock Holmes',
      author: 'Arthur Conan Doyle',
      description:
        'Les aventures du détective le plus célèbre du monde et de son ami Watson.',
      isbn: '9780141439686',
      publishingHouse: 'George Newnes',
      publishedAt: new Date('1892-10-14'),
    },
    {
      name: 'Treasure Island',
      author: 'Robert Louis Stevenson',
      description:
        'Un jeune garçon embarque dans une quête périlleuse pour trouver un trésor caché.',
      isbn: '9780141435886',
      publishingHouse: 'Cassell & Co.',
      publishedAt: new Date('1881-11-14'),
    },
    {
      name: 'Journey to the Center of the Earth',
      author: 'Jules Verne',
      description:
        'Une expédition extraordinaire au cœur de la Terre remplie de dangers et de découvertes.',
      isbn: '9780141439953',
      publishingHouse: 'Pierre-Jules Hetzel',
      publishedAt: new Date('1864-11-25'),
    },
    {
      name: 'The Count of Monte Cristo',
      author: 'Alexandre Dumas',
      description:
        "Un homme injustement emprisonné s'échappe et se venge spectaculairement de ses ennemis.",
      isbn: '9780141449301',
      publishingHouse: 'Journal des Débats',
      publishedAt: new Date('1844-08-28'),
    },
    {
      name: 'The Three Musketeers',
      author: 'Alexandre Dumas',
      description:
        "Les aventures d'un jeune homme et de trois mousquetaires dans la France du 17e siècle.",
      isbn: '9780141439617',
      publishingHouse: 'Le Siècle',
      publishedAt: new Date('1844-03-14'),
    },
    {
      name: 'Around the World in Eighty Days',
      author: 'Jules Verne',
      description:
        'Un riche excentrique relève le pari de faire le tour du monde en quatre-vingts jours.',
      isbn: '9780141441146',
      publishingHouse: 'Le Temps',
      publishedAt: new Date('1873-11-06'),
    },
    {
      name: 'The Adventures of Tom Sawyer',
      author: 'Mark Twain',
      description:
        "Les aventures espièg les d'un jeune garçon au bord du Mississippi au 19e siècle.",
      isbn: '9780141391748',
      publishingHouse: 'American Publishing Company',
      publishedAt: new Date('1876-12-09'),
    },
    {
      name: 'Robinson Crusoe',
      author: 'Daniel Defoe',
      description:
        'Un marin naufragé survit seul sur une île déserte pendant vingt-huit ans.',
      isbn: '9780141439228',
      publishingHouse: 'W. Taylor',
      publishedAt: new Date('1719-04-25'),
    },
  ],
  fantasy: [
    {
      name: 'The Lord of the Rings: The Fellowship of the Ring',
      author: 'J.R.R. Tolkien',
      description:
        'Une quête épique pour détruire un anneau magique et sauver le monde de la domination du mal.',
      isbn: '9780544003415',
      publishingHouse: 'Allen & Unwin',
      publishedAt: new Date('1954-07-29'),
    },
    {
      name: "Harry Potter and the Philosopher's Stone",
      author: 'J.K. Rowling',
      description:
        'Un jeune sorcier découvre un monde magique caché et fait face aux menaces du mal.',
      isbn: '9780747532699',
      publishingHouse: 'Bloomsbury',
      publishedAt: new Date('1997-06-26'),
    },
    {
      name: 'A Game of Thrones',
      author: 'George R.R. Martin',
      description:
        "Un monde fantasy complexe rempli d'intrigues politiques, de magie et de dragons.",
      isbn: '9780553103541',
      publishingHouse: 'Bantam Books',
      publishedAt: new Date('1996-08-06'),
    },
    {
      name: 'The Name of the Wind',
      author: 'Patrick Rothfuss',
      description:
        "L'histoire d'un magicien légendaire racontée par lui-même dans un monde époustouflant.",
      isbn: '9780575081482',
      publishingHouse: 'DAW Books',
      publishedAt: new Date('2007-08-29'),
    },
    {
      name: 'The Way of Kings',
      author: 'Brandon Sanderson',
      description:
        'Une épopée fantasy sur des guerriers, la magie et le destin dans un monde magnifique.',
      isbn: '9780765326355',
      publishingHouse: 'Tor Books',
      publishedAt: new Date('2010-08-31'),
    },
    {
      name: 'The Cruel Prince',
      author: 'Holly Black',
      description:
        'Une jeune fille grandit parmi les créatures féériques du Monde de Féerie.',
      isbn: '9781250195449',
      publishingHouse: 'Greenwillow Books',
      publishedAt: new Date('2018-01-02'),
    },
    {
      name: 'Six of Crows',
      author: 'Leigh Bardugo',
      description:
        'Un groupe de criminels tente un héist impossible pour devenir riches et légendaires.',
      isbn: '9780545284837',
      publishingHouse: 'Balzer + Bray',
      publishedAt: new Date('2015-09-29'),
    },
    {
      name: 'Mistborn: The Final Empire',
      author: 'Brandon Sanderson',
      description:
        'Une jeune fille découvre des pouvoirs magiques cachés dans un empire totalitaire.',
      isbn: '9780765311788',
      publishingHouse: 'Tor Books',
      publishedAt: new Date('2006-07-17'),
    },
  ],
  'science-fiction': [
    {
      name: 'Dune',
      author: 'Frank Herbert',
      description:
        "Une épopée spatiale sur la politique, la religion et l'écologie sur une planète désertique.",
      isbn: '9780441172719',
      publishingHouse: 'Ace Books',
      publishedAt: new Date('1965-06-01'),
    },
    {
      name: '1984',
      author: 'George Orwell',
      description:
        'Un roman dystopique sur un régime totalitaire contrôlant chaque aspect de la vie humaine.',
      isbn: '9780451524935',
      publishingHouse: 'Secker & Warburg',
      publishedAt: new Date('1949-06-08'),
    },
    {
      name: 'The Martian',
      author: 'Andy Weir',
      description:
        'Un astronaute stranded sur Mars utilise son ingéniosité pour survivre et trouver son chemin de retour.',
      isbn: '9780553418026',
      publishingHouse: 'Crown Publishers',
      publishedAt: new Date('2011-11-11'),
    },
    {
      name: 'Foundation',
      author: 'Isaac Asimov',
      description:
        "Un scientifique utilise la psychohistoire pour prédire l'avenir et sauver la civilisation.",
      isbn: '9780553294384',
      publishingHouse: 'Gnome Press',
      publishedAt: new Date('1951-06-01'),
    },
    {
      name: 'Neuromancer',
      author: 'William Gibson',
      description:
        'Un hacker cyberpunk est engagé pour une dernière mission dans un futur dystopique.',
      isbn: '9780441569595',
      publishingHouse: 'Ace Books',
      publishedAt: new Date('1984-07-01'),
    },
    {
      name: 'The Expanse: Leviathan Wakes',
      author: 'James S.A. Corey',
      description:
        'Un détective privé et un capitaine de vaisseau enquêtent sur une disparition qui risque de déclencher une guerre spatiale.',
      isbn: '9780316129083',
      publishingHouse: 'Orbit',
      publishedAt: new Date('2011-06-14'),
    },
    {
      name: 'Altered Carbon',
      author: 'Richard K. Morgan',
      description:
        "Un assassin ressuscité dans un corps neuf doit résoudre le meurtre d'un homme riche dans un futur dystopique.",
      isbn: '9780425089577',
      publishingHouse: 'Del Rey',
      publishedAt: new Date('2002-11-19'),
    },
    {
      name: 'The Ministry for the Future',
      author: 'Kim Stanley Robinson',
      description:
        "Un regard futuriste sur comment l'humanité pourrait affronter la crise climatique.",
      isbn: '9780316300130',
      publishingHouse: 'Hachette Book Group',
      publishedAt: new Date('2020-10-06'),
    },
  ],
  mystère: [
    {
      name: 'The Girl with the Dragon Tattoo',
      author: 'Stieg Larsson',
      description:
        "Un journaliste et une hacker brillante enquêtent sur la disparition d'une femme riche.",
      isbn: '9780307454546',
      publishingHouse: 'Norstedts & Söner',
      publishedAt: new Date('2005-08-01'),
    },
    {
      name: 'The Da Vinci Code',
      author: 'Dan Brown',
      description:
        'Un symbologiste et une cryptographe résolvent un mystère ancien lié aux secrets religieux.',
      isbn: '9780385504205',
      publishingHouse: 'Doubleday',
      publishedAt: new Date('2003-03-18'),
    },
    {
      name: 'Murder on the Orient Express',
      author: 'Agatha Christie',
      description:
        'Le détective Hercule Poirot enquête sur un meurtre dans un train luxueux bloqué dans la neige.',
      isbn: '9780062079570',
      publishingHouse: "Christie's Estate",
      publishedAt: new Date('1934-01-01'),
    },
    {
      name: 'And Then There Were None',
      author: 'Agatha Christie',
      description:
        'Dix étrangers sont piégés sur une île et tués un par un selon une comptine mystérieuse.',
      isbn: '9780062073556',
      publishingHouse: "Christie's Estate",
      publishedAt: new Date('1939-11-06'),
    },
    {
      name: 'The Big Sleep',
      author: 'Raymond Chandler',
      description:
        'Le détective privé Philip Marlowe enquête sur le chantage et le meurtre à Los Angeles.',
      isbn: '9780141184234',
      publishingHouse: 'Knopf',
      publishedAt: new Date('1939-02-06'),
    },
    {
      name: 'Mystic River',
      author: 'Dennis Lehane',
      description:
        'Trois enfants liés par un traumatisme se retrouvent adultes confrontés à des crimes qui changent à jamais leurs vies.',
      isbn: '9780380731596',
      publishingHouse: 'William Morrow',
      publishedAt: new Date('2001-05-28'),
    },
    {
      name: 'The Girl Before',
      author: 'JP Delaney',
      description:
        'Une jeune femme emménage dans un appartement futuriste et commence à revivre les mystères liés à sa locataire précédente.',
      isbn: '9780345415298',
      publishingHouse: 'Ballantine Books',
      publishedAt: new Date('2016-10-04'),
    },
    {
      name: 'The Woman in Cabin 10',
      author: 'Ruth Ware',
      description:
        "Une journaliste en croisière découvre une femme mystérieuse et sa cabine devient la scène d'un crime.",
      isbn: '9780804170734',
      publishingHouse: 'The Random House Publishing Group',
      publishedAt: new Date('2016-08-02'),
    },
  ],
  thriller: [
    {
      name: 'The Silence of the Lambs',
      author: 'Thomas Harris',
      description:
        "Une jeune agent du FBI demande l'aide d'un tueur en série emprisonné pour attraper un autre tueur.",
      isbn: '9780312927579',
      publishingHouse: "St. Martin's Press",
      publishedAt: new Date('1988-06-01'),
    },
    {
      name: 'The Girl on the Train',
      author: 'Paula Hawkins',
      description:
        "Une femme devient témoin d'un incident troublant depuis son train et se retrouve entraînée dans un mystère dangereux.",
      isbn: '9780345457011',
      publishingHouse: 'Doubleday',
      publishedAt: new Date('2015-01-13'),
    },
    {
      name: 'Gone Girl',
      author: 'Gillian Flynn',
      description:
        "Le mari d'une femme disparue devient suspect dans une affaire d'enlèvement remplie de rebondissements.",
      isbn: '9780307588371',
      publishingHouse: 'Crown Publishers',
      publishedAt: new Date('2012-06-27'),
    },
    {
      name: 'The Bourne Identity',
      author: 'Robert Ludlum',
      description:
        "Un homme amnésique découvre qu'il est un agent secret et doit fuir pour sa vie.",
      isbn: '9780553275957',
      publishingHouse: 'Random House',
      publishedAt: new Date('1980-03-01'),
    },
    {
      name: 'The Woman in White',
      author: 'Wilkie Collins',
      description:
        'Un mystère gothique où une jeune femme innocente est remplacée par une impostrice en clinique.',
      isbn: '9780141439594',
      publishingHouse: 'All the Year Round',
      publishedAt: new Date('1859-11-26'),
    },
    {
      name: 'In the Woods',
      author: 'Tana French',
      description:
        "Un détective enquête sur un meurtre qui le ramène à ses propres traumatismes d'enfance.",
      isbn: '9780340899779',
      publishingHouse: 'Hodder & Stoughton',
      publishedAt: new Date('2007-03-01'),
    },
    {
      name: 'Rebecca',
      author: 'Daphne du Maurier',
      description:
        'Une jeune femme épouse un riche aristocrate anglais, mais découvre que le fantôme de sa première épouse hante le château.',
      isbn: '9780141040685',
      publishingHouse: 'Victor Gollancz Ltd',
      publishedAt: new Date('1938-08-03'),
    },
    {
      name: 'The Kind Worth Killing',
      author: 'Peter Swanson',
      description:
        'Deux étrangers se rencontrent en avion et nouent une amitié dangereuse basée sur la vengeance mutuelle.',
      isbn: '9780062267597',
      publishingHouse: 'William Morrow',
      publishedAt: new Date('2015-02-10'),
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
