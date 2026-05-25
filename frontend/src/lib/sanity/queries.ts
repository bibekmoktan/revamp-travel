const POST_LIST_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  image { ..., asset-> },
  date,
  readTime,
  featured,
  author-> { name, "slug": slug.current, avatar },
  category-> { title, "slug": slug.current }
`;

export const ALL_POSTS_QUERY = `
  *[_type == "blogPost"] | order(date desc) {
    ${POST_LIST_FIELDS}
  }
`;

export const FEATURED_POSTS_QUERY = `
  *[_type == "blogPost" && featured == true] | order(date desc) {
    ${POST_LIST_FIELDS}
  }
`;

export const POST_BY_SLUG_QUERY = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    image { ..., asset->, alt },
    date,
    readTime,
    featured,
    keyTakeaways,
    content[]{ heading, paragraph },
    finalThoughts { title, paragraphs },
    author-> { name, "slug": slug.current, avatar, bio },
    category-> { title, "slug": slug.current, description }
  }
`;

export const ALL_SLUGS_QUERY = `
  *[_type == "blogPost" && defined(slug.current)][].slug.current
`;

export const POSTS_BY_CATEGORY_QUERY = `
  *[_type == "blogPost" && category->slug.current == $categorySlug]
    | order(date desc) {
    ${POST_LIST_FIELDS}
  }
`;
