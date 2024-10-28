'use client'

import Tile from "./tile"
import { useAppContext } from "../lib/app-context"

export default function Board() {
  const { tiles, size, isEnd } = useAppContext()
  return (
    <div className={`
      w-80 md:w-[70vh] h-80 md:h-[70vh] 
      grid gap-[0.2vh] p-[0.2vh] justify-center items-center
      rounded-lg bg-slate-400 transition-opacity duration-500
      ${size === 3 && 'grid-cols-3 md:gap-[0.5vh] md:p-[0.5vh]'}
      ${size === 4 && 'grid-cols-4 md:gap-[0.5vh] md:p-[0.5vh]'}
      ${size === 5 && 'grid-cols-5 md:gap-[0.4vh] md:p-[0.4vh]'}
      ${size === 6 && 'grid-cols-6 md:gap-[0.4vh] md:p-[0.4vh]'}
      ${size === 7 && 'grid-cols-7 md:gap-[0.4vh] md:p-[0.4vh]'}
      ${size === 8 && 'grid-cols-8 md:gap-[0.4vh] md:p-[0.4vh]'}
      ${size === 9 && 'grid-cols-9 md:gap-[0.5vh] md:p-[0.5vh]'}
      ${size === 10 && 'grid-cols-10 md:gap-[0.5vh] md:p-[0.5vh]'}
      ${isEnd && 'opacity-60'}
    `}>
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