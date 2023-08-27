import { createContext, useEffect, useState } from 'react'
import Calendar from './components/calendar'
import { Range, fetchedData } from './types'
import numeral from 'numeral'
import format from 'date-fns/format'
import { Chart } from './components/chart'
import Select from 'react-select'

export type IStore = {
  date: [Date, Date]
  setDate: (dates: [Date, Date]) => void
  range: Range
  setRange: (range: 'd' | 'h' | 'ms' | 'w-mon') => void
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
},

rangeOptions = [
  { value: 'h' as Range, label: 'Час' },
  { value: 'd' as Range, label: 'День' },
  { value: 'w-mon' as Range, label: 'Неделя' },
  { value: 'ms' as Range, label: 'Месяц' }
]

export default function App() {
  const [date, setDate] = useState<[Date, Date]>([new Date, new Date]),
  [range, setRange] = useState<Range>('d'),
  [data, setData] = useState<fetchedData | null>(null),
  [selectedOption] = useState(rangeOptions[1]),
  sum = data?.resume.sum

  useEffect(() => {
    fetch(`http://shelter.bmsys.net:58600/api/dashboard/cash/?format=json&range=${range}&start=${format(date[0], 'yyyy-MM-dd')}&stop=${format(date[1], 'yyyy-MM-dd')}`)
    .then(res => res.json())
    .then(setData)
  }, [date, range])

  return <Store.Provider value={{date, setDate, range, setRange, data}}>
    <div style={{display: 'flex', flexWrap: 'wrap'}}>
      <Calendar/>
      <div style={{margin: '10px', marginRight: '30px'}}>
        Разделение по времени:
        <Select
        options={rangeOptions}
        defaultValue={selectedOption}
        onChange={e => e?.value && setRange(e.value)}/>
      </div>
    </div>
    {sum && <div style={{color: '#fff'}}>Общая сумма за выбранный период: {formatter(sum)}</div>}
    <Chart data={data?.result ?? []} range={range} setDate={setDate}/>
  </Store.Provider>
}