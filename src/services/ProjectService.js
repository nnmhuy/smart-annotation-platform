import RestConnector from '../connectors/RestConnector'

import ProjectClass from '../classes/ProjectClass'

class ProjectService {
  createProject(data) {
    return RestConnector.post(`/projects`, {
      name: data.name,
      description: data.description,
    })
      .then(response => {
        return ProjectClass.constructorFromServerData(response.data)
      })
  }
}

export default new ProjectService()