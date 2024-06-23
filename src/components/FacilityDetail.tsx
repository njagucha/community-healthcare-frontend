import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";

// react-leaflet imports
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

// MUI Imports
import {
  Grid,
  Typography,
  CircularProgress,
  Breadcrumbs,
  Link,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

// icons-png
import assortmentPng from "../assets/map-icons/assortment.png";
import busStopPng from "../assets/map-icons/busstop.png";
import communityServicePng from "../assets/map-icons/community-service.png";
import schoolPng from "../assets/map-icons/school.png";
import stadiumPng from "../assets/map-icons/stadium.png";
import townHousePng from "../assets/map-icons/townhouse.png";

// types
interface PointField {
  type: "Point";
  coordinates: [number, number];
}

interface Landmark {
  id: number;
  name: string;
  lon: number;
  lat: number;
  type: string;
  geom: PointField;
}

// Fetcher function for SWR
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const FacilityDetail = () => {
  const navigate = useNavigate();
  const params = useParams();

  // fetching the health facilities detail
  const { data: healthFacility, error: healthFacilityError } = useSWR(
    `https://community-healthcare-backend.onrender.com/api/facilities/${params.id}`,
    fetcher
  );
  // state for image slider
  const [currentPicture, setCurrentPicture] = useState(0);
  // Define the event handlers for the pictures
  const nextPicture = () => {
    if (currentPicture === healthFacilityPictures.length - 1) {
      setCurrentPicture(0);
    } else {
      setCurrentPicture(currentPicture + 1);
    }
  };
  const previousPicture = () => {
    if (currentPicture === 0) {
      setCurrentPicture(healthFacilityPictures.length - 1);
    } else {
      setCurrentPicture(currentPicture - 1);
    }
  };

  // Check if there are any errors when fetching
  if (healthFacilityError) {
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

  // Check if data has finished loading
  if (!healthFacility) {
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

  // Get the health facility pictures
  const healthFacilityPictures = [
    healthFacility.picture1,
    healthFacility.picture2,
    healthFacility.picture3,
    healthFacility.picture4,
    healthFacility.picture5,
  ].filter((picture) => picture !== null);

  // custom icons
  const assormentIcon = new Icon({
    iconUrl: assortmentPng,
    iconSize: [40, 40],
  });
  const busStopIcon = new Icon({
    iconUrl: busStopPng,
    iconSize: [40, 40],
  });
  const schoolIcon = new Icon({
    iconUrl: schoolPng,
    iconSize: [40, 40],
  });
  const stadiumIcon = new Icon({
    iconUrl: stadiumPng,
    iconSize: [40, 40],
  });
  const townHouseIcon = new Icon({
    iconUrl: townHousePng,
    iconSize: [40, 40],
  });

  return (
    <div
      style={{ marginLeft: "2rem", marginRight: "2rem", marginBottom: "2rem" }}
    >
      <Grid item style={{ marginTop: "1rem" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/explorer")}
            style={{ cursor: "pointer", color: "blueviolet" }}
          >
            Explorer
          </Link>
          <Typography color="text.primary">
            {healthFacility.name_of_health_facility}
          </Typography>
        </Breadcrumbs>
      </Grid>

      {/* Image Slider */}
      {healthFacilityPictures.length > 0 ? (
        <Grid
          item
          container
          justifyContent="center"
          sx={{
            position: "relative",
            marginTop: "1rem",
          }}
        >
          {healthFacilityPictures.map((healthFacilityPicture, index) => {
            return (
              <div key={index}>
                {index === currentPicture ? (
                  <img
                    src={healthFacilityPicture}
                    style={{ width: "50rem", height: "35rem" }}
                    title={healthFacilityPicture}
                    alt="Health Facility Picture"
                  />
                ) : (
                  ""
                )}
              </div>
            );
          })}
          <ArrowCircleLeftIcon
            sx={{
              position: "absolute",
              cursor: "pointer",
              fontSize: "3rem",
              "&:hover": {
                backgroundColor: "green",
              },
              color: "whitesmoke",
              top: "50%",
              left: "27.5%",
            }}
            onClick={previousPicture}
          />
          <ArrowCircleRightIcon
            sx={{
              position: "absolute",
              cursor: "pointer",
              fontSize: "3rem",
              "&:hover": {
                backgroundColor: "green",
              },
              color: "whitesmoke",
              top: "50%",
              right: "27.5%",
            }}
            onClick={nextPicture}
          />
        </Grid>
      ) : (
        ""
      )}
      {/* More info about facility */}
      <Grid
        item
        container
        style={{ padding: "1rem", border: "1px solid #000", marginTop: "1rem" }}
      >
        <Grid item container xs={7} direction="column" spacing={1}>
          <Grid item>
            <Typography variant="h6">
              {healthFacility.name_of_health_facility}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              <PhoneIcon />
              Contact Details: +254{healthFacility.contact}
            </Typography>
          </Grid>
        </Grid>
        <Grid item alignItems="center">
          <Typography
            variant="h6"
            style={{ fontWeight: "bolder", color: "green" }}
          >
            Facility Type: {healthFacility.facility_type}
          </Typography>
        </Grid>
        <Grid item xs={5} alignItems="center">
          <Typography
            variant="h6"
            style={{ fontWeight: "bolder", color: "blue" }}
          >
            Operating Hours: {healthFacility.operating_hrs}
          </Typography>
        </Grid>
        <Grid item xs={5} alignItems="center">
          <Typography
            variant="h6"
            style={{ fontWeight: "bolder", color: "green" }}
          >
            KMHFL Number: {healthFacility.mfl_number}
          </Typography>
        </Grid>
        <Grid item xs={5} alignItems="center">
          <Typography
            variant="h6"
            style={{ fontWeight: "bolder", color: "green" }}
          >
            Number of Healthcare Professionals:
            {healthFacility.healthcare_professionals}
          </Typography>
        </Grid>
      </Grid>
      {healthFacility.community_healthcare_programs ? (
        <Grid
          item
          container
          justifyContent="flex-start"
          style={{
            padding: "1rem",
            border: "1px solid #000",
            marginTop: "1rem",
          }}
        >
          <Grid item xs={7} style={{ display: "flex" }}>
            <img src={communityServicePng} alt="Community Service" />
            <Typography variant="h6">
              This facility conducts community healthcare programs
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <Grid
          item
          container
          justifyContent="flex-start"
          style={{
            padding: "1rem",
            border: "1px solid #000",
            marginTop: "1rem",
          }}
        >
          <Grid item xs={7} style={{ display: "flex" }}>
            <Typography variant="h6">
              This facility does not conduct any community healthcare programs
            </Typography>
          </Grid>
        </Grid>
      )}

      <Grid
        item
        container
        justifyContent="flex-start"
        style={{ padding: "1rem", border: "1px solid #000", marginTop: "1rem" }}
      >
        {healthFacility.adequate_parking ? (
          <Grid item xs={2} style={{ display: "flex" }}>
            <CheckBoxIcon style={{ color: "green", fontSize: "2rem" }} />
            <Typography variant="body2">Adequate Parking</Typography>
          </Grid>
        ) : (
          ""
        )}
        {healthFacility.clean_water ? (
          <Grid item xs={2} style={{ display: "flex" }}>
            <CheckBoxIcon style={{ color: "green", fontSize: "2rem" }} />
            <Typography variant="body2">Clean Water</Typography>
          </Grid>
        ) : (
          ""
        )}
        {healthFacility.electricity ? (
          <Grid item xs={2} style={{ display: "flex" }}>
            <CheckBoxIcon style={{ color: "green", fontSize: "2rem" }} />
            <Typography variant="body2">Electricity</Typography>
          </Grid>
        ) : (
          ""
        )}
        {healthFacility.road_accessibility ? (
          <Grid item xs={2} style={{ display: "flex" }}>
            <CheckBoxIcon style={{ color: "green", fontSize: "2rem" }} />
            <Typography variant="body2">Road Accessibility</Typography>
          </Grid>
        ) : (
          ""
        )}
        {healthFacility.wheelchair_accessible ? (
          <Grid item xs={2} style={{ display: "flex" }}>
            <CheckBoxIcon style={{ color: "green", fontSize: "2rem" }} />
            <Typography variant="body2">Wheelchair Accessible</Typography>
          </Grid>
        ) : (
          ""
        )}
      </Grid>
      {/* MapContainer */}
      <Grid
        item
        container
        style={{ height: "35rem", marginTop: "1rem" }}
        spacing={2}
        justifyContent="space-between"
      >
        <Grid item xs={3} style={{ overflow: "auto", height: "35rem" }}>
          {healthFacility.landmarks_within_500M.map((landmark: Landmark) => {
            const degreeToRadian = (coordinate: number) => {
              return coordinate * (Math.PI / 180);
            };
            const calculateDistance = () => {
              // coordinates of listing
              const latitude1 = degreeToRadian(healthFacility.latitude);
              const longitude1 = degreeToRadian(healthFacility.longitude);

              // coordinates of POI
              const latitude2 = degreeToRadian(landmark.geom.coordinates[1]);
              const longitude2 = degreeToRadian(landmark.geom.coordinates[0]);

              // The formula to calculate dist in km
              const latDiff = latitude2 - latitude1;
              const lonDiff = longitude2 - longitude1;
              const R = 6378; //radius of earth in km

              const a =
                Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
                Math.cos(latitude1) *
                  Math.cos(latitude2) *
                  Math.sin(lonDiff / 2) *
                  Math.sin(lonDiff / 2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              const dist = R * c;
              return dist.toFixed(2);
            };
            return (
              <div
                key={landmark.id}
                style={{ marginBottom: "0.5rem", border: "1px solid #000" }}
              >
                <Typography variant="h6">{landmark.name}</Typography>
                <Typography variant="subtitle1">
                  {landmark.type} |
                  <span style={{ fontWeight: "bolder", color: "green" }}>
                    {calculateDistance()} Kilometres
                  </span>
                </Typography>
              </div>
            );
          })}
        </Grid>
        <Grid item xs={9}>
          <MapContainer
            center={[healthFacility.latitude, healthFacility.longitude]}
            zoom={13}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[healthFacility.latitude, healthFacility.longitude]}
            >
              <Popup>{healthFacility.name_of_health_facility}</Popup>
            </Marker>
            {healthFacility.landmarks_within_500M.map((landmark: Landmark) => {
              const landmarkIconDisplay = () => {
                if (landmark.type === "Social") {
                  return assormentIcon;
                } else if (landmark.type === "Transport") {
                  return busStopIcon;
                } else if (landmark.type === "Education") {
                  return schoolIcon;
                } else if (landmark.type === "Recreational") {
                  return stadiumIcon;
                } else if (landmark.type === "Commercial") {
                  return townHouseIcon;
                }
              };
              return (
                <Marker
                  key={landmark.id}
                  position={[
                    landmark.geom.coordinates[1],
                    landmark.geom.coordinates[0],
                  ]}
                  icon={landmarkIconDisplay()}
                >
                  <Popup>{landmark.name}</Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default FacilityDetail;
