import { useEffect } from "react";
import L, { Map, Control } from "leaflet";

// types
interface LegendProps {
  map: Map | null;
}

const Legend = ({ map }: LegendProps) => {
  // only load when map finished loading
  useEffect(() => {
    if (map) {
      const legend = new Control({ position: "topleft" });
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
