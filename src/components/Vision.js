import React, { useState, useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { AdjustmentFilter, BloomFilter } from 'pixi-filters';
import { ResizeObserver } from '@juggle/resize-observer';

const adjustmentFilter = new AdjustmentFilter();
const blurFilter = new PIXI.filters.BlurFilter()
const bloomFilter = new BloomFilter()

const glaucomaFilter = new PIXI.Filter(
    null, 
    ` 
      precision mediump float;
      
      uniform vec2 iResolution;
  
      varying vec2 vTextureCoord;
  
      uniform sampler2D uSampler;
  
      const float INNER_RADIUS = 0.5;
      const float OUTER_RADIUS = 0.85;
      const float MIX_RATE = 1.0;
  
      void main( void ) {
  
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        vec2 center = vec2(0.5, 0.5);
        float dist = 1.0 - distance(uv, center);
        float vig = smoothstep(INNER_RADIUS, OUTER_RADIUS, dist);
      
        vec4 color = texture2D( uSampler, vTextureCoord );
  
        gl_FragColor = vec4( mix(color, color * vig, MIX_RATE) );
  
      }
    `, 
    {
      iResolution: []
    }
  );

const macularFilter = new PIXI.Filter(
    null, 
    ` 
        precision mediump float;
        
        uniform vec2 iResolution;

        varying vec2 vTextureCoord;

        uniform sampler2D uSampler;

        const float MIX_RATE = 1.0;

        void main( void ) {

            vec2 center = vec2(iResolution.x * 0.5, iResolution.y * 0.5);
            float dist = distance(gl_FragCoord.xy, center);
            float width = min(iResolution.x, iResolution.y) * 0.5;
            float black = smoothstep(0.0, width, dist);
            
            vec4 color = texture2D( uSampler, vTextureCoord );

            gl_FragColor = vec4( mix(color, color * black, MIX_RATE) );

        }
    `, 
    {
        iResolution: []
    }
);

const pigmentosaFilter = new PIXI.Filter(
    null, 
    ` 
        precision mediump float;
        
        uniform vec2 iResolution;

        varying vec2 vTextureCoord;

        uniform sampler2D uSampler;

        const float sigma = 10.;
        const float r = sigma * 2.;
        const float invTwoSigmaSqr = 1. / (2. * sigma * sigma);
        const float lod = 1.0;

        const float INNER_RADIUS = 0.08;
        const float OUTER_RADIUS = 0.3;
        
        vec4 gaussBlur( sampler2D tex, vec2 uv, vec2 d, float lod ) {
            vec4 c = texture2D( tex, uv );
            
            for (float i = 1.; i < r; ++i) 
                c += (
                    texture2D(tex, uv + d * i) +
                    texture2D(tex, uv - d * i)
                ) * exp(- i * i * invTwoSigmaSqr);
            
            return c / c.a;
        }
        
        void main( void ) {

            vec4 blurColor = gaussBlur(
                uSampler, 
                vTextureCoord,
                vec2(exp2(lod)/iResolution.x, 0.), 
                lod
            );

            vec2 uv = gl_FragCoord.xy / iResolution.xy;
            vec2 center = vec2(0.5, 0.5);
            float dist = distance(uv, center);
            float amount = smoothstep(INNER_RADIUS, OUTER_RADIUS, dist);
        
            vec4 color = texture2D( uSampler, vTextureCoord );
  
            gl_FragColor = vec4( mix(color, blurColor, amount) );

        }
    `, 
    {
        iResolution: []
    }
);


export default function Vision({ mode, isSmallScreen, setIsSmallScreen }) {

    const [width, setWidth] = useState(null)
    const [height, setHeight] = useState(null)

    const rootRef = useRef()
    const visionRef = useRef()
    const sizeRef = useRef()
    const appRef = useRef()
    const videoRatioRef = useRef()
    const videoSpriteRef = useRef()

    const resize = () => {
        setIsSmallScreen( Math.min(rootRef.current.offsetHeight, rootRef.current.offsetWidth) < 500 );

        if (videoRatioRef.current && videoSpriteRef.current) {

            const videoRatio = videoRatioRef.current
            const videoSprite = videoSpriteRef.current

            if (videoRatio > rootRef.current.offsetWidth / rootRef.current.offsetHeight ) {
              const width = rootRef.current.offsetWidth
              const height = width / videoRatio;
              visionRef.current.style.width = width + 'px'
              visionRef.current.style.height = height + 'px'
              videoSprite.width = width
              videoSprite.height = height
            }
            else {
              const height = rootRef.current.offsetHeight
              const width = height * videoRatio
              visionRef.current.style.width = width + 'px'
              visionRef.current.style.height = height + 'px'
              videoSprite.height = height
              videoSprite.width = width
            }
        
            appRef.current.resize();

            clearTimeout(setSizeLoopRef.current)
            setSizeLoopRef.current = setTimeout(doneResizing, 500)
        }
    }
    const setSizeLoopRef = useRef();
    const doneResizing = () => {
        setWidth(visionRef.current.offsetWidth)
        setHeight(visionRef.current.offsetHeight)
        sizeRef.current = {
            width: visionRef.current.offsetWidth,
            height: visionRef.current.offsetHeight
        }
    }

    useEffect(() => {

        // resize
        rootRef.current = document.getElementById('vision-player')
        const resizeObserver = new ResizeObserver((entries) => {
            resize();
        });
        resizeObserver.observe(rootRef.current);

        // pixi init
        const app = new PIXI.Application({        
            antialias: true,    
            transparent: false,
            resolution: 1,
        });
        app.renderer.view.style.position = "absolute"
        app.renderer.view.style.display = "block"
        app.renderer.autoResize = true
        appRef.current = app
        visionRef.current.appendChild(app.view)
        app.resizeTo = visionRef.current

        loadVideo()

    }, []); 

    const loadVideo = () => {
        const video = document.createElement('video')
        video.src = process.env.PUBLIC_URL + '/video.mp4'
    
        video.onloadedmetadata = () => {
            video.loop = true;
            video.autoplay = true; 
            video.muted = true;
            video.setAttribute("muted", true);
            video.setAttribute("playsinline", true);

            const videoTexture = PIXI.Texture.from(video)
            videoSpriteRef.current = new PIXI.Sprite(videoTexture)
            videoRatioRef.current = video.videoWidth / video.videoHeight
            resize()
            appRef.current.stage.addChild(videoSpriteRef.current)

            video.play()
        };
    }

    useEffect(() => {
        if (width && height)
            switch(mode) {
                case 0:
                    adjustmentFilter.brightness = 0.7
                    adjustmentFilter.saturation = 0.6
                    adjustmentFilter.contrast = 1
                    adjustmentFilter.gamma = 1
                    macularFilter.uniforms.iResolution = [parseInt(width), parseInt(height)]
                    videoSpriteRef.current.filters = [macularFilter, adjustmentFilter]
                break;
                case 1:
                    bloomFilter.blur = 5
                    glaucomaFilter.uniforms.iResolution = [parseInt(width), parseInt(height)]
                    videoSpriteRef.current.filters = [glaucomaFilter, bloomFilter]
                break;
                case 2:
                    blurFilter.strength = 0.2
                    videoSpriteRef.current.filters = [blurFilter]
                    setRetinaDetachment()
                    appRef.current.speed = 0.5
                    appRef.current.ticker.add(animateFloaters.current)
                break
                case 3:
                    blurFilter.strength = 0.2
                    adjustmentFilter.brightness = 1
                    adjustmentFilter.saturation = 0.6
                    adjustmentFilter.contrast = 0.6
                    adjustmentFilter.gamma = 1.4
                    videoSpriteRef.current.filters = [blurFilter, adjustmentFilter]
                break;
                case 4:
                    pigmentosaFilter.uniforms.iResolution = [parseInt(width), parseInt(height)]
                    videoSpriteRef.current.filters = [pigmentosaFilter]
                break;
            }

            if (mode != 2) {
                if (floatersRef.current) 
                    appRef.current.stage.removeChild(floatersRef.current)
       
                appRef.current.ticker.remove(animateFloaters.current)
            }

    }, [width, height, mode]); 

    // mode 2 Retina Detachment
    const floatersRef = useRef(null)
    const setRetinaDetachment = () => {

        if (floatersRef.current) 
            appRef.current.stage.removeChild(floatersRef.current)

        const floaters = new PIXI.Container()
        const MIN_SIZE = 5
        const MAX_SIZE = isSmallScreen ? 30: 60
        const DIST = isSmallScreen ? 60 : 150

        for (let x = 0; x < width; x += DIST) {
            for (let y = 0; y < height; y += DIST) {
                const floaterImage = require(`../assets/images/floater-${Math.ceil(Math.random() * 9)}.png`).default
                const floaterTexture = PIXI.Texture.from(floaterImage)        
                const floater = new PIXI.Sprite(floaterTexture)
                const size = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE
                floater.width = size
                floater.height = size
                floater.position.set(
                    x + (Math.random() * 2 - 1) * DIST * 0.4,
                    y + (Math.random() * 2 - 1) * DIST * 0.4
                )
                floater.anchor.set(0.5)
                floater.rotation = Math.random() * 360
                floater.alpha = 0.2
                floater.blendMode = PIXI.BLEND_MODES.MULTIPLY
                floater._direction = Math.random() * Math.PI * 2
                floaters.addChild(floater)
            }
        }
   
        appRef.current.stage.addChild(floaters)
        floatersRef.current = floaters
    }
    const animateFloaters = useRef( 
        () => {
            const DIST = 150
            const SPEED = 0.3
            for (const floater of floatersRef.current.children) {
                floater.position.x += SPEED * Math.cos(floater._direction)
	            floater.position.y += SPEED * Math.sin(floater._direction)
                if (floater.position.x < - DIST || floater.position.x > sizeRef.current.width + DIST || floater.position.y < - DIST || floater.position.y > sizeRef.current.height + DIST) {
                    floater._direction +=  Math.PI
                }
            }
        }
    )

    return (
        <div id="vision" ref={visionRef}/>
    );
}

