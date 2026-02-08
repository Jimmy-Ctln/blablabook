import React from "react";
import { Globe, Library, FileText, Barcode, Calendar, Star } from "lucide-react";
import { BookDataItem } from "../ui/item";

interface BookDataGridProps {
  isbn: string;
  publisher: string;
  language: string;
  pages: number | string;
  publishedAt: string;
  categories: string[] | string;
  rating?: number;  
}

export const BookDataGrid: React.FC<BookDataGridProps> = ({ isbn, publisher, language, pages, publishedAt, categories, rating }) => (
    <div className="bg-chart-2 border border-gray-200 flex flex-col rounded-xl p-6 shadow-sm w-full gap-4">
      {/* BookDataGrid displays book technical details using BookDataItem for each field */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* ISBN field */}
      <BookDataItem icon={<Barcode size={18} />} label="code ISBN" value={isbn} />
      {/* Language field */}
      <BookDataItem icon={<Globe size={18} />} label="Langues" value={language} />
      {/* Date field */}
      <BookDataItem icon={<Calendar size={18} />} label="Date de publication" value={publishedAt} />
      {/* Publisher field */}
      <BookDataItem icon={<Library size={18} />} label="Éditeur" value={publisher} />
      {/* Pages field */}
      <BookDataItem icon={<FileText size={18} />} label="Pages" value={pages} />
      {/* Categories field */}
      <BookDataItem
        icon={<FileText size={18} />}
        label="Catégories"
        value={Array.isArray(categories) ? categories.join(", ") : categories}
      />
      {/* Only display the rating badge if a rating is provided */}
      {rating !== undefined && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-sm font-sans text-foreground shadow-sm">
          <Star size={16} className="text-foreground fill-bookochre" aria-hidden="true" /> 
          <span>{rating}/5</span>
        </div>
      )}
    </div>
  </div>
);