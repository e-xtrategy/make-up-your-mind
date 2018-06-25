import { createRect, createText } from 'radar/utils/svg'
import { flatten } from 'radar/utils/array'
const BLOCK_WIDTH = 50
const BLOCK_SPACING = 50
const TEXT_SPACING = 80

const getColor = (colors, index) => {
  return colors[index % colors.length]
}

export default ({ series, colors }) => {
  if (!series.length) {
    return
  }

  const items = series.map((label, index) => {
    const block = createRect({
      x: BLOCK_SPACING + index * (BLOCK_SPACING + BLOCK_WIDTH + TEXT_SPACING),
      y: 0,
      width: BLOCK_WIDTH,
      height: BLOCK_WIDTH,
      color: getColor(colors, index),
      attrs: {
        'semi-trasparent': true
      }
    })

    const text = createText({
      text: label,
      x: parseInt(block.getAttribute('x')) + TEXT_SPACING,
      y: BLOCK_WIDTH / 2,
      attrs: {
        class: 'legend',
        'alignment-baseline': 'middle',
        'text-anchor': 'start'
      }
    })

    return [block, text]
  })

  return flatten(items)
}
