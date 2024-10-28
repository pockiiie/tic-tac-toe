'use client'

import { BaseSyntheticEvent } from "react"
import { useAppContext, TileType } from "../lib/app-context"
import { displayPlayer } from "../lib/player-display"

export default function Tile({ own, position }: { own: number, position: number[] }) {

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
    const arr: TileType = Array.from(tiles)

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

    isBoardFull()

    const result = findWinner()
    if (result.isWin) {
      setWinner(result.player)
    }
  }

  return (
    <div className={`bg-gray-800 w-auto rounded-lg flex justify-center items-center overflow-clip
      
      ${size === 3 && 'h-[13vh] md:h-[22.6vh]'}
      ${size === 4 && 'h-[9.8vh] md:h-[16.8vh]'}
      ${size === 5 && 'h-[7.8vh] md:h-[13.4vh]'}
      ${size === 6 && 'h-[6.4vh] md:h-[11vh] rounded-md'}
      ${size === 7 && 'h-[5.4vh] md:h-[9.4vh] rounded-md'}
      ${size === 8 && 'h-[4.8vh] md:h-[8.2vh] rounded-md'}
      ${size === 9 && 'h-[4.2vh] md:h-[7vh] rounded-md'}
      ${size === 10 && 'h-[3.8vh] md:h-[6.4vh] rounded-md'}
      `}
      onClick={handleTileClick}
    >
      <div className={`
        text-8xl md:text-[20vh] w-full text-center
        ${own === 1 ? 'text-blue-500' : 'text-red-500'} 
        ${own === 0 && 'invisible'}
        ${size === 4 && 'md:text-[14vh]'}
        ${size === 5 && 'md:text-[12vh]'}
        ${size === 6 && 'md:text-[9vh]'}
        ${size === 7 && 'md:text-[8vh]'}
        ${size === 8 && 'md:text-[7vh]'}
        ${size === 9 && 'md:text-[6vh]'}
        ${size === 10 && 'md:text-[5vh]'}
        `}>
        <input type="hidden" name="tileNumber" value={position.toString()} />
        {displayPlayer(own)}
      </div>
    </div>
  )
}