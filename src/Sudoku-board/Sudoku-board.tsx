import React, {useState} from 'react';
import './Sudoku-board.css'
import {SudokuGrid} from "./Sudoku-resolver";

interface Props {
    startingGrid?:number[]
}

const SudokuBoard: React.FC<Props>= ({startingGrid}:Props) => {

/*
    const grid:number[][] = new Array(9)
    .fill(0)
    .map( () => new Array(9).fill(0))
*/

    if (startingGrid === undefined) {
         startingGrid = new Array<number>(81).fill(0)
    }
    const [gridState, setGridState] = useState(startingGrid)

    const changedCellHandler = (event:React.FormEvent<HTMLInputElement>, index:number) => {
        let enteredValue = parseInt(event.currentTarget.value) | 0
        if (enteredValue >=0 && enteredValue <=9) {
            let newGrid = [...gridState]
            newGrid[index] = enteredValue
            setGridState(newGrid)
        }
    }

    const updateState = ( (newBoard:number[]) => {
        console.log("updateState..")
        setGridState([...newBoard])
    })

    const solveItHandler = ( () => {
        let sudoku = new SudokuGrid(gridState)
        if (!sudoku.isValid()) {
            alert("The grid contains not valid entries (duplicates on row, col or quadrant")
            return
        }
        if (sudoku.isResolved()) {
            alert("The game is already resolved")
            return
        }
        if (sudoku.resolve(0,0, updateState)) {
            alert("Found a solution!")
            setGridState(sudoku.board)
        } else {
            alert("no solution found!")
        }
    });

    const clearHandler = (() =>{
        setGridState(new Array<number>(81).fill(0))
    });

    const rowElements = new Array<JSX.Element>(9).fill(<p></p>)
        .map( () => new Array<JSX.Element>(9).fill(<></>))

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            rowElements[i][j] = <input key={i*9+j}
                                       value={gridState[i * 9 + j]}
                                       onChange={(event)=>changedCellHandler(event, i*9+j)}/>
        }
    }

    return (
        <div>
            <label className="centerstyle">Sudoku Resolver</label>
        <div className="sudokuGrid" id = {"grid"}>
            {rowElements}
        </div>
        <div className="centerstyle">
            <button onClick={solveItHandler}>Solve it!</button>
            <button onClick={clearHandler}>Clear</button>
        </div>
        </div>
    )

};

export default SudokuBoard