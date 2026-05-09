from flask import Flask, jsonify
from flask_cors import CORS

import psutil
import socket

from scapy.all import sniff
from scapy.layers.inet import IP, TCP, UDP

app = Flask(__name__)
CORS(app)

packets_data = []

alerts = []
ip_counter = {}


@app.route('/')
def home():
    return "Monitoring API Running"


@app.route('/system')
def system_monitor():

    network = psutil.net_io_counters()

    system_data = {
        "hostname": socket.gethostname(),
        "cpu": psutil.cpu_percent(interval=1),
        "ram": psutil.virtual_memory().percent,
        "disk": psutil.disk_usage('/').percent,
        "bytes_sent": network.bytes_sent,
        "bytes_received": network.bytes_recv
    }

    return jsonify(system_data)


@app.route('/processes')
def process_monitor():

    process_list = []

    for process in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):

        try:

            cpu_usage = process.info['cpu_percent']
            memory_usage = round(process.info['memory_percent'], 2)

            suspicious = False

            if cpu_usage > 50 or memory_usage > 20:
                suspicious = True

            process_info = {
                "pid": process.info['pid'],
                "name": process.info['name'],
                "cpu": cpu_usage,
                "memory": memory_usage,
                "suspicious": suspicious
            }

            process_list.append(process_info)

        except:
            pass

    process_list = sorted(process_list, key=lambda x: x['cpu'], reverse=True)

    return jsonify(process_list[:10])


def packet_callback(packet):

    if packet.haslayer(IP):

        protocol = "Other"

        if packet.haslayer(TCP):
            protocol = "TCP"

        elif packet.haslayer(UDP):
            protocol = "UDP"

        packet_info = {
            "source": packet[IP].src,
            "destination": packet[IP].dst,
            "protocol": protocol
        }

        packets_data.append(packet_info)

        source_ip = packet[IP].src

        if source_ip not in ip_counter:
            ip_counter[source_ip] = 0

        ip_counter[source_ip] += 1

        severity = None

        if ip_counter[source_ip] > 20:
            severity = "HIGH"

        elif ip_counter[source_ip] > 10:
            severity = "MEDIUM"

        if severity:

            alert = {
                "ip": source_ip,
                "reason": "Suspicious traffic detected",
                "severity": severity
            }

            if alert not in alerts:
                alerts.append(alert)


@app.route('/packets')
def packets():

    sniff(prn=packet_callback, count=5)

    return jsonify(packets_data[-5:])


@app.route('/alerts')
def get_alerts():

    return jsonify(alerts)

@app.route('/ai-threat-analysis')
def ai_threat_analysis():

    total_alerts = len(alerts)

    suspicious_processes = 0

    for process in psutil.process_iter(['cpu_percent', 'memory_percent']):

        try:

            cpu = process.info['cpu_percent']
            memory = process.info['memory_percent']

            if cpu > 50 or memory > 20:
                suspicious_processes += 1

        except:
            pass

    threat_score = min(
        100,
        (total_alerts * 15) + (suspicious_processes * 5)
    )

    risk_level = "LOW"

    recommendation = "System operating normally"

    if threat_score > 70:

        risk_level = "HIGH"

        recommendation = "Immediate investigation recommended"

    elif threat_score > 40:

        risk_level = "MEDIUM"

        recommendation = "Monitor suspicious activity closely"

    analysis = {
        "threat_score": threat_score,
        "risk_level": risk_level,
        "recommendation": recommendation,
        "alerts_detected": total_alerts,
        "suspicious_processes": suspicious_processes
    }

    return jsonify(analysis)

if __name__ == '__main__':
    app.run(debug=True)