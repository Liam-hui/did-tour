import React, { useState, useEffect } from 'react'

import Info from '@/components/Info'
import Vision from '@/components/Vision'
import Menu from '@/components/Menu'

import '@/styles/styles.css'

function App() {

  const [mode, setMode] = useState(null)
  const [fontSize, setFontSize] = useState(1)
  const [data, setData] = useState([])
  const [isInfoVisible, setIsInfoVisible] = useState(false)

  const root = document.getElementById('vision-player')
  const [isSmallScreen, setIsSmallScreen] = useState( Math.min(root.offsetHeight, root.offsetWidth) < 500 )

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/data.json")
    .then(res => res.json())
    .then(data => setData(data));
  }, [])

  useEffect(() => {
    if (mode == null)
      setIsInfoVisible(false)
  }, [mode])


  // const reset = () => {
  //   setMode(null)
  //   setIsInfoVisible(false)
  // }
  // const ResetButton = () => {
  //   return (
  //     <div className="vision-player-reset-button-container">
  //       <img onClick={reset} src={require(`@/assets/icons/icon-reset.svg`).default}/>
  //       <div>Reset</div>
  //     </div>
  //   )
  // }

  const FontSizeSetting = () => {
    return (
      <div className="vision-player-set-font-container">
        <img onClick={() => setFontSize(1)} style={{ height: 36, width: 'auto'}} src={require(`@/assets/icons/icon-font-${fontSize == 1 ? 'white' : 'black'}.svg`).default}/>
        <img onClick={() => setFontSize(2)} style={{ height: 48, width: 'auto'}} src={require(`@/assets/icons/icon-font-${fontSize == 2 ? 'white' : 'black'}.svg`).default}/>
        <img onClick={() => setFontSize(3)} style={{ height: 60, width: 'auto'}} src={require(`@/assets/icons/icon-font-${fontSize == 3 ? 'white' : 'black'}.svg`).default}/>
      </div>
    )
  }

  const fontSizeValue = {
    1: 16,
    2: 19,
    3: 22,
  }[fontSize]

  return (
    <div 
      className={`vision-player-container ${isSmallScreen ? 'is-small' : ''}`}
      style={{
        "--text-size": `${(isSmallScreen? 0.75 : 1) * fontSizeValue}px`
      }}
    >
      <Vision mode={mode} isSmallScreen={isSmallScreen} setIsSmallScreen={setIsSmallScreen}/>
      <Menu data={data} mode={mode} setMode={setMode} setIsInfoVisible={setIsInfoVisible} isSmallScreen={isSmallScreen}/>
      <Info data={data} mode={mode} isInfoVisible={isInfoVisible} setIsInfoVisible={setIsInfoVisible}/>
      {/* <ResetButton/> */}
      <FontSizeSetting/>
    </div>
  )
}

export default App
