import { createContext, useEffect, useState } from 'react'
import Calendar from './components/calendar'
import mockData from './mockData.json'
import { fetchedData } from './types'
import numeral from 'numeral'

export type IStore = {
  date: string[]
  setDate: (dates: string[]) => void
  range: string
  setRange: (range: string) => void
  data: fetchedData
}

export const Store = createContext<IStore | null>(null),

dateToString = (date: Date) => {
  const offset = date.getTimezoneOffset()
  date = new Date(date.getTime() - (offset*60*1000))
  return date.toISOString().split('T')[0]
},

formatter = (num: number) => {
  const stringArray = numeral(num).format().split(',')
  return stringArray.reduce((acc, sum, i, array) => {
    let abbr = ''
    switch (array.length - i) {
      case 1: abbr = ' тыс. '; break
      case 2: abbr = ' млн. '; break
      case 3: abbr = ' млрд. '; break
      case 4: abbr = ' трлн. '; break
    }
    return acc + abbr + sum
  })
}


const today = dateToString(new Date)

export default function App() {
  const [date, setDate] = useState([today, today]),
  [range, setRange] = useState('d'),
  [data, setData] = useState(mockData)

  useEffect(() => {
    // fetch(`http://shelter.bmsys.net:58600/api/dashboard/cash/?format=json&range=${range}&start=${date[0]}&stop=${date[1]}`)
    console.log(date)
  }, [date, range])

  return <Store.Provider value={{date, setDate, range, setRange, data}}>
    <h1>{data.title}</h1>
    <Calendar/>
    <div>Общая сумма за выбранный период: {formatter(data.resume.sum)}</div>
  </Store.Provider>
}