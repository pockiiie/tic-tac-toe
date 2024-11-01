'use client'
import { BaseSyntheticEvent } from "react"
import { useAppContext, Tiles } from "../lib/app-context"
import { displayPlayer } from "../lib/player-display"

export default function Board() {
  // Type for result of checked array
  type CheckResult = {
    player: number
    isWin: boolean
  }

  // all params came from AppContext.Provider in page.tsx
  const {
    tiles,
    setTiles,
    isEnd,
    setIsEnd,
    turn,
    setTurn,
    nextTurn,
    setNextTurn,
    setWinner,
    setIsDraw,
    size,
  } = useAppContext()

  // check row for winner
  const checkLine = (arr: number[]): CheckResult => {
    const check = arr.every(el => el === arr[0])
    return { player: arr[0], isWin: arr[0] === 0 ? false : check }
  }

  // check column and row for winner
  const checkRowAndColumn = () => {
    const rows = tiles.length
    const cols = tiles[0].length
    let col = []
    let result = { player: 0, isWin: false }
    for (let r = 0; r <= rows - 1; r++) {
      col = []
      for (let c = 0; c <= cols - 1; c++) {
        col.push(tiles[c][r])
      }
      result = checkLine(col)
      if (result.isWin) return result

      result = checkLine(tiles[r])
      if (result.isWin) return result
    }
    return result
  }

  // Get diagonal data from board tiles
  // isReverse the diagonal line from top last to bottom first
  // [1,2,(1)]
  // [2,(1),1]
  // [(2),1,2]
  // isReverse will return [1,1,2]
  const getDiagonal = (isReverse: boolean = false) => {
    const diag: number[] = []
    const arr: Tiles = Array.from(tiles)

    if (isReverse) {
      tiles.forEach((row, r) => {
        arr[r] = Array.from(row).reverse()
      })
    }

    arr.forEach((row, r) => {
      row.forEach((own, c) => {
        if (r === c) {
          diag.push(own)
        }
      })
    })

    return diag
  }

  // Check diagonal on board for winner
  const checkDiagonal = () => {
    const diag1 = getDiagonal()
    let result: CheckResult = { player: 0, isWin: false }
    result = checkLine(diag1)
    if (!result.isWin)
      result = checkLine(getDiagonal(true))
    return result
  }

  // Check is Board doesn't have a blank tile
  const isBoardFull = () => {
    const result = tiles.flat().every(el => el !== 0)
    if (result) {
      setIsEnd(true)
      setIsDraw(true)
    }
    return result
  }

  // Find the winner
  const findWinner = () => {
    let result = checkRowAndColumn()
    if (result.isWin) {
      setIsEnd(true)
    } else {
      result = checkDiagonal()
      if (result.isWin)
        setIsEnd(true)
      else
        result = { player: 0, isWin: false }
    }

    return result
  }

  // Handle player click on tile
  const handleTileClick = (event: BaseSyntheticEvent) => {
    if (isEnd) return;

    const { target } = event
    const [x, y] = target?.querySelector('input')?.value?.split(',')

    // Prevent player click on the already clicked tile
    if (tiles[x][y] != 0) return

    const newTurn: number = (turn === 1) ? 2 : 1

    tiles[x][y] = newTurn
    setTurn(newTurn)
    setNextTurn((newTurn === 1) ? 2 : 1)
    setTiles(tiles)

    const result = findWinner()
    if (result.isWin) {
      setWinner(result.player)
    } else {
      isBoardFull()
    }
  }

  return (
    <div className={`
      w-80 h-80 sm:w-[480px] sm:h-[480px] md:w-[600px] md:h-[600px] 
      grid justify-center items-center
      rounded-lg bg-slate-400 transition-opacity duration-500
      ${size === 3 && 'grid-cols-3 gap-[0.5rem] p-[0.5rem]'}
      ${size === 4 && 'grid-cols-4 gap-[0.3rem] p-[0.3rem]'}
      ${size === 5 && 'grid-cols-5 gap-[0.15rem] p-[0.15rem]'}
      ${isEnd && 'opacity-60'}
    `}>
      {
        tiles.map((row, ri) => {
          return row.map((_, ci) => {
            const own = tiles[ri][ci]
            const position = [[ri], [ci]].toString()
            return (
              // ${own === 0 && 'hover:contrast-75 hover:blur-lg'}

              <div key={position}
                className={`tile
                  bg-gray-800 rounded-lg flex justify-center items-center
                  transition-all duration-200
                  ${size === 3 && 'h-[6rem] sm:h-[9.2rem] md:h-[11.6rem]'}
                  ${size === 4 && 'h-[4.6rem] sm:h-[7rem] md:h-[9rem]'}
                  ${size === 5 && 'h-[3.8rem] sm:h-[5.7rem] md:h-[7.2rem]'}
                  ${own === 0 && 'hover:brightness-150 hover:blur-md'}
                  ${nextTurn === 1 && own === 0 && 'hover:bg-blue-500'}
                  ${nextTurn === 2 && own === 0 && 'hover:bg-red-500'}
                `}
                onClick={handleTileClick}
              >
                <div className={`
                  w-full text-center
                  ${own === 1 ? 'text-blue-500' : 'text-red-500'} 
                  ${own === 0 && 'invisible'}
                  ${size === 3 && 'text-[6rem] sm:text-[9rem] md:text-[12rem]'}
                  ${size === 4 && 'text-[4rem] sm:text-[8rem] md:text-[9rem]'}
                  ${size === 5 && 'text-[4rem] sm:text-[6rem] md:text-[8rem]'}
                  `}>
                  <input type="hidden" name="tileNumber" value={position} />
                  {displayPlayer(own)}
                </div>
              </div>
            )
          })
        })
      }
    </div>
  )
}