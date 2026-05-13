import { useEffect, useState } from "react";
import axios from "axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function App() {


  const [systemData, setSystemData] = useState({
    cpu: 0,
    ram: 0,
    disk: 0
  });

  const [processes, setProcesses] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [packets, setPackets] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState({});
  const [lastUpdated, setLastUpdated] = useState("");



  // Fetch system monitoring data
  const fetchSystemData = async () => {

    try {

      const response = await axios.get("https://ai-cloud-monitor-api.onrender.com/system");

      setSystemData(response.data);
      setChartData(prevData => [

        ...prevData.slice(-9),

        {
          time: new Date().toLocaleTimeString(),
          cpu: response.data.cpu,
          ram: response.data.ram,
          disk: response.data.disk
        }

      ]);

      setLastUpdated(new Date().toLocaleTimeString());

    } catch (error) {

      console.log(error);

    }

  };



  // Fetch running processes
  const fetchProcesses = async () => {

    try {

      const response = await axios.get("https://ai-cloud-monitor-api.onrender.com/processes");

      setProcesses(response.data);

    } catch (error) {

      console.log(error);

    }

  };
  const fetchAlerts = async () => {

    try {

      const response = await axios.get("https://ai-cloud-monitor-api.onrender.com/alerts");

      setAlerts(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const fetchPackets = async () => {

    try {

      const response = await axios.get("https://ai-cloud-monitor-api.onrender.com/packets");

      setPackets(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const fetchAIAnalysis = async () => {

    try {

      const response = await axios.get(
        "https://ai-cloud-monitor-api.onrender.com/ai-threat-analysis"
      );

      setAiAnalysis(response.data);

    } catch (error) {

      console.log(error);

    }

  };


  // Auto refresh every 3 seconds
  useEffect(() => {

    fetchSystemData();
    fetchAlerts();
    fetchPackets();
    fetchProcesses();
    fetchAIAnalysis();




    const interval = setInterval(() => {

      fetchSystemData();
      fetchAlerts();
      fetchPackets();
      fetchProcesses();
      fetchAIAnalysis();

    }, 3000);

    return () => clearInterval(interval);

  }, []);



  return (

    <div style={{
      display: "flex",
      backgroundColor: "#020617",
      minHeight: "100vh",
      color: "white",
      fontFamily: "Arial"
    }}>

      {/* Sidebar */}
      <div style={{
        width: "250px",
        backgroundColor: "#0f172a",
        padding: "25px",
        borderRight: "1px solid #1e293b"
      }}>

        <h1 style={{
          color: "#38bdf8",
          marginBottom: "40px"
        }}>
          NetSecure AI
        </h1>

        <div>

          <p style={{ marginBottom: "25px", cursor: "pointer" }}>
            📊 Dashboard
          </p>

          <p style={{ marginBottom: "25px", cursor: "pointer" }}>
            🖥️ Processes
          </p>

          <p style={{ marginBottom: "25px", cursor: "pointer" }}>
            ⚠️ Alerts
          </p>

          <p style={{ marginBottom: "25px", cursor: "pointer" }}>
            📡 Traffic
          </p>

          <p style={{ marginBottom: "25px", cursor: "pointer" }}>
            📈 Analytics
          </p>

        </div>

      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: "30px"
      }}>
        {/* Top Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>

          <div>

            <h1>Cloud Network Monitoring Dashboard</h1>

            <p style={{ color: "#94a3b8" }}>
              Last Updated: {lastUpdated}
            </p>

          </div>

        </div>



        {/* Monitoring Cards */}
        <div style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px",
          flexWrap: "wrap"
        }}>

          {/* CPU */}
          <div style={{
            backgroundColor: "#1e293b",
            padding: "25px",
            borderRadius: "15px",
            width: "220px",
            boxShadow: "0px 0px 15px rgba(56,189,248,0.3)"
          }}>

            <h3>CPU Usage</h3>

            <h1 style={{ color: "#38bdf8" }}>
              {systemData.cpu}%
            </h1>

          </div>



          {/* RAM */}
          <div style={{
            backgroundColor: "#1e293b",
            padding: "25px",
            borderRadius: "15px",
            width: "220px",
            boxShadow: "0px 0px 15px rgba(34,197,94,0.3)"
          }}>

            <h3>RAM Usage</h3>

            <h1 style={{ color: "#22c55e" }}>
              {systemData.ram}%
            </h1>

          </div>



          {/* DISK */}
          <div style={{
            backgroundColor: "#1e293b",
            padding: "25px",
            borderRadius: "15px",
            width: "220px",
            boxShadow: "0px 0px 15px rgba(249,115,22,0.3)"
          }}>

            <h3>Disk Usage</h3>

            <h1 style={{ color: "#f97316" }}>
              {systemData.disk}%
            </h1>

          </div>

        </div>



        {/* Process Monitoring Table */}
        <div style={{ marginTop: "40px" }}>

          <h2>Running Processes</h2>

          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px"
          }}>

            <thead>

              <tr style={{ backgroundColor: "#1e293b" }}>

                <th style={{ padding: "10px" }}>Process</th>

                <th style={{ padding: "10px" }}>CPU %</th>

                <th style={{ padding: "10px" }}>Memory %</th>

                <th style={{ padding: "10px" }}>Threat</th>

              </tr>

            </thead>



            <tbody>

              {processes.map((process, index) => (

                <tr
                  key={index}
                  style={{
                    backgroundColor: process.suspicious
                      ? "#7f1d1d"
                      : "#0f172a"
                  }}
                >

                  <td style={{ padding: "10px" }}>
                    {process.name}
                  </td>

                  <td style={{ padding: "10px" }}>
                    {process.cpu}
                  </td>

                  <td style={{ padding: "10px" }}>
                    {process.memory}
                  </td>

                  <td style={{ padding: "10px" }}>
                    {process.suspicious ? "⚠️ YES" : "SAFE"}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
        <div style={{ marginTop: "40px" }}>

          <h2>⚠️ Security Alerts</h2>

          {alerts.length === 0 ? (

            <p>No threats detected</p>

          ) : (

            alerts.map((alert, index) => (

              <div
                key={index}
                style={{
                  backgroundColor:
                    alert.severity === "HIGH"
                      ? "#7f1d1d"
                      : "#78350f",

                  padding: "15px",
                  marginTop: "10px",
                  borderRadius: "10px"
                }}
              >

                <h3>{alert.ip}</h3>

                <p>{alert.reason}</p>

                <strong>{alert.severity}</strong>

              </div>

            ))

          )}
        </div>
        <div style={{ marginTop: "40px" }}>

          <h2>📡 Live Network Traffic</h2>

          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px"
          }}>

            <thead>

              <tr style={{ backgroundColor: "#1e293b" }}>

                <th style={{ padding: "10px" }}>Source IP</th>

                <th style={{ padding: "10px" }}>Destination IP</th>

                <th style={{ padding: "10px" }}>Protocol</th>

              </tr>

            </thead>

            <tbody>

              {packets.map((packet, index) => (

                <tr key={index}>

                  <td style={{ padding: "10px" }}>
                    {packet.source}
                  </td>

                  <td style={{ padding: "10px" }}>
                    {packet.destination}
                  </td>

                  <td style={{ padding: "10px" }}>
                    {packet.protocol}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
        <div style={{ marginTop: "50px" }}>

          <h2>📊 System Analytics</h2>

          <div style={{
            backgroundColor: "#1e293b",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "20px"
          }}>

            <ResponsiveContainer width="100%" height={300}>

              <LineChart data={chartData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="time" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="cpu"
                  stroke="#38bdf8"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="ram"
                  stroke="#22c55e"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="disk"
                  stroke="#f97316"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>
        <div style={{ marginTop: "50px" }}>

          <h2>🤖 AI Threat Intelligence</h2>

          <div style={{
            backgroundColor: "#1e293b",
            padding: "25px",
            borderRadius: "15px",
            marginTop: "20px",
            boxShadow: "0px 0px 15px rgba(239,68,68,0.3)"
          }}>

            <h1 style={{
              color:
                aiAnalysis.risk_level === "HIGH"
                  ? "#ef4444"
                  : aiAnalysis.risk_level === "MEDIUM"
                    ? "#f59e0b"
                    : "#22c55e"
            }}>
              Threat Score: {aiAnalysis.threat_score}%
            </h1>

            <h2>
              Risk Level: {aiAnalysis.risk_level}
            </h2>

            <p style={{ marginTop: "15px" }}>
              {aiAnalysis.recommendation}
            </p>

            <div style={{ marginTop: "20px" }}>

              <p>
                Alerts Detected:
                {" "}
                {aiAnalysis.alerts_detected}
              </p>

              <p>
                Suspicious Processes:
                {" "}
                {aiAnalysis.suspicious_processes}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default App;