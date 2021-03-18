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
      drawMarker: false,  // adds button to draw markers
      drawPolygon: true,  // adds button to draw a polygon
      drawPolyline: false,  // adds button to draw a polyline
      drawCircle: false,  // adds button to draw a cricle
      editPolygon: true,  // adds button to toggle global edit mode

      editMode: true,
      dragMode: true,
      removalMode: true,
      cutPolygon: true,
    };
    const layer = L.polygon([[-10, -10], [-10, 10], [10, 10], [10, -10]]).addTo(map);
    console.log(layer)

    // add leaflet.pm controls to the map
    map.pm.addControls(options);
    map.pm.setPathOptions({
      color: 'orange',
      fillColor: 'green',
      fillOpacity: 0.4,
    });

    map.on('pm:remove', ({ layer, shape }) => {
      console.log('remove')
    })
    map.on('pm:create', ({ layer, shape }) => {
      console.log('create')
      layer.on('pm:edit', e => {
        console.log('edit')
        console.log(e);
      });  
    });
  })

  return null
}

export default LeafletGeoman