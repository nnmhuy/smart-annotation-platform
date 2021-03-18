import React from 'react'
import L from 'leaflet'
import { useMap } from 'react-leaflet'
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

const LeafletGeoman = (props) => {
  const map = useMap()

  React.useEffect(() => {
    var options = {
      position: 'topleft', // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
      drawPolygon: true,  // adds button to draw a polygon
      editPolygon: true,  // adds button to toggle global edit mode

      drawMarker: false,  // adds button to draw markers
      drawCircleMarker: false, // adds button to draw CircleMarkers
      drawPolyline: false,  // adds button to draw a polyline
      drawCircle: false,  // adds button to draw a cricle

      editMode: true,
      dragMode: true,
      removalMode: true,
      cutPolygon: true,
    };
    // add leaflet.pm controls to the map
    map.pm.addControls(options);

    // const layer = L.polygon([[-10, -10], [-10, 10], [10, 10], [10, -10]]).addTo(map);
    
    // create control group
    const boundingBoxGroup = L.layerGroup().addTo(map);
    const polygonGroup = L.layerGroup().addTo(map);
    const overlayMaps = {
      "Bounding box": boundingBoxGroup,
      "Polygon": polygonGroup,
    };
    const control = L.control.layers(null, overlayMaps).addTo(map);


    // set custom properties for drawing new layers
    // map.pm.setPathOptions({
    //   color: 'orange',
    //   fillColor: 'green',
    //   fillOpacity: 0.4,
    //   className: 'myClassName'
    // });

    map.on('pm:remove', ({ layer, shape }) => {
      console.log('remove')
      console.log(boundingBoxGroup.getLayers())
    })
    map.on('pm:create', ({ layer, shape }) => {
      switch (shape) {
        case 'Rectangle':
          boundingBoxGroup.addLayer(layer)
          break;
        case 'Polygon':
          polygonGroup.addLayer(layer)
        default:
          break;
      }
      console.log('create')

      layer.on('pm:edit', ({layer}) => {
        console.log('edit')
      });  
    });
  })

  return null
}

export default LeafletGeoman