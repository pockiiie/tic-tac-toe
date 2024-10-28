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
    setIsDraw
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
    <div className={`bg-gray-800 w-auto h-auto md:h-[22vh] rounded-lg flex justify-center items-center overflow-clip`}
      onClick={handleTileClick}
    >
      <div className={`
        ${own === 1 ? 'text-blue-500' : 'text-red-500'} 
        ${own === 0 ? 'invisible' : ''}
        text-8xl md:text-[20vh] w-full text-center
        `}>
        <input type="hidden" name="tileNumber" value={position.toString()} />
        {displayPlayer(own)}
      </div>
    </div>
  )
}