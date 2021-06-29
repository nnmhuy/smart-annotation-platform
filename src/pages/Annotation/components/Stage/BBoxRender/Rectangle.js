import React from 'react'
import { Group, Rect, Transformer } from 'react-konva';

import { EVENT_TYPES } from '../../../constants'

const emittingSubjects = [
  EVENT_TYPES.SELECT_ANNOTATION,
  EVENT_TYPES.EDIT_ANNOTATION,
]

const Rectangle = (props) => {
  const { useStore, eventCenter, id, bBox, properties, } = props
  const editingAnnotationId = useStore(state => state.editingAnnotationId)

  const groupRef = React.useRef(null);
  const rectRef = React.useRef();
  const trRef = React.useRef();

  const isSelected = (id === editingAnnotationId)

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([rectRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleSelect = (e) => {
    groupRef.current.moveToTop()
    eventCenter.emitEvent(EVENT_TYPES.SELECT_ANNOTATION)({
      e,
      id
    })
  }

  const handleContextMenu = (e) => {
    eventCenter.emitEvent(EVENT_TYPES.CONTEXT_MENU_ANNOTATION)({
      e,
      id
    })
  }

  React.useEffect(() => {
    const { getSubject } = eventCenter
    let initializingObservingSubjects = {}
    emittingSubjects.forEach(subject => {
      initializingObservingSubjects[subject] = getSubject(subject)
    })

    return () => {
    }
  }, [])

  return (
    <Group
      id={id}
      ref={groupRef}
    >
      <Rect
        onClick={handleSelect}
        onTap={handleSelect}
        onContextMenu={handleContextMenu}
        ref={rectRef}
        strokeScaleEnabled={false}
        {...bBox}
        {...properties}
        opacity={isSelected ? properties.opacity + 0.2 : properties.opacity}
        draggable={isSelected}
        onDragEnd={(e) => {
          eventCenter.emitEvent(EVENT_TYPES.EDIT_ANNOTATION)({
            x: e.target.x(),
            y: e.target.y(),
          })
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = rectRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          eventCenter.emitEvent(EVENT_TYPES.EDIT_ANNOTATION)({
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          })
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          keepRatio={false}
          ignoreStroke={true}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </Group>
  );
};

export default Rectangle