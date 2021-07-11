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

  updateProject(newProject) {
    return RestConnector.put(`/projects`, {
      id: newProject.id,
      name: newProject.name,
      description: newProject.description,
    }).then(response => {
      return ProjectClass.constructorFromServerData(response.data)
    })
  }

  deleteProjectById(id) {
    return RestConnector.delete(`/projects?id=${id}`)
      .then((response) => {
        return response.data
      })
  }
}

export default new ProjectService()