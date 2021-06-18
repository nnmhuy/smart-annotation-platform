import { cloneDeep } from 'lodash'
import React from 'react'
import { Circle } from 'react-konva'

import checkValidPolys from '../../../utils/checkValidPolys'
import formatPolygonsToRightCCW from '../../../utils/formatPolygonsToRightCCW'


const PolygonMainPoints = (props) => {
  const {
    isDrawing, isCutting, isEditing, isDraggingViewport,
    setIsMouseOverPolygonStart,
    scale,
    polygon,
    draggingPointKey, setDraggingPointKey,
    onChange,
  } = props

  const { id, polys, x: dX, y: dY } = polygon

  const [lastValidPos, setLastValidPos] = React.useState(null)

  const handleMouseOverStartPoint = (event, polyIndex) => {
    if (polys[polyIndex].length < 3) return;
    event.target.scale({ x: 2, y: 2 });
    setIsMouseOverPolygonStart(true)
  }

  const handleMouseOutStartPoint = event => {
    event.target.scale({ x: 1, y: 1 });
    setIsMouseOverPolygonStart(false)
  }

  const handleStartDraggingMainPoint = event => {
    const key = event.target.key;

    if (!draggingPointKey) {
      setDraggingPointKey(key)
    }
  }

  const handleMoveDraggingMainPoint = (event, polyIndex, pointIndex) => {
    // NOTE: heavy recalculation => cause slow update
    const target = event.target
    const key = target.key;
    if (key !== draggingPointKey) { // prevent dragging 2 near points
      return
    }
    const pos = [event.target.attrs.x, event.target.attrs.y];

    const newPolys = cloneDeep(polys).map((poly, index) => {
      if (index !== polyIndex) {
        return poly
      } else {
        return [...poly.slice(0, pointIndex), pos, ...poly.slice(pointIndex + 1)]
      }
    })
    if (checkValidPolys(newPolys)) {
      setLastValidPos({ x: pos[0], y: pos[1] })
      onChange({
        ...polygon,
        polys: newPolys
      })
    } else {
      if (lastValidPos) {
        target.absolutePosition(lastValidPos)
      }
    }
  }

  const handleEndDraggingMainPoint = (event) => {
    onChange({
      ...polygon,
      polys: formatPolygonsToRightCCW(polygon.polys)
    })
    setDraggingPointKey(null)
    setLastValidPos(null)
  }

  const handleDoubleClickDeletePoint = (event, polyIndex, pointIndex) => {
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
    <>
      {polys.map((mainPoints, polyIndex) => {
        const isActivePoly = (isDrawing && polyIndex === 0) || (isCutting && polyIndex === polys.length - 1)

        return (
          <>{mainPoints.map((point, pointIndex) => {
            const x = point[0] + dX;
            const y = point[1] + dY;
            const startPointAttr =
              (pointIndex === 0 && isActivePoly)
                ? {
                  hitStrokeWidth: 6 / scale,
                  onMouseOver: (e) => handleMouseOverStartPoint(e, polyIndex),
                  onMouseOut: handleMouseOutStartPoint,
                  onTap: (e) => handleMouseOverStartPoint(e, polyIndex),
                  fill: "red",
                  hitFunc: function (context) {
                    context.beginPath();
                    context.arc(0, 0, 6 / scale, 0, Math.PI * 2, true);
                    context.closePath();
                    context.fillStrokeShape(this);
                  },
                }
                : null;
            return (
              <Circle
                key={`poly-main_points-${id}-${polyIndex}-${pointIndex}`}
                x={x}
                y={y}
                radius={6 / scale}
                fill="white"
                stroke="black"
                strokeWidth={2 / scale}
                onDragStart={handleStartDraggingMainPoint}
                onDragMove={(e) => handleMoveDraggingMainPoint(e, polyIndex, pointIndex)}
                onDragEnd={handleEndDraggingMainPoint}
                onDblClick={isEditing ? (e) => handleDoubleClickDeletePoint(e, polyIndex, pointIndex) : null}
                draggable={isEditing}
                hitFunc={(isCutting || isDraggingViewport) && function () {
                  // disable hitFunc while cutting or dragging viewport
                }}
                {...startPointAttr}
              />
            );
          }
          )}
          </>
        )
      })}
    </>
  )
}

export default PolygonMainPoints