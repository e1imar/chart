import { createContext, useEffect, useState } from 'react'
import Calendar from './components/calendar'
import mockData from './mockData.json'
import { fetchedData } from './types'
import numeral from 'numeral'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import format from 'date-fns/format'
import ru from 'date-fns/locale/ru'

export type IStore = {
  date: string[]
  setDate: (dates: string[]) => void
  range: string
  setRange: (range: string) => void
  data: fetchedData
}

export const Store = createContext<IStore | null>(null),

dateToString = (date: Date) => format(date, 'yyyy-MM-dd'),

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
  [data, setData] = useState(mockData),
  options = {
    xAxis: {categories: data.result.map(({date}) => {
      switch (range) {
        case 'h': return format(new Date(date), 'dd MMM H:mm', {locale: ru})
        case 'ms': return format(new Date(date), 'MMM y', {locale: ru})
        case 'w-mon': return format(new Date(date), 'wo', {locale: ru}) + ' неделя'

        default: return format(new Date(date), 'dd MMM', {locale: ru})
      }
    })},
    series: [{type: 'column', data: data.result.map(e => e.sum)}]
  }

  useEffect(() => {
    // fetch(`http://shelter.bmsys.net:58600/api/dashboard/cash/?format=json&range=${range}&start=${date[0]}&stop=${date[1]}`)
    console.log(date)
  }, [date, range])

  return <Store.Provider value={{date, setDate, range, setRange, data}}>
    <h1>{data.title}</h1>
    <Calendar/>
    <div>Общая сумма за выбранный период: {formatter(data.resume.sum)}</div>
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  </Store.Provider>
}