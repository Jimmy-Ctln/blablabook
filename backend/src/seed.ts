import { db } from './db';
import { book, bookCategory, category } from './db/schema';

async function seed() {
  console.log('Seeding database...');

  const categoriesToInsert = [
    { name: 'random' },
    { name: 'bestsellers' },
    { name: 'horror' },
  ];

  const booksToInsert = [
    // ================= RANDOM =================
    {
      name: 'Moby-Dick',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780142437247-L.jpg',
      author: 'Herman Melville',
      description: 'Epic tale of obsession and the sea.',
      isbn: '9780142437247',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1851-10-18',
    },
    {
      name: 'Crime and Punishment',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780140449136-L.jpg',
      author: 'Fyodor Dostoevsky',
      description: 'A psychological exploration of guilt and redemption.',
      isbn: '9780140449136',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1866-01-01',
    },
    {
      name: 'The Hobbit',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg',
      author: 'J.R.R. Tolkien',
      description: 'A fantasy adventure that precedes the Lord of the Rings.',
      isbn: '9780547928227',
      publishingHouse: 'HarperCollins',
      publishedAt: '1937-09-21',
    },
    {
      name: 'Wuthering Heights',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780141439556-L.jpg',
      author: 'Emily Brontë',
      description: 'A stormy tale of passion.',
      isbn: '9780141439556',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1847-12-01',
    },
    {
      name: 'Anna Karenina',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780143035008-L.jpg',
      author: 'Leo Tolstoy',
      description: 'Love and tragedy in Imperial Russia.',
      isbn: '9780143035008',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1877-01-01',
    },
    {
      name: 'The Picture of Dorian Gray',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780141439570-L.jpg',
      author: 'Oscar Wilde',
      description: 'Vanity, beauty, and corruption.',
      isbn: '9780141439570',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1890-07-01',
    },
    {
      name: '1984',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
      author: 'George Orwell',
      description: 'A dystopian surveillance state.',
      isbn: '9780451524935',
      publishingHouse: 'Signet Classics',
      publishedAt: '1949-06-08',
    },
    {
      name: 'Brave New World',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg',
      author: 'Aldous Huxley',
      description: 'A futuristic dystopia.',
      isbn: '9780060850524',
      publishingHouse: 'Harper Perennial',
      publishedAt: '1932-01-01',
    },
    {
      name: 'The Old Man and the Sea',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780684801223-L.jpg',
      author: 'Ernest Hemingway',
      description: 'A fisherman’s final battle.',
      isbn: '9780684801223',
      publishingHouse: 'Scribner',
      publishedAt: '1952-09-01',
    },
    {
      name: 'The Stranger',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780679720201-L.jpg',
      author: 'Albert Camus',
      description: 'Existential alienation.',
      isbn: '9780679720201',
      publishingHouse: 'Vintage',
      publishedAt: '1942-01-01',
    },
    {
      name: 'Frankenstein',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780141439471-L.jpg',
      author: 'Mary Shelley',
      description: 'A man creates a monster.',
      isbn: '9780141439471',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1818-01-01',
    },
    {
      name: 'Don Quixote',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780060934347-L.jpg',
      author: 'Miguel de Cervantes',
      description: 'A knight chasing illusions.',
      isbn: '9780060934347',
      publishingHouse: 'Harper Perennial',
      publishedAt: '1605-01-01',
    },

    // ================= BESTSELLERS =================
    {
      name: 'Harry Potter and the Sorcerer’s Stone',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg',
      author: 'J.K. Rowling',
      description: 'The beginning of a wizarding saga.',
      isbn: '9780590353427',
      publishingHouse: 'Scholastic',
      publishedAt: '1997-06-26',
    },
    {
      name: 'The Da Vinci Code',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780307474278-L.jpg',
      author: 'Dan Brown',
      description: 'A symbology thriller.',
      isbn: '9780307474278',
      publishingHouse: 'Anchor',
      publishedAt: '2003-03-18',
    },
    {
      name: 'The Hunger Games',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780439023528-L.jpg',
      author: 'Suzanne Collins',
      description: 'A dystopian survival game.',
      isbn: '9780439023528',
      publishingHouse: 'Scholastic',
      publishedAt: '2008-09-14',
    },
    {
      name: 'Gone Girl',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780307588371-L.jpg',
      author: 'Gillian Flynn',
      description: 'A twisted marriage thriller.',
      isbn: '9780307588371',
      publishingHouse: 'Crown',
      publishedAt: '2012-06-05',
    },
    {
      name: 'The Girl with the Dragon Tattoo',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780307454546-L.jpg',
      author: 'Stieg Larsson',
      description: 'A dark Scandinavian crime novel.',
      isbn: '9780307454546',
      publishingHouse: 'Vintage',
      publishedAt: '2005-08-01',
    },
    {
      name: 'The Alchemist',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg',
      author: 'Paulo Coelho',
      description: 'A journey of self-discovery.',
      isbn: '9780061122415',
      publishingHouse: 'HarperOne',
      publishedAt: '1988-01-01',
    },
    {
      name: 'Twilight',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780316015844-L.jpg',
      author: 'Stephenie Meyer',
      description: 'A vampire romance.',
      isbn: '9780316015844',
      publishingHouse: 'Little, Brown',
      publishedAt: '2005-10-05',
    },
    {
      name: 'The Fault in Our Stars',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780525478812-L.jpg',
      author: 'John Green',
      description: 'Love and loss.',
      isbn: '9780525478812',
      publishingHouse: 'Dutton',
      publishedAt: '2012-01-10',
    },
    {
      name: 'To Kill a Mockingbird',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780060935467-L.jpg',
      author: 'Harper Lee',
      description: 'Justice and morality.',
      isbn: '9780060935467',
      publishingHouse: 'Harper Perennial',
      publishedAt: '1960-07-11',
    },
    {
      name: 'The Great Gatsby',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg',
      author: 'F. Scott Fitzgerald',
      description: 'The American dream.',
      isbn: '9780743273565',
      publishingHouse: 'Scribner',
      publishedAt: '1925-04-10',
    },
    {
      name: 'Life of Pi',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780156027328-L.jpg',
      author: 'Yann Martel',
      description: 'Survival and faith.',
      isbn: '9780156027328',
      publishingHouse: 'Harcourt',
      publishedAt: '2001-09-11',
    },
    {
      name: 'The Book Thief',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780375842207-L.jpg',
      author: 'Markus Zusak',
      description: 'A story told by Death.',
      isbn: '9780375842207',
      publishingHouse: 'Knopf',
      publishedAt: '2005-03-14',
    },

    // ================= HORROR =================
    {
      name: 'Dracula',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780141439846-L.jpg',
      author: 'Bram Stoker',
      description: 'The original vampire.',
      isbn: '9780141439846',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1897-05-26',
    },
    {
      name: 'The Shining',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780307743657-L.jpg',
      author: 'Stephen King',
      description: 'A haunted hotel.',
      isbn: '9780307743657',
      publishingHouse: 'Anchor',
      publishedAt: '1977-01-28',
    },
    {
      name: 'It',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780450411434-L.jpg',
      author: 'Stephen King',
      description: 'Evil in a small town.',
      isbn: '9780450411434',
      publishingHouse: 'Viking',
      publishedAt: '1986-09-15',
    },
    {
      name: 'Pet Sematary',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780743412285-L.jpg',
      author: 'Stephen King',
      description: 'Death doesn’t stay buried.',
      isbn: '9780743412285',
      publishingHouse: 'Pocket Books',
      publishedAt: '1983-11-14',
    },
    {
      name: 'The Exorcist',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780061007224-L.jpg',
      author: 'William Peter Blatty',
      description: 'Demonic possession.',
      isbn: '9780061007224',
      publishingHouse: 'Harper',
      publishedAt: '1971-06-01',
    },
    {
      name: 'The Haunting of Hill House',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780141191442-L.jpg',
      author: 'Shirley Jackson',
      description: 'A cursed mansion.',
      isbn: '9780141191442',
      publishingHouse: 'Penguin',
      publishedAt: '1959-10-16',
    },
    {
      name: 'Carrie',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780307743664-L.jpg',
      author: 'Stephen King',
      description: 'Telekinetic terror.',
      isbn: '9780307743664',
      publishingHouse: 'Anchor',
      publishedAt: '1974-04-05',
    },
    {
      name: 'Bird Box',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780062259653-L.jpg',
      author: 'Josh Malerman',
      description: 'Don’t look.',
      isbn: '9780062259653',
      publishingHouse: 'Ecco',
      publishedAt: '2014-03-27',
    },
    {
      name: 'The Road',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780307387899-L.jpg',
      author: 'Cormac McCarthy',
      description: 'Post-apocalyptic horror.',
      isbn: '9780307387899',
      publishingHouse: 'Vintage',
      publishedAt: '2006-09-26',
    },
    {
      name: 'World War Z',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780307346612-L.jpg',
      author: 'Max Brooks',
      description: 'An oral history of zombies.',
      isbn: '9780307346612',
      publishingHouse: 'Broadway',
      publishedAt: '2006-09-12',
    },
    {
      name: 'House of Leaves',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780375703768-L.jpg',
      author: 'Mark Z. Danielewski',
      description: 'Experimental horror.',
      isbn: '9780375703768',
      publishingHouse: 'Pantheon',
      publishedAt: '2000-03-07',
    },
    {
      name: 'The Mist',
      coverId: 'https://covers.openlibrary.org/b/isbn/9781501142970-L.jpg',
      author: 'Stephen King',
      description: 'Something in the fog.',
      isbn: '9781501142970',
      publishingHouse: 'Scribner',
      publishedAt: '1980-01-01',
    },
  ];

  const insertedBooks = await db.insert(book).values(booksToInsert).returning();
  const insertedCategories = await db
    .insert(category)
    .values(categoriesToInsert)
    .returning();

  const links = insertedBooks.map((b, i) => ({
    bookId: b.id,
    categoryId:
      i < 12
        ? insertedCategories.find((c) => c.name === 'random')!.id
        : i < 24
          ? insertedCategories.find((c) => c.name === 'bestsellers')!.id
          : insertedCategories.find((c) => c.name === 'horror')!.id,
  }));

  await db.insert(bookCategory).values(links);

  console.log('Database seeded successfully! ✅');
}

seed().then(() => process.exit(0));
