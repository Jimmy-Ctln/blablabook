import { category } from 'src/db/schema';

// On utilise l'inférence de Drizzle comme source de vérité unique
export type Category = typeof category.$inferSelect;
