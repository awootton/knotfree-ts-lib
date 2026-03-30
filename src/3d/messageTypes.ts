

export interface MessageBaseClass {
    type: string,       // for routing by type
    sessionId: string   //  for routing reply messages
}

export interface InitMessage extends MessageBaseClass {

    payload: {
        props: any,
        drawingSurface: any,    // offscreencanvas,
        width: number,          //canvas.clientWidth,
        height: number,         //canvas.clientHeight,
        pixelRatio: number,     //window.devicePixelRatio,
    }
}