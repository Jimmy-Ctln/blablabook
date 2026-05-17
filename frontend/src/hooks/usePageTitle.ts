import { useEffect } from "react";

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} — Blablabook`;
  }, [title]);
}

export function useNoIndex() {
  useEffect(() => {
    const meta = Object.assign(document.createElement("meta"), {
      name: "robots",
      content: "noindex, nofollow",
    });
    document.head.appendChild(meta);
    return () => {
      if (document.head.contains(meta)) document.head.removeChild(meta);
    };
  }, []);
}
