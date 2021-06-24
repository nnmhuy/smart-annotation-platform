import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
  }
}))

const ImageUploader = (props) => {
  const classes = useStyles()
  const { stageSize, setImage } = props

  const handleChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    // reader.onloadend = () => {
    //   setImage({
    //     file: file,
    //     imagePreviewUrl: reader.result
    //   })
    // }
    
    let resizedImage

    reader.onload = function (readerEvent) {
      let image = new Image();
      image.onload = function (imageEvent) {
        // Resize the image
        let canvas = document.createElement('canvas'),
            width = image.width,
            height = image.height;
        let { width: maxWidth, height: maxHeight } = stageSize
        // padding
        maxWidth -= 50
        maxHeight -= 50

        if ((width / height) > (maxWidth / maxHeight)) {
          height *= maxWidth / width;
          width = maxWidth;
        } else {
          width *= maxHeight / height;
          height = maxHeight;
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        resizedImage = canvas.toDataURL('image/jpeg');
        setImage({
          resizedImg: resizedImage,
          resizedImageSize: {
            width,
            height,
          },
          img: image.src,
          imgSize: {
            width: image.width,
            height: image.height,
          }
        })
      }

      image.src = readerEvent.target.result;
    }


    reader.readAsDataURL(file)
  }

  return (
    <div className={classes.container}>
      <label htmlFor="img">Select image:</label>
      <input type="file" id="img" name="img" accept="image/*" onChange={handleChange}/>
    </div>
  )
}

export default ImageUploader