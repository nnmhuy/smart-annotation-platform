import React from 'react'
import { Group, Rect, Transformer } from 'react-konva';


const Rectangle = ({ shapeProps, isSelected, onSelect, onChange, isDraggingViewport }) => {
  const { id } = shapeProps

  const groupRef = React.useRef(null);
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleSelect = () => {
    groupRef.current.moveToTop()
    onSelect()
  }
  
  return (
    <Group
      id={id}
      ref={groupRef}
    >
      <Rect
        onClick={handleSelect}
        onTap={handleSelect}
        ref={shapeRef}
        strokeScaleEnabled={false}
        {...shapeProps}
        draggable={isSelected}
        onDragEnd={(e) => {
          if (onChange) {
            onChange({
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            });
          }
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          if (onChange) {
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              // set minimal value
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY),
            });
          }
        }}
        hitFunc={isDraggingViewport && function (context) {
          // disable hitFunc while dragging viewport
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
          hitFunc={isDraggingViewport && function (context) {
            // disable hitFunc while dragging viewport
          }}
        />
      )}
    </Group>
  );
};

export default Rectangle