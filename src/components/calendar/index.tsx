import { useContext } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './index.css'
import { IStore, Store,  } from '../../App';
import {
  previousMonday,
  previousSunday,
  startOfMonth,
  lastDayOfMonth, 
  startOfQuarter,
  subQuarters,
  endOfQuarter,
  startOfYear,
  endOfYear,
  sub
} from 'date-fns';

export default function CalendarContainer() {
  const {date, setDate} = useContext(Store) as IStore,
  today = new Date,
  monthBefore = sub(today, {months: 1}),
  twoMonthBef = sub(today, {months: 2}),
  minusQuart = subQuarters(today, 1),
  minusYear = sub(today, {years: 1}),
  yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000),
  beforeYest = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  bBYest = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  
  return <div>
    <Calendar
    value={date}
    onChange={value => {
        if (Array.isArray(value) && value[0] && value[1]) setDate([value[0], (value[1])])
      }
    }
    locale='ru'
    selectRange/>
    <div>
      <button type='button' onClick={() => setDate([yesterday, yesterday])}>вчера</button>
      <button type='button' onClick={() => setDate([beforeYest, beforeYest])}>позавчера</button>
      <button type='button' onClick={() => setDate([bBYest, bBYest])}>2 дня назад</button>
      <button type='button' onClick={() => setDate([previousMonday(today), today])}>текущая неделя</button>
      <button type='button' onClick={() => setDate([previousMonday(sub(today, {weeks: 1})), previousSunday(today)])}>Прошлая неделя</button>
      <button type='button' onClick={() => setDate([startOfMonth(today), today])}>текущий месяц</button>
      <button type='button' onClick={() => setDate([startOfMonth(monthBefore), lastDayOfMonth(monthBefore)])}>прошлый месяц</button>
      <button type='button' onClick={() => setDate([startOfMonth(twoMonthBef), lastDayOfMonth(twoMonthBef)])}>позапрошлый месяц</button>
      <button type='button' onClick={() => setDate([startOfQuarter(today), today])}>текущий квартал</button>
      <button type='button' onClick={() => setDate([startOfQuarter(minusQuart), endOfQuarter(minusQuart)])}>прошлый квартал</button>
      <button type='button' onClick={() => setDate([startOfYear(today), today])}>текущий год</button>
      <button type='button' onClick={() => setDate([startOfYear(minusYear), endOfYear(minusYear)])}>прошлый год</button>
    </div>
  </div>
}