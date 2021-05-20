import React from 'react'
import { Group, Circle, Path } from 'react-konva'
import Flatten from '@flatten-js/core';


const MIN_DIST_TO_START_POINT = 10

const Polygon = (props) => {
  const { 
    polygon, currentMousePos,
    isDrawing, isCutting, isEditing,
    isSelected, onSelect,
    setIsMouseOverPolygonStart, 
    onChange,
    setCuttingPolygon, setIsMouseOverCuttingPolygon,
    isDraggingViewport,
  } = props

  const groupRef = React.useRef(null)
  const { id, polys, ...others } = polygon
  const [draggingKey, setDraggingKey] = React.useState(null)
  const [isDraggingPolygon, setIsDraggingPolygon] = React.useState(false)
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
    setIsDraggingPolygon(true)
  }

  const onDragMove = event => {
    const dX = event.target.x()
    const dY = event.target.y()
    onChange({
      ...polygon,
      x: dX,
      y: dY
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
    setIsDraggingPolygon(false)
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

  const scale = (groupRef && groupRef.current) ? groupRef.current.getStage().scaleX() : 1

  // TODO: handle click cut inside polygon checking
  let toDrawPolys = polys.map((points, polyIndex) => {
    const isActivePoly = (isDrawing && polyIndex === 0) || (isCutting && polyIndex === polys.length - 1)
  
    const addMousePos = [currentMousePos.x, currentMousePos.y]
    let mainPoints = points
    if (isActivePoly && points[0] && Flatten.point(addMousePos).distanceTo(Flatten.point(points[0]))[0] > MIN_DIST_TO_START_POINT) {
      mainPoints = mainPoints.concat([addMousePos])
    }

    return mainPoints
  })

  let fullPolygon = Flatten.polygon()
  toDrawPolys.forEach((points, polyIndex) => {
    if (points.length < 3) {
      return
    }
    let newFace = fullPolygon.addFace(points)
    if ((polyIndex === 0 && newFace.orientation() === Flatten.ORIENTATION.CCW) ||
      (polyIndex !== 0 && newFace.orientation() === Flatten.ORIENTATION.CW)
    ) {
      newFace.reverse()
    }
  })
  if (isCutting) {
    setIsMouseOverCuttingPolygon(fullPolygon.contains(Flatten.point(currentMousePos.x, currentMousePos.y)))
  }
  
  return (
    <Group
      ref={groupRef}
      id={id}
    >
      <Path 
        id={id}
        data={fullPolygon.svg()}
        onClick={onSelect}
        onTap={onSelect}
        draggable={isEditing}
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        strokeWidth={others.strokeWidth / scale}
        hitFunc={isDraggingViewport && function (context) {
          // disable hitFunc while dragging viewport
        }}
        {...others}
      />
      {toDrawPolys.map((mainPoints, polyIndex) => {
        const isActivePoly = (isDrawing && polyIndex === 0) || (isCutting && polyIndex === polys.length - 1)

        const midPoints = polysMidPoints[polyIndex]
        const scale = (groupRef && groupRef.current) ? groupRef.current.getStage().scaleX() : 1

        return (
          <>
            {/* Rendering polygon's main points */}
            {(!isDraggingPolygon && (isDrawing || isSelected)) &&
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
                    hitFunc={(isCutting || isDraggingViewport) && function (context) {
                      // disable hitFunc while cutting or dragging viewport
                    }}
                    {...startPointAttr}
                  />
                );
              }
              )}
              {/* Rendering mid points for editing */}
              {(!isDraggingPolygon && isEditing) &&
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
                      hitFunc={isDraggingViewport && function (context) {
                        // disable hitFunc while dragging viewport
                      }}
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