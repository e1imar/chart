import { createContext, useEffect, useState } from 'react'
import Calendar from './components/calendar'
import { fetchedData } from './types'
import numeral from 'numeral'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import format from 'date-fns/format'
import ru from 'date-fns/locale/ru'

export type IStore = {
  date: [Date, Date]
  setDate: (dates: [Date, Date]) => void
  range: string
  setRange: (range: string) => void
  data: fetchedData | null
}

export const Store = createContext<IStore | null>(null),

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

export default function App() {
  const [date, setDate] = useState<[Date, Date]>([new Date, new Date]),
  [range, setRange] = useState('w-mon'),
  [data, setData] = useState<fetchedData | null>(null),
  sum = data?.resume.sum,
  options = data ? {
    xAxis: {categories: data.result.map(({date}) => {
      switch (range) {
        case 'h': return format(new Date(date), 'dd MMM H:mm', {locale: ru})
        case 'ms': return format(new Date(date), 'MMM y', {locale: ru})
        case 'w-mon': return format(new Date(date), 'wo', {locale: ru}) + ' неделя'

        default: return format(new Date(date), 'dd MMM', {locale: ru})
      }
    })},
    series: [{type: 'column', data: data.result.map(e => e.sum)}]
  } : null

  useEffect(() => {
    fetch(`http://shelter.bmsys.net:58600/api/dashboard/cash/?format=json&range=${range}&start=${format(date[0], 'yyyy-MM-dd')}&stop=${format(date[1], 'yyyy-MM-dd')}`)
    .then(res => res.json())
    .then(setData)
  }, [date, range])

  return <Store.Provider value={{date, setDate, range, setRange, data}}>
    <h1>{data?.title}</h1>
    <Calendar/>
    {sum && <div>Общая сумма за выбранный период: {formatter(sum)}</div>}
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  </Store.Provider>
}