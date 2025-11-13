/**
 * StringEncoder utility class
 * Provides bidirectional encoding/decoding for 5 standard formats
 */
export class StringEncoder {
  
  static process(text, method, mode = 'encode') {
    if (!text) return '';

    try {
      const processor = this.methods[method];
      if (!processor) return 'Unknown Method';
      
      return mode === 'encode' ? processor.encode(text) : processor.decode(text);
    } catch (e) {
      return `Error: Invalid input for ${method} decoding.`;
    }
  }

  static methods = {
    base64: {
      // Uses TextEncoder to safely handle UTF-8/Emojis
      encode: (str) => {
        return window.btoa(
          String.fromCharCode(...new TextEncoder().encode(str))
        );
      },
      decode: (str) => {
        return new TextDecoder().decode(
          Uint8Array.from(window.atob(str), c => c.charCodeAt(0))
        );
      }
    },

    url: {
      encode: (str) => encodeURIComponent(str),
      decode: (str) => decodeURIComponent(str)
    },

    html: {
      encode: (str) => str.replace(/[\u00A0-\u9999<>&]/g, i => '&#' + i.charCodeAt(0) + ';'),
      decode: (str) => {
        const doc = new DOMParser().parseFromString(str, "text/html");
        return doc.documentElement.textContent;
      }
    },

    hex: {
      encode: (str) => {
        return Array.from(str)
          .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('');
      },
      decode: (str) => {
        const hex = str.toString();
        let output = '';
        for (let i = 0; i < hex.length; i += 2) {
          output += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return output;
      }
    },

    binary: {
      encode: (str) => {
        return Array.from(str)
          .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
          .join(' ');
      },
      decode: (str) => {
        return str.split(' ')
          .map(bin => String.fromCharCode(parseInt(bin, 2)))
          .join('');
      }
    }
  };
}
