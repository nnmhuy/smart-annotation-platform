import React from 'react'
import DeckGL, { BitmapLayer } from 'deck.gl'
import { 
  EditableGeoJsonLayer,
  DrawPolygonMode
} from 'nebula.gl'

const Annotation = (props) => {
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
            [
              [ 5, 5 ],
              [ 15, 15 ],
              [ 15, -7],
              [ 5, 5]
            ]
          ],
          "type": "Polygon"
        }
      }
    ]
  });

  const [mode, setMode] = React.useState(() => DrawPolygonMode);
  const [selectedFeatureIndexes] = React.useState([]);

  const geoJsonLayer = new EditableGeoJsonLayer({
    id: "geojson-layer",
    data: features,
    mode,
    selectedFeatureIndexes,

    onEdit: ({ updatedData }) => {
      setFeatures(updatedData);
    }
  });


  const bitmapLayer = new BitmapLayer({
    id: 'bitmap-layer',
    bounds: [-100, -50, 100, 50],
    image: 'https://ichef.bbci.co.uk/news/976/cpsprodpb/68C3/production/_93791862_thinkstockphotos-585524268.jpg'
  });

  return (
    <>
      <DeckGL
        initialViewState={{
          longitude: 0,
          latitude: 0,
          zoom: 1,
          bearing: 0,
          pitch: 0
        }}
        controller={true}
        layers={[bitmapLayer, geoJsonLayer]}
        getCursor={geoJsonLayer.getCursor.bind(geoJsonLayer)}
      >
      </DeckGL>
      {/* <Toolbox
        mode={mode}
        onSetMode={setMode}
        modeConfig={modeConfig}
        onSetModeConfig={setModeConfig}
        geoJson={features}
        onSetGeoJson={setFeatures}
        onImport={setFeatures}
      /> */}
    </>
  );
}

export default Annotation