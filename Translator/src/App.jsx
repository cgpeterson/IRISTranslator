import React from 'react';
import { Toaster } from 'sonner';
import Translator from './pages/Translator';
import { LLMProvider } from './contexts/LLMContext';

function App() {
  return (
    <LLMProvider>
      <Translator />
      <Toaster position="top-right" richColors />
    </LLMProvider>
  );
}

export default App;
