import React, { useState, useEffect, useRef } from 'react'
import { isMobile } from 'react-device-detect';

export default function Menu({ data, mode, setMode, setIsInfoVisible, isSmallScreen }) {

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
    const [isHover, setIsHover] = useState(false)

    const canvasRef = useRef()
    const animationIdRef = useRef()

    useEffect(() => {
        canvasRef.current.width = WIDTH
        canvasRef.current.height = HEIGHT
        const ctx = canvasRef.current.getContext('2d')
        ctx.imageSmoothingQuality = "high"
        ctx.lineWidth = 1
        ctx.strokeStyle = '#fff'
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

    useEffect(() => {
        if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current)
        drawArc(isVisible)
    }, [isVisible]); 

    const openMenu = () => {
        setIsVisible(true)
    }

    const closeMenu = () => {
        setIsVisible(false)
        if (isMobile) setIsHover(false)
    }

    const toggleMenu = () => {
        setIsVisible(!isVisible)
        setIsHover(!isHover)
    }

    const hoverOn = () => {
        setIsHover(true)
    }

    const hoverOff = () => {
        setIsHover(false)
    }

    const openInfo = (index) => {
        setMode(index)
        if (isMobile) {
            setIsHover(false)
            setIsVisible(false)
        }
    }

    const showInfo = () => {
        setIsInfoVisible(true)
    }

    return (
        <div 
            id="menu" 
            className={isVisible ? 'is-visible' : ''}
            style={{ width: WIDTH, height: HEIGHT }}
            onMouseEnter={isMobile ? null : openMenu} 
            onMouseLeave={closeMenu}
        >
            <div 
                id="menu-button" 
                className={isHover ? 'is-hover' : ''}
                onMouseDown={isMobile ? toggleMenu : null}
                onMouseEnter={isMobile ? null : hoverOn}
                onMouseLeave={isMobile ? null : hoverOff}
            >
                <img src={require(`../assets/icons/icon-eye.svg`).default}/>
            </div>
            <div className="menu-items-container">
                <canvas ref={canvasRef}/>
                {data.map( (item, index) =>
                    <div 
                        key={index}
                        className={`menu-item ${mode == index ? 'is-selected' : ''}`}
                        style={{
                            width: ITEM_RADIUS * 2,
                            height: ITEM_RADIUS * 2,
                            borderRadius: ITEM_RADIUS,
                            transform: `translate(${itemPos[index].x - ITEM_RADIUS}px, ${itemPos[index].y - ITEM_RADIUS}px)`,
                            transition: `opacity 0.2s ease-in-out ${ (isVisible ? index : (4 - index) ) * DURATION / 4 * 0.01}s`
                        }}
                        onMouseDown={() => openInfo(index)}
                    >
                        <div 
                            className="menu-fill"
                            style={{
                                width: ITEM_RADIUS * 2 * 0.8,
                                height: ITEM_RADIUS * 2 * 0.8,
                                borderRadius: ITEM_RADIUS * 0.8,
                            }}
                        />
                        <div 
                            className="menu-title"
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
                            {item.titleChi} <img onClick={showInfo} src={require(`../assets/icons/icon-info.svg`).default}/>
                            <br/>
                            {item.titleEng}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
