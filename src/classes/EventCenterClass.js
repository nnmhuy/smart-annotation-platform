import { Subject } from 'rxjs';

class EventCenter {
  constructor() {
    this.subjects = []
  }

  getSubjects = () => {
    return this.subjects
  }

  getSubject = (subjectName) => {
    if (!(subjectName in this.subjects)) {
      let newSubject = new Subject()

      this.subjects[subjectName] = newSubject
    }
    return this.subjects[subjectName]
  }
}

export default EventCenter