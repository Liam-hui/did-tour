import React, { useState, useEffect, useRef } from 'react'

export default function Info({ data, mode, labels, infoReopen }) {
    
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
                    <h2 tabIndex={4}>
                        {data[mode].title}
                    </h2>

                    {data[mode].info &&
                        <p tabIndex={4}>
                            {data[mode].info}
                        </p>
                    }
                </div>
            }

            <button aria-label={labels?.closeInfo ?? ''} tabIndex={4} className='vision-player-info-close-button' onClick={closeInfo}>
                <img alt={labels?.closeInfo ?? ''} src={require(`../assets/icons/icon-close.svg`).default}/>
            </button>
            
        </div>
    )
}
