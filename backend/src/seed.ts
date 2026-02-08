import { db } from './db';
import { book, bookCategory, category } from './db/schema';

async function seed() {
  console.log('Seeding : 105 livres français avec couvertures et maisons d\'édition...');

  const categoriesToInsert = [
    { name: 'random' },
    { name: 'horror' },
    { name: 'love' },
  ];

  const booksData = [
    // ================= RANDOM (Classiques & Littérature) (35) =================
    { name: 'Les Misérables', coverId: 'https://covers.openlibrary.org/b/isbn/9782253096337-L.jpg', author: 'Victor Hugo', description: 'Le chef-d\'œuvre sur la justice et la misère humaine.', isbn: '9782253096337', publishingHouse: 'Hachette Livre', publishedAt: '1862-01-01' },
    { name: 'Le Petit Prince', coverId: 'https://covers.openlibrary.org/b/isbn/9782070612758-L.jpg', author: 'Antoine de Saint-Exupéry', description: 'Un conte philosophique universel.', isbn: '9782070612758', publishingHouse: 'Éditions Gallimard', publishedAt: '1943-04-06' },
    { name: 'L\'Étranger', coverId: 'https://covers.openlibrary.org/b/isbn/9782070360024-L.jpg', author: 'Albert Camus', description: 'Le récit de l\'absurdité humaine.', isbn: '9782070360024', publishingHouse: 'Éditions Gallimard', publishedAt: '1942-01-01' },
    { name: 'Madame Bovary', coverId: 'https://covers.openlibrary.org/b/isbn/9782253004318-L.jpg', author: 'Gustave Flaubert', description: 'L\'ennui et les rêves d\'une femme de province.', isbn: '9782253004318', publishingHouse: 'Éditions Flammarion', publishedAt: '1857-01-01' },
    { name: 'Bel-Ami', coverId: 'https://covers.openlibrary.org/b/isbn/9782253002864-L.jpg', author: 'Guy de Maupassant', description: 'L\'ascension sociale d\'un opportuniste.', isbn: '9782253002864', publishingHouse: 'Hachette Livre', publishedAt: '1885-01-01' },
    { name: 'Germinal', coverId: 'https://covers.openlibrary.org/b/isbn/9782253004226-L.jpg', author: 'Émile Zola', description: 'La lutte des mineurs pour leur dignité.', isbn: '9782253004226', publishingHouse: 'Éditions Grasset', publishedAt: '1885-01-01' },
    { name: 'Le Rouge et le Noir', coverId: 'https://covers.openlibrary.org/b/isbn/9782253006206-L.jpg', author: 'Stendhal', description: 'L\'ascension et la chute de Julien Sorel.', isbn: '9782253006206', publishingHouse: 'Hachette Livre', publishedAt: '1830-01-01' },
    { name: 'Vingt mille lieues sous les mers', coverId: 'https://covers.openlibrary.org/b/isbn/9782253006329-L.jpg', author: 'Jules Verne', description: 'Voyage à bord du Nautilus.', isbn: '9782253006329', publishingHouse: 'Éditions Hetzel', publishedAt: '1870-01-01' },
    { name: 'Notre-Dame de Paris', coverId: 'https://covers.openlibrary.org/b/isbn/9782253009687-L.jpg', author: 'Victor Hugo', description: 'Esméralda et Quasimodo.', isbn: '9782253009687', publishingHouse: 'Éditions Flammarion', publishedAt: '1831-01-01' },
    { name: 'L\'Île au trésor', coverId: 'https://covers.openlibrary.org/b/isbn/9782253003298-L.jpg', author: 'R.L. Stevenson', description: 'Pirates et cartes mystérieuses.', isbn: '9782253003298', publishingHouse: 'Hachette Livre', publishedAt: '1883-01-01' },
    { name: 'Le Tour du monde en 80 jours', coverId: 'https://covers.openlibrary.org/b/isbn/9782253003250-L.jpg', author: 'Jules Verne', description: 'Le pari fou de Phileas Fogg.', isbn: '9782253003250', publishingHouse: 'Hachette Livre', publishedAt: '1872-01-01' },
    { name: 'Cyrano de Bergerac', coverId: 'https://covers.openlibrary.org/b/isbn/9782253005674-L.jpg', author: 'Edmond Rostand', description: 'Panache et poésie.', isbn: '9782253005674', publishingHouse: 'Fasquelle', publishedAt: '1897-01-01' },
    { name: 'La gloire de mon père', coverId: 'https://covers.openlibrary.org/b/isbn/9782877065078-L.jpg', author: 'Marcel Pagnol', description: 'Souvenirs d\'enfance en Provence.', isbn: '9782877065078', publishingHouse: 'Éditions de Fallois', publishedAt: '1957-01-01' },
    { name: 'Le château de ma mère', coverId: 'https://covers.openlibrary.org/b/isbn/9782877065085-L.jpg', author: 'Marcel Pagnol', description: 'La suite des souvenirs d\'enfance.', isbn: '9782877065085', publishingHouse: 'Éditions de Fallois', publishedAt: '1957-01-01' },
    { name: 'L\'écume des jours', coverId: 'https://covers.openlibrary.org/b/isbn/9782253006619-L.jpg', author: 'Boris Vian', description: 'Un roman d\'amour surréaliste.', isbn: '9782253006619', publishingHouse: 'Éditions Fayard', publishedAt: '1947-01-01' },
    { name: 'Le Horla', coverId: 'https://covers.openlibrary.org/b/isbn/9782253005933-L.jpg', author: 'Guy de Maupassant', description: 'Descente dans la folie.', isbn: '9782253005933', publishingHouse: 'Éditions Ollendorff', publishedAt: '1887-01-01' },
    { name: 'Les Fleurs du Mal', coverId: 'https://covers.openlibrary.org/b/isbn/9782253006855-L.jpg', author: 'Charles Baudelaire', description: 'Poèmes sur le spleen et l\'idéal.', isbn: '9782253006855', publishingHouse: 'Poulet-Malassis', publishedAt: '1857-01-01' },
    { name: 'La Peste', coverId: 'https://covers.openlibrary.org/b/isbn/9782070360420-L.jpg', author: 'Albert Camus', description: 'Une ville face à l\'épidémie.', isbn: '9782070360420', publishingHouse: 'Éditions Gallimard', publishedAt: '1947-01-01' },
    { name: 'Le Comte de Monte-Cristo', coverId: 'https://covers.openlibrary.org/b/isbn/9782253042198-L.jpg', author: 'Alexandre Dumas', description: 'Vengeance et rédemption.', isbn: '9782253042198', publishingHouse: 'Éditions Baudry', publishedAt: '1844-01-01' },
    { name: 'Les Trois Mousquetaires', coverId: 'https://covers.openlibrary.org/b/isbn/9782253004233-L.jpg', author: 'Alexandre Dumas', description: 'Un pour tous, tous pour un.', isbn: '9782253004233', publishingHouse: 'Hachette Livre', publishedAt: '1844-01-01' },
    { name: 'Antigone', coverId: 'https://covers.openlibrary.org/b/isbn/9782710300250-L.jpg', author: 'Jean Anouilh', description: 'La tragédie du non.', isbn: '9782710300250', publishingHouse: 'Éditions de la Table Ronde', publishedAt: '1944-01-01' },
    { name: 'En attendant Godot', coverId: 'https://covers.openlibrary.org/b/isbn/9782707301482-L.jpg', author: 'Samuel Beckett', description: 'Théâtre de l\'absurde.', isbn: '9782707301482', publishingHouse: 'Éditions de Minuit', publishedAt: '1952-01-01' },
    { name: 'La Cantatrice chauve', coverId: 'https://covers.openlibrary.org/b/isbn/9782070364305-L.jpg', author: 'Eugène Ionesco', description: 'L\'absurdité du langage.', isbn: '9782070364305', publishingHouse: 'Éditions Gallimard', publishedAt: '1950-01-01' },
    { name: 'Rhinocéros', coverId: 'https://covers.openlibrary.org/b/isbn/9782070368167-L.jpg', author: 'Eugène Ionesco', description: 'La montée du totalitarisme.', isbn: '9782070368167', publishingHouse: 'Éditions Gallimard', publishedAt: '1959-01-01' },
    { name: 'Huis Clos', coverId: 'https://covers.openlibrary.org/b/isbn/9782070368075-L.jpg', author: 'Jean-Paul Sartre', description: 'L\'enfer, c\'est les autres.', isbn: '9782070368075', publishingHouse: 'Éditions Gallimard', publishedAt: '1944-01-01' },
    { name: 'La Nausée', coverId: 'https://covers.openlibrary.org/b/isbn/9782070360048-L.jpg', author: 'Jean-Paul Sartre', description: 'Le manifeste de l\'existentialisme.', isbn: '9782070360048', publishingHouse: 'Éditions Gallimard', publishedAt: '1938-01-01' },
    { name: 'Les Mains sales', coverId: 'https://covers.openlibrary.org/b/isbn/9782070368051-L.jpg', author: 'Jean-Paul Sartre', description: 'Politique et engagement.', isbn: '9782070368051', publishingHouse: 'Éditions Gallimard', publishedAt: '1948-01-01' },
    { name: 'Mémoires d\'une jeune fille rangée', coverId: 'https://covers.openlibrary.org/b/isbn/9782070360062-L.jpg', author: 'Simone de Beauvoir', description: 'Émancipation.', isbn: '9782070360062', publishingHouse: 'Éditions Gallimard', publishedAt: '1958-01-01' },
    { name: 'Le Deuxième Sexe', coverId: 'https://covers.openlibrary.org/b/isbn/9782070323517-L.jpg', author: 'Simone de Beauvoir', description: 'Essai fondateur.', isbn: '9782070323517', publishingHouse: 'Éditions Gallimard', publishedAt: '1949-01-01' },
    { name: 'Paroles', coverId: 'https://covers.openlibrary.org/b/isbn/9782070360093-L.jpg', author: 'Jacques Prévert', description: 'Poèmes du quotidien.', isbn: '9782070360093', publishingHouse: 'Éditions Gallimard', publishedAt: '1946-01-01' },
    { name: 'Capitale de la douleur', coverId: 'https://covers.openlibrary.org/b/isbn/9782070301133-L.jpg', author: 'Paul Éluard', description: 'Surréalisme.', isbn: '9782070301133', publishingHouse: 'Éditions Gallimard', publishedAt: '1926-01-01' },
    { name: 'Le Parti pris des choses', coverId: 'https://covers.openlibrary.org/b/isbn/9782070301386-L.jpg', author: 'Francis Ponge', description: 'Poésie de l\'objet.', isbn: '9782070301386', publishingHouse: 'Éditions Gallimard', publishedAt: '1942-01-01' },
    { name: 'Alcools', coverId: 'https://covers.openlibrary.org/b/isbn/9782070300075-L.jpg', author: 'Guillaume Apollinaire', description: 'Modernité.', isbn: '9782070300075', publishingHouse: 'Éditions Gallimard', publishedAt: '1913-01-01' },
    { name: 'Calligrammes', coverId: 'https://covers.openlibrary.org/b/isbn/9782070300082-L.jpg', author: 'Guillaume Apollinaire', description: 'Guerre et paix.', isbn: '9782070300082', publishingHouse: 'Éditions Gallimard', publishedAt: '1918-01-01' },
    { name: 'Un barrage contre le Pacifique', coverId: 'https://covers.openlibrary.org/b/isbn/9782070361007-L.jpg', author: 'Marguerite Duras', description: 'Indochine.', isbn: '9782070361007', publishingHouse: 'Éditions Gallimard', publishedAt: '1950-01-01' },

    // ================= BESTSELLERS (35) =================
    { name: 'L\'Anomalie', coverId: 'https://covers.openlibrary.org/b/isbn/9782072895043-L.jpg', author: 'Hervé Le Tellier', description: 'Un vol qui change tout.', isbn: '9782072895043', publishingHouse: 'Éditions Gallimard', publishedAt: '2020-08-20' },
    { name: 'Petit Pays', coverId: 'https://covers.openlibrary.org/b/isbn/9782246857334-L.jpg', author: 'Gaël Faye', description: 'Burundi.', isbn: '9782246857334', publishingHouse: 'Éditions Grasset', publishedAt: '2016-08-24' },
    { name: 'Changer l\'eau des fleurs', coverId: 'https://covers.openlibrary.org/b/isbn/9782226402431-L.jpg', author: 'Valérie Perrin', description: 'Garde-cimetière.', isbn: '9782226402431', publishingHouse: 'Éditions Albin Michel', publishedAt: '2018-02-28' },
    { name: 'La Vérité sur l\'affaire Harry Quebert', coverId: 'https://covers.openlibrary.org/b/isbn/9782877068161-L.jpg', author: 'Joël Dicker', description: 'Thriller.', isbn: '9782877068161', publishingHouse: 'Éditions de Fallois', publishedAt: '2012-09-19' },
    { name: 'L\'Amant', coverId: 'https://covers.openlibrary.org/b/isbn/9782707306951-L.jpg', author: 'Marguerite Duras', description: 'Passion.', isbn: '9782707306951', publishingHouse: 'Éditions de Minuit', publishedAt: '1984-09-01' },
    { name: 'Vernon Subutex 1', coverId: 'https://covers.openlibrary.org/b/isbn/9782246857365-L.jpg', author: 'Virginie Despentes', description: 'Paris.', isbn: '9782246857365', publishingHouse: 'Éditions Grasset', publishedAt: '2015-01-07' },
    { name: 'L\'élégance du hérisson', coverId: 'https://covers.openlibrary.org/b/isbn/9782070780938-L.jpg', author: 'Muriel Barbery', description: 'Beauté.', isbn: '9782070780938', publishingHouse: 'Éditions Gallimard', publishedAt: '2006-08-31' },
    { name: 'La Tresse', coverId: 'https://covers.openlibrary.org/b/isbn/9782246813880-L.jpg', author: 'Laetitia Colombani', description: 'Trois femmes.', isbn: '9782246813880', publishingHouse: 'Éditions Grasset', publishedAt: '2017-05-10' },
    { name: 'Tout le bleu du ciel', coverId: 'https://covers.openlibrary.org/b/isbn/9782253241584-L.jpg', author: 'Mélissa Da Costa', description: 'Voyage.', isbn: '9782253241584', publishingHouse: 'Carnets Nord', publishedAt: '2019-02-01' },
    { name: 'Sapiens', coverId: 'https://covers.openlibrary.org/b/isbn/9782226257017-L.jpg', author: 'Yuval Noah Harari', description: 'Humanité.', isbn: '9782226257017', publishingHouse: 'Éditions Albin Michel', publishedAt: '2015-01-01' },
    { name: 'Harry Potter 1', coverId: 'https://covers.openlibrary.org/b/isbn/9782070541270-L.jpg', author: 'J.K. Rowling', description: 'Magie.', isbn: '9782070541270', publishingHouse: 'Gallimard Jeunesse', publishedAt: '1998-10-09' },
    { name: 'Harry Potter 2', coverId: 'https://covers.openlibrary.org/b/isbn/9782070541294-L.jpg', author: 'J.K. Rowling', description: 'Chambre des secrets.', isbn: '9782070541294', publishingHouse: 'Gallimard Jeunesse', publishedAt: '1999-01-01' },
    { name: 'Harry Potter 3', coverId: 'https://covers.openlibrary.org/b/isbn/9782070528189-L.jpg', author: 'J.K. Rowling', description: 'Azkaban.', isbn: '9782070528189', publishingHouse: 'Gallimard Jeunesse', publishedAt: '1999-01-01' },
    { name: 'Harry Potter 4', coverId: 'https://covers.openlibrary.org/b/isbn/9782070543519-L.jpg', author: 'J.K. Rowling', description: 'Coupe de feu.', isbn: '9782070543519', publishingHouse: 'Gallimard Jeunesse', publishedAt: '2000-01-01' },
    { name: 'Nymphéas noirs', coverId: 'https://covers.openlibrary.org/b/isbn/9782253161677-L.jpg', author: 'Michel Bussi', description: 'Giverny.', isbn: '9782253161677', publishingHouse: 'Presses de la Cité', publishedAt: '2011-01-01' },
    { name: 'Un avion sans elle', coverId: 'https://covers.openlibrary.org/b/isbn/9782253173731-L.jpg', author: 'Michel Bussi', description: 'Crash.', isbn: '9782253173731', publishingHouse: 'Presses de la Cité', publishedAt: '2012-01-01' },
    { name: 'Maman a tort', coverId: 'https://covers.openlibrary.org/b/isbn/9782253086581-L.jpg', author: 'Michel Bussi', description: 'Identité.', isbn: '9782253086581', publishingHouse: 'Presses de la Cité', publishedAt: '2015-01-01' },
    { name: 'Pars vite et reviens tard', coverId: 'https://covers.openlibrary.org/b/isbn/9782290325414-L.jpg', author: 'Fred Vargas', description: 'Adamsberg.', isbn: '9782290325414', publishingHouse: 'Éditions Viviane Hamy', publishedAt: '2001-01-01' },
    { name: 'La vie secrète des arbres', coverId: 'https://covers.openlibrary.org/b/isbn/9782809712315-L.jpg', author: 'Peter Wohlleben', description: 'Nature.', isbn: '9782809712315', publishingHouse: 'Éditions Guy Trédaniel', publishedAt: '2017-01-01' },
    { name: 'Ta deuxième vie...', coverId: 'https://covers.openlibrary.org/b/isbn/9782212561166-L.jpg', author: 'Raphaëlle Giordano', description: 'Bien-être.', isbn: '9782212561166', publishingHouse: 'Éditions Eyrolles', publishedAt: '2015-09-17' },
    { name: 'Le Parfum', coverId: 'https://covers.openlibrary.org/b/isbn/9782253044901-L.jpg', author: 'Patrick Süskind', description: 'Odeurs.', isbn: '9782253044901', publishingHouse: 'Éditions Fayard', publishedAt: '1985-01-01' },
    { name: 'Millénium 1', coverId: 'https://covers.openlibrary.org/b/isbn/9782 Actes Sud-L.jpg', author: 'Stieg Larsson', description: 'Lisbeth Salander.', isbn: '9782742761579', publishingHouse: 'Actes Sud', publishedAt: '2006-05-10' },
    { name: 'Juste avant le bonheur', coverId: 'https://covers.openlibrary.org/b/isbn/9782226246813-L.jpg', author: 'Agnès Ledig', description: 'Rencontre.', isbn: '9782226246813', publishingHouse: 'Éditions Albin Michel', publishedAt: '2013-04-01' },
    { name: 'Kilomètre zéro', coverId: 'https://covers.openlibrary.org/b/isbn/9782212567229-L.jpg', author: 'Maud Ankaoua', description: 'Voyage.', isbn: '9782212567229', publishingHouse: 'Éditions Eyrolles', publishedAt: '2017-09-14' },
    { name: 'La Délicatesse', coverId: 'https://covers.openlibrary.org/b/isbn/9782070124626-L.jpg', author: 'David Foenkinos', description: 'Amour.', isbn: '9782070124626', publishingHouse: 'Éditions Gallimard', publishedAt: '2009-03-05' },
    { name: 'No et moi', coverId: 'https://covers.openlibrary.org/b/isbn/9782253124801-L.jpg', author: 'Delphine de Vigan', description: 'Amitié.', isbn: '9782253124801', publishingHouse: 'Éditions Jean-Claude Lattès', publishedAt: '2007-01-01' },
    { name: 'D\'après une histoire vraie', coverId: 'https://covers.openlibrary.org/b/isbn/9782253068594-L.jpg', author: 'Delphine de Vigan', description: 'Manipulation.', isbn: '9782253068594', publishingHouse: 'Éditions Jean-Claude Lattès', publishedAt: '2015-08-26' },
    { name: 'L\'art de perdre', coverId: 'https://covers.openlibrary.org/b/isbn/9782081395534-L.jpg', author: 'Alice Zeniter', description: 'Algérie.', isbn: '9782081395534', publishingHouse: 'Éditions Flammarion', publishedAt: '2017-08-16' },
    { name: 'Leurs enfants après eux', coverId: 'https://covers.openlibrary.org/b/isbn/9782330108670-L.jpg', author: 'Nicolas Mathieu', description: 'Années 90.', isbn: '9782330108670', publishingHouse: 'Actes Sud', publishedAt: '2018-08-22' },
    { name: 'Hunger Games 1', coverId: 'https://covers.openlibrary.org/b/isbn/9782266182690-L.jpg', author: 'Suzanne Collins', description: 'Panem.', isbn: '9782266182690', publishingHouse: 'Pocket Jeunesse', publishedAt: '2008-01-01' },
    { name: 'Divergente 1', coverId: 'https://covers.openlibrary.org/b/isbn/9782092532300-L.jpg', author: 'Veronica Roth', description: 'Factions.', isbn: '9782092532300', publishingHouse: 'Éditions Nathan', publishedAt: '2011-01-01' },
    { name: 'Twilight 1', coverId: 'https://covers.openlibrary.org/b/isbn/9782012010673-L.jpg', author: 'Stephenie Meyer', description: 'Vampire.', isbn: '9782012010673', publishingHouse: 'Hachette Jeunesse', publishedAt: '2005-01-01' },
    { name: 'Le Labyrinthe', coverId: 'https://covers.openlibrary.org/b/isbn/9782266223256-L.jpg', author: 'James Dashner', description: 'Dédale.', isbn: '9782266223256', publishingHouse: 'Pocket Jeunesse', publishedAt: '2009-01-01' },
    { name: 'La nuit des temps', coverId: 'https://covers.openlibrary.org/b/isbn/9782266000017-L.jpg', author: 'René Barjavel', description: 'Antarctique.', isbn: '9782266000017', publishingHouse: 'Presses de la Cité', publishedAt: '1968-01-01' },
    { name: 'Le meilleur des mondes', coverId: 'https://covers.openlibrary.org/b/isbn/9782266128568-L.jpg', author: 'Aldous Huxley', description: 'Dystopie.', isbn: '9782266128568', publishingHouse: 'Éditions Plon', publishedAt: '1932-01-01' },

    // ================= HORROR / THRILLER NOIR (35) =================
    { name: 'Maléfices', coverId: 'https://covers.openlibrary.org/b/isbn/9782226154941-L.jpg', author: 'Maxime Chattam', description: 'Araignées.', isbn: '9782226154941', publishingHouse: 'Éditions Albin Michel', publishedAt: '2004-01-01' },
    { name: 'Ça - Tome 1', coverId: 'https://covers.openlibrary.org/b/isbn/9782253134114-L.jpg', author: 'Stephen King', description: 'Grippe-Sou.', isbn: '9782253134114', publishingHouse: 'Éditions Albin Michel', publishedAt: '1986-09-15' },
    { name: 'Shining', coverId: 'https://covers.openlibrary.org/b/isbn/9782253134138-L.jpg', author: 'Stephen King', description: 'Folie.', isbn: '9782253134138', publishingHouse: 'Éditions Albin Michel', publishedAt: '1977-01-28' },
    { name: 'Simetierre', coverId: 'https://covers.openlibrary.org/b/isbn/9782253134152-L.jpg', author: 'Stephen King', description: 'Le retour.', isbn: '9782253134152', publishingHouse: 'Éditions Albin Michel', publishedAt: '1983-11-14' },
    { name: 'Le Syndrome E', coverId: 'https://covers.openlibrary.org/b/isbn/9782265089334-L.jpg', author: 'Franck Thilliez', description: 'Cerveau.', isbn: '9782265089334', publishingHouse: 'Fleuve Éditions', publishedAt: '2010-10-14' },
    { name: 'Gataca', coverId: 'https://covers.openlibrary.org/b/isbn/9782265091580-L.jpg', author: 'Franck Thilliez', description: 'Évolution.', isbn: '9782265091580', publishingHouse: 'Fleuve Éditions', publishedAt: '2011-01-01' },
    { name: 'Glacé', coverId: 'https://covers.openlibrary.org/b/isbn/9782352041351-L.jpg', author: 'Bernard Minier', description: 'Pyrénées.', isbn: '9782352041351', publishingHouse: 'XO Éditions', publishedAt: '2011-02-24' },
    { name: 'Le Chuchoteur', coverId: 'https://covers.openlibrary.org/b/isbn/9782253133377-L.jpg', author: 'Donato Carrisi', description: 'Chuchotements.', isbn: '9782253133377', publishingHouse: 'Éditions Calmann-Lévy', publishedAt: '2009-01-01' },
    { name: 'Dracula', coverId: 'https://covers.openlibrary.org/b/isbn/9782253005889-L.jpg', author: 'Bram Stoker', description: 'Vampire.', isbn: '9782253005889', publishingHouse: 'Constable & Robinson', publishedAt: '1897-01-01' },
    { name: 'Frankenstein', coverId: 'https://covers.openlibrary.org/b/isbn/9782253005896-L.jpg', author: 'Mary Shelley', description: 'Monstre.', isbn: '9782253005896', publishingHouse: 'Lackington', publishedAt: '1818-01-01' },
    { name: 'Misery', coverId: 'https://covers.openlibrary.org/b/isbn/9782253134169-L.jpg', author: 'Stephen King', description: 'Fan.', isbn: '9782253134169', publishingHouse: 'Éditions Albin Michel', publishedAt: '1987-01-01' },
    { name: 'Carrie', coverId: 'https://covers.openlibrary.org/b/isbn/9782253134121-L.jpg', author: 'Stephen King', description: 'Vengeance.', isbn: '9782253134121', publishingHouse: 'Éditions Albin Michel', publishedAt: '1974-01-01' },
    { name: 'Cujo', coverId: 'https://covers.openlibrary.org/b/isbn/9782253134145-L.jpg', author: 'Stephen King', description: 'Chien.', isbn: '9782253134145', publishingHouse: 'Éditions Albin Michel', publishedAt: '1981-01-01' },
    { name: 'Sharko', coverId: 'https://covers.openlibrary.org/b/isbn/9782266282337-L.jpg', author: 'Franck Thilliez', description: 'Enquête.', isbn: '9782266282337', publishingHouse: 'Fleuve Éditions', publishedAt: '2017-01-01' },
    { name: 'Pandemia', coverId: 'https://covers.openlibrary.org/b/isbn/9782266267747-L.jpg', author: 'Franck Thilliez', description: 'Virus.', isbn: '9782266267747', publishingHouse: 'Fleuve Éditions', publishedAt: '2015-01-01' },
    { name: 'Angor', coverId: 'https://covers.openlibrary.org/b/isbn/9782265098251-L.jpg', author: 'Franck Thilliez', description: 'Cœur.', isbn: '9782265098251', publishingHouse: 'Fleuve Éditions', publishedAt: '2014-01-01' },
    { name: 'Luca', coverId: 'https://covers.openlibrary.org/b/isbn/9782266307376-L.jpg', author: 'Franck Thilliez', description: 'Génétique.', isbn: '9782266307376', publishingHouse: 'Fleuve Éditions', publishedAt: '2019-01-01' },
    { name: 'Atomka', coverId: 'https://covers.openlibrary.org/b/isbn/9782265094543-L.jpg', author: 'Franck Thilliez', description: 'Froid.', isbn: '9782265094543', publishingHouse: 'Fleuve Éditions', publishedAt: '2012-01-01' },
    { name: 'Puzzle', coverId: 'https://covers.openlibrary.org/b/isbn/9782265096189-L.jpg', author: 'Franck Thilliez', description: 'Jeu.', isbn: '9782265096189', publishingHouse: 'Fleuve Éditions', publishedAt: '2013-01-01' },
    { name: 'L\'empire des loups', coverId: 'https://covers.openlibrary.org/b/isbn/9782253112310-L.jpg', author: 'Jean-Christophe Grangé', description: 'Loups.', isbn: '9782253112310', publishingHouse: 'Éditions Albin Michel', publishedAt: '2003-01-01' },
    { name: 'Les Rivières pourpres', coverId: 'https://covers.openlibrary.org/b/isbn/9782253147367-L.jpg', author: 'Jean-Christophe Grangé', description: 'Macabre.', isbn: '9782253147367', publishingHouse: 'Éditions Albin Michel', publishedAt: '1998-01-01' },
    { name: 'L\'outsider', coverId: 'https://covers.openlibrary.org/b/isbn/9782253241584-L.jpg', author: 'Stephen King', description: 'Crime.', isbn: '9782253241584', publishingHouse: 'Éditions Albin Michel', publishedAt: '2018-01-01' },
    { name: 'Le Silence des Agneaux', coverId: 'https://covers.openlibrary.org/b/isbn/9782266208949-L.jpg', author: 'Thomas Harris', description: 'Lecter.', isbn: '9782266208949', publishingHouse: 'St. Martin\'s Press', publishedAt: '1988-01-01' },
    { name: 'Dragon Rouge', coverId: 'https://covers.openlibrary.org/b/isbn/9782266208932-L.jpg', author: 'Thomas Harris', description: 'Origines.', isbn: '9782266208932', publishingHouse: 'G. P. Putnam\'s Sons', publishedAt: '1981-01-01' },
    { name: '22/11/63', coverId: 'https://covers.openlibrary.org/b/isbn/9782253177691-L.jpg', author: 'Stephen King', description: 'Kennedy.', isbn: '9782253177691', publishingHouse: 'Éditions Albin Michel', publishedAt: '2011-01-01' },
    { name: 'Le Fléau', coverId: 'https://covers.openlibrary.org/b/isbn/9782253134190-L.jpg', author: 'Stephen King', description: 'Virus.', isbn: '9782253134190', publishingHouse: 'Éditions Albin Michel', publishedAt: '1978-01-01' },
    { name: 'L\'Appel de Cthulhu', coverId: 'https://covers.openlibrary.org/b/isbn/9782290033142-L.jpg', author: 'H.P. Lovecraft', description: 'Cosmique.', isbn: '9782290033142', publishingHouse: 'Weird Tales', publishedAt: '1928-01-01' },
    { name: 'Ring', coverId: 'https://covers.openlibrary.org/b/isbn/9782266130455-L.jpg', author: 'Koji Suzuki', description: 'Cassette.', isbn: '9782266130455', publishingHouse: 'Kadokawa Shoten', publishedAt: '1991-01-01' },
    { name: 'Psycho', coverId: 'https://covers.openlibrary.org/b/isbn/9782266150170-L.jpg', author: 'Robert Bloch', description: 'Bates.', isbn: '9782266150170', publishingHouse: 'Simon & Schuster', publishedAt: '1959-01-01' },
    { name: 'Le Signal', coverId: 'https://covers.openlibrary.org/b/isbn/9782226438096-L.jpg', author: 'Maxime Chattam', description: 'Signal.', isbn: '9782226438096', publishingHouse: 'Éditions Albin Michel', publishedAt: '2018-01-01' },
    { name: 'L\'Exorciste', coverId: 'https://covers.openlibrary.org/b/isbn/9782221141366-L.jpg', author: 'William Peter Blatty', description: 'Démon.', isbn: '9782221141366', publishingHouse: 'Harper & Row', publishedAt: '1971-01-01' },
    { name: 'Dôme - Tome 1', coverId: 'https://covers.openlibrary.org/b/isbn/9782253162315-L.jpg', author: 'Stephen King', description: 'Sous le dôme.', isbn: '9782253162315', publishingHouse: 'Éditions Albin Michel', publishedAt: '2009-01-01' },
    { name: 'Marche ou crève', coverId: 'https://covers.openlibrary.org/b/isbn/9782253134145-L.jpg', author: 'Stephen King', description: 'Course.', isbn: '9782253134145', publishingHouse: 'Signet Books', publishedAt: '1979-01-01' },
    { name: 'L\'Institut', coverId: 'https://covers.openlibrary.org/b/isbn/9782226443151-L.jpg', author: 'Stephen King', description: 'Enfants.', isbn: '9782226443151', publishingHouse: 'Éditions Albin Michel', publishedAt: '2019-01-01' },
    { name: 'Docteur Sleep', coverId: 'https://covers.openlibrary.org/b/isbn/9782253134183-L.jpg', author: 'Stephen King', description: 'Danny Torrance.', isbn: '9782253134183', publishingHouse: 'Éditions Albin Michel', publishedAt: '2013-01-01' },
  ];

  // Standardisation stricte
  const standardizedBooks = booksData.map(b => ({
    name: b.name,
    author: b.author,
    description: b.description,
    isbn: b.isbn,
    publishedAt: b.publishedAt,
    coverId: b.coverId,
    publishingHouse: b.publishingHouse,
  }));

  // Insertion Livres
  const insertedBooks = await db
    .insert(book)
    .values(standardizedBooks)
    .onConflictDoNothing({ target: book.isbn })
    .returning();

  // Insertion Catégories
  await db
    .insert(category)
    .values(categoriesToInsert)
    .onConflictDoNothing({ target: category.name });

  const allCategories = await db.select().from(category);

  // Liaisons
  if (insertedBooks.length > 0) {
    const links = insertedBooks.map((b, i) => {
      let catName = 'random';
      if (i >= 35 && i < 70) catName = 'bestsellers';
      if (i >= 70) catName = 'horror';

      return {
        bookId: b.id,
        categoryId: allCategories.find(c => c.name === catName)!.id
      };
    });

    await db.insert(bookCategory).values(links).onConflictDoNothing();
    console.log(`${links.length} liaisons créées avec succès ! 🔗`);
  }

  console.log('Seeding terminé ! 🚀');
}

seed().catch((error) => {
  console.error('Erreur :', error);
  process.exit(1);
});