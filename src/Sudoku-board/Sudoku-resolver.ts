import assert from 'assert'

export type gridRange = 0 | 1 | 2 | 3 | 4 | 5 | 6 |7 | 8
export type valueRange = 1 | 2 | 3 | 4 | 5 | 6 |7 | 8 | 9

export interface callBackType {
    (newBoard:number[], index:number) : void
}

class QuadrantRange {
    // a quadrant is a 3x3 sub-matrix numbered as below
    // [ 0, 1 , 2  ]
    // [ 3, 4 , 5  ]
    // [ 6, 7 , 8  ]
    // indexSet contains the indexes of the elements belonging to a specific quadrant

    name: string
    indexSet: Set<number>
    constructor(q: gridRange) {

        if (q <0 || q>8)
            throw new RangeError('Enter a valid range 0..8')
        this.name = `quadrant-${q}`
        let quotient = ((q / 3) >> 0) * 3
        let remainder = (q % 3) * 3
        this.indexSet = new Set()
        for (let i = quotient; i < quotient + 3; i++) {
            for (let j = remainder; j < remainder + 3; j++) {
                this.indexSet.add(j + i * 9)
            }
        }
    }
}

class Quadrants extends Array<QuadrantRange> {
    private static done: boolean = false

    constructor() {
        super()
        if (Quadrants.done) {
            console.log("static structure quadrants NOT initialized")
            return;
        }
        console.log("static structure quadrants initialized")
        for (let i:gridRange = 0; i < 9; i++) {
            this[i] = new QuadrantRange(i as gridRange)
        }
        Quadrants.done = true
    }
}

let quadrants = new Quadrants()

export class SudokuGrid {

    board: number[]
    isBoardValid: boolean

    constructor(initialBoard?: number[]) {
        if (initialBoard !== undefined)
            this.board = [...initialBoard]
        else
            this.board = new Array<number>(81)

        this.isBoardValid = this.isValid()           //check if the input board is valid, if not no other operation makes sense

        // debug
        if ( !this.isBoardValid) {
            console.log('Board invalid in constructor')
            console.log(`${this}`)
            console.log(this)
            //assert(this.isBoardValid, "The board is not valid")
        }

    }

    private delay(ms: number) {
       return new Promise( resolve => setTimeout(resolve, ms))
    }

    getItem(row:gridRange, col:gridRange):number {
        assert(this.isBoardValid, "The board is not valid")
        assert((row>=0 && row<9) && (col >=0 && col < 9))
        return this.board[row * 9 + col]
    }

    setItem( index:number, val:number, callback?: callBackType)  {
        this.board[index] = val
        if (callback) {
            callback(this.board, index)
         }
    }

    isRowValid(row:gridRange, col:gridRange, val:valueRange):boolean {
        //corner case to evaluate: if the value is already assigned the function
        // return false.
        assert((row>=0 && row<9 ) && (val>=1 && val <=9))
        // return true if 'val' is not contained in row
        for (let i:gridRange = 0; i < 9; i++) {
            if (this.getItem(row, i as gridRange) === val)
                return false
        }
        return true
    }

    isColValid(row:gridRange, col:gridRange, val:valueRange):boolean {
        assert(( col >=0 && col < 9) && (val>=1 && val <=9))
        // return true if 'val' is not contained in column
        for (let i = 0; i < 9; i++) {
            if (this.getItem(i as gridRange, col) === val)
                return false
        }
        return true
    }

    isQuadrantValid(row:gridRange, col:gridRange, val:valueRange):boolean {
        assert((row>=0 && row<9) && (col >=0 && col < 9) && (val>=1 && val <=9))
        // return true if 'val' is not contained in the quadrant corresponding to the row,col coordinates
        let q = this.getQuadrant(row, col)
        for (let i of quadrants[q].indexSet) {
            if (this.board[i] === val)
                return false
        }
        return true
    }

    getQuadrant(row:gridRange, col:gridRange) {
        assert((row>=0 && row<9) && (col >=0 && col < 9))
        //return the quadrant index from row,col
        return ((row / 3) >> 0) * 3 + ((col / 3) >> 0)
    }

