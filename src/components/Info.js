import React, { useState, useEffect, useRef } from 'react'

export default function Info({ data, mode, labels, transcript, isShowTranscript, setIsShowTranscript, infoReopen }) {
    
    const [isVisible, setIsVisible] = useState(false)
    const [isHidden, setIsHidden] = useState(true)

    const timeoutRef = useRef(null)

    useEffect(() => {
        if (isShowTranscript) {
            openInfo()
        }
    }, [isShowTranscript])
    
    useEffect(() => {
        if (mode != null) {
            setIsShowTranscript(false);
            openInfo()
        }
        else if (!isShowTranscript)
            closeInfo(true)
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

    const closeInfo = (isResetMode) => {
        if (timeoutRef.current) 
            clearTimeout(timeoutRef.current)
        setIsVisible(false)
        timeoutRef.current = setTimeout(() => {
            setIsHidden(true);
            setIsShowTranscript(false);
        }, 800)
    }

    if (isHidden) return null
    else return (
        <div className={`vision-player-info ${isVisible ? 'is-visible' : ''}`}>
            {(mode != null || isShowTranscript) &&
                <div className='vision-player-info-scroll'>
                    {isShowTranscript
                        ? <p tabIndex={4}>{transcript ?? ""}</p>
                        : <>
                            <h2 tabIndex={4}>
                                {data[mode].title}
                            </h2>
                            <p tabIndex={4}>
                                {data[mode].info}
                            </p>
                        </>
                    }
                </div>
            }

            <button aria-label={labels?.closeInfo ?? ''} tabIndex={4} className='vision-player-info-close-button' onClick={closeInfo}>
                <img alt={labels?.closeInfo ?? ''} src={require(`../assets/icons/icon-close.svg`).default}/>
            </button>
            
        </div>
    )
}
