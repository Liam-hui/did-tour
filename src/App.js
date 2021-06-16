import React, { useState } from 'react';

import Info from '@/components/Info'
import Vision from '@/components/Vision'
import Menu from '@/components/Menu'

import '@/styles/styles.css';

function App() {

  const [mode, setMode] = useState(null);

  return (
    <>
      <Vision mode={mode}/>
      <Menu mode={mode} setMode={setMode}/>
      <Info mode={mode}/>
    </>
  )
}

export default App;
