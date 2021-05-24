import React from 'react'
import { Layer } from 'react-konva'
import UIDGenerator from 'uid-generator'

import Polygon from './Polygon'

import {
  MODES,
  DEFAULT_SHAPE_ATTRS,
} from '../../constants'
import formatPolygonsToRightCCW from '../../../../helpers/formatPolygonsToRightCCW'

const uidgen = new UIDGenerator();

const PolygonLayer = (props) => {
  const { 
    layerRef,
    polygons, setPolygons,
    activeMode, highlightId,
    selectedId, selectShape,
    currentMousePos, isDraggingViewport,
    isClickOn,
  } = props

  // const layerRef = React.createRef(null)
  const [drawingPolygon, setDrawingPolygon] = React.useState(null)
  const [cuttingPolygon, setCuttingPolygon] = React.useState(null)
  const [isValidProcessingPolygon, setIsValidProcessingPolygon] = React.useState(false)
  const [isMouseOverPolygonStart, setIsMouseOverPolygonStart] = React.useState(false)

  const isClickOnPolygon = (e) => {
    return isClickOn(e, ['Path'])
  }

  const handleClickDrawPolygon = (e) => {
    if (drawingPolygon === null) {
      setDrawingPolygon({
        ...DEFAULT_SHAPE_ATTRS,
        id: uidgen.generateSync(),
        x: 0,
        y: 0,
        polys: [[[currentMousePos.x, currentMousePos.y]]]
      })
    } else {
      if (isMouseOverPolygonStart) {
        handleClickFinishDrawPolygon()
      } else {
        if (isValidProcessingPolygon) {
          setDrawingPolygon({
            ...drawingPolygon,
            polys: [[...drawingPolygon.polys[0], [currentMousePos.x, currentMousePos.y]]],
          })
        }
      }
    }
  }

  const handleRightClickDrawPolygon = (e) => {
    if (drawingPolygon !== null) {
      const drawingPoly = drawingPolygon.polys[0]
      drawingPoly.pop()
      if (drawingPoly.length === 0) { // remove all drawing polygon's points
        setDrawingPolygon(null)
      } else {
        setDrawingPolygon({
          ...drawingPolygon,
          polys: [drawingPoly]
        })
      }
    }
  }


  const handleClickFinishDrawPolygon = () => {
    drawingPolygon.polys = formatPolygonsToRightCCW(drawingPolygon.polys)
    setPolygons([...polygons, drawingPolygon])
    setDrawingPolygon(null)
    setIsMouseOverPolygonStart(false)
  }

  const handleClickCutPolygon = (e) => {
    const shapeId = e.target.attrs.id
    if (isMouseOverPolygonStart) {
      handleClickFinishCutPolygon()
      return
    }
    if (cuttingPolygon) {
      if (cuttingPolygon.length === 0 && shapeId === selectedId) {
        setCuttingPolygon([...cuttingPolygon, [currentMousePos.x, currentMousePos.y]])
      } else {
        if (isValidProcessingPolygon) {
          setCuttingPolygon([...cuttingPolygon, [currentMousePos.x, currentMousePos.y]])
        }
      }
    } else {
      if (isClickOnPolygon(e)) {
        setCuttingPolygon([])
        selectShape(shapeId)
      }
    }
  }


  const handleRightClickCutPolygon = (e) => {
    if (cuttingPolygon) {
      const newCuttingPolygon = cuttingPolygon
      if (newCuttingPolygon.length > 0) { // remove all cutting polygon's points
        newCuttingPolygon.pop()
        setCuttingPolygon(newCuttingPolygon)
      }
    }
  }


  const handleClickFinishCutPolygon = () => {
    setPolygons(polygons.map(polygon => {
      if (polygon.id !== selectedId) {
        return polygon
      } else {
        return ({
          ...polygon,
          polys: formatPolygonsToRightCCW([...polygon.polys, cuttingPolygon])
        })
      }
    }))
    setCuttingPolygon(null)
    selectShape(null)
    setIsMouseOverPolygonStart(false)
  }


  const handleLayerClick = (e) => {
    // prevent propagate to stage click
    e.cancelBubble = true

    if (activeMode === MODES.DRAW_POLYGON) {
      handleClickDrawPolygon(e)
    }
    if (activeMode === MODES.CUT) {
      handleClickCutPolygon(e)
    }
  }

  const handleLayerRightClick = (e) => {
    // prevent propagate to stage click
    e.cancelBubble = true
    // prevent rendering browser context menu
    e.evt.preventDefault()

    if (activeMode === MODES.DRAW_POLYGON) {
      handleRightClickDrawPolygon(e)
    }
    if (activeMode === MODES.CUT) {
      handleRightClickCutPolygon(e)
    }
  }

  return (
    <Layer
      ref={layerRef}
      onClick={handleLayerClick}
      onTap={handleLayerClick}
      onContextMenu={handleLayerRightClick}
    >
      {polygons.map((polygon, i) => {
        const isCutting = Boolean(polygon.id === selectedId && cuttingPolygon)
        const isEditing = Boolean(polygon.id === selectedId && activeMode === MODES.EDIT)
        return (
          <Polygon
            key={`polygon-${polygon.id}`}
            polygon={{
              ...polygon,
              opacity: (polygon.id === highlightId || polygon.id === selectedId) ? 0.5 : 0.4,
              polys: isCutting ? [...polygon.polys, cuttingPolygon] : polygon.polys
            }}
            isSelected={polygon.id === selectedId}
            isCutting={isCutting}
            isEditing={isEditing}
            onChange={(newPolygon) => {
              if (newPolygon.polys.length > 0) {
                const polys = polygons.slice();
                polys[i] = newPolygon;
                setPolygons(polys);
              } else {
                setPolygons(polygons.filter(poly => poly.id !== newPolygon.id))
              }
            }}
            onSelect={() => {
              if (activeMode === MODES.EDIT) {
                selectShape(polygon.id);
              }
            }}
            currentMousePos={currentMousePos}
            setCuttingPolygon={isCutting && setCuttingPolygon}
            isValidProcessingPolygon={isValidProcessingPolygon}
            setIsValidProcessingPolygon={setIsValidProcessingPolygon}
            setIsMouseOverPolygonStart={setIsMouseOverPolygonStart}
            isDraggingViewport={isDraggingViewport}
          />
        )
      })}
      {
        drawingPolygon &&
        <Polygon
          key={'drawing-polygon'}
          isDrawing={true}
          currentMousePos={currentMousePos}
          polygon={drawingPolygon}
          setIsMouseOverPolygonStart={setIsMouseOverPolygonStart}
          isValidProcessingPolygon={isValidProcessingPolygon}
          setIsValidProcessingPolygon={setIsValidProcessingPolygon}
          isDraggingViewport={isDraggingViewport}
        />
      }
    </Layer>
  )
}

export default PolygonLayer