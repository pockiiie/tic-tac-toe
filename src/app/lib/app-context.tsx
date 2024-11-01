import { createContext, useContext } from "react";

// Define type for setFunction of useState
export type Tiles = number[][]

export const initTiles = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
]

// createContext parameters must be the same as useState variable and function to set in Provider
export const AppContext = createContext({
  tiles: initTiles,
  setTiles: (_: Tiles) => { }, //mimic useState setFunction
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
  size: 3,
  setSize: (_: number) => { }
})

export const useAppContext = () => useContext(AppContext)