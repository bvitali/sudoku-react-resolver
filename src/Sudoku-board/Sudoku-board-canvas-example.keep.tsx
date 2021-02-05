import React, {useRef, useEffect} from 'react';
import './Sudoku-board.css'

type Line = {
    x: number
    y: number
    x1: number
    y1: number
}

type Style = {
    color?:string,
    width?: number
}

interface Props {
    startingGrid:number[]
}

const SudokuBoard: React.FC<Props>= ({startingGrid}:Props) => {
    const canvas = useRef<HTMLCanvasElement>(null)
    let ctx:CanvasRenderingContext2D | null;

    // initialize the canvas context
    useEffect(() => {
        if (!canvas.current) {
            return;
        }

        const canvasEle = canvas.current;

        if (canvasEle !== undefined) {
            // get context of the canvas
            ctx = canvasEle.getContext("2d")

            // dynamically assign the width and height to canvas
//            canvasEle.width = canvasEle.clientWidth;
//            canvasEle.height = canvasEle.clientHeight;
            console.log(canvasEle.width, canvasEle.height)
         }
    });

    useEffect(() => {
        drawGrid()
    });

// draw a line
    const drawLine = ( info: Line, style:Style = {}) => {
        const { x, y, x1, y1 } = info;
        const { color = 'black', width = 1 } = style;
        if (ctx) {
            ctx.beginPath();

            ctx.moveTo(x, y);
            ctx.strokeStyle = color;
            ctx.lineWidth = width;

            ctx.lineTo(x1, y1);
            ctx.stroke();
        }
    }
// draw a grid on the viewport
    const drawGrid = () => {
        const lineStyle: Style = {color: 'blue', width: 2};
        if (ctx && canvas.current) {
            const width = canvas.current.clientWidth
            const height = canvas.current.clientHeight
            drawLine({x:width/3,y:0,x1:width/3,y1:height}, lineStyle)
            drawLine({x:width*2/3,y:0,x1:width*2/3,y1:height}, lineStyle)
            drawLine({x:0,y:height/3,x1:width,y1:height/3}, lineStyle)
            drawLine({x:0,y:height*2/3,x1:width,y1:height*2/3}, lineStyle)

        }
    }

    const grid:number[][] = new Array(9)
    .fill(0)
    .map( () => new Array(9).fill(0))

    const rowElements = new Array<JSX.Element>(9).fill(<p></p>)
        .map( () => new Array<JSX.Element>(10).fill(<></>))

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            grid[i][j] = startingGrid[i * 9 + j]
            rowElements[i][j] = <input key={i*9+j} value={grid[i][j]}/>
        }
    }

    return (
             <div className="sudokuGrid" id = {"grid"}>
                {rowElements}
            </div>)

};

export default SudokuBoard