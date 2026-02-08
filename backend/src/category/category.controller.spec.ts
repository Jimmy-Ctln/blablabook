import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { NotFoundException } from '@nestjs/common';

describe('CategoryController', () => {
  let controller: CategoryController;

  // Mock du service : simulation uniquement des méthodes utilisées par le contrôleur
  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CategoryController
      ],
      providers: [
        // Injection du mock à la place du vrai service pour isoler le contrôleur
        { 
          provide: CategoryService, 
          useValue: mockService 
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return an array of categories', async () => {
      const expectedResult = [
        { id: 1, name: 'Roman' },
        { id: 2, name: 'BD' },
      ];

      // Définition du comportement du mock pour ce test précis
      mockService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should return a single category by ID', async () => {
      const expectedCategory = { id: 1, name: 'Roman' };
      mockService.findOne.mockResolvedValue(expectedCategory);

      // Si le contrôleur transmet bien l'ID au service
      const result = await controller.findOne(1);

      expect(result).toEqual(expectedCategory);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
    });

    it('should propagate exceptions from the service', async () => {
      /**
       * Si le service lance une erreur (ex: 404), 
       * le contrôleur la laisse remonter correctement vers NestJS.
       */
      const errorMessage = 'Category with ID 99 not found';
      mockService.findOne.mockRejectedValue(new NotFoundException(errorMessage));

      await expect(controller.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });
});