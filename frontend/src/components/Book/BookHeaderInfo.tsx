import React from "react";

// Props for the BookHeaderInfo component
interface BookHeaderInfoProps {
  title: string;
  author: string;
}

export const BookHeaderInfo: React.FC<BookHeaderInfoProps> = ({
  title,
  author,
}) => (
  <div className="flex flex-col w-full">
    <h2 className="text-5xl md:text-5x text-foreground mb-2">{title}</h2>
    <div className="text-lg text-foreground">
      <span className="mr-2 text-muted-foreground">par</span>{" "}
      <span className=" text-foreground">{author}</span>
    </div>
    <div className="text-foreground mt-4"></div>
  </div>
);
