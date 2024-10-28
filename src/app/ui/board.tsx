'use client'

import Tile from "./tile"
import { useAppContext } from "../lib/app-context"

export default function Board() {
  const { tiles } = useAppContext()
  return (
    <div className="w-80 md:w-[70vh] h-80 md:h-[70vh] 
      grid grid-cols-3 gap-[1lvh] p-[1lvh] justify-center items-center 
      rounded-lg bg-slate-400">
      {
        tiles.map((row, ri) => {
          return row.map((_, ci) => {
            return <Tile key={`${ri}-${ci}`} own={tiles[ri][ci]} position={[ri, ci]} />
          })
        })
      }
    </div>
  )
}