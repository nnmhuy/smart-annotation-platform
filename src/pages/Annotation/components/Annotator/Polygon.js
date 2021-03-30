import React from 'react'
import { Group, Line, Circle } from 'react-konva'

import { getDistancePointAndPoint } from '../../../../helpers/getDistance'

const Polygon = (props) => {
  const { 
    polygon, currentMousePos, cutMousePos,
    isDrawing, isCutting,
    isSelected, onSelect,
    isMouseOverPolygonStart, setIsMouseOverPolygonStart, 
    onChange,
    setCuttingPolygon,
  } = props

  const groupRef = React.useRef(null)
  const { id, polys, ...others } = polygon
  const [draggingKey, setDraggingKey] = React.useState(null)

  const handleMouseOverStartPoint = (event, polyIndex) => {
    if (polys[polyIndex].length < 3) return;
    event.target.scale({ x: 2, y: 2 });
    setIsMouseOverPolygonStart(true)
  }
  
  const handleMouseOutStartPoint = event => {
    event.target.scale({ x: 1, y: 1 });
    setIsMouseOverPolygonStart(false)
  }

  const handleDragStartPoint = event => {
    console.log("start", event);
    const key = event.target.key;

    if (!draggingKey) {
      setDraggingKey(key)
    }
  }

  const handleDragMovePoint = (event, polyIndex, pointIndex) => {
    const key = event.target.key;
    if (key !== draggingKey) { // prevent dragging 2 near points
      return
    }
    const pos = [event.target.attrs.x, event.target.attrs.y];
    onChange({
      ...polygon,
      polys: polys.map((poly, index) => {
        if (index !== polyIndex) {
          return poly
        } else {
          return [...poly.slice(0, pointIndex), pos, ...poly.slice(pointIndex + 1)]
        }
      })
    })
  }

  const handleDragOutPoint = event => {
    console.log("end", event);
    setDraggingKey(null)
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
    const dX = polygon.x
    const dY = polygon.y
    if (isCutting) {
      const holes = polys[polys.length - 1]
      setCuttingPolygon(holes.map(p => [p[0] + dX, p[1] + dY]))
      onChange({
        ...polygon,
        polys: polys.slice(-1).map(poly => poly.map(p => [p[0] + dX, p[1] + dY])),
        x: 0,
        y: 0
      })
    } else {
      onChange({
        ...polygon,
        polys: polys.map(poly => poly.map(p => [p[0] + dX, p[1] + dY])),
        x: 0,
        y: 0
      })
    }
  }

  return (
    <Group
      ref={groupRef}
      id={id}
    >
      {polys.map((points, polyIndex) => {
          const isActivePoly = (isDrawing && polyIndex === 0) || (isCutting && polyIndex === polys.length - 1)

          const addMousePos = (isCutting && cutMousePos) ? [cutMousePos.x, cutMousePos.y] : [currentMousePos.x, currentMousePos.y]
          const addedPoints = points.concat(isActivePoly ? [addMousePos] : [])

          const flattenedPoints = addedPoints.reduce((a, b) => a.concat(b), [])

          let filledHoleFlattenedPoints = flattenedPoints
          if (filledHoleFlattenedPoints.length) {
            filledHoleFlattenedPoints = [...filledHoleFlattenedPoints, flattenedPoints[0], flattenedPoints[1]]
          }

          const scale = (groupRef && groupRef.current) ? groupRef.current.getStage().scaleX() : 1

          return (
            <>
              {polyIndex >= 1 && 
                <Line
                  points={filledHoleFlattenedPoints}
                  id={id}
                  {...others}
                  fill={polyIndex >= 1 ? 'white' : others.fill}
                  strokeWidth={others.strokeWidth / scale}
                />
              }
              <Line
                id={id}
                points={flattenedPoints}
                closed={true}
                onClick={onSelect}
                onTap={onSelect}
                draggable={isSelected && polyIndex === 0}
                onDragStart={onDragStart}
                onDragMove={onDragMove}
                onDragEnd={onDragEnd}
                globalCompositeOperation={polyIndex >= 1 && 'destination-out'}
                {...others}
                fill={polyIndex >= 1 ? 'white' : others.fill}
                opacity={polyIndex >= 1 ? 1 : others.opacity}
                strokeEnabled={polyIndex === 0}
                strokeWidth={others.strokeWidth / scale}
              />
              {(isDrawing || isSelected) &&
                (getDistancePointAndPoint(addMousePos, points[0]) <= 10 ? points : addedPoints).map((point, pointIndex) => {
                  const x = point[0] + polygon.x;
                  const y = point[1] + polygon.y;
                  const startPointAttr =
                    (pointIndex === 0 && isActivePoly)
                      ? {
                        hitStrokeWidth: 6 / scale,
                        onMouseOver: (e) => handleMouseOverStartPoint(e, polyIndex),
                        onMouseOut: handleMouseOutStartPoint,
                        fill: "red",
                      }
                      : null;
                  return (
                    <Circle
                      key={`poly-${id}-${polyIndex}-${pointIndex}`}
                      x={x}
                      y={y}
                      radius={5 / scale}
                      fill="white"
                      stroke="black"
                      strokeWidth={2 / scale}
                      onDragStart={handleDragStartPoint}
                      onDragMove={(e) => handleDragMovePoint(e, polyIndex, pointIndex)}
                      onDragEnd={handleDragOutPoint}
                      draggable={isSelected && !isCutting}
                      {...startPointAttr}
                    />
                  );
                }
                )}
            </>
          )
        }
      )}
    </Group>
  )
}

export default Polygon