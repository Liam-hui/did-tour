import React, { useEffect } from 'react'

export default function Info({ data, mode, isInfoVisible, setIsInfoVisible }) {
    
    useEffect(() => {
        if (mode != null)
            setIsInfoVisible(true)
    }, [mode]); 

    const closeInfo = () => {
        setIsInfoVisible(false)
    }

    return (
        <div 
            className={`vision-player-info ${isInfoVisible ? 'is-visible' : ''}`}
        >
            {mode != null &&
                <div className='vision-player-info-scroll'>
                    <div className='vision-player-info-title'>
                        {data[mode].titleChi}
                        <br/>   
                        {data[mode].titleEng}  
                    </div>

                    {data[mode].infoChi &&
                        <p>
                            {data[mode].infoChi}
                        </p>
                    }

                    {data[mode].infoEng &&
                        <p>
                            {data[mode].infoEng}
                        </p>
                    }

                </div>
            }

            <div className='vision-player-info-close-button' onMouseDown={closeInfo}>
                <img src={require(`../assets/icons/icon-close.svg`).default}/>
            </div>
            
        </div>
    );
}
