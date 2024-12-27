const express = require("express");
const WebSocket = require("ws");
const { Client } = require('@opensearch-project/opensearch');

// Configurare OpenSearch
const osClient = new Client({
  node: 'https://your-opensearch-url',
  auth: {
    username: 'your-username',
    password: 'your-password'
  }
});

// Crearea serverului WebSocket
const app = express();
const wss = new WebSocket.Server({ noServer: true });

// API pentru OpenSearch query
async function getLogsCount() {
  const response = await osClient.search({
    index: 'your-index-name',
    body: {
      size: 0,
      query: {
        match_all: {}
      },
      aggs: {
        log_count_per_second: {
          date_histogram: {
            field: "@timestamp",
            interval: "second"
          }
        }
      }
    }
  });

  const logsPerSecond = response.body.aggregations.log_count_per_second.buckets.map(bucket => bucket.doc_count);
  return logsPerSecond;
}

// Transmiterea datelor prin WebSocket
wss.on('connection', (ws) => {
  setInterval(async () => {
    const logsPerSecond = await getLogsCount();
    // Trimite numărul de loguri per secundă către client
    ws.send(JSON.stringify({ logsPerSecond }));
  }, 1000); // Actualizează la fiecare secundă
});

// Setarea serverului Express pentru WebSocket
app.server = app.listen(3001, () => {
  console.log("Serverul WebSocket rulează pe portul 3001");
});

app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