    toString():string {
        let rows = "\n"
        for (let r = 0; r < 9; r++) {
//            rows = rows + '[ ' + this.board.slice(r * 9, (r+1) * 9) + ' ]\n'
            let i = r * 9
            rows = rows + '| ' + this.board.slice(i, i + 3) + ' | ' + this.board.slice(i + 3, i + 6) + ' | ' + this.board.slice(i + 6, i + 9) + ' |\n'
            if ( (r % 3) === 2)
                rows = rows + "-".repeat(25) + "\n"
        }
        return rows
    }


    isResolved() {
        assert(this.isBoardValid, "The board is not valid")
        // if there are no more '0' values the game is resolved
        return this.board.every( (val) =>  val)
    }

    isValidAssignment(row:gridRange, col:gridRange, val:valueRange):boolean {
        if (this.isRowValid(row, col, val))
            if (this.isColValid(row, col, val))
                if (this.isQuadrantValid(row,col,val))
                    return true
        return false
    }

    checkRow(row:gridRange):boolean {
        let tracker = new Array<number>(10).fill(0)
        for (let col = 0; col < 9; col++ ) {
            let index = row * 9 + col
            let val = this.board[index]
            if (val)
                tracker[val] = tracker[val] + 1
        }
        return tracker.every( (count) => {return count<=1})
    }

    checkCol(col:gridRange):boolean {
        let tracker = new Array<number>(10).fill(0)
        for (let row = 0; row < 9; row++ ) {
            let index = row * 9 + col
            let val = this.board[index]
            if (val)
                tracker[val] = tracker[val] + 1
        }

        return tracker.every( (count) => {return count<=1})
    }

    checkQuadrant(row:gridRange,col:gridRange):boolean {
        let q = this.getQuadrant(row,col)
        let tracker = new Array<number>(10).fill(0)
        for (let index of quadrants[q].indexSet) {
            let val = this.board[index]
            if (val)
                tracker[val] = tracker[val] + 1
        }

        return tracker.every( (count) => {return count<=1})
    }

    isValid():boolean {

        return this.board.every( (val, index) => {
            let row = (index/9)>>0
            let col = index % 9
            return this.checkRow(row as gridRange)  && this.checkCol(col as gridRange) && this.checkQuadrant(row as gridRange,col as gridRange)
        })
    }

    resolve( iterations:number = 0, startingIndex:number = 0, callback?:callBackType):boolean  {

        // the callback to track progress during the iterations works on the console but not in React

        iterations++
//        console.log(`Recursive Iteration: ${iterations}`)
//    console.log(`${sudoku}`)
//    console.log(sudoku.candidateSet)

        while (this.board[startingIndex] > 0 && startingIndex <81) {
            // skip the cells with a non zero value
            startingIndex++
        }
        if (startingIndex === 81)
            return true
        let i = startingIndex
        let row = (i/9) >> 0
        let col = i % 9
//    console.log(`current item[${row},${col}], index:${i}`)

        for (let candidateValue:valueRange = 1; candidateValue <=9;  candidateValue++) {
            // try to assign all possible candidates, if an assignment doesn't bring to resolution
            // go back and try the other alternatives
//        console.log(`candidate (${candidateValue}) inside`, sudoku.candidateSet[i])

            // try to resolve the game assigning the candidateValue
            // start the recursion from the index after the current one
//            console.log(`===== before setting ${candidateValue}  in (${row}, ${col}`)

            if (this.isValidAssignment(row as gridRange,col as gridRange,candidateValue as valueRange)) {
                //make a tentative assignment
                //this.board[i] = candidateValue
                this.setItem(i, candidateValue, callback)

//            console.log(`===== after setting ${candidateValue}  in (${row}, ${col}`)

                if (this.resolve( iterations, i + 1, callback)) {
                    // the candidate reached a valid solution
                    // exit
                    return true
                }
                //this.board[i] = 0
                this.setItem(i, 0, callback)
            }

        }
        return false
    }

}
