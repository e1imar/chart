import { useContext } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './index.css'
import { IStore, Store, dateToString } from '../../App';
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
    onChange={value => {
        if (Array.isArray(value) && value[0] && value[1]) setDate([dateToString(value[0]), dateToString(value[1])])
      }
    }
    locale='ru'
    selectRange/>
    <div>
      <button type='button' onClick={() => setDate([dateToString(yesterday), dateToString(yesterday)])}>вчера</button>
      <button type='button' onClick={() => setDate([dateToString(beforeYest), dateToString(beforeYest)])}>позавчера</button>
      <button type='button' onClick={() => setDate([dateToString(bBYest), dateToString(bBYest)])}>2 дня назад</button>
      <button type='button' onClick={() => setDate([dateToString(previousMonday(today)), dateToString(today)])}>текущая неделя</button>
      <button type='button' onClick={() => setDate([dateToString(previousMonday(sub(today, {weeks: 1}))), dateToString(previousSunday(today))])}>Прошлая неделя</button>
      <button type='button' onClick={() => setDate([dateToString(startOfMonth(today)), dateToString(today)])}>текущий месяц</button>
      <button type='button' onClick={() => setDate([dateToString(startOfMonth(monthBefore)), dateToString(lastDayOfMonth(monthBefore))])}>прошлый месяц</button>
      <button type='button' onClick={() => setDate([dateToString(startOfMonth(twoMonthBef)), dateToString(lastDayOfMonth(twoMonthBef))])}>позапрошлый месяц</button>
      <button type='button' onClick={() => setDate([dateToString(startOfQuarter(today)), dateToString(today)])}>текущий квартал</button>
      <button type='button' onClick={() => setDate([dateToString(startOfQuarter(minusQuart)), dateToString(endOfQuarter(minusQuart))])}>прошлый квартал</button>
      <button type='button' onClick={() => setDate([dateToString(startOfYear(today)), dateToString(today)])}>текущий год</button>
      <button type='button' onClick={() => setDate([dateToString(startOfYear(minusYear)), dateToString(endOfYear(minusYear))])}>прошлый год</button>
    </div>
  </div>
}