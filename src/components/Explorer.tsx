import React, { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";
import Legend from "./Legend";

// react-leaflet imports
import {
  MapContainer,
  TileLayer,
  LayersControl,
  GeoJSON,
  Marker,
  FeatureGroup,
  Popup,
  useMap,
} from "react-leaflet";
import * as L from "leaflet";

// MUI imports
import {
  AppBar,
  Button,
  Grid,
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CircularProgress,
  IconButton,
  CardActions,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";

// types
import { baseMaps } from "../types";

// Fetcher function for SWR
const fetcher = (url) => axios.get(url).then((res) => res.data);

const Explorer = () => {
  const [mapInstance, setMapInstance] = useState(null);
  const navigate = useNavigate();

  // fetching the health facilities
  const { data: healthFacilities, error: healthFacilitiesError } = useSWR(
    "http://127.0.0.1:8000/api/facilities/",
    fetcher
  );

  // fetching the sub county boundary
  const { data: subCountyBnd, error: subCountyBndError } = useSWR(
    "http://127.0.0.1:8000/api/bnd/",
    fetcher
  );

  // check if there any errors when fetching
  if (healthFacilitiesError || subCountyBndError) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        <Typography variant="h6" color="error">
          Error loading data
        </Typography>
      </Grid>
    );
  }

  // check if data has finished loading
  if (!healthFacilities || !subCountyBnd) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  // basemaps
  const baseMaps: baseMaps[] = [
    {
      name: "OSM",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      checked: false,
    },
    {
      name: "ESRI World Imagery",
      url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      checked: true,
    },
  ];

  // fit initial map load to the subcounty
  const FitBoundsToGeoJSON = ({ data }: any) => {
    const map = useMap();

    useEffect(() => {
      if (data) {
        const geoJsonLayer = new L.GeoJSON(data);
        const bounds = geoJsonLayer.getBounds();
        map.fitBounds(bounds);
      }
    }, [data, map]);

    return null;
  };

  // a map component for user interaction with the map
  const MapComponent = () => {
    const map = useMap();
    setMapInstance(map);
    return null;
  };

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        md={4}
        sx={{
          "@media (max-width: 900px)": {
            overflowX: "auto",
            whiteSpace: "nowrap",
          },
        }}
      >
        {healthFacilities.map((healthFacility) => {
          return (
            <Card
              key={healthFacility.id}
              sx={{
                display: "inline-block",
                margin: "0.5rem",
                border: "1px solid black",
                position: "relative",
                width: {
                  xs: "calc(100% - 1rem)",
                  md: "calc(100% - 1rem)",
                },
              }}
            >
              <CardHeader
                action={
                  <IconButton
                    aria-label="settings"
                    onClick={() =>
                      mapInstance.flyTo(
                        [healthFacility.latitude, healthFacility.longitude],
                        16
                      )
                    }
                  >
                    <RoomIcon />
                  </IconButton>
                }
                sx={{
                  color: "#616161",
                }}
                title={healthFacility.name_of_health_facility}
              />
              <CardMedia
                component="img"
                image={healthFacility.picture1}
                alt={healthFacility.name_of_health_facility}
                title={healthFacility.name_of_health_facility}
                sx={{
                  height: "20rem",
                  width: "100%",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/facilities/${healthFacility.id}`)}
              />
              <CardContent>
                <Typography variant="body1">
                  Level: {healthFacility.level}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Grid>
      <Grid item xs={12} md={8}>
        <AppBar position="sticky">
          <div style={{ height: "100vh" }}>
            <MapContainer center={[-0.718, 37.149]} zoom={12}>
              <LayersControl position="topright">
                {baseMaps.map((baseMap) => (
                  <LayersControl.BaseLayer
                    key={baseMap.name}
                    name={baseMap.name}
                    checked={baseMap.checked}
                  >
                    <TileLayer
                      url={baseMap.url}
                      attribution={baseMap.attribution}
                    />
                  </LayersControl.BaseLayer>
                ))}
                <LayersControl.Overlay checked name="Kiharu Sub County">
                  <GeoJSON data={subCountyBnd[0].geom} />
                </LayersControl.Overlay>
                <LayersControl.Overlay checked name="Health Facilities">
                  <FeatureGroup>
                    {healthFacilities.map((healthFacility) => {
                      return (
                        <Marker
                          key={healthFacility.id}
                          position={[
                            healthFacility.latitude,
                            healthFacility.longitude,
                          ]}
                        >
                          <Popup>
                            <Typography variant="h6">
                              {healthFacility.name_of_health_facility}
                            </Typography>
                            <img
                              src={healthFacility.picture1}
                              alt={healthFacility.name_of_health_facility}
                              style={{
                                height: "20rem",
                                width: "18rem",
                              }}
                            />
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() =>
                                navigate(`/facilities/${healthFacility.id}`)
                              }
                            >
                              Details
                            </Button>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </FeatureGroup>
                </LayersControl.Overlay>
              </LayersControl>
              <MapComponent />
              <FitBoundsToGeoJSON data={subCountyBnd[0].geom} />
              <Legend map={mapInstance} />
            </MapContainer>
          </div>
        </AppBar>
      </Grid>
    </Grid>
  );
};

export default Explorer;
