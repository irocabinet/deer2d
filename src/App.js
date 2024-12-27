import React from "react";
import Header from "./components/Header";
import D3Graph from "./components/Graph";
import InfoOverlay from "./components/InfoOverlay";

// const technologyNodes = require("./data/technology.json");
// const projectNodes = require("./data/project.json");
// const technologyTechnologyLinks = require("./data/technology-technology.json");
// const projectTechnologyLinks = require("./data/project-technology.json");
// const allNodes = technologyNodes.concat(projectNodes);
// const allLinks = technologyTechnologyLinks.concat(projectTechnologyLinks);

const technologyNodes = require("./data/technology.json");
const projectNodes = require("./data/project.json");
const view1Nodes = require("./data/technology.json");
const view1Links = require("./data/technology-technology.json");
const view2Nodes = require("./data/technology.json");
const view2Links = require("./data/technology-technology.json");
const view3Nodes = require("./data/technology.json");
const view3Links = require("./data/technology-technology.json");
const allNodes = technologyNodes.concat(projectNodes);
const allLinks = view1Links.concat(view2Links).concat(view3Links);

const views = {
  "tn-test": {
    nodes: allNodes,
    links: allLinks,
  },
  "mn-test": {
    nodes: view2Nodes,
    links: view2Links,
  },
  "ts-test": {
    nodes: view3Nodes,
    links: view3Links,
  },
};
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: 0,
      windowHeight: 0,
      data: {
        nodes: allNodes,
        links: allLinks,
      },
      selectedNode: null,
      currentView: "tn-test", // Vizualizarea curentă
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.updateNodesAndLinks = this.updateNodesAndLinks.bind(this);
    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.handleHomeButtonClick = this.handleHomeButtonClick.bind(this);
    this.handleBackgroundClick = this.handleBackgroundClick.bind(this);
    this.handleViewChange = this.handleViewChange.bind(this); // Adăugat pentru a schimba vizualizarea
    this.fg = React.createRef();
  }

  // handleNodeClick(selectedNode) {
  //   const links = allLinks.filter((link) => {
  //     return (
  //       link.source.id === selectedNode.id || link.target.id === selectedNode.id
  //     );
  //   });
  //   const nodes = allNodes.filter((node) => {
  //     return (
  //       node.id === selectedNode.id ||
  //       links.reduce((isIn, curr) => {
  //         return (
  //           isIn || node.id === curr.source.id || node.id === curr.target.id
  //         );
  //       }, false)
  //     );
  //   });
  //   this.updateNodesAndLinks(selectedNode, nodes, links);
  //   this.fg.current.centerAt(selectedNode.x, selectedNode.y, 1000);
  //   this.fg.current.zoom(3, 1000);

  // }
  handleNodeClick(selectedNode) {
    const links = allLinks.filter((link) => {
      return (
        link.source.id === selectedNode.id || link.target.id === selectedNode.id
      );
    });
    const nodes = allNodes.filter((node) => {
      return (
        node.id === selectedNode.id ||
        links.reduce((isIn, curr) => {
          return (
            isIn || node.id === curr.source.id || node.id === curr.target.id
          );
        }, false)
      );
    });
    
    this.updateNodesAndLinks(selectedNode, nodes, links);
  
    // Zoom și centru pe nodul selectat
    this.fg.current.centerAt(selectedNode.x, selectedNode.y, 1000);
    this.fg.current.zoom(2, 1000); // Zoom mai apropiat pentru detalii
  }
  
  handleHomeButtonClick() {
    console.log("test");
    const allData = views["tn-test"]; // Vizualizarea implicită (sau toate nodurile și legăturile)
    this.setState({
      currentView: "tn-test", // Revine la vizualizarea implicită
      data: {
        nodes: allData.nodes,
        links: allData.links,
      },
      selectedNode: null,
    });
    this.fg.current.centerAt(10, 5, 1000);
    this.fg.current.zoom(2, 1000);
  }
  
  // handleHomeButtonClick() {
  //   this.updateNodesAndLinks(null, allNodes, allLinks);
  //   this.fg.current.centerAt(0, 0, 1000);
  //   this.fg.current.zoom(1, 1000);
  // }

  handleBackgroundClick() {
    this.updateNodesAndLinks(
      null,
      this.state.data.nodes,
      this.state.data.links
    );
  }
  handleViewChange(newView) {
    const viewData = views[newView] || { nodes: allNodes, links: allLinks };
    this.setState({
      currentView: newView,
      data: {
        nodes: viewData.nodes,
        links: viewData.links,
      },
      selectedNode: null,
    });
    this.fg.current.centerAt(10, 5, 1000);
    this.fg.current.zoom(2, 1000);
  }
//  handleViewChange(view) {
//     const viewData = this.getViewData(view); // Obține datele pentru vizualizarea selectată
//     this.setState({
//       currentView: view,
//       data: viewData,
//       selectedNode: null,
//     });
//     this.fg.current.centerAt(0, 0, 1000);
//     this.fg.current.zoom(1, 1000);
//   }
  updateNodesAndLinks(selectedNode, nodes, links, view = null) {
    const state = this.state;
    if (view) {
      if (view === "tn-test") {
          state.data.nodes = view1Nodes;
          state.data.links = view1Links;
      } else if (view === "mn-test") {
          state.data.nodes = view2Nodes;
          state.data.links = view2Links;
      } else if (view === "ts-test") {
          state.data.nodes = view3Nodes;
          state.data.links = view3Links;
      }
  } else {
      // Actualizare normală bazată pe nodul selectat
      state.selectedNode = selectedNode;
      state.data.nodes = nodes;
      state.data.links = links;
  }

    this.setState(state);
    state.selectedNode = selectedNode;
    // state.data.nodes = nodes;
    // state.data.links = links;
    // this.setState(state);
  }

  updateWindowDimensions() {
    const state = this.state;
    state.windowWidth = window.innerWidth;
    state.windowHeight = window.innerHeight;
    this.setState(state);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  render() {
    return (
      <div>
        <Header
  handleClick={this.handleHomeButtonClick}
  currentView={this.state.currentView} // Vizualizarea curentă
  onViewChange={this.handleViewChange} // Transmiterea metodei
/>
        <InfoOverlay
          windowWidth={this.state.windowWidth}
          windowHeight={this.state.windowHeight}
          selectedNode={this.state.selectedNode}
        />
        <D3Graph
          fg={this.fg}
          selectedNode={this.state.selectedNode}
          data={this.state.data}
          width={this.state.windowWidth}
          height={this.state.windowHeight}
          handleNodeClick={this.handleNodeClick}
          handleBackgroundClick={this.handleBackgroundClick}
        />
      </div>
    );
  }
}
