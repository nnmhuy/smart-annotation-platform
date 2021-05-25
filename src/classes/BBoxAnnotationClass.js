import Annotation from "./AnnotationClass";

export default class BboxAnnotation extends Annotation {
    constructor(annotationId, labelId, imageId, bbox) {
        super(annotationId, labelId, imageId)
        this.bbox = bbox
    }
    updateLabel = (labelId) => {
        this.labelId = labelId
    }
    updateBbox = (bbox) => {
        this.bbox = bbox
    }
}