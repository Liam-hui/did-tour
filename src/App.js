import React, { useState, useEffect } from 'react'

import Info from '@/components/Info'
import Vision from '@/components/Vision'
import Menu from '@/components/Menu'

import '@/styles/styles.css'

function App() {

  const [mode, setMode] = useState(null)
  const [fontSize, setFontSize] = useState(1)
  const [data, setData] = useState([])

  const root = document.getElementById('vision-player')
  const [isSmallScreen, setIsSmallScreen] = useState( Math.min(root.offsetHeight, root.offsetWidth) < 500 )

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/data.json")
    .then(res => res.json())
    .then(data => setData(data));
  }, [])

  const FontSizeSetting = () => {
    return (
      <div className="vision-player-set-font-container">
        <button aria-label="set small font size" onClick={() => setFontSize(1)} >
          <img alt="set small font size" style={{ height: 36, width: 'auto'}} src={require(`@/assets/icons/icon-font-${fontSize == 1 ? 'white' : 'black'}.svg`).default}/>
        </button>
        <button aria-label="set medium font size" onClick={() => setFontSize(2)} >
          <img alt="set medium font size" style={{ height: 48, width: 'auto'}} src={require(`@/assets/icons/icon-font-${fontSize == 2 ? 'white' : 'black'}.svg`).default}/>
        </button>
        <button aria-label="set large font size" onClick={() => setFontSize(3)}  >
          <img alt="set large font size" style={{ height: 60, width: 'auto'}} src={require(`@/assets/icons/icon-font-${fontSize == 3 ? 'white' : 'black'}.svg`).default}/>
        </button>
    </div>
    )
  }

  const fontSizeValue = {
    1: 16,
    2: 19,
    3: 22,
  }[fontSize]

  const [infoReopen, setInfoReopen] = useState(-1)
  const reopenInfo = () => {
    setInfoReopen(infoReopen == -1 ? 0 : 1 - infoReopen)
  }

  return (
    <div 
      className={`vision-player-container ${isSmallScreen ? 'is-small' : ''}`}
      style={{
        "--text-size": `${(isSmallScreen? 0.75 : 1) * fontSizeValue}px`
      }}
    >
      <Vision mode={mode} isSmallScreen={isSmallScreen} setIsSmallScreen={setIsSmallScreen}/>
      <Menu data={data} mode={mode} setMode={setMode} isSmallScreen={isSmallScreen} reopenInfo={reopenInfo} />
      <Info data={data} mode={mode} infoReopen={infoReopen} />
      <FontSizeSetting/>
    </div>
  )
}

export default App
