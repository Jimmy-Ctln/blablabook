import { Test, TestingModule } from '@nestjs/testing';
import { CookieService } from './cookie.service';

describe('CookieService', () => {
  let service: CookieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CookieService],
    }).compile();

    service = module.get<CookieService>(CookieService);

    jest.resetModules();
    process.env.NODE_ENV = 'test';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateCookiesConfig()', () => {
    it('should return correct configuration structure', () => {
      const config = service.generateCookiesConfig();

      expect(config).toHaveProperty('jwtCookieConfig');
      expect(config).toHaveProperty('refreshCookieConfig');

      // Vérification des valeurs communes
      expect(config.jwtCookieConfig.httpOnly).toBe(true);
      expect(config.refreshCookieConfig.path).toBe('/');
    });

    it('should set secure to false when not in prod', () => {
      process.env.NODE_ENV = 'dev';
      const config = service.generateCookiesConfig();

      expect(config.jwtCookieConfig.secure).toBe(false);
      expect(config.refreshCookieConfig.secure).toBe(false);
    });

    it('should set secure to true when in prod', () => {
      process.env.NODE_ENV = 'prod';
      const config = service.generateCookiesConfig();

      expect(config.jwtCookieConfig.secure).toBe(true);
      expect(config.refreshCookieConfig.secure).toBe(true);
    });

    it('should have correct maxAge for both cookies', () => {
      const config = service.generateCookiesConfig();

      const fifteenMins = 15 * 60 * 1000;
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;

      expect(config.jwtCookieConfig.maxAge).toBe(fifteenMins);
      expect(config.refreshCookieConfig.maxAge).toBe(thirtyDays);
    });
  });
});
