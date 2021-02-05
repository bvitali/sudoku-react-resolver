import React from "react";
import "./App.css";
import SudokuBoard from "./Sudoku-board/Sudoku-board";

const startingGrid = [
    0,0,0,0,8,7,0,4,0,
    0,0,6,0,0,0,0,0,0,
    0,8,0,9,5,0,3,0,0,
    3,9,0,7,0,2,0,0,0,
    4,2,0,0,0,8,0,0,0,
    0,0,0,5,4,0,0,0,0,
    0,0,0,0,0,5,2,0,0,
    6,0,0,8,0,0,0,5,0,
    2,0,0,0,3,0,4,0,0]

export default function App() {

  return (
      <div className="App">
       <SudokuBoard startingGrid={startingGrid}/>
      </div>
  );

    /*
    return (
        <div className="App">
            <SudokuBoard />
        </div>
    );
*/
}