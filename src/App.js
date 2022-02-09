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
  const [transcript, setTranscript] = useState(null)
  const [isShowTranscript, setIsShowTranscript] = useState(false)

  const playerRef = useRef()
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)

  useLayoutEffect(() => {
    onResize(playerRef.current.offsetWidth, playerRef.current.offsetHeight);
  }, [])

  const onResize = (width, height) => {
    setIsSmallScreen(Math.min(width, height) < 500)
    setIsLandscape(width > height);
  }

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/data.json")
    .then(res => res.json())
    .then(data => {
      setData(data.items)
      setLabels(data.labels)
      setTranscript(data.transcript)
    })
  }, [])

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
        className={`${isSmallScreen ? 'is-small ' : ''}${isLandscape ? 'is-landscape' : ''}`}
        ref={playerRef}
        style={{
          "--text-size": ` ${(isSmallScreen? 0.75 : 1) * fontSizeValue}px`
        }}
      >
        <Vision data={data} mode={mode} labels={labels} isPaused={isPaused} isSmallScreen={isSmallScreen} onResize={onResize}/>
        <Menu data={data} mode={mode} labels={labels} setMode={setMode} isSmallScreen={isSmallScreen} reopenInfo={reopenInfo} />
        <Info data={data} mode={mode} labels={labels} transcript={transcript} isShowTranscript={isShowTranscript} setIsShowTranscript={setIsShowTranscript} infoReopen={infoReopen} />
        <Setting fontSize={fontSize} setFontSize={setFontSize} labels={labels}/>
        <button className="vision-player-play-button" aria-label={isPaused ? labels?.playVideo ?? '' : labels?.pauseVideo ?? ''} onClick={() => setIsPaused(!isPaused)}  >
          <img alt={isPaused ? labels?.playVideo ?? '' : labels?.pauseVideo ?? ''} src={require(`@/assets/icons/icon-${isPaused ? 'play' : 'pause'}.svg`).default}/>
        </button>
        <button class="vision-transcript-button" aria-label={labels?.transcript ?? ''} onClick={() => setIsShowTranscript(true)}  >
          {labels?.transcript ?? ''}
        </button>
      </div>
    </>
  )
}

export default App


const Setting = ({ fontSize, setFontSize, labels }) => {
  return (
    <div className="vision-player-setting-container">
      <button aria-label={labels?.setFontSmall ?? ''} onClick={() => setFontSize(1)} >
        <img alt={labels?.setFontSmall ?? ''} src={require(`@/assets/icons/icon-font-${fontSize == 1 ? 'white' : 'black'}.svg`).default}/>
      </button>
      <button aria-label={labels?.setFontMedium ?? ''} onClick={() => setFontSize(2)} >
        <img alt={labels?.setFontMediu ?? ''} src={require(`@/assets/icons/icon-font-${fontSize == 2 ? 'white' : 'black'}.svg`).default}/>
      </button>
      <button aria-label={labels?.setFontLarge ?? ''} onClick={() => setFontSize(3)}  >
        <img alt={labels?.setFontLarge ?? ''} src={require(`@/assets/icons/icon-font-${fontSize == 3 ? 'white' : 'black'}.svg`).default}/>
      </button>
  </div>
  )
}