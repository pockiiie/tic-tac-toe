'use client'

import Board from "@/app/ui/board"
import { BaseSyntheticEvent, useEffect, useState } from "react"
import { AppContext, initTiles } from "./lib/app-context"
import { displayPlayer } from "./lib/player-display"

export default function Home() {
  const [tiles, setTiles] = useState(Array.from(initTiles))
  const [isEnd, setIsEnd] = useState(false)
  const [turn, setTurn] = useState(1)
  const [nextTurn, setNextTurn] = useState(1)
  const [winner, setWinner] = useState(0)
  const [isDraw, setIsDraw] = useState(false)
  const [size, setSize] = useState(3)

  const boardSize = [3, 4, 5, 6, 7, 8, 9, 10]

  useEffect(() => {
    createTiles(size);
  }, [size])

  // Create board tiles with specify number
  const createTiles = (size: number) => {
    const rows = new Array(size)
    const newTiles = Array.from(rows, () => new Array(size).fill(0))
    setTiles(newTiles);
    return newTiles
  }

  // NEW GAME
  const newGame = () => {
    if (winner === 1) {
      setNextTurn(2)
      setTurn(1)
    } else {
      setNextTurn(1)
      setTurn(2)
    }
    setWinner(0)
    setIsEnd(false)
    setIsDraw(false)
    createTiles(size)
  }

  // Size select change
  const handleSizeChange = (event: BaseSyntheticEvent) => {
    const newSize = event.target.value
    setSize(Number(newSize))
    newGame()
  }

  // New Game button clic
  const handleNewGameClick = () => {
    newGame()
  }

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <div className="absolute p-4">
        Created by <a className="bg-amber-600 px-2 py-1 rounded-lg" target="_blank" href="https://github.com/pockiiie/tic-tac-toe">pockiiie</a>
      </div>
      <main className="grid grid-col-1 items-center justify-center min-h-lvh">
        <div className="w-full flex justify-center">
          <select name="size" id="size"
            onChange={handleSizeChange}
            className="block w-52 px-2 py-0 mx-2 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            {
              boardSize.map(size => {
                return (
                  <option key={size} value={size}>{size + 'x' + size}</option>
                )
              })
            }
          </select>
          <button className="bg-slate-600 rounded-md p-2"
            type="button"
            onClick={handleNewGameClick}
          >
            New Game
          </button>
        </div>
        <div className="w-full">
          {/* Assign variables and functions in to value of BoardContext Provider then 
        you can use it in any child component via react.useContext function */}
          <AppContext.Provider value={{
            tiles, setTiles,
            isEnd, setIsEnd,
            turn, setTurn,
            nextTurn, setNextTurn,
            winner, setWinner,
            isDraw, setIsDraw,
            size, setSize
          }}>
            <Board />
          </AppContext.Provider>
        </div>
        <div className="w-full text-[6vh] text-center">
          <span className={`${(winner === 0 && !isDraw) ? 'block' : 'hidden'}`}>
            Player {displayPlayer(nextTurn)}
          </span>
          <span className={`${(winner !== 0 && !isDraw) ? 'block' : 'hidden'}`}>
            Winner is {displayPlayer(winner)}
          </span>
          <span className={`${isDraw ? 'block' : 'hidden'}`}>
            TIE is a LAME!
          </span>
        </div>
      </main>
    </div>
  );
}
