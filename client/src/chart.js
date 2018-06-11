import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export const Chart = (props) => (
  <HighchartsReact
    highcharts={Highcharts}
    options={props.options}
  />
)


