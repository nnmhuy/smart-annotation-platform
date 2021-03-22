import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  container: {
    
  }
}))

const ImageUploader = (props) => {
  const { setImage } = props

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
          max_size = 500,
          width = image.width,
          height = image.height;
        if (width > height) {
          if (width > max_size) {
            height *= max_size / width;
            width = max_size;
          }
        } else {
          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        resizedImage = canvas.toDataURL('image/jpeg');
        setImage({
          resizedImg: resizedImage,
          img: image.src
        })
      }

      image.src = readerEvent.target.result;
    }


    reader.readAsDataURL(file)
  }

  return (
    <div>
      <label htmlFor="img">Select image:</label>
      <input type="file" id="img" name="img" accept="image/*" onChange={handleChange}/>
    </div>
  )
}

export default ImageUploader