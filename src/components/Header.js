import React from "react";
import { IconButton, Box, Select, MenuItem } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";

const containerStyle = {
  position: "absolute",
  zIndex: 101,
  marginTop: 10,
  marginLeft: 10,
};

const homeButtonStyle = {
  color: "black",
};

const titleStyle = {
  marginLeft: 10,
  marginTop: 14,
};

export default function Header(props) {
  const handleViewChange = (event) => {
    props.onViewChange(event.target.value); // Transmite selecția către componenta părinte
  };

  return (
    <Box display="flex" style={containerStyle} alignItems="center">
      <IconButton style={homeButtonStyle} onClick={props.handleHomeClick}>
        <HomeIcon />
      </IconButton>
      <Box fontWeight="fontWeightBold" style={titleStyle}>
        ESB-
      </Box>
      <Select
        value={props.currentView}
        onChange={handleViewChange}
        style={{ marginLeft: 20, minWidth: 120 }}
      >
        <MenuItem value="tn-test">TN-TEST</MenuItem>
        <MenuItem value="mn-test">MN-TEST</MenuItem>
        <MenuItem value="ts-test">TS-TEST</MenuItem>
      </Select>
    </Box>
  );
}
