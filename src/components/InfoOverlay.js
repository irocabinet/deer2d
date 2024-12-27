import React from "react";
import { Box, Container } from "@material-ui/core";
const appearance = require("../appearance.json");

const style = {
  position: "absolute",
  zIndex: 101,
  minHeight: 1,
  borderRadius: 16,
  paddingBottom: 10,
};

export default function InfoOverlay(props) {
  if (noNodeSelected(props.selectedNode)) {
    return null;
  }
  const dynamicStyle = createDynamicStyle(
    props.selectedNode,
    props.windowWidth,
    props.windowHeight
  );

  return (
    <Container style={dynamicStyle}>
      <CommonProperties selectedNode={props.selectedNode} />
      <TypeProperties selectedNode={props.selectedNode} />
    </Container>
  );
}

function noNodeSelected(selectedNode) {
  return selectedNode === null;
}

function createDynamicStyle(selectedNode, windowWidth, windowHeight) {
  const dynamicStyle = {
    ...style,
    backgroundColor: appearance[selectedNode.type].color,
  };
  if (isNarrowScreen(windowWidth)) {
    dynamicStyle["maxWidth"] = windowWidth - 20;
    dynamicStyle["top"] = windowHeight - 75;
    dynamicStyle["left"] = 10;
    dynamicStyle["marginBottom"] = 10;
  } else {
    dynamicStyle["maxWidth"] = windowWidth / 4;
    dynamicStyle["maxHeight"] = windowHeight - 40;
    dynamicStyle["top"] = 20;
    dynamicStyle["right"] = 20;
    dynamicStyle["overflowY"] = "scroll";
  }
  return dynamicStyle;
}

function isNarrowScreen(windowWidth) {
  return windowWidth <= 400;
}

function CommonProperties(props) {
  return (
    <>
      <h6>{props.selectedNode.type.toUpperCase()}</h6>
      <h2>{props.selectedNode.name}</h2>
      <p>{props.selectedNode.description}</p>
    </>
  );
}

function TypeProperties(props) {
  if (props.selectedNode.type === "Sistem") {
    return <ProjectPropertiesDiv selectedNode={props.selectedNode} />;
  } else if (props.selectedNode.type === "flux") {
    return <TechnologyProperties selectedNode={props.selectedNode} />;
  } else {
    return null;
  }
}

function ProjectPropertiesDiv(props) {
  const sn = props.selectedNode;
  const grade = sn.grade ? sn.grade.toString() + "/100" : null;
  const altText = "Diagrama " + sn.name;
  return (
    <>
      <OneLineProperty displayName="Status2" property={sn.year} />
      <OneLineProperty displayName="Implementare2" property={grade} />
      <Link displayName="Legatura2" property={sn.website} />
      <Link displayName="Endpoint2" property={sn.code} />
      <Image altText={altText} property={sn.image} />
    </>
  );
}

function TechnologyProperties(props) {
  const sn = props.selectedNode;
  return (
    <OneLineProperty
      displayName="Status Trafic"
      property={skillLevelMap(sn.skillLevel)}
    />
  );
}

function skillLevelMap(n) {
  if (n === 0) {
    return "inca nimic";
  } else if (n === 1) {
    return "scazut";
  } else if (n === 2) {
    return "moderat";
  } else if (n === 3) {
    return "ridicat";
  } else if (n === 4) {
    return "foarte ridicat";
  } else {
    return "";
  }
}

function OneLineProperty(props) {
  const displayName = props.displayName;
  const property = props.property;
  if (!property) {
    return null;
  } else {
    return <p>{displayName + ": " + property}</p>;
  }
}

function Link(props) {
  const displayName = props.displayName;
  const property = props.property;
  if (!property) {
    return null;
  } else {
    return (
      <>
        <Box>{displayName + ":"}</Box>
        <a href={property} target="_blank" rel="noopener noreferrer">
          {property}{" "}
        </a>
        <p />
      </>
    );
  }
}

function Image(props) {
  const altText = props.altText;
  const property = props.property;
  if (!property) {
    return null;
  } else {
    return (
      <>
        <a href={property} target="_blank" rel="noopener noreferrer">
          <img src={property} alt={altText} width={"100%"} />
        </a>
        <p />
      </>
    );
  }
}
