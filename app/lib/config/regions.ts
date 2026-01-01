export const SUPPORTED_REGIONS = {
  US: { code: 'US', name: 'United States', flag: '🇺🇸' },
  GB: { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  CA: { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  AU: { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  DE: { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  FR: { code: 'FR', name: 'France', flag: '🇫🇷' },
  ES: { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  IT: { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  NL: { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  SE: { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
} as const;

export type RegionCode = keyof typeof SUPPORTED_REGIONS;

export const DEFAULT_REGION: RegionCode = 'US';

export const LANGUAGE_CODES = {
  en: 'English',
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  it: 'Italian',
  nl: 'Dutch',
  sv: 'Swedish',
} as const;

export const DEFAULT_LANGUAGE = 'en';
