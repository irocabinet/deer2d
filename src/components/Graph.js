import React, { useRef, useEffect } from "react"; 
import ForceGraph2D from "react-force-graph-2d";
const appearance = require("../appearance.json");

var supportsTouch = "ontouchstart" in window || navigator.msMaxTouchPoints;

export default function Graph(props) {
  const graphRef = useRef();
  // const [logsPerSecond, setLogsPerSecond] = useState([]);

  // useEffect(() => {
  //   const ws = new WebSocket("ws://localhost:3001"); // Conectare la serverul WebSocket

  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     setLogsPerSecond(data.logsPerSecond); // Actualizează starea cu datele primite
  //   };

  //   return () => {
  //     ws.close(); // Închide conexiunea WebSocket la dezmontarea componentelor
  //   };
  // }, []);
  // Funcție pentru emiterea particulelor
  const emitParticles = (node) => {
    if (graphRef.current) {
      graphRef.current.emitParticle(node, {
        color: "rgba(0, 255, 0, 0.8)", // Particule verzi, ajustabile
        speed: node.speed || 0.01,    // Folosește `node.speed` sau valoarea implicită
      });
    }
  };
  const getSpeed = (logCount) => {
    if (logCount >= 0 && logCount <= 10) return 0.05; // Viteza mică
    if (logCount > 10 && logCount <= 100) return 0.2; // Viteza medie
    if (logCount > 100 && logCount <= 500) return 0.5; // Viteza mare
    return 1; // Viteza maximă
  };

  const mapSpeedToVelocity = (speed) => {
    if (speed === 0) return 0; 
    if (speed <= 5) return 0.005; // Cea mai mică viteză
    if (speed <= 10) return 0.01; // O viteză mai mare
    if (speed <= 50) return 0.02;
    if (speed <= 100) return 0.03; // Mai rapid
    if (speed <= 500) return 0.05; // Cea mai mare viteză
    return 0; // Valoare implicită dacă lipsește sau este peste interval
  };
  return (
    <ForceGraph2D
    ref={(el) => {
      graphRef.current = el;
      if (props.fg) props.fg.current = el; // Legăm referința transmisă prin props
    }}
    enableNodeDrag={!supportsTouch}
    graphData={props.data}
    onNodeClick={props.handleNodeClick}
    onBackgroundClick={props.handleBackgroundClick}
    nodeColor={(node) => appearance[node.type].color}
    nodeVal={nodeSize}
    nodeCanvasObject={renderLabel}
    nodeCanvasObjectMode={() => "after"}
    linkDirectionalParticles={(link) => (link.speed === 0 ? 0 : 6)} // 0 particule pentru speed = 0
    linkDirectionalParticleSpeed={(link) =>
      mapSpeedToVelocity(link.speed) // Convertim valoarea speed în viteză
    }
    // linkWidth={(link) => {
    //   const logCount = logsPerSecond[link.source.id] || 0; // Obține numărul de loguri pentru fiecare legătură
    //   return getSpeed(logCount); // Setează viteza particulelor în funcție de loguri
    // }}
    linkDirectionalParticleColor={() => "rgba(0, 255, 255, 0.8)"} // Culoarea particulelor
  />
    // <ForceGraph2D
    //   ref={props.fg}
    //   enableNodeDrag={!supportsTouch}
    //   graphData={props.data}
    //   onNodeClick={props.handleNodeClick}
    //   onBackgroundClick={props.handleBackgroundClick}
    //   nodeColor={(node) => appearance[node.type].color}
    //   nodeVal={nodeSize}
    //   nodeCanvasObject={renderLabel}
    //   nodeCanvasObjectMode={() => "after"}
    // />
  );
}

function nodeSize(node) {
  if (node.skillLevel != null) return node.skillLevel;
  else return 5;
}

function renderLabel(node, ctx, globalScale) {
  if (globalScale < 1.5) return;
  const fontSize = 15 / globalScale;
  ctx.font = `${fontSize}px "Exo 2"`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "black";
  const bottomDistance = nodeSize(node) + 10;
  ctx.fillText(node.name, node.x, node.y + bottomDistance);
}
