'use client'

import Board from "@/app/ui/board"
import { useState } from "react"
import { AppContext, initTiles } from "./lib/app-context"
import { displayPlayer } from "./lib/player-display"

export default function Home() {
  const [tiles, setTiles] = useState(Array.from(initTiles))
  const [isEnd, setIsEnd] = useState(false)
  const [turn, setTurn] = useState(0)
  const [nextTurn, setNextTurn] = useState(1)
  const [winner, setWinner] = useState(0)
  const [isDraw, setIsDraw] = useState(false)

  // New Game
  const handleNewGameClick = () => {
    if (winner === 1) {
      setNextTurn(2)
    } else {
      setNextTurn(1)
    }
    setWinner(0)
    setTurn(0)
    setIsEnd(false)
    setIsDraw(false)
    const newTiles = Array.from(initTiles, (row) => new Array(row.length).fill(0))
    setTiles(newTiles)
  }

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main className="grid grid-col-1 items-center justify-center min-h-lvh">
        <div className="flex justify-center">
          <button className="bg-slate-600 rounded-md p-2"
            type="button"
            onClick={handleNewGameClick}
          >
            New Game
          </button>
        </div>
        <div className="w-full text-[6vh] text-center">
          <span className={`${(winner === 0 && !isDraw) ? 'block' : 'hidden'}`}>
            Player {displayPlayer(nextTurn)}
          </span>
          <span className={`${(winner !== 0) ? 'block' : 'hidden'}`}>
            Winner is {displayPlayer(winner)}
          </span>
          <span className={`${isDraw ? 'block' : 'hidden'}`}>
            TIE is a LAME!
          </span>
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
          }}>
            <Board />
          </AppContext.Provider>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
