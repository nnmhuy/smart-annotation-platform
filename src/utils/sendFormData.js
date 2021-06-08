import RestConnector from '../connectors/RestConnector'

const sendFormData = async (objectData, url) => {
  const formData = new FormData();
  Object.keys(objectData).forEach(key => {
    if (objectData[key]) {
      formData.append(key, objectData[key])
    }
  })

  try {
    const { data: response } = await RestConnector.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log(response)
    return response
  } catch (error) {
    throw error
  }
}

export default sendFormData