import React, { useState } from 'react';
import { ChevronDown, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { toast } from 'sonner';
import Base64Panel from '../components/translator/Base64Panel';
import EncodingPanel from '../components/translator/EncodingPanel';
import AITranslatorPanel from '../components/translator/AITranslatorPanel';

export default function Translator() {
  const [openCategories, setOpenCategories] = useState({
    encoding: true,
    literary: false,
    dialects: false,
    decode: false,
  });

  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const translationModes = {
    encoding: [
      {
        id: 'base64',
        name: 'Base64',
        encodingType: 'base64',
        color: 'blue',
      },
      {
        id: 'url',
        name: 'URL Encoding',
        encodingType: 'url',
        color: 'indigo',
      },
      {
        id: 'html',
        name: 'HTML Entity',
        encodingType: 'html',
        color: 'violet',
      },
      {
        id: 'hex',
        name: 'Hexadecimal',
        encodingType: 'hex',
        color: 'sky',
      },
      {
        id: 'binary',
        name: 'Binary',
        encodingType: 'binary',
        color: 'emerald',
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

  const categoryInfo = {
    encoding: {
      title: 'Encoding',
      description: 'Base64, URL, HTML, Hex, and Binary encoding',
      icon: '🔐',
    },
    literary: {
      title: 'Literary Styles',
      description: 'Shakespearian, Haiku, Iambic Pentameter',
      icon: '📖',
    },
    dialects: {
      title: 'Regional Dialects',
      description: 'Pirate, Cowboy, Redneck',
      icon: '🗣️',
    },
    decode: {
      title: 'Decode',
      description: 'Decode any obscured or encoded text',
      icon: '🔓',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-6 md:px-6 md:py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Chat Translator
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              Transform your text with encoding, literary styles, and regional dialects
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 md:px-6">
        <div className="space-y-4">
          {Object.entries(translationModes).map(([category, modes]) => (
            <Collapsible
              key={category}
              open={openCategories[category]}
              onOpenChange={() => toggleCategory(category)}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden"
            >
              <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{categoryInfo[category].icon}</span>
                  <div className="text-left">
                    <h2 className="text-lg font-semibold text-white">
                      {categoryInfo[category].title}
                    </h2>
                    <p className="text-sm text-slate-400">
                      {categoryInfo[category].description}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    openCategories[category] ? 'rotate-180' : ''
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-6 space-y-6 border-t border-slate-700">
                  {modes.map((mode) => (
                    <div key={mode.id}>
                      {mode.encodingType ? (
                        <EncodingPanel 
                          encodingType={mode.encodingType}
                          color={mode.color}
                          name={mode.name}
                        />
                      ) : (
                        <AITranslatorPanel mode={mode} />
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          <p>All translations happen in real-time. No data is stored.</p>
        </div>
      </div>
    </div>
  );
}