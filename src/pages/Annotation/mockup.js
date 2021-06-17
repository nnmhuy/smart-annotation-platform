import LabelClass from "../../classes/LabelClass"

const mockupLabels = [
  new LabelClass(1, 'Cat', { isHidden: true, color: 'red' }),
  new LabelClass(2, 'Dog', { isHidden: false, color: 'blue' }),
]

export {
  mockupLabels,
}