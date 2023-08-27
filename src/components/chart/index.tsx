import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import ru from 'date-fns/locale/ru'
import { Range, Result } from '../../types'
import format from 'date-fns/format'
// import { useRef } from 'react'
import { IStore } from '../../App'

type Props = {
  data: Result[]
  range: Range
  setDate: IStore['setDate']
  setRange: IStore['setRange']
}

export function Chart({data, range, setDate, setRange}: Props) {
  // const chartComponentRef = useRef<HighchartsReact.RefObject>(null),
  const options: Highcharts.Options = {
    title: {text: 'Выручка'},
    // xAxis: {categories: data.map(({date}) => {
    //   switch (range) {
    //     case 'h': return format(new Date(date), 'dd MMM H:mm', {locale: ru})
    //     case 'ms': return format(new Date(date), 'MMM y', {locale: ru})
    //     case 'w-mon': return format(new Date(date), 'wo', {locale: ru}) + ' неделя'

    //     default: return format(new Date(date), 'dd MMM', {locale: ru})
    //   }
    // })},
    xAxis: {type: 'category'},
    legend: {
      enabled: false
    },
    series: [{
      type: 'column',
      data: data.map(e => {
        const obj = {
          name: '',
          y: e.sum,
          drilldown: 'true',
          events: {
            click: () => {
              setDate([new Date(e.date), new Date(e.date)])
            }
          }
        }
        switch (range) {
          case 'h': obj.name = format(new Date(e.date), 'dd MMM H:mm', {locale: ru}); break
          case 'ms': obj.name = format(new Date(e.date), 'MMM y', {locale: ru}); break
          case 'w-mon': obj.name = format(new Date(e.date), 'wo', {locale: ru}) + ' неделя'; break
  
          default: obj.name = format(new Date(e.date), 'dd MMM', {locale: ru})
        }
        return obj
      }),
      colorByPoint: true,
    }],
    drilldown: {
        series: []
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true
            }
        }
    },
    chart: {
      type: 'column',
      events: {
        drilldown: function (e) {
          if (!e.seriesOptions) {

            const chart = this,
            drilldowns = {
              Animals: {
                name: 'Animals',
                data: [
                  ['Cows', 2],
                  ['Sheep', 3]
                ]
              },
              Fruits: {
                name: 'Fruits',
                data: [
                  ['Apples', 5],
                  ['Oranges', 7],
                  ['Bananas', 2]
                ]
              },
              Cars: {
                name: 'Cars',
                data: [
                  ['Toyota', 1],
                  ['Volkswagen', 2],
                  ['Opel', 5]
                ]
              }
            }
            // series = drilldowns[e.point.name];

            // Show the loading label
            chart.showLoading('Simulating Ajax ...');

            // setTimeout(function () {
            //   chart.hideLoading();
            //   chart.addSeriesAsDrilldown(e.point, series);
            //   chart.
            // }, 1000);
          }
        }
      }
    },
  }

  return <HighchartsReact
    highcharts={Highcharts}
    options={options}
    // ref={chartComponentRef}
  />
}