import React, { useState, useEffect, useRef } from 'react'

const INFO_DATA = [
    {
        title: '黃斑點病變\nMacular Degeneration'
    },
    {
        title: '青光眼\nGlaucoma'
    },
    {
        title: '視網膜脫落\nRetina Detachment'
    },
    {
        title: '白內障\nCataract'
    },
    {
        title: '視網膜色素變性\nRetinitis Pigmentosa'
    },
]

export default function Info({ mode }) {

    const [isVisible, setIsVisible] = useState(false)
    
    useEffect(() => {
        if (mode != null)
            setIsVisible(true)
    }, [mode]); 

    const closeInfo = () => {
        setIsVisible(false)
    }

    return (
        <div 
            id="info" 
            className={isVisible ? 'is-visible' : ''}
        >
            {mode != null &&
                <>
                    <div className='info-title'>
                        {INFO_DATA[mode].title}     
                    </div>

                    <p>
                        字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字字
                    </p>

                    <p>
                        text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text 
                    </p>
                </>
            }

            <div className='close-button' onMouseDown={closeInfo}>x</div>
            
        </div>
    );
}
