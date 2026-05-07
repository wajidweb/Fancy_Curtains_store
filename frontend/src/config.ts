export const CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
  CONTACT: {
    WHATSAPP_1: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_1 || '60199218203',
    WHATSAPP_2: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_2 || '60129291483',
    NAME_1: process.env.NEXT_PUBLIC_CONTACT_NAME_1 || 'Fazal Subhan',
    NAME_2: process.env.NEXT_PUBLIC_CONTACT_NAME_2 || 'Nadir Khan',
  }
};
