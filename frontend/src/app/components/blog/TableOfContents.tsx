'use client';

import { useEffect, useState } from 'react';
import { ChevronsRight } from 'lucide-react';

export interface TocEntry {
  id: string;
  text: string;
  level: 'h2' | 'h3' | string;
}

interface Props {
  entries: TocEntry[];
}

export default function TableOfContents({ entries }: Props) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (entries.length === 0) return;

    const elements = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const firstVisible = elements.find((el) => visible.has(el.id));
        if (firstVisible) setActiveId(firstVisible.id);
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
        In this article
      </h4>
      <nav className="border-l border-gray-200">
        <ul className="space-y-1">
          {entries.map((e) => {
            const isActive = e.id === activeId;
            return (
              <li key={e.id}>
                <a
                  href={`#${e.id}`}
                  className={`flex items-center gap-1.5 text-sm -ml-px py-1 border-l-2 transition-colors ${
                    e.level === 'h3' ? 'pl-6' : 'pl-3'
                  } ${
                    isActive
                      ? 'text-sky-600 border-sky-600 font-medium'
                      : 'text-gray-600 border-transparent hover:text-sky-700 hover:border-sky-700'
                  }`}
                >
                  <ChevronsRight
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-sky-600' : 'text-gray-400'
                    }`}
                  />
                  <span>{e.text}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
