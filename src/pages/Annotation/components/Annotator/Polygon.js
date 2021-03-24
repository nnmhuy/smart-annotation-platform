import React from 'react'
import { Group, Line, Circle } from 'react-konva'

const Polygon = (props) => {
  const { 
    polygon, currentMousePos, 
    isDrawing, isCutting,
    isSelected, onSelect,
    setIsMouseOverPolygonStart, onChange,
    setCuttingPolygon, setIsMouseOverPolygonCutStart,
  } = props

  const groupRef = React.useRef(null)
  const { id, points, holes, ...others } = polygon
  const [draggingIndex, setDraggingIndex] = React.useState(null)

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
    const index = event.target.index - 1;

    if (!draggingIndex) {
      setDraggingIndex(index)
    }
  }

  const handleDragMovePoint = event => {
    const index = event.target.index - 1;
    if (index !== draggingIndex) { // prevent dragging 2 near points
      return
    }
    const pos = [event.target.attrs.x, event.target.attrs.y];
    onChange({
      ...polygon,
      points: [...points.slice(0, index), pos, ...points.slice(index + 1)],
    })
  }

  const handleDragOutPoint = event => {
    console.log("end", event);
    setDraggingIndex(null)
  }

  const onDragStart = event => {
  }

  const onDragMove = event => {
    onChange({
      ...polygon,
      x: event.target.x(),
      y: event.target.y()
    })
  }

  const onDragEnd = event => {
    onChange({
      ...polygon,
      points: polygon.points.map(p => [p[0] + polygon.x, p[1] + polygon.y]),
      holes: holes.map(hole => hole.map(p => [p[0] + polygon.x, p[1] + polygon.y])),
      x: 0,
      y: 0
    })
    if (isCutting) {
      setCuttingPolygon(holes[holes.length - 1].map(p => [p[0] + polygon.x, p[1] + polygon.y]))
    }
  }

  const handleMouseOverCutStartPoint = event => {
    setIsMouseOverPolygonCutStart(true)
  }

  const handleMouseOutCutStartPoint = event => {
    setIsMouseOverPolygonCutStart(false)
  }

  return (
    <Group
      ref={groupRef}
      id={id}
    >
      <Line
        id={id}
        points={flattenedPoints}
        closed={true}
        onClick={onSelect}
        onTap={onSelect}
        draggable={isSelected}
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        {...others}
      />
      {(isDrawing || isSelected) && 
        points.map((point, index) => {
          const x = point[0];
          const y = point[1];
          const scale = (groupRef && groupRef.current) ? groupRef.current.getStage().scaleX() : 1
          const startPointAttr =
            (index === 0 && isDrawing)
              ? {
                hitStrokeWidth: 6,
                onMouseOver: handleMouseOverStartPoint,
                onMouseOut: handleMouseOutStartPoint,
                fill: "red"
              }
              : null;
          return (
            <Circle
              key = {`poly-${id}-${index}`}
              x = {x + polygon.x}
              y = {y + polygon.y}
              radius={5 / scale}
              fill="white"
              stroke="black"
              strokeWidth={2}
              onDragStart={handleDragStartPoint}
              onDragMove={handleDragMovePoint}
              onDragEnd={handleDragOutPoint}
              draggable={isSelected}
              {...startPointAttr}
            />
          );
        }
      )}
      {holes.map((holePoints, holeIndex) => {
        const holeFlattenedPoints = holePoints
          .concat((isCutting && holeIndex === holes.length - 1) ? [currentMousePos.x + polygon.x, currentMousePos.y + polygon.y] : [])
          .reduce((a, b) => a.concat(b), [])
        let filledHoleFlattenedPoints = holeFlattenedPoints
        if (filledHoleFlattenedPoints.length) {
          filledHoleFlattenedPoints = [...filledHoleFlattenedPoints, holeFlattenedPoints[0], holeFlattenedPoints[1]]
        }
        return (
          <>
            <Line
              points={filledHoleFlattenedPoints}
              id={id}
              {...others}
            />
            <Line
              closed={true}
              points={holeFlattenedPoints}
              fill="white"
              globalCompositeOperation='destination-out'
              id={id}
              {...others}
            />
            {(isSelected || isCutting) &&
              holePoints.map((point, index) => {
                const x = point[0];
                const y = point[1];
                const scale = (groupRef && groupRef.current) ? groupRef.current.getStage().scaleX() : 1
                const startPointAttr =
                  (index === 0 && isCutting && holeIndex === holes.length - 1)
                    ? {
                      hitStrokeWidth: 6,
                      onMouseOver: handleMouseOverCutStartPoint,
                      onMouseOut: handleMouseOutCutStartPoint,
                      fill: "red"
                    }
                    : null;
                return (
                  <Circle
                    key={`poly-${id}-${holeIndex}-${index}`}
                    x={x + polygon.x}
                    y={y + polygon.y}
                    radius={5 / scale}
                    fill="white"
                    stroke="black"
                    strokeWidth={2}
                    onDragStart={handleDragStartPoint}
                    onDragMove={handleDragMovePoint}
                    onDragEnd={handleDragOutPoint}
                    draggable={isSelected}
                    {...startPointAttr}
                  />
                );
              }
              )}
          </>
        )
      })
      }
    </Group>
  )
}

export default Polygon