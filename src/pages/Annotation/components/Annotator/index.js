import React from 'react'
import { 
  MapContainer, ImageOverlay,
} from 'react-leaflet'
import LeafletGeoman from './LeafletGeoman'

const Annotator = (props) => {
  return (
    <MapContainer
      center={[0, 0]} 
      bounds={[
        [-50, -50],
        [50, 50]
      ]}
      zoom={3}
      style={{
        height: '100%',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <ImageOverlay
        url="https://image.shutterstock.com/mosaic_250/2389049/1365289022/stock-photo-a-surreal-image-of-an-african-elephant-wearing-black-and-white-zebra-stripes-1365289022.jpg"
        bounds={[
          [-40, -40],
          [40, 40]
        ]}
        opacity={1}
        zIndex={10}
      />
      <LeafletGeoman/>
    </MapContainer>
  );
}

export default Annotator