import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'

import Info from '@/components/Info'
import Vision from '@/components/Vision'
import Menu from '@/components/Menu'

import '@/styles/styles.css'

function App() {

  const [mode, setMode] = useState(null)
  const [fontSize, setFontSize] = useState(1)
  
  const [data, setData] = useState([])
  const [labels, setLabels] = useState(null)
  const [text, setText] = useState('')

  const playerRef = useRef()
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  useLayoutEffect(() => {
    setIsSmallScreen(Math.min(playerRef.current.offsetHeight, playerRef.current.offsetWidth) < 500)
  }, [])

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/data.json")
    .then(res => res.json())
    .then(data => {
      setData(data.items)
      setLabels(data.labels)
      setText(data.text)
    })
  }, [])

  const FontSizeSetting = () => {
    return (
      <div className="vision-player-setting-container">
        <button aria-label={labels?.setFontSmall ?? ''} onClick={() => setFontSize(1)} >
          <img alt={labels?.setFontSmall ?? ''} style={{ height: 36, width: 'auto'}} src={require(`@/assets/icons/icon-font-${fontSize == 1 ? 'white' : 'black'}.svg`).default}/>
        </button>
        <button aria-label={labels?.setFontMedium ?? ''} onClick={() => setFontSize(2)} >
          <img alt={labels?.setFontMediu ?? ''} style={{ height: 48, width: 'auto'}} src={require(`@/assets/icons/icon-font-${fontSize == 2 ? 'white' : 'black'}.svg`).default}/>
        </button>
        <button aria-label={labels?.setFontLarge ?? ''} onClick={() => setFontSize(3)}  >
          <img alt={labels?.setFontLarge ?? ''} style={{ height: 60, width: 'auto'}} src={require(`@/assets/icons/icon-font-${fontSize == 3 ? 'white' : 'black'}.svg`).default}/>
        </button>
    </div>
    )
  }

  const [isPaused, setIsPaused] = useState(false)

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
    <>
      <div 
        id="vision-player"
        className={`${isSmallScreen ? ' is-small' : ''}`}
        ref={playerRef}
        style={{
          "--text-size": ` ${(isSmallScreen? 0.75 : 1) * fontSizeValue}px`
        }}
      >
        <Vision data={data} mode={mode} labels={labels} isPaused={isPaused} isSmallScreen={isSmallScreen} setIsSmallScreen={setIsSmallScreen}/>
        <Menu data={data} mode={mode} labels={labels} setMode={setMode} isSmallScreen={isSmallScreen} reopenInfo={reopenInfo} />
        <Info data={data} mode={mode} labels={labels} infoReopen={infoReopen} />
        <FontSizeSetting/>
        <button className="vision-player-play-button" aria-label={isPaused ? labels?.playVideo ?? '' : labels?.pauseVideo ?? ''} onClick={() => setIsPaused(!isPaused)}  >
          <img alt={isPaused ? labels?.playVideo ?? '' : labels?.pauseVideo ?? ''} style={{ height: 35, width: 'auto' }} src={require(`@/assets/icons/icon-${isPaused ? 'play' : 'pause'}.svg`).default}/>
        </button>
      </div>
      <div id="vision-text">
        <p tabIndex={0}>{text}</p>
      </div>
    </>
  )
}

export default App
