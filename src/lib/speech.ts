// Language code mapping from 2-letter codes to ResponsiveVoice language codes
const LANGUAGE_CODE_MAP: Record<string, string> = {
  'en': 'en-US',
  'sq': 'sq-AL',
  'am': 'am-ET',
  'ar': 'ar-SA',
  'bn': 'bn-BD',
  'bg': 'bg-BG',
  'my': 'my-MM',
  'zh': 'zh-CN',
  'hr': 'hr-HR',
  'cs': 'cs-CZ',
  'da': 'da-DK',
  'nl': 'nl-NL',
  'et': 'et-EE',
  'fi': 'fi-FI',
  'fr': 'fr-FR',
  'de': 'de-DE',
  'el': 'el-GR',
  'he': 'he-IL',
  'hi': 'hi-IN',
  'hu': 'hu-HU',
  'is': 'is-IS',
  'id': 'id-ID',
  'it': 'it-IT',
  'ja': 'ja-JP',
  'km': 'km-KH',
  'ko': 'ko-KR',
  'lo': 'lo-LA',
  'lv': 'lv-LV',
  'lt': 'lt-LT',
  'mk': 'mk-MK',
  'ms': 'ms-MY',
  'mn': 'mn-MN',
  'no': 'no-NO',
  'fa': 'fa-IR',
  'pl': 'pl-PL',
  'pt': 'pt-BR',
  'ro': 'ro-RO',
  'ru': 'ru-RU',
  'sr': 'sr-RS',
  'sk': 'sk-SK',
  'sl': 'sl-SI',
  'so': 'so-SO',
  'es': 'es-ES',
  'sw': 'sw-KE',
  'sv': 'sv-SE',
  'tl': 'tl-PH',
  'th': 'th-TH',
  'tr': 'tr-TR',
  'uk': 'uk-UA',
  'ur': 'ur-PK',
  'vi': 'vi-VN',
  'cy': 'cy-GB',
  'zu': 'zu-ZA',
};

// ResponsiveVoice library
declare global {
  interface Window {
    responsiveVoice: {
      speak: (text: string, voice: string, options?: any) => void;
      cancel: () => void;
    };
  }
}

export const speak = async (text: string, lang: string) => {
  console.log('Speech called with:', { text, lang });

  try {
    // Map 2-letter language code to ResponsiveVoice format
    const voiceLang = LANGUAGE_CODE_MAP[lang] || lang;
    console.log('Mapped language code:', { from: lang, to: voiceLang });

    // Check if ResponsiveVoice is loaded
    if (!window.responsiveVoice) {
      console.warn('ResponsiveVoice not loaded, falling back to Web Speech API');
      fallbackToWebSpeech(text, voiceLang);
      return;
    }

    // Check if the language is supported by ResponsiveVoice
    const voiceName = getResponsiveVoiceName(voiceLang);
    
    // If the voice name is the default English, it means the language isn't supported
    if (voiceName === 'US English Female' && voiceLang !== 'en-US') {
      console.warn(`Language ${voiceLang} not supported by ResponsiveVoice, falling back to Web Speech API`);
      fallbackToWebSpeech(text, voiceLang);
      return;
    }
    
    console.log('Speaking text with ResponsiveVoice:', text, 'voice:', voiceName);
    
    window.responsiveVoice.speak(text, voiceName, {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
    });
    
    console.log('Speech command sent successfully');
  } catch (error) {
    console.error('Error in text-to-speech:', error);
    // Fallback to Web Speech API on error
    fallbackToWebSpeech(text, lang);
  }
};

const getResponsiveVoiceName = (lang: string): string => {
  // Map language codes to ResponsiveVoice voice names (using exact names from their API)
  const voiceMap: Record<string, string> = {
    'de-DE': 'Deutsch Female',
    'en-US': 'US English Female',
    'es-ES': 'Spanish Female',
    'fr-FR': 'French Female',
    'it-IT': 'Italian Female',
    'pt-BR': 'Brazilian Portuguese Female',
    'ru-RU': 'Russian Female',
    'ja-JP': 'Japanese Female',
    'ko-KR': 'Korean Female',
    'zh-CN': 'Chinese Female',
    'ar-SA': 'Arabic Female',
    'is-IS': 'Icelandic Male',
    'nl-NL': 'Dutch Female',
    'pl-PL': 'Polish Female',
    'tr-TR': 'Turkish Female',
    'sv-SE': 'Swedish Female',
    'da-DK': 'Danish Female',
    'no-NO': 'Norwegian Female',
    'fi-FI': 'Finnish Female',
    'el-GR': 'Greek Female',
    'hu-HU': 'Hungarian Female',
    'cs-CZ': 'Czech Female',
    'ro-RO': 'Romanian Female',
    'uk-UA': 'Ukrainian Female',
    'vi-VN': 'Vietnamese Female',
    'th-TH': 'Thai Female',
    'id-ID': 'Indonesian Female',
    'ms-MY': 'Malay Female',
    'hi-IN': 'Hindi Female',
    'fa-IR': 'Persian Female',
    'ur-PK': 'Urdu Female',
    'sq-AL': 'Albanian Male',
    'hr-HR': 'Croatian Female',
    'sk-SK': 'Slovak Female',
    'sl-SI': 'Slovenian Female',
    'bg-BG': 'Bulgarian Female',
    'et-EE': 'Estonian Male',
    'lv-LV': 'Latvian Male',
    'lt-LT': 'Lithuanian Female',
    'mk-MK': 'Macedonian Female',
    'ro-RO': 'Romanian Female',
    'sr-RS': 'Serbian Female',
    'uk-UA': 'Ukrainian Female',
    'cy-GB': 'Welsh Male',
  };
  
  return voiceMap[lang] || 'US English Female';
};

const fallbackToWebSpeech = (text: string, lang: string) => {
  if ('speechSynthesis' in window) {
    console.log('Using Web Speech API fallback');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Text-to-speech is not supported in this browser');
  }
}; 