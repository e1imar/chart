import { createContext, useEffect, useState } from 'react'
import Calendar from './components/calendar'
import { Range, fetchedData } from './types'
import numeral from 'numeral'
import format from 'date-fns/format'
import { Chart } from './components/chart'
import Select from 'react-select'
import Toggle from './components/toggle'

export type IStore = {
  date: [Date, Date]
  setDate: (dates: [Date, Date]) => void
  range: Range
  setRange: (range: Range) => void
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
  sum = data?.resume.sum
  let selectedOption
  
  switch (range) {
    case 'h': selectedOption = rangeOptions[0]; break
    case 'd': selectedOption = rangeOptions[1]; break
    case 'w-mon': selectedOption = rangeOptions[2]; break
    case 'ms': selectedOption = rangeOptions[3]; break
  }

  useEffect(() => {
    fetch(`http://shelter.bmsys.net:58600/api/dashboard/cash/?format=json&range=${range}&start=${format(date[0], 'yyyy-MM-dd')}&stop=${format(date[1], 'yyyy-MM-dd')}`)
    .then(res => res.json())
    .then(setData)
  }, [date, range])

  return <Store.Provider value={{date, setDate, range, setRange, data}}>
    <div style={{display: 'flex', flexWrap: 'wrap', marginBottom: '10px'}}>
      <Calendar/>
      <div style={{marginRight: '50px'}}>
        Разделение по времени:
        <div style={{color: '#000', marginTop: '5px'}}>
          <Select
          value={selectedOption}
          options={rangeOptions}
          onChange={e => e?.value && setRange(e.value)}/>
        </div>
      </div>
      <div style={{margin: '10px', position: 'absolute', top: 0, right: 0}}><Toggle/></div>
    </div>
    {sum && <div style={{marginBottom: '10px'}}>Общая сумма за период с {date[0].toLocaleString()} по {date[1].toLocaleString()}: <span style={{fontWeight: 'bold'}}>{formatter(sum)}</span></div>}
    <Chart data={data?.result ?? []} range={range} setDate={setDate} setRange={setRange}/>
  </Store.Provider>
}