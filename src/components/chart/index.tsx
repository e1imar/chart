import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import ru from 'date-fns/locale/ru'
import { Range, Result } from '../../types'
import format from 'date-fns/format'
import { IStore } from '../../App'
import 'highcharts/css/themes/dark-unica.css'
import { lastDayOfMonth, lastDayOfWeek } from 'date-fns'

type Props = {
  data: Result[]
  range: Range
  setDate: IStore['setDate']
  setRange: IStore['setRange']
}

const easeOutBounce = (pos: number) => {
  if ((pos) < (1 / 2.75)) {
      return (7.5625 * pos * pos);
  }
  if (pos < (2 / 2.75)) {
      return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
  }
  if (pos < (2.5 / 2.75)) {
      return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
  }
  return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
}

export function Chart({data, range, setDate, setRange}: Props) {
  const options: Highcharts.Options = {
    colors: ['blue'],
    title: {
      text: 'Выручка',
      style: {color: 'rgba(255, 255, 255, 0.87)'}
    },
    subtitle: {style: {color: 'rgba(255, 255, 255, 0.87)'}},
    xAxis: {
      type: 'category',
      labels: {style: {color: '#fff'}}
    },
    legend: {
      enabled: false
    },
    series: [{
      animation: {easing: easeOutBounce},
      type: 'column',
      data: data.map(e => {
        const obj = {
          name: '',
          y: e.sum,
          drilldown: 'true',
          events: {
            click: () => {
              let until, newRange: Range
              switch (range) {
                case 'ms': until = lastDayOfMonth(new Date(e.date)), newRange = 'w-mon'; break
                case 'w-mon': until = lastDayOfWeek(new Date(e.date), {locale: ru}), newRange = 'd'; break
                default: until = new Date(e.date), newRange = 'h'
              }
              setDate([new Date(e.date), until])
              setRange(newRange)
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
      // events: {
      //   drilldown: function (e) {
      //     if (!e.seriesOptions) {

      //       const chart = this,
      //       drilldowns = {
      //         Animals: {
      //           name: 'Animals',
      //           data: [
      //             ['Cows', 2],
      //             ['Sheep', 3]
      //           ]
      //         },
      //         Fruits: {
      //           name: 'Fruits',
      //           data: [
      //             ['Apples', 5],
      //             ['Oranges', 7],
      //             ['Bananas', 2]
      //           ]
      //         },
      //         Cars: {
      //           name: 'Cars',
      //           data: [
      //             ['Toyota', 1],
      //             ['Volkswagen', 2],
      //             ['Opel', 5]
      //           ]
      //         }
      //       }
      //       series = drilldowns[e.point.name];

      //       // Show the loading label
      //       chart.showLoading('Simulating Ajax ...');

      //       setTimeout(function () {
      //         chart.hideLoading();
      //         chart.addSeriesAsDrilldown(e.point, series);
      //         chart.
      //       }, 1000);
      //     }
      //   }
      // }
    },
  }

  return <HighchartsReact
    highcharts={Highcharts}
    options={options}
  />
}