import React from 'react'
import DeckGL, { BitmapLayer } from 'deck.gl'
import { 
  EditableGeoJsonLayer,
  ViewMode,
  SelectionLayer,

  SELECTION_TYPE
} from 'nebula.gl'

import { CUSTOM_MODIFY_MODE } from '../../constants'

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
  const { 
    activeMode, setMode,
    features, setFeatures,
    selectedFeatureIndexes, setSelectedFeatureIndexes
  } = props


  const bitmapLayer = new BitmapLayer({
    id: 'bitmap-layer',
    bounds: [-100, -50, 100, 50],
    image: 'https://ichef.bbci.co.uk/news/976/cpsprodpb/68C3/production/_93791862_thinkstockphotos-585524268.jpg'
  });


  const _onLayerClick = (info) => {
    console.log('onLayerClick', info); // eslint-disable-line
    if (activeMode !== ViewMode && activeMode !== CUSTOM_MODIFY_MODE) {
      // don't change selection while drawing
      return;
    }

    if (info && info.index >= 0) {
      console.log(`select editing feature ${info.index}`); // eslint-disable-line
      // a feature was clicked
      setSelectedFeatureIndexes([info.index]);
      // setMode(CUSTOM_MODIFY_MODE)
    } else {
      console.log('deselect editing feature'); // eslint-disable-line
      // open space was clicked, so stop editing
      setMode(ViewMode)
      setSelectedFeatureIndexes([]);
    }
  };

  const geoJsonLayer = new EditableGeoJsonLayer({
    id: "geojson-layer",
    data: features,
    mode: activeMode,
    modeConfig: {
      enableSnapping: true,
    },
    selectedFeatureIndexes,

    onEdit: ({ updatedData }) => {
      setFeatures(updatedData)
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
    lineWidthMinPixels: 1
  })

  const layers = [bitmapLayer, geoJsonLayer]

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
      getCursor={geoJsonLayer.getCursor.bind(geoJsonLayer)}
      style={{ position: 'relative' }}
      onClick={_onLayerClick}
    >
    </DeckGL>
  );
}

export default Annotator