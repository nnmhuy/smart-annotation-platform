import { ANNOTATION_TYPE } from "../pages/Annotation/constants";
import Annotation from "./AnnotationClass";

export default class BboxAnnotation extends Annotation {
    constructor(annotationId, labelId, imageId, bbox) {
        super(annotationId, labelId, imageId)
        this.type = ANNOTATION_TYPE.BBOX
        this.bbox = bbox
    }
    updateLabel = (labelId) => {
        this.labelId = labelId
    }
    updateBbox = (bbox) => {
        this.bbox = bbox
    }
}