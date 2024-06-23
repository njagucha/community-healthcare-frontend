import { useEffect } from "react";
import L, { Map, Control } from "leaflet";
// icons-png
import level2Png from "../assets/map-icons/level_2.png";
import level3Png from "../assets/map-icons/level_3.png";
import level4Png from "../assets/map-icons/level_4.png";
import level5Png from "../assets/map-icons/level_5.png";

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
        div.innerHTML =
          "<h4>Legend</h4>" +
          `<div class='legend-item'><span>Level 2</span><img src=${level2Png} alt='Level 2' /></div>` +
          `<div class='legend-item'><span>Level 3</span><img src=${level3Png} alt='Level 2' /></div>` +
          `<div class='legend-item'><span>Level 4</span><img src=${level4Png} alt='Level 2' /></div>` +
          `<div class='legend-item'><span>Level 5</span><img src=${level5Png} alt='Level 2' /></div>`;
        return div;
      };
      legend.addTo(map);
    }
  }, [map]);
  return null;
};

export default Legend;
