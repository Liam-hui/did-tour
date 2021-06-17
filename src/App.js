import React, { useState, useEffect } from 'react';

import Info from '@/components/Info'
import Vision from '@/components/Vision'
import Menu from '@/components/Menu'

import '@/styles/styles.css';

function App() {

  const [mode, setMode] = useState(null);
  const [data, setData] = useState([])
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState( Math.min(window.innerHeight, window.innerWidth) < 500 );

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/data.json")
    .then(res => res.json())
    .then(data => setData(data));
  }, []);

  return (
    <>
      <Vision mode={mode} isSmallScreen={isSmallScreen} setIsSmallScreen={setIsSmallScreen}/>
      <Menu data={data} mode={mode} setMode={setMode} setIsInfoVisible={setIsInfoVisible} isSmallScreen={isSmallScreen}/>
      <Info data={data} mode={mode} isInfoVisible={isInfoVisible} setIsInfoVisible={setIsInfoVisible}/>
    </>
  )
}

export default App;
