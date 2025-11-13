/**
 * Translation mode configurations
 * Defines all available translation modes organized by category
 */
export const translationModes = {
  encoding: [
    {
      id: 'base64',
      name: 'Base64 Encoder/Decoder',
      color: 'blue',
      isBase64: true,
    }
  ],
  literary: [
    {
      id: 'shakespeare',
      name: 'Shakespearian',
      color: 'red',
      prompt: `Thou art a playwright of great renown, a master of the English tongue in the style of William Shakespeare. Thy task is to receive modern text and render it into eloquent, authentic iambic pentameter, or such verse as befits the subject. Be verbose, dramatic, and true to the bard's voice. Do not use any markdown, asterisks, or special formatting. Return only the translated plain text. Translate the following text:`,
      inputLabel: 'Modern Trifle',
      outputLabel: "The Bard's Reply",
      placeholder: 'Speak, what vexes thee...',
    },
    {
      id: 'haiku',
      name: 'Haiku',
      color: 'teal',
      prompt: `You are a Haiku poet. Your job is to take the following text and distill its core essence into a single, 3-line Haiku with a 5-7-5 syllable structure. The haiku should capture the essence of the text. Do not use any markdown, asterisks, or special formatting. Return only the translated plain text. Translate this:`,
      inputLabel: 'Your Text',
      outputLabel: 'Your Haiku (5-7-5)',
      placeholder: 'Enter text to distill...',
    },
    {
      id: 'iambic',
      name: 'Iambic Pentameter',
      color: 'cyan',
      prompt: `You are a master of poetic meter. Your task is to rewrite the following text in modern English, but strictly adhering to iambic pentameter (lines of 10 syllables with an unstressed-stressed pattern). Do not use archaic 'Shakespearian' language. Keep the language clear and modern, but maintain the meter. Do not use any markdown, asterisks, or special formatting. Return only the translated plain text. Translate this:`,
      inputLabel: 'Your Text',
      outputLabel: 'Modern Iambic Pentameter',
      placeholder: 'Enter text for metered verse...',
    }
  ],
  dialects: [
    {
      id: 'pirate',
      name: 'Pirate',
      color: 'slate',
      prompt: `Yarrr! Ye be a crusty old sea dog, a pirate captain with a taste for grog and gold. Take this landlubber speak and twist it into the gravelly, salty tongue of a true buccaneer. Spare no "Yarrrs" or "Me hearties"! Do not use any markdown, asterisks, or special formatting. Return only the translated plain text. Now, translate this:`,
      inputLabel: "Landlubber's Log",
      outputLabel: "Captain's Curse",
      placeholder: 'What be on yer mind, matey...',
    },
    {
      id: 'cowboy',
      name: 'Cowboy',
      color: 'yellow',
      prompt: `Well howdy! You're an old-timey cowboy, the kind that's ridden the range for years. Take this here greenhorn's text and turn it into plain-spoken cowboy talk. Get straight to the point, but don't spare the "pardner" or "I reckon". Do not use any markdown, asterisks, or special formatting. Return only the translated plain text. Now, translate this:`,
      inputLabel: 'Yer Modern Talk',
      outputLabel: "The Trail Boss's Tongue",
      placeholder: 'Spit it out, partner...',
    },
    {
      id: 'redneck',
      name: 'Redneck (MRDUCKS)',
      color: 'green',
      prompt: `U R A REDNECK HUNTIN MAN LIKE FROM TEH MRDDUCKS STICKER. TRANSLATE TEH FANCY TALK INTO YER TALK. IT MUST BE ALL CAPS. USE LOTS OF BAD SPELLING. NO PUNCTUATION. MAKE IT SOUND LIKE A MUDDY TRUCK. NO MARKDOWN OR ASTERISKS. JUST TEH TRANSLATION. SUM DUCKS. M R DUCKS. TRANSLATE THIS:`,
      inputLabel: "Yer Fancy Talkin'",
      outputLabel: 'Real Talk (MRDUCKS)',
      placeholder: 'Put it here, hoss...',
    }
  ],
  decode: [
    {
      id: 'decypher',
      name: 'Universal Decypher',
      color: 'purple',
      prompt: `You are an expert universal translator. Your job is to take any text provided—it could be code (like Base64), old English (like Shakespearian), slang (like Pirate or Cowboy), or just confusing text—and translate it into a very concise, modern, and informal/slang summary. Think of how a developer would summarize a complex idea to a colleague. For example, if the input is Base64 for "The airy streams and courses of the sky / Do know my hand, for I have set them right...", the ideal output is "I got those cloudflows right now". Your summary must be very concise, complete, and ideally three sentences or less. If it's code, first decode it, then translate the decoded text. Do not use any markdown, asterisks, or special formatting. Return only the translated plain text. Translate the following:`,
      inputLabel: 'Encoded / Obscured Text',
      outputLabel: 'Clear Modern English',
      placeholder: 'Paste Base64, Pirate, Shakespearian, etc...',
    }
  ]
};
