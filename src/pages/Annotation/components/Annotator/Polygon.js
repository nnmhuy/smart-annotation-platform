import React from 'react'
import { Group, Line, Circle } from 'react-konva'

import { getDistancePointAndPoint } from '../../../../helpers/getDistance'


const MIN_DIST_TO_START_POINT = 10

const Polygon = (props) => {
  const { 
    polygon, currentMousePos,
    isDrawing, isCutting, isEditing,
    isSelected, onSelect,
    setIsMouseOverPolygonStart, 
    onChange,
    setCuttingPolygon, setIsMouseOverCuttingPolygon,
  } = props

  const groupRef = React.useRef(null)
  const { id, polys, ...others } = polygon
  const [draggingKey, setDraggingKey] = React.useState(null)
  const [polysMidPoints, setPolysMidPoints] = React.useState([])

  // update mid points when polygon is edited
  React.useEffect(() => {
    setPolysMidPoints(polygon.polys.map(poly => poly.map((curPoint, index) => {
      const nextPoint = poly[(index + 1) % poly.length]
      return [
        (curPoint[0] + nextPoint[0]) / 2,
        (curPoint[1] + nextPoint[1]) / 2,
      ]
    })))
  }, [polygon])

  React.useEffect(() => {
    if (isSelected) {
      groupRef.current.parent.moveToTop()
    }
  }, [isSelected])

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

  const handleDragMovePoint = (event, polyIndex, pointIndex, isMidPoint) => {
    const key = event.target.key;
    if (key !== draggingKey) { // prevent dragging 2 near points
      return
    }
    const pos = [event.target.attrs.x, event.target.attrs.y];

    if (!isMidPoint) {
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
    } else {
      setPolysMidPoints(polysMidPoints.map((poly, index) => {
          if (index !== polyIndex) {
            return poly
          } else {
            return [...poly.slice(0, pointIndex), pos, ...poly.slice(pointIndex + 1)]
          }
        })
      )
    }
  }

  const handleDragEndPoint = (event, polyIndex, pointIndex, isMidPoint) => {
    console.log("end", event);

    if (isMidPoint) {
      const pos = [event.target.attrs.x, event.target.attrs.y];
      onChange({
        ...polygon,
        polys: polys.map((poly, index) => {
          if (index !== polyIndex) {
            return poly
          } else {
            return [...poly.slice(0, pointIndex + 1), pos, ...poly.slice(pointIndex + 1)]
          }
        })
      })
    }

    setDraggingKey(null)
  }

  const onDragStart = event => {
  }

  const onDragMove = event => {
    const dX = event.target.x()
    const dY = event.target.y()
    onChange({
      ...polygon,
      x: dX,
      y: dY
    })
    setPolysMidPoints(polysMidPoints.map(poly => poly.map(p => [p[0] + dX, p[1] + dY])))
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

  const handleDoubleClickDeletePoint = (event, polyIndex, pointIndex) => {
    if (!isEditing) { // only allow in edit mode
      return
    }

    // TODO: handle holes

    let newPolygon = {
      ...polygon,
      polys: polys.map((poly, index) => {
        if (index !== polyIndex) {
          return poly
        } else {
          return [...poly.slice(0, pointIndex), ...poly.slice(pointIndex + 1)]
        }
      }).filter(poly => poly.length >= 3)
    }

    onChange(newPolygon)
  }

  return (
    <Group
      ref={groupRef}
      id={id}
    >
      {polys.map((points, polyIndex) => {
        const isActivePoly = (isDrawing && polyIndex === 0) || (isCutting && polyIndex === polys.length - 1)

        const addMousePos = [currentMousePos.x, currentMousePos.y]
        let mainPoints = points
        if (isActivePoly && getDistancePointAndPoint(addMousePos, points[0]) > MIN_DIST_TO_START_POINT) {
          mainPoints = mainPoints.concat([addMousePos])
        }

        let shapePoints = []
        const midPoints = polysMidPoints[polyIndex]
        if (isEditing) {
          midPoints.forEach((p, pIndex) => {
            if (pIndex < mainPoints.length) {
              shapePoints.push(mainPoints[pIndex])
            }
            shapePoints.push(p)
          })
        } else {
          shapePoints = mainPoints
        }

        const flattenedPoints = shapePoints.reduce((a, b) => a.concat(b), [])

        let filledHoleFlattenedPoints = flattenedPoints
        if (filledHoleFlattenedPoints.length) {
          filledHoleFlattenedPoints = [...filledHoleFlattenedPoints, flattenedPoints[0], flattenedPoints[1]]
        }

        const scale = (groupRef && groupRef.current) ? groupRef.current.getStage().scaleX() : 1

        // TODO: handle mouse cursor when mouse out of cutting polygon
        const conditionalPolygonAttr =
          (polyIndex === 0)
            ? {
              onMouseOver: isCutting ? () => setIsMouseOverCuttingPolygon(true) : null,
              onMouseOut: isCutting ? () => setIsMouseOverCuttingPolygon(false) : null,
              strokeEnabled: true,
            }
            : {
              globalCompositeOperation: 'destination-out',
              strokeEnabled: false,
              //hitFunc: function (context) {
                // disable hitFunc for holes
              //},
              fill: 'white',
              opacity: 1,
            };

        return (
          <>
            {/* For showing border of holes */}
            {polyIndex >= 1 && 
              <Line
                points={filledHoleFlattenedPoints}
                id={id}
                {...others}
                fill={polyIndex >= 1 ? 'white' : others.fill}
                strokeWidth={others.strokeWidth / scale}
                hitFunc={function (context) {
                  // disable hitFunc
                }}
              />
            }
            <Line
              id={id}
              points={flattenedPoints}
              closed={true}
              onClick={onSelect}
              onTap={onSelect}
              draggable={isEditing}
              onDragStart={onDragStart}
              onDragMove={onDragMove}
              onDragEnd={onDragEnd}
              {...others}
              strokeWidth={others.strokeWidth / scale}
              {...conditionalPolygonAttr}
            />
            {/* Rendering polygon's main points */}
            {(isDrawing || isSelected) &&
              mainPoints.map((point, pointIndex) => {
                const x = point[0] + polygon.x;
                const y = point[1] + polygon.y;
                const startPointAttr =
                  (pointIndex === 0 && isActivePoly)
                    ? {
                      hitStrokeWidth: 6 / scale,
                      onMouseOver: (e) => handleMouseOverStartPoint(e, polyIndex),
                      onMouseOut: handleMouseOutStartPoint,
                      fill: "red",
                      hitFunc: null,
                    }
                    : null;
                return (
                  <Circle
                    key={`poly-${id}-${polyIndex}-${pointIndex}`}
                    x={x}
                    y={y}
                    radius={6 / scale}
                    fill="white"
                    stroke="black"
                    strokeWidth={2 / scale}
                    onDragStart={handleDragStartPoint}
                    onDragMove={(e) => handleDragMovePoint(e, polyIndex, pointIndex)}
                    onDragEnd={handleDragEndPoint}
                    onDblClick={(e) => handleDoubleClickDeletePoint(e, polyIndex, pointIndex)}
                    draggable={isEditing}
                    hitFunc={isCutting && function (context) {
                      // disable hitFunc while cutting
                    }}
                    {...startPointAttr}
                  />
                );
              }
              )}
              {/* Rendering mid points for editing */}
              {isEditing &&
                midPoints.map((point, pointIndex) => {
                  const x = point[0] + polygon.x;
                  const y = point[1] + polygon.y;
                  return (
                    <Circle
                      key={`poly-midpoint-${id}-${polyIndex}-${pointIndex}`}
                      x={x}
                      y={y}
                      radius={5 / scale}
                      fill="white"
                      stroke="black"
                      opacity={0.8}
                      strokeWidth={2 / scale}
                      onDragStart={handleDragStartPoint}
                      onDragMove={(e) => handleDragMovePoint(e, polyIndex, pointIndex, true)}
                      onDragEnd={(e) => handleDragEndPoint(e, polyIndex, pointIndex, true)}
                      draggable={isEditing}
                    />
                  );
                })
              }
            </>
          )
        }
      )}
    </Group>
  )
}

export default Polygon