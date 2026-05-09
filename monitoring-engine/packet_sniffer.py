from scapy.all import sniff
from scapy.layers.inet import IP, TCP, UDP

packets_data = []

def packet_callback(packet):

    if packet.haslayer(IP):

        source_ip = packet[IP].src
        destination_ip = packet[IP].dst

        protocol = "Other"

        if packet.haslayer(TCP):
            protocol = "TCP"

        elif packet.haslayer(UDP):
            protocol = "UDP"

        packet_info = {
            "source": source_ip,
            "destination": destination_ip,
            "protocol": protocol
        }

        packets_data.append(packet_info)

        print(packet_info)

sniff(prn=packet_callback, count=10)