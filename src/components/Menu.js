import React, { useState, useEffect, useRef } from 'react'

export default function Menu({ data, mode, setMode, isSmallScreen, reopenInfo }) {

    const RADIUS = isSmallScreen ? 60: 85
    const WIDTH = RADIUS
    const HEIGHT = RADIUS * 2
    const DURATION = 35
    const ITEM_RADIUS = isSmallScreen ? 4 : 6

    const itemPos = data.map( (_, index) => {
        const x = {
            0: RADIUS,
            1: RADIUS * Math.sin(Math.PI / 4),
            2: 0
        }[Math.abs(index - 2)]
        const y = {
            0: 0,
            1: RADIUS - RADIUS * Math.cos(Math.PI / 4),
            2: RADIUS,
            3: RADIUS + RADIUS * Math.cos(Math.PI / 4),
            4: RADIUS * 2,
        }[index]
        return { 
            x: x, 
            y: y,
        }
    })

    const [isVisible, setIsVisible] = useState(false)
    const [isHidden, setIsHidden] = useState(true)

    const canvasRef = useRef()
    const animationIdRef = useRef()

    useEffect(() => {
        canvasRef.current.width = WIDTH
        canvasRef.current.height = HEIGHT
        const ctx = canvasRef.current.getContext('2d')
        ctx.imageSmoothingQuality = "high"
        ctx.lineWidth = 1
        ctx.strokeStyle = '#E5E5E5'
    }, [isSmallScreen]); 

    const drawProgress = useRef(0)
    const drawArc = (isStart) => {

        const ctx = canvasRef.current.getContext('2d')
        ctx.clearRect(0, 0, WIDTH, HEIGHT)

        ctx.globalCompositeOperation = "source-over"
        ctx.beginPath()
        ctx.arc(0, HEIGHT * 0.5, RADIUS, Math.PI * -0.5, Math.PI * ( -0.5 + drawProgress.current / DURATION) )
        ctx.stroke()

        ctx.globalCompositeOperation = "destination-out";
        for (const pos of itemPos) {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, ITEM_RADIUS + 1, 0, 2 * Math.PI);
            ctx.fill();
        }

        drawProgress.current +=  isStart? 1 : -1
        if ( (isStart && drawProgress.current <= DURATION) || (!isStart && drawProgress.current >= 0) ) {
            animationIdRef.current = requestAnimationFrame(
                () => drawArc(isStart)
            )
        }
    }

    const timeoutRef = useRef(null)
    useEffect(() => {
        if (animationIdRef.current) 
            cancelAnimationFrame(animationIdRef.current)
        drawArc(isVisible)
    }, [isVisible])

    const toggleMenu = () => {
        reset()

        if (isVisible) 
            closeMenu()
        else 
            openMenu()
    }

    const openMenu = () => {
        if (timeoutRef.current) 
            clearTimeout(timeoutRef.current)

        setIsHidden(false)
        timeoutRef.current = setTimeout(() => setIsVisible(true), 20)
    }

    const closeMenu = () => {
        if (timeoutRef.current) 
            clearTimeout(timeoutRef.current)

        setIsVisible(false)
        timeoutRef.current = setTimeout(() => setIsHidden(true), 1500)
    }

    const openInfo = (index) => {
        setMode(index)
    }
    
    const reset = () => {
        setMode(null)
    }

    return (
        <div 
            className={`vision-player-menu ${isVisible ? 'is-visible' : ''}`}
            style={{ width: WIDTH, height: HEIGHT }}
            onMouseEnter={openMenu}
            onMouseLeave={closeMenu}
        >
            <div 
                className='vision-player-menu-button'
                onMouseDown={toggleMenu}
                aria-lable="open menu"
            >
                <img alt="open menu" src={require(`../assets/icons/icon-eye.svg`).default}/>
            </div>
            <div className="vision-player-menu-items-container">
                <canvas ref={canvasRef}/>
                {!isHidden && data.map( (item, index) =>
                    <div 
                        key={index}
                        className={`vision-player-menu-item ${mode == index ? 'is-selected' : ''}`}
                        alt={item.titleEng}
                        style={{
                            width: ITEM_RADIUS * 2,
                            height: ITEM_RADIUS * 2,
                            transform: `translate(${itemPos[index].x - ITEM_RADIUS}px, ${itemPos[index].y - ITEM_RADIUS}px)`,
                            transition: `opacity 0.2s ease-in-out ${ (isVisible ? index : (4 - index) ) * DURATION / 4 * 0.01}s`
                        }}
                        onMouseDown={() => openInfo(index)}
                    >
                        <div 
                            className="vision-player-menu-fill"
                            style={{
                                width: ITEM_RADIUS * 2 + (mode == index ? ITEM_RADIUS : 0), 
                                height: ITEM_RADIUS * 2 + (mode == index ? ITEM_RADIUS : 0),
                                borderRadius: ITEM_RADIUS + (mode == index ? ITEM_RADIUS * 0.5 : 0),
                            }}
                        >
                            <div
                                style={{
                                    width: ITEM_RADIUS * 3 - 2, 
                                    height: ITEM_RADIUS * 3 - 2,
                                    borderRadius: ITEM_RADIUS * 1.5 - 1,
                                }}
                            />
                        </div>

                        <div 
                            className="vision-player-menu-title"
                            alt={`${item.titleChi}${item.titleEng}`}
                            style={ 
                                {
                                    0: {
                                        paddingBottom: 10 + ITEM_RADIUS,
                                        transform: `translateX(-30px) translateY( calc(-100%) )`
                                    },
                                    4: {
                                        paddingTop: 10 + ITEM_RADIUS,
                                        transform: `translateX(-30px)`
                                    },
                                } [index] || {
                                    paddingLeft: ITEM_RADIUS * 2 + 15,
                                    transform: `translateY(-50%)`
                                }
                            }
                        >
                            {item.titleChi} 
                            <img alt={`open detail of ${item.titleEng}`} onClick={reopenInfo} src={require(`../assets/icons/icon-info.svg`).default}/>
                            <br/>
                            {item.titleEng}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
