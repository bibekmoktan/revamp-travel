import { logger } from './logger';

/**
 * Generate a URL-friendly slug from a string
 */
export const generateSlug = (text: string): string => {
  try {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  } catch (error: any) {
    logger.error('Failed to generate slug', { text, error: error.message });
    throw new Error('Slug generation failed');
  }
};

/**
 * Generate a unique slug by checking for duplicates
 */
export const generateUniqueSlug = async (text: string, model: any, additionalCheck?: any): Promise<string> => {
  try {
    let baseSlug = generateSlug(text);
    let uniqueSlug = baseSlug;
    let counter = 1;

    // Check if slug exists
    while (true) {
      const query = { slug: uniqueSlug };
      if (additionalCheck) {
        Object.assign(query, additionalCheck);
      }
      
      const existing = await model.findOne(query);
      
      if (!existing) {
        break;
      }

      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    logger.info('Generated unique slug', { 
      originalText: text, 
      baseSlug, 
      finalSlug: uniqueSlug,
      attempts: counter 
    });

    return uniqueSlug;
  } catch (error: any) {
    logger.error('Failed to generate unique slug', { 
      text, 
      error: error.message 
    });
    throw new Error('Unique slug generation failed');
  }
};

/**
 * Validate slug format
 */
export const validateSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 100;
};
