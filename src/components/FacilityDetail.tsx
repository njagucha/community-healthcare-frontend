import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";

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
            <CheckBoxIcon style={{ color: "green", fontSize: "2rem" }} />
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
    </div>
  );
};

export default FacilityDetail;
