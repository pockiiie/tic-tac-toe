export const displayPlayer = (own: number) => {
  if (own === 1) 
    return 'O'
  if (own === 2)
    return 'X'
  else
    return '0'
}