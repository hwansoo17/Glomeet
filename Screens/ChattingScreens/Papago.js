import config from '../../config'

  export async function detectLanguage(message) {
    try {
      const response = await fetch('https://openapi.naver.com/v1/papago/detectLangs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Naver-Client-Id': config.clientId,
          'X-Naver-Client-Secret': config.clientSecret,
        },
        body: JSON.stringify({ query: message }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('result:', result); 
        return result.langCode;
        
      } else {
        const errorResponse = await response.json();
        throw new Error(`API 요청 실패: ${errorResponse.errorMessage}`);
      }
    } catch (error) {
      console.error('언어 감지 중 오류 발생:', error);
      throw error;
    }
}

export async function translateText(message, sourceLang, targetLang) {
  
    try {
      const response = await fetch('https://openapi.naver.com/v1/papago/n2mt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Naver-Client-Id': config.clientId,
          'X-Naver-Client-Secret': config.clientSecret,
        },
        body: `source=${sourceLang}&target=${targetLang}&text=${encodeURIComponent(message)}`,
      });
  
      if (response.ok) {
        const result = await response.json();
        return result.message.result.translatedText;
      } else {
        const errorResponse = await response.json();
        throw new Error(`API 요청 실패: ${errorResponse.errorMessage}`);
      }
    } catch (error) {
      console.error('번역 중 오류 발생:', error);
      throw error;
    }
  }