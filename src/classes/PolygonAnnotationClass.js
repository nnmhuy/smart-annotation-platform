import Annotation from "./AnnotationClass";

export default class PolygonAnnotation extends Annotation {
    constructor(annotationId, labelId, imageId, polys) {
        super(annotationId, labelId, imageId)
        this.polys = polys
    }
    updateLabel = (labelId) => {
        this.labelId = labelId
    }
    updatePolys = (polys) => {
        this.polys = polys
    }
}