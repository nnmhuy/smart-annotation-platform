import React from 'react'
import { Line, Rect } from 'react-konva'

const Polygon = (props) => {
  const { 
    polygon, currentMousePos, 
    isDrawing, 
    isSelected, onSelect,
    setIsMouseOverPolygonStart, onChange 
  } = props

  const [dragStartPos, setDragStartPos] = React.useState(null)

  const { points, ...others } = polygon

  const isFinished = !!!isDrawing
  const flattenedPoints = points
    .concat(isFinished ? [] : [currentMousePos.x, currentMousePos.y])
    .reduce((a, b) => a.concat(b), [])

  const handleMouseOverStartPoint = event => {
    if (isFinished || points.length < 3) return;
    event.target.scale({ x: 2, y: 2 });
    setIsMouseOverPolygonStart(true)
  }
  
  const handleMouseOutStartPoint = event => {
    event.target.scale({ x: 1, y: 1 });
    setIsMouseOverPolygonStart(false)
  }

  const handleDragStartPoint = event => {
    console.log("start", event);
  }

  const handleDragMovePoint = event => {
    const index = event.target.index - 1;
    const pos = [event.target.attrs.x, event.target.attrs.y];
    onChange({
      ...polygon,
      points: [...points.slice(0, index), pos, ...points.slice(index + 1)]
    })
  }

  const handleDragOutPoint = event => {
    console.log("end", event);
  }

  const onDragStart = event => {
    const pos = [event.target.x(), event.target.y()];
    setDragStartPos(pos)
  }

  const onDragMove = event => {
    onChange({
      ...polygon,
      x: event.target.x(),
      y: event.target.y()
    })
  }

  const onDragEnd = event => {
    setDragStartPos(null)
    onChange({
      ...polygon,
      points: polygon.points.map(p => [p[0] + polygon.x, p[1] + polygon.y]),
      x: 0,
      y: 0
    })
  }

  return (
    <>
      <Line
        points={flattenedPoints}
        // closed={isFinished}
        closed={true}
        onClick={onSelect}
        onTap={onSelect}
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        draggable={isSelected}
        {...others}
      />
      {(isDrawing || isSelected) && 
        points.map((point, index) => {
          const width = 6;
          const x = point[0] - width / 2;
          const y = point[1] - width / 2;
          const startPointAttr =
            (index === 0 && isDrawing)
              ? {
                hitStrokeWidth: 12,
                onMouseOver: handleMouseOverStartPoint,
                onMouseOut: handleMouseOutStartPoint,
                fill: "red"
              }
              : null;
          return (
            <Rect
              key={index}
              x={x + polygon.x}
              y={y + polygon.y}
              width={width}
              height={width}
              fill="white"
              stroke="black"
              strokeWidth={3}
              onDragStart={handleDragStartPoint}
              onDragMove={handleDragMovePoint}
              onDragEnd={handleDragOutPoint}
              draggable
              {...startPointAttr}
            />
          );
        }
      )}
    </>
  )
}

export default Polygon