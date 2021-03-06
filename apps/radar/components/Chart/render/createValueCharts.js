import createChartValuesPoints from '../model/createChartValuesPoints'
import { createPath } from 'radar/utils/svg'

const getColor = (colors, index) => {
  return colors[index % colors.length]
}

const extractSeriesFromData = data => Object.keys(data[0].values)

const extractValuesFromData = (data, serie) => {
  return data.map(dataRow => dataRow.values[serie])
}

const createValueChart = ({ values, radius, color }) => {
  const point = createChartValuesPoints({ values, radius })
  return createPath(point, {
    'semi-trasparent': true,
    fill: color,
    stroke: color
  })
}

const createValueCharts = ({ dataset, radius, colors }) => {
  const series = extractSeriesFromData(dataset)
  const seriesValues = series.map(serie =>
    extractValuesFromData(dataset, serie)
  )
  return seriesValues.map((values, index) =>
    createValueChart({ values, radius, color: getColor(colors, index) })
  )
}

export default createValueCharts
