import LabelClass from "../../classes/LabelClass"

const mockupLabels = [
  new LabelClass(1, 'Cat', { isHidden: true }, { fill: 'red' }),
  new LabelClass(2, 'Dog', { isHidden: false}, { fill: 'blue' }),
]

export {
  mockupLabels,
}