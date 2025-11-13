import React from 'react';
import { Toaster } from 'sonner';
import Translator from './pages/Translator';
import { ModelProvider } from './contexts/ModelContext';

function App() {
  return (
    <ModelProvider>
      <Translator />
      <Toaster position="top-right" richColors />
    </ModelProvider>
  );
}

export default App;
