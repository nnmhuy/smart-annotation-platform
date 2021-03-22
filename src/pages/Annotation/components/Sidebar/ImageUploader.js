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

    reader.onloadend = () => {
      setImage({
        file: file,
        imagePreviewUrl: reader.result
      })
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