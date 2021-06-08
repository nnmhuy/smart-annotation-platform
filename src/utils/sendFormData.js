import RestConnector from '../connectors/RestConnector'

const sendFormData = async (objectData, url) => {
  const formData = new FormData();
  Object.keys(objectData).forEach(key => {
    formData.append(key, objectData[key])
  })

  try {
    const { data: response } = await RestConnector.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  } catch (error) {
    return null
  }
}

export default sendFormData