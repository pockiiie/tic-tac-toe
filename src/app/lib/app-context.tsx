import { createContext, useContext } from "react";

// Define type for setFunction of useState
export type TileType = number[][]

// Initial tiles array
// export const initTiles = [
//   ['x', 'o', 'x'],
//   ['o', 'x', 'o'],
//   ['o', 'o', 'n']
// ]

export const initTiles = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
]

// createContext parameters must be the same as useState variable and function to set in Provider
export const AppContext = createContext({
  tiles: initTiles,
  setTiles: (_: TileType) => { }, //mimic useState setFunction
  isEnd: false,
  setIsEnd: (_: boolean) => { },
  turn: 0,
  setTurn: (_: number) => { },
  nextTurn: 0,
  setNextTurn: (_: number) => { },
  winner: 0,
  setWinner: (_: number) => { },
  isDraw: false,
  setIsDraw: (_: boolean) => { },
})

export const useAppContext = () => useContext(AppContext)