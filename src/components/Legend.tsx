import React, { useEffect } from "react";
import L from "leaflet";

const Legend = ({ map }) => {
  // only load when map finished loading
  useEffect(() => {
    if (map) {
      const legend = L.control({ position: "topleft" });
      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "info legend");
        div.innerHTML = "<h4>Legend</h4>" + "<b>Lorem ipsum dolor, sit.</b>";
        return div;
      };
      legend.addTo(map);
    }
  }, [map]);
  return null;
};

export default Legend;
