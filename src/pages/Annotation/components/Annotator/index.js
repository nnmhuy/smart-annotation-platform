import React from 'react'
import DeckGL, { BitmapLayer } from 'deck.gl'
import { 
  EditableGeoJsonLayer,
  ViewMode,
  DrawPolygonMode,
  TransformMode,
  TranslateMode,
  ModifyMode,
  SelectionLayer,
  CompositeMode,

  SELECTION_TYPE
} from 'nebula.gl'

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  zoom: 1,
  minZoom: 0.5,
  maxZoom: 5,
  bearing: 0,
  pitch: 0
}

const Annotator = (props) => {
  const [features, setFeatures] = React.useState({
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "coordinates": [
            [
              [ -20, -20 ],
              [ 20, -20 ],
              [ 20, 20 ],
              [ -20, 20 ],
              [ -20, -20]
            ],
            // [
            //   [ 5, 5 ],
            //   [ 15, 15 ],
            //   [ 15, -7],
            //   [ 5, 5]
            // ]
          ],
          "type": "Polygon"
        }
      }
    ]
  });

  const compositeMode = new CompositeMode([new ViewMode(), new DrawPolygonMode(), new ModifyMode()])

  const [mode, setMode] = React.useState(() => new ViewMode());
  const [selectedFeatureIndexes, setSelectedFeatureIndexes] = React.useState([]);

  console.log(selectedFeatureIndexes)

  const geoJsonLayer = new EditableGeoJsonLayer({
    id: "geojson-layer",
    data: features,
    mode,
    modeConfig: {
      enableSnapping: true,
    },
    pickable: true,
    selectedFeatureIndexes,

    onEdit: ({ updatedData, editType, featureIndexes }) => {
      console.log(editType)
      console.log(featureIndexes)
      setFeatures(updatedData);
    }
  });

  // draw rectangle to select multiple features
  const selectionLayer = new SelectionLayer({
    id: 'selection',
    selectionType: SELECTION_TYPE.RECTANGLE,
    onSelect: ({ pickingInfos }) => {
      setSelectedFeatureIndexes(pickingInfos.map(pi => pi.index));
    },
    layerIds: ['geojson-layer'],

    getTentativeFillColor: () => [255, 0, 255, 100],
    getTentativeLineColor: () => [0, 0, 255, 255],
    getTentativeLineDashArray: () => [0, 0],
    lineWidthMinPixels: 3
  })


  const bitmapLayer = new BitmapLayer({
    id: 'bitmap-layer',
    bounds: [-100, -50, 100, 50],
    image: 'https://ichef.bbci.co.uk/news/976/cpsprodpb/68C3/production/_93791862_thinkstockphotos-585524268.jpg'
  });

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={[bitmapLayer, geoJsonLayer]}
      getCursor={geoJsonLayer.getCursor.bind(geoJsonLayer)}
      style={{ position: 'relative' }}
    >
    </DeckGL>
  );
}

export default Annotator