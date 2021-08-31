import React, { useState, useEffect, useRef } from 'react'

export default function Info({ data, mode, infoReopen }) {
    
    const [isVisible, setIsVisible] = useState(false)
    const [isHidden, setIsHidden] = useState(true)

    const timeoutRef = useRef(null)
    
    useEffect(() => {
        if (mode != null) {
            openInfo()
        }
        else
            closeInfo()
    }, [mode])

    useEffect(() => {
        if (infoReopen != -1 ) openInfo()
    }, [infoReopen])

    const openInfo = () => {
        if (timeoutRef.current) 
            clearTimeout(timeoutRef.current)

        setIsHidden(false)
        timeoutRef.current = setTimeout(() => setIsVisible(true), 20)
    }

    const closeInfo = () => {
        if (timeoutRef.current) 
            clearTimeout(timeoutRef.current)

        setIsVisible(false)
        timeoutRef.current = setTimeout(() => setIsHidden(true), 1000)
    }

    if (isHidden) return null
    else return (
        <div className={`vision-player-info ${isVisible ? 'is-visible' : ''}`}>
            {mode != null &&
                <div className='vision-player-info-scroll'>
                    <div className='vision-player-info-title' tabIndex={8}>
                        {data[mode].titleChi}
                        <br/>   
                        {data[mode].titleEng}  
                    </div>

                    {data[mode].infoChi &&
                        <p tabIndex={9}>
                            {data[mode].infoChi}
                        </p>
                    }

                    {data[mode].infoEng &&
                        <p tabIndex={10}>
                            {data[mode].infoEng}
                        </p>
                    }
                </div>
            }

            <button aria-label="close info" tabIndex={7} className='vision-player-info-close-button' onClick={closeInfo}>
                <img alt="close info" src={require(`../assets/icons/icon-close.svg`).default}/>
            </button>
            
        </div>
    )
}
