import get from 'lodash.get'
import template from './Form.tpl.html'
import { bindEvents, updateProps } from 'radar/utils/dom'
import { htmlToElement } from 'lib/utils/dom'

const MAX_ROWS = 8
const MIN_ROWS = 3

const EVENTS_NAMESPACE = 'FORM'

export const EVENTS = {
  ADD_ROW: `${EVENTS_NAMESPACE}/ADD_ROW`,
  REMOVE_ROW: `${EVENTS_NAMESPACE}/REMOVE_ROW`,
  DATA_CHANGE: `${EVENTS_NAMESPACE}/DATA_CHANGE`,
  RESET: `${EVENTS_NAMESPACE}/RESET`
}

const extractSeries = element => {
  return Array.from(element.querySelectorAll('[data-series-input]')).map(
    input => input.value
  )
}
class Form extends HTMLElement {
  constructor () {
    super()
    this.rowContainer = undefined
    this.updateProps = this.updateProps.bind(this)
  }

  static get observedAttributes () {
    return ['data']
  }

  get addButtonDisabled () {
    const dataset = get(this.data, 'dataset', [])
    return dataset.length >= MAX_ROWS
  }

  get removeButtonDisabled () {
    const dataset = get(this.data, 'dataset', [])
    return dataset.length <= MIN_ROWS
  }

  get data () {
    if (!this.hasAttribute('data')) {
      return
    }

    return JSON.parse(this.getAttribute('data'))
  }

  set data (obj) {
    this.setAttribute('data', JSON.stringify(obj))
  }

  onAddClick () {
    const dataset = get(this.data, 'dataset', [])
    if (dataset.length < MAX_ROWS) {
      const event = new window.CustomEvent(EVENTS.ADD_ROW, { bubbles: true })
      this.dispatchEvent(event)
    }
  }

  onRemoveClick () {
    const dataset = get(this.data, 'dataset', [])
    if (dataset.length > MIN_ROWS) {
      const event = new window.CustomEvent(EVENTS.REMOVE_ROW, {
        bubbles: true
      })
      this.dispatchEvent(event)
    }
  }

  onResetClick () {
    const event = new window.CustomEvent(EVENTS.RESET, { bubbles: true })
    this.dispatchEvent(event)
  }

  onSeriesChange () {
    const newData = {
      ...this.data,
      series: extractSeries(this)
    }

    this.dispatchDataChange(newData)
  }

  onDatasetChange ({ detail }) {
    const newData = {
      ...this.data,
      dataset: detail
    }

    this.dispatchDataChange(newData)
  }

  dispatchDataChange (data) {
    const event = new window.CustomEvent(EVENTS.DATA_CHANGE, {
      detail: data,
      bubbles: true
    })

    this.dispatchEvent(event)
  }

  updateProps () {
    updateProps(this)
    const seriesInput = this.querySelectorAll('[data-series-input]')
    const series = get(this.data, 'series', [])
    series.forEach((serie, index) => {
      seriesInput[index].value = serie
    })
  }

  render () {
    const main = htmlToElement(template)
    const { data } = this
    if (!data) {
      return
    }

    this.appendChild(main)

    bindEvents(main, this, 'click', 'dataset-change', 'input')
    this.updateProps()

    this.rowContainer = this.querySelector('app-form-row-container')
  }

  connectedCallback () {
    this.render()
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (!this.data) {
      return
    }

    if (this.rowContainer) {
      return window.requestAnimationFrame(() => {
        this.updateProps()
      })
    }

    this.render()
  }
}

export default Form
