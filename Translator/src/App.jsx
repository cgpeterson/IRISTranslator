import React from 'react';
import { Toaster } from 'sonner';
import Translator from './pages/Translator';

function App() {
  return (
    <>
      <Translator />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
