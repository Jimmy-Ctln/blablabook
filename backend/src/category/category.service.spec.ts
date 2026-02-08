import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { Category } from './types/category';

/**
 * INTERFACE DE MOCK POUR DRIZZLE
 * Drizzle utilise un "Fluent API" (chaînage de méthodes).
 * Chaque méthode (select, from, where) doit retourner l'objet lui-même (this) 
 * pour que la chaîne ne soit pas brisée.
 */
interface DrizzleMock {
  select: jest.Mock<DrizzleMock>;
  from: jest.Mock<DrizzleMock>;
  where: jest.Mock<DrizzleMock>;
  insert: jest.Mock<DrizzleMock>;
  values: jest.Mock<DrizzleMock>;
  // execute et returning sont les "terminaisons" qui renvoient la promesse de données
  execute: jest.Mock<Promise<Category[]>>;
  returning: jest.Mock<Promise<Category[]>>;
}

describe('CategoryService', () => {
  let service: CategoryService;
  let dbMock: DrizzleMock;

  beforeEach(async () => {
    // Initialisation du mock avec 'mockReturnThis()'
    // Permet de simuler: db.select().from().where() sans erreur
    dbMock = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      execute: jest.fn(),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn(),
    } as unknown as DrizzleMock;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        // Injection du mock sous le token 'DRIZZLE' défini dans le Provider global
        { provide: 'DRIZZLE', useValue: dbMock },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all active categories', async () => {
      // Données simulées basées sur l'inférence Drizzle ($inferSelect)
      const categories: Category[] = [
        { id: 1, name: 'Roman', isActive: true },
        { id: 2, name: 'BD', isActive: true },
      ];

      // Simulation du retour de la base de données
      dbMock.execute.mockResolvedValue(categories);
      
      const result = await service.findAll();

      // Vérification que le service filtre bien les données (ne renvoyer que id et name)
      expect(result).toEqual([
        { id: 1, name: 'Roman' },
        { id: 2, name: 'BD' },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const categories: Category[] = [{ id: 1, name: 'Roman', isActive: true }];
      dbMock.execute.mockResolvedValue(categories);

      const result = await service.findOne(1);
      expect(result).toEqual({ id: 1, name: 'Roman' });
    });

    it('should throw NotFoundException if not found', async () => {
      // Simuler un retour vide de la base de données
      dbMock.execute.mockResolvedValue([]); 
      
      await expect(service.findOne(99)).rejects.toThrow(
        'Category with ID 99 not found',
      );
    });
  });

  describe('findOrCreateByName', () => {
    it('should return existing category if found', async () => {
      const categories: Category[] = [{ id: 1, name: 'Roman', isActive: true }];
      dbMock.execute.mockResolvedValue(categories);

      const result = await service.findOrCreateByName('Roman');

      // Vérification qu'il n'y a pas eu d'insertion (quand la catégorie existe déjà)
      expect(dbMock.insert).not.toHaveBeenCalled();
      expect(result).toEqual({ id: 1, name: 'Roman' });
    });

    it('should create and return new category if not found', async () => {
      /**
       * 1. Simulation que le premier SELECT est vide (mockResolvedValueOnce)
       * 2. Simulation que l'insertion (returning) renvoie la nouvelle ligne
       */
      dbMock.execute.mockResolvedValueOnce([]);
      
      const newCategory: Category[] = [{ id: 2, name: 'BD', isActive: true }];
      dbMock.returning.mockResolvedValue(newCategory);

      const result = await service.findOrCreateByName('BD');

      expect(result).toEqual({ id: 2, name: 'BD' });
      
      // Vérification des appels au Query Builder
      expect(dbMock.insert).toHaveBeenCalled();
      expect(dbMock.values).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'BD' }),
      );
    });
  });
});