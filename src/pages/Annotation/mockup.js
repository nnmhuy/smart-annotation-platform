import LabelClass from "../../classes/LabelClass"

import Image_1 from '../../static/images/mockup/Image_1.jpg'
import Image_2 from '../../static/images/mockup/Image_2.jpg'
import Image_3 from '../../static/images/mockup/Image_3.jpg'
import Image_4 from '../../static/images/mockup/Image_4.jpg'
import Image_5 from '../../static/images/mockup/Image_5.jpg'
import Image_6 from '../../static/images/mockup/Image_6.jpg'
import Image_7 from '../../static/images/mockup/Image_7.jpg'
import Image_8 from '../../static/images/mockup/Image_8.jpg'
import Image_9 from '../../static/images/mockup/Image_9.jpg'
import Image_10 from '../../static/images/mockup/Image_10.jpg'

const mockupLabels = [
  new LabelClass(1, 'Cat', { isHidden: true }, { fill: 'red' }),
  new LabelClass(2, 'Dog', { isHidden: false}, { fill: 'blue' }),
]

const mockupImageList = [
  {
    id: 0,
    imageURL: Image_1,
    thumbnailURL: Image_1,
  },
  {
    id: 1,
    imageURL: Image_2,
    thumbnailURL: Image_2,
  },
  {
    id: 2,
    imageURL: Image_3,
    thumbnailURL: Image_3,
  },
  {
    id: 3,
    imageURL: Image_4,
    thumbnailURL: Image_4,
  },
  {
    id: 4,
    imageURL: Image_5,
    thumbnailURL: Image_5,
  },
  {
    id: 5,
    imageURL: Image_6,
    thumbnailURL: Image_6,
  },
  {
    id: 6,
    imageURL: Image_7,
    thumbnailURL: Image_7,
  },
  {
    id: 7,
    imageURL: Image_8,
    thumbnailURL: Image_8,
  },
  {
    id: 8,
    imageURL: Image_9,
    thumbnailURL: Image_9,
  },
  {
    id: 9,
    imageURL: Image_10,
    thumbnailURL: Image_10,
  },
]

export {
  mockupLabels,
  mockupImageList,
}