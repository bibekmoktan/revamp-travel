import Image from 'next/image';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { urlFor } from '@/lib/sanity/client';
import { extractText, slugify } from '@/lib/sanity/slugify';
import type { ContentBlock } from '@/lib/sanity/types';

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const src = urlFor(value).width(1600).fit('max').url();
      return (
        <figure className="my-8">
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
            <Image
              src={src}
              alt={value.alt ?? ''}
              fill
              className="object-cover"
              sizes="(max-width: 1000px) 100vw, 1000px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-sm text-gray-500 text-center mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ value, children }) => {
      const blank = !!value?.blank;
      return (
        <a
          href={value?.href}
          target={blank ? '_blank' : undefined}
          rel={blank ? 'noopener noreferrer' : undefined}
          className="text-sky-700 underline hover:text-sky-900"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm">{children}</code>
    ),
  },
  block: {
    normal: ({ children }) => (
      <p className="text-gray-700 leading-relaxed text-base mb-4">{children}</p>
    ),
    h2: ({ children }) => (
      <h2
        id={slugify(extractText(children))}
        className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3 scroll-mt-[120px]"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        id={slugify(extractText(children))}
        className="text-lg md:text-xl font-bold text-gray-900 mt-6 mb-2 scroll-mt-[120px]"
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-sky-300 pl-4 italic text-gray-600 my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 space-y-2 mb-4 text-gray-700">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 space-y-2 mb-4 text-gray-700">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
};

interface PostBodyProps {
  value: ContentBlock[];
}

export default function PostBody({ value }: PostBodyProps) {
  return <PortableText value={value} components={components} />;
}
