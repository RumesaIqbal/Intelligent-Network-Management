import os
import re
import psutil
import socket
import sqlite3
from datetime import datetime, timedelta
from collections import defaultdict, Counter
import platform

class NetworkLogSummarization:
    """MODULE 1: Network Log Summarization - Analyzes logs and generates insights"""
    
    def __init__(self):
        self.log_patterns = {
            'authentication_failures': r'authentication failed|login failed|invalid credentials|access denied',
            'connection_issues': r'connection.*lost|disconnected|timeout|failed to connect',
            'dns_issues': r'dns.*error|domain.*not.*found|name resolution',
            'bandwidth_issues': r'bandwidth.*exceeded|high.*usage|slow.*performance',
            'security_threats': r'firewall.*blocked|unauthorized.*access|port.*scan',
            'service_disruptions': r'service.*stopped|dhcp.*failure|vpn.*disconnected'
        }
    
    def _format_bytes(self, bytes):
        """Format bytes to human readable format"""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if bytes < 1024.0:
                return f"{bytes:.1f}{unit}"
            bytes /= 1024.0
        return f"{bytes:.1f}TB"
    
    def run_module(self):
        """Main function to run the Log Summarization module"""
        print("\n" + "="*60)
        print("📋 MODULE 1: NETWORK LOG SUMMARIZATION")
        print("="*60)
        print("Analyzing system logs and generating insights...")
        
        # Collect and analyze logs
        self.raw_logs = self._collect_system_logs()  # Store logs as instance variable
        print(f"📊 Collected {len(self.raw_logs)} log entries from system")
        
        # Analyze patterns
        analysis_results = self._analyze_log_patterns(self.raw_logs)
        
        # Generate summary
        summary = self._generate_comprehensive_summary(analysis_results)
        
        # Display results
        self._display_log_summary(summary)
        
        input("\nPress Enter to return to main menu...")
    
    def _collect_system_logs(self):
        """Collect system logs from various sources"""
        logs = []
        current_time = datetime.now()
        
        try:
            # Network statistics
            net_io = psutil.net_io_counters()
            logs.extend([
                {
                    'timestamp': current_time,
                    'message': f"Network Traffic - Sent: {self._format_bytes(net_io.bytes_sent)} | Received: {self._format_bytes(net_io.bytes_recv)}",
                    'source': 'Network-Statistics',
                    'severity': 'INFO'
                },
                {
                    'timestamp': current_time,
                    'message': f"Packet Statistics - Sent: {net_io.packets_sent} | Received: {net_io.packets_recv} | Errors: {net_io.errin + net_io.errout}",
                    'source': 'Network-Statistics', 
                    'severity': 'WARNING' if (net_io.errin + net_io.errout) > 0 else 'INFO'
                }
            ])
            
            # Connection analysis
            connections = psutil.net_connections()
            established_count = len([c for c in connections if c.status == 'ESTABLISHED'])
            logs.append({
                'timestamp': current_time,
                'message': f"Connection Analysis - Established: {established_count} | Total: {len(connections)}",
                'source': 'Connection-Analysis',
                'severity': 'INFO'
            })
            
            # Interface status - REMOVED LIMIT
            interfaces = psutil.net_if_stats()
            for interface, stats in interfaces.items():  # ← REMOVED [:3] LIMIT
                status = "UP" if stats.isup else "DOWN"
                logs.append({
                    'timestamp': current_time,
                    'message': f"Interface {interface}: {status} | Speed: {stats.speed}Mbps",
                    'source': 'Interface-Status',
                    'severity': 'INFO' if stats.isup else 'WARNING'
                })
            
            # Process network usage - INCREASED LIMIT
            process_connections = defaultdict(list)
            for conn in connections:
                if conn.pid:
                    process_connections[conn.pid].append(conn)
            
            # Show more processes - increased from 3 to 10
            top_processes = sorted(process_connections.items(), key=lambda x: len(x[1]), reverse=True)[:10]  # ← INCREASED LIMIT
            for pid, conns in top_processes:
                try:
                    process = psutil.Process(pid)
                    logs.append({
                        'timestamp': current_time,
                        'message': f"Process {process.name()} (PID: {pid}): {len(conns)} connections",
                        'source': 'Process-Network',
                        'severity': 'INFO'
                    })
                except:
                    continue
                    
        except Exception as e:
            logs.append({
                'timestamp': current_time,
                'message': f"Log collection error: {e}",
                'source': 'System',
                'severity': 'ERROR'
            })
        
        return logs
    def _analyze_log_patterns(self, logs):
        """Analyze logs to detect patterns and issues"""
        analysis = {
            'total_logs': len(logs),
            'patterns_detected': defaultdict(list),
            'severity_distribution': Counter(),
            'source_distribution': Counter(),
            'key_metrics': {}
        }
        
        # Pattern recognition
        for log in logs:
            analysis['severity_distribution'][log['severity']] += 1
            analysis['source_distribution'][log['source']] += 1
            
            for pattern_name, pattern in self.log_patterns.items():
                if re.search(pattern, log['message'], re.IGNORECASE):
                    analysis['patterns_detected'][pattern_name].append(log)
        
        # Calculate key metrics
        try:
            net_io = psutil.net_io_counters()
            analysis['key_metrics'] = {
                'total_data_transferred': net_io.bytes_sent + net_io.bytes_recv,
                'error_rate': (net_io.errin + net_io.errout) / max(1, net_io.packets_sent + net_io.packets_recv),
                'connection_success_rate': self._calculate_connection_success_rate(),
                'interface_uptime_percentage': self._calculate_interface_uptime()
            }
        except Exception as e:
            analysis['key_metrics']['error'] = str(e)
        
        return analysis
    
    def _calculate_connection_success_rate(self):
        """Calculate connection success rate"""
        try:
            connections = psutil.net_connections()
            established = len([c for c in connections if c.status == 'ESTABLISHED'])
            total = len(connections)
            return (established / total * 100) if total > 0 else 100
        except:
            return 0
    
    def _calculate_interface_uptime(self):
        """Calculate percentage of interfaces that are up"""
        try:
            interfaces = psutil.net_if_stats()
            up_count = sum(1 for stats in interfaces.values() if stats.isup)
            return (up_count / len(interfaces) * 100) if interfaces else 0
        except:
            return 0
    
    def _generate_comprehensive_summary(self, analysis):
        """Generate human-readable summary from analysis"""
        summary = {
            'executive_summary': [],
            'detailed_insights': [],
            'recommendations': [],
            'health_score': 100
        }
        
        # Executive summary
        summary['executive_summary'].append(f"Analyzed {analysis['total_logs']} network events")
        summary['executive_summary'].append(f"Found {len(analysis['patterns_detected'])} distinct issue patterns")
        summary['executive_summary'].append(f"Severity distribution: {dict(analysis['severity_distribution'])}")
        
        # Detailed insights from patterns
        for pattern, logs in analysis['patterns_detected'].items():
            if logs:
                insight = f"🔍 {pattern.replace('_', ' ').title()}: {len(logs)} occurrences"
                summary['detailed_insights'].append(insight)
                
                # Adjust health score based on issues
                if pattern in ['security_threats', 'authentication_failures']:
                    summary['health_score'] -= len(logs) * 10
                elif pattern in ['connection_issues', 'service_disruptions']:
                    summary['health_score'] -= len(logs) * 5
        
        # Performance insights
        if analysis['key_metrics'].get('error_rate', 0) > 0.01:
            summary['detailed_insights'].append("📊 High network error rate detected")
            summary['health_score'] -= 10
        
        if analysis['key_metrics'].get('connection_success_rate', 100) < 90:
            summary['detailed_insights'].append("🔌 Connection success rate below optimal")
            summary['health_score'] -= 5
        
        # Generate recommendations
        if summary['health_score'] < 80:
            summary['recommendations'].append("🚨 Review network configuration and security settings")
        if any(pattern in analysis['patterns_detected'] for pattern in ['bandwidth_issues', 'connection_issues']):
            summary['recommendations'].append("💡 Consider network optimization and load balancing")
        if not analysis['patterns_detected']:
            summary['recommendations'].append("✅ Network operating optimally - continue monitoring")
        
        summary['health_score'] = max(0, summary['health_score'])
        
        return summary
    
    def _display_log_summary(self, summary):
        """Display the comprehensive log summary"""
        print(f"\n📈 LOG ANALYSIS SUMMARY:")
        print(f"   Network Health Score: {summary['health_score']}/100")
        
        print(f"\n📋 EXECUTIVE SUMMARY:")
        for item in summary['executive_summary']:
            print(f"   • {item}")
        
        # NEW FEATURE: Display all collected logs
        print(f"\n📜 ALL COLLECTED LOGS ({len(self.raw_logs)} log entries):")
        for i, log in enumerate(self.raw_logs, 1):
            print(f"   {i}. [{log['severity']}] {log['source']}: {log['message']}")
            print(f"      🕒 {log['timestamp'].strftime('%Y-%m-%d %H:%M:%S')}")
        
        print(f"\n🔍 DETAILED INSIGHTS:")
        if summary['detailed_insights']:
            for insight in summary['detailed_insights']:
                print(f"   • {insight}")
        else:
            print(f"   • No significant issues detected")
        
        print(f"\n💡 RECOMMENDATIONS:")
        for recommendation in summary['recommendations']:
            print(f"   • {recommendation}")

class AutomatedAlertClassification:
    """MODULE 2: Automated Alert Classification - Classifies issues by severity"""
    
    def __init__(self):
        self.alert_rules = {
            'CRITICAL': [
                (r'CPU Usage', 10, "Immediate attention required"),      # 10% = CRITICAL!
                (r'Memory Usage', 10, "System may become unstable"),     # 10% = CRITICAL!
                (r'Internet Connectivity.*Disconnected', 0, "Network connectivity lost"),
                (r'Disk Usage', 10, "Critical disk space")               # 10% = CRITICAL!
            ],
            'WARNING': [
                (r'CPU Usage', 5, "High CPU usage"),                     # 5% = WARNING!
                (r'Memory Usage', 5, "High memory usage"),               # 5% = WARNING!
                (r'Network Errors', 1, "Network issues detected"),       # 1+ errors
                (r'Packet.*drop', 1, "Packet loss occurring")
            ],
            'INFO': [
                (r'Active Connections', 0, "Connection monitoring"),
                (r'Internet Connectivity.*Connected', 0, "Internet active")
            ]
        }
    
    def run_module(self):
        """Main function to run the Alert Classification module"""
        print("\n" + "="*60)
        print("🚨 MODULE 2: AUTOMATED ALERT CLASSIFICATION")
        print("="*60)
        print("Monitoring system and classifying alerts by severity...")
        
        # Monitor system for potential issues
        system_metrics = self._monitor_system_metrics()
        print(f"📊 Monitored {len(system_metrics)} system metrics")
        
        # Classify each metric into alert severity
        alerts = self._classify_alerts(system_metrics)
        
        # Prioritize and categorize alerts
        organized_alerts = self._organize_alerts_by_severity(alerts)
        
        # Display classified alerts
        self._display_classified_alerts(organized_alerts)
        
        input("\nPress Enter to return to main menu...")
    
    def _monitor_system_metrics(self):
        """Monitor various system metrics for alert generation"""
        metrics = []
        current_time = datetime.now()
        
        try:
            # CPU Monitoring
            cpu_percent = psutil.cpu_percent(interval=1)
            metrics.append({
                'timestamp': current_time,
                'metric': 'CPU Usage',
                'value': f"{cpu_percent}%",
                'raw_value': cpu_percent,
                'device': 'System'
            })
            
            # Memory Monitoring
            memory = psutil.virtual_memory()
            metrics.append({
                'timestamp': current_time,
                'metric': 'Memory Usage',
                'value': f"{memory.percent}%",
                'raw_value': memory.percent,
                'device': 'System'
            })
            
            # Disk Monitoring
            disk = psutil.disk_usage('/')
            metrics.append({
                'timestamp': current_time,
                'metric': 'Disk Usage',
                'value': f"{disk.percent}%",
                'raw_value': disk.percent,
                'device': 'Storage'
            })
            
            # Network Error Monitoring
            net_io = psutil.net_io_counters()
            error_count = net_io.errin + net_io.errout
            metrics.append({
                'timestamp': current_time,
                'metric': 'Network Errors',
                'value': f"{error_count} errors",
                'raw_value': error_count,
                'device': 'Network'
            })
            
            # Connection Count Monitoring
            connections = psutil.net_connections()
            established_count = len([c for c in connections if c.status == 'ESTABLISHED'])
            metrics.append({
                'timestamp': current_time,
                'metric': 'Active Connections',
                'value': f"{established_count} connections",
                'raw_value': established_count,
                'device': 'Network'
            })
            
            # Internet Connectivity
            internet_status = self._check_internet_connectivity()
            metrics.append({
                'timestamp': current_time,
                'metric': 'Internet Connectivity',
                'value': internet_status,
                'raw_value': 0 if '✅' in internet_status else 100,
                'device': 'Network'
            })
            
        except Exception as e:
            metrics.append({
                'timestamp': current_time,
                'metric': 'Monitoring System',
                'value': f"Error: {e}",
                'raw_value': 100,
                'device': 'Monitor',
                'severity': 'CRITICAL'
            })
        
        return metrics
    
    def _check_internet_connectivity(self):
        """Check internet connectivity"""
        try:
            socket.create_connection(("8.8.8.8", 53), timeout=5)
            return "✅ Connected"
        except:
            return "❌ Disconnected"
    
    def _classify_alerts(self, metrics):
        """Classify each metric into appropriate alert severity"""
        alerts = []
        
        for metric in metrics:
            # If severity already assigned (like for monitoring errors)
            if 'severity' in metric:
                alerts.append(metric)
                continue
            
            severity = 'INFO'
            message = metric['value']
            
            # Apply classification rules
            for severity_level, rules in self.alert_rules.items():
                for pattern, threshold, description in rules:
                    if re.search(pattern, metric['metric'] + " " + metric['value'], re.IGNORECASE):
                        if isinstance(metric['raw_value'], (int, float)):
                            if metric['raw_value'] >= threshold:
                                severity = severity_level
                                message = f"{description}: {metric['value']}"
                                break
            
            alerts.append({
                'timestamp': metric['timestamp'],
                'metric': metric['metric'],
                'message': message,
                'severity': severity,
                'device': metric['device']
            })
        
        return alerts
    
    def _organize_alerts_by_severity(self, alerts):
        """Organize alerts by severity level for prioritization"""
        organized = {
            'CRITICAL': [],
            'WARNING': [],
            'INFO': [],
            'summary': {
                'total_alerts': len(alerts),
                'critical_count': 0,
                'warning_count': 0,
                'health_status': 'HEALTHY'
            }
        }
        
        for alert in alerts:
            organized[alert['severity']].append(alert)
        
        # Update summary
        organized['summary']['critical_count'] = len(organized['CRITICAL'])
        organized['summary']['warning_count'] = len(organized['WARNING'])
        
        # Determine overall health status
        if organized['summary']['critical_count'] > 0:
            organized['summary']['health_status'] = 'CRITICAL'
        elif organized['summary']['warning_count'] > 0:
            organized['summary']['health_status'] = 'WARNING'
        else:
            organized['summary']['health_status'] = 'HEALTHY'
        
        return organized
    
    def _display_classified_alerts(self, organized_alerts):
        """Display alerts organized by severity"""
        summary = organized_alerts['summary']
        
        print(f"\n📊 ALERT SUMMARY:")
        print(f"   Overall Status: {summary['health_status']}")
        print(f"   Critical Alerts: {summary['critical_count']}")
        print(f"   Warning Alerts: {summary['warning_count']}")
        print(f"   Total Active Alerts: {summary['total_alerts']}")
        
        # NEW FEATURE: Display all monitored metrics
        print(f"\n📈 ALL MONITORED METRICS ({summary['total_alerts']} metrics):")
        
        # Combine all alerts for display
        all_alerts = organized_alerts['CRITICAL'] + organized_alerts['WARNING'] + organized_alerts['INFO']
        
        for i, alert in enumerate(all_alerts, 1):
            severity_icon = "🔴" if alert['severity'] == 'CRITICAL' else "🟡" if alert['severity'] == 'WARNING' else "🔵"
            print(f"   {i}. {severity_icon} [{alert['severity']}] {alert['metric']}: {alert['message']}")
            print(f"      📱 Device: {alert['device']} | 🕒 {alert['timestamp'].strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Display critical alerts separately for emphasis
        if organized_alerts['CRITICAL']:
            print(f"\n🔴 CRITICAL ALERTS (Require Immediate Attention):")
            for alert in organized_alerts['CRITICAL']:
                print(f"   • {alert['message']}")
                print(f"     📱 {alert['device']} | 🕒 {alert['timestamp'].strftime('%H:%M:%S')}")
        
        # Display warning alerts separately for emphasis
        if organized_alerts['WARNING']:
            print(f"\n🟡 WARNING ALERTS (Monitor Closely):")
            for alert in organized_alerts['WARNING']:
                print(f"   • {alert['message']}")
                print(f"     📱 {alert['device']} | 🕒 {alert['timestamp'].strftime('%H:%M:%S')}")
        
        # Display info alerts count
        info_count = len(organized_alerts['INFO'])
        if info_count > 0:
            print(f"\n🔵 INFORMATIONAL ALERTS: {info_count} normal operations")
        
        if summary['critical_count'] == 0 and summary['warning_count'] == 0:
            print(f"\n✅ No critical or warning alerts - System is healthy")

class ChatOpsAssistant:
    """MODULE 3: ChatOps for Network Management - Interactive troubleshooting assistant"""
    
    def __init__(self, log_summarizer, alert_classifier):
        self.log_summarizer = log_summarizer
        self.alert_classifier = alert_classifier
        self.commands = {
            'help': self._show_help,
            'status': self._show_status,
            'alerts': self._show_alerts,
            'summary': self._show_summary,
            'troubleshoot': self._troubleshoot,
            'diagnose': self._run_diagnostics,
            'scan': self._scan_network,
            'processes': self._show_processes,
            'bandwidth': self._show_bandwidth,
            'connections': self._show_connections,
            'interfaces': self._show_interfaces,
            'exit': self._exit_chat
        }
        
        self.troubleshooting_guide = {
            'internet': [
                "1. Check physical network cable connections",
                "2. Restart your router and modem", 
                "3. Try pinging your gateway: ping 192.168.1.1",
                "4. Flush DNS cache: ipconfig /flushdns",
                "5. Contact your ISP if issue persists"
            ],
            'wifi': [
                "1. Move closer to the wireless access point",
                "2. Restart your wireless router",
                "3. Check for interference from other devices",
                "4. Forget and reconnect to the WiFi network",
                "5. Update wireless adapter drivers"
            ],
            'slow': [
                "1. Check for bandwidth-intensive applications",
                "2. Run speed test to measure actual performance", 
                "3. Restart networking equipment",
                "4. Check for background updates/downloads",
                "5. Contact network administrator for analysis"
            ],
            'dns': [
                "1. Flush DNS cache: ipconfig /flushdns",
                "2. Try alternative DNS servers (8.8.8.8, 1.1.1.1)",
                "3. Check DNS server settings",
                "4. Restart DNS client service",
                "5. Check hosts file for incorrect entries"
            ]
        }
    
    def run_module(self):
        """Main function to run the ChatOps module"""
        print("\n" + "="*60)
        print("💬 MODULE 3: CHATOPS NETWORK ASSISTANT")
        print("="*60)
        print("🤖 Hello! I'm your Network Management Assistant.")
        print("   I can help you monitor, troubleshoot, and manage your network.")
        
        self._show_help()
        
        while True:
            try:
                user_input = input("\n💬 Enter command (or 'back' to return to main menu): ").strip()
                
                if not user_input:
                    continue
                
                if user_input.lower() == 'back':
                    print("Returning to main menu...")
                    break
                
                response = self._process_command(user_input)
                
                if response == "exit":
                    print("\n👋 Thank you for using the Network Management Assistant!")
                    break
                
                print(f"\n🤖 Assistant: {response}")
                
            except KeyboardInterrupt:
                print("\n\n👋 Returning to main menu...")
                break
            except Exception as e:
                print(f"\n❌ Error: {e}. Type 'help' for available commands.")
    
    def _process_command(self, user_input):
        """Process user commands and return responses"""
        parts = user_input.lower().split()
        if not parts:
            return "Please enter a command. Type 'help' for available commands."
        
        command = parts[0]
        args = parts[1:] if len(parts) > 1 else None
        
        if command in self.commands:
            return self.commands[command](args)
        else:
            return f"Unknown command '{command}'. Type 'help' for available commands."
    
    def _show_help(self, args=None):
        """Show available commands"""
        return """
Available Commands:

• help - Show this help message
• status - Show current network status
• alerts - Display current system alerts
• summary - Show log analysis summary
• troubleshoot <issue> - Get troubleshooting help
• diagnose - Run comprehensive diagnostics
• scan - Scan network interfaces and connections
• processes - Show top network processes
• bandwidth - Show bandwidth usage statistics
• connections - Show active network connections
• interfaces - Show network interface details
• exit - Quit the assistant
• back - Return to main menu

Examples:
  troubleshoot internet
  status
  scan
  processes
  bandwidth
  connections
  interfaces
"""
    
    def _show_status(self, args=None):
        """Show current network status"""
        try:
            # Get basic network information
            hostname = socket.gethostname()
            local_ip = socket.gethostbyname(hostname)
            
            # Check internet connectivity
            try:
                socket.create_connection(("8.8.8.8", 53), timeout=5)
                internet_status = "✅ Connected"
            except:
                internet_status = "❌ Disconnected"
            
            # Get network statistics
            net_io = psutil.net_io_counters()
            connections = psutil.net_connections()
            established = len([c for c in connections if c.status == 'ESTABLISHED'])
            
            status_report = f"""
🌐 NETWORK STATUS OVERVIEW:

Basic Information:
  • Hostname: {hostname}
  • Local IP: {local_ip}
  • Internet: {internet_status}

Current Metrics:
  • Data Sent: {self._format_bytes(net_io.bytes_sent)}
  • Data Received: {self._format_bytes(net_io.bytes_recv)}
  • Active Connections: {established}
  • Network Errors: {net_io.errin + net_io.errout}

System Health:
  • CPU Usage: {psutil.cpu_percent()}%
  • Memory Usage: {psutil.virtual_memory().percent}%
"""
            return status_report
            
        except Exception as e:
            return f"❌ Error getting status: {e}"
    
    def _show_alerts(self, args=None):
        """Display current system alerts"""
        try:
            # Simulate alert collection and classification
            system_metrics = self.alert_classifier._monitor_system_metrics()
            alerts = self.alert_classifier._classify_alerts(system_metrics)
            organized_alerts = self.alert_classifier._organize_alerts_by_severity(alerts)
            
            # Build alert summary
            summary = organized_alerts['summary']
            alert_report = [f"📊 ALERT SUMMARY:"]
            alert_report.append(f"  Overall Status: {summary['health_status']}")
            alert_report.append(f"  Critical Alerts: {summary['critical_count']}")
            alert_report.append(f"  Warning Alerts: {summary['warning_count']}")
            alert_report.append(f"  Total Active Alerts: {summary['total_alerts']}")
            
            # Show critical alerts if any
            if organized_alerts['CRITICAL']:
                alert_report.append(f"\n🔴 CRITICAL ALERTS:")
                for alert in organized_alerts['CRITICAL']:
                    alert_report.append(f"  • {alert['message']}")
            
            # Show warning alerts if any
            if organized_alerts['WARNING']:
                alert_report.append(f"\n🟡 WARNING ALERTS:")
                for alert in organized_alerts['WARNING']:
                    alert_report.append(f"  • {alert['message']}")
            
            return "\n".join(alert_report)
            
        except Exception as e:
            return f"❌ Error retrieving alerts: {e}"
    
    def _show_summary(self, args=None):
        """Show log analysis summary"""
        try:
            # Simulate log collection and analysis
            logs = self.log_summarizer._collect_system_logs()
            analysis = self.log_summarizer._analyze_log_patterns(logs)
            summary = self.log_summarizer._generate_comprehensive_summary(analysis)
            
            summary_report = [f"📈 LOG ANALYSIS SUMMARY:"]
            summary_report.append(f"  Network Health Score: {summary['health_score']}/100")
            
            summary_report.append(f"\n📋 EXECUTIVE SUMMARY:")
            for item in summary['executive_summary']:
                summary_report.append(f"  • {item}")
            
            summary_report.append(f"\n🔍 DETAILED INSIGHTS:")
            if summary['detailed_insights']:
                for insight in summary['detailed_insights']:
                    summary_report.append(f"  • {insight}")
            else:
                summary_report.append(f"  • No significant issues detected")
            
            return "\n".join(summary_report)
            
        except Exception as e:
            return f"❌ Error generating summary: {e}"
    
    def _troubleshoot(self, args):
        """Provide troubleshooting assistance for common issues"""
        if not args:
            return "Please specify an issue. Usage: troubleshoot <internet|wifi|slow|dns>"
        
        issue = args[0].lower()
        if issue not in self.troubleshooting_guide:
            return f"Unknown issue '{issue}'. Available: internet, wifi, slow, dns"
        
        steps = self.troubleshooting_guide[issue]
        steps_text = "\n".join([f"  {step}" for step in steps])
        
        return f"""
🔧 TROUBLESHOOTING: {issue.upper()}

Recommended Steps:
{steps_text}

💡 Need more help? Contact your network administrator.
"""
    
    def _run_diagnostics(self, args=None):
        """Run comprehensive network diagnostics"""
        try:
            diagnostics = []
            
            # Internet connectivity test
            try:
                socket.create_connection(("8.8.8.8", 53), timeout=5)
                diagnostics.append("✅ Internet Connectivity: PASS")
            except:
                diagnostics.append("❌ Internet Connectivity: FAIL")
            
            # DNS resolution test
            try:
                socket.gethostbyname("google.com")
                diagnostics.append("✅ DNS Resolution: PASS")
            except:
                diagnostics.append("❌ DNS Resolution: FAIL")
            
            # Local network test
            interfaces = psutil.net_if_stats()
            up_interfaces = sum(1 for stats in interfaces.values() if stats.isup)
            diagnostics.append(f"📡 Network Interfaces: {up_interfaces}/{len(interfaces)} active")
            
            # Resource check
            cpu = psutil.cpu_percent()
            memory = psutil.virtual_memory().percent
            diagnostics.append(f"💻 System Resources: CPU {cpu}%, Memory {memory}%")
            
            # Connection test
            connections = psutil.net_connections()
            established = len([c for c in connections if c.status == 'ESTABLISHED'])
            diagnostics.append(f"🔗 Active Connections: {established} established")
            
            diagnostics_text = "\n".join([f"  • {diag}" for diag in diagnostics])
            
            return f"""
🔍 COMPREHENSIVE DIAGNOSTICS:

{diagnostics_text}

💡 All diagnostics completed. Review results above.
"""
        except Exception as e:
            return f"❌ Diagnostics error: {e}"
    
    def _scan_network(self, args=None):
        """Scan and display network interfaces and connections"""
        try:
            interfaces = psutil.net_if_addrs()
            connections = psutil.net_connections()
            
            scan_report = ["🔍 NETWORK SCAN REPORT:"]
            
            # Interface details
            scan_report.append("\n🌐 NETWORK INTERFACES:")
            for interface, addrs in list(interfaces.items())[:5]:  # Show top 5
                scan_report.append(f"  📡 {interface}:")
                for addr in addrs:
                    if addr.family == socket.AF_INET:  # IPv4
                        scan_report.append(f"    IP: {addr.address} | Netmask: {addr.netmask}")
            
            # Connection summary
            established = len([c for c in connections if c.status == 'ESTABLISHED'])
            listen = len([c for c in connections if c.status == 'LISTEN'])
            
            scan_report.append(f"\n🔗 CONNECTION SUMMARY:")
            scan_report.append(f"  • Established: {established}")
            scan_report.append(f"  • Listening: {listen}")
            scan_report.append(f"  • Total: {len(connections)}")
            
            return "\n".join(scan_report)
        except Exception as e:
            return f"❌ Scan error: {e}"
    
    def _show_processes(self, args=None):
        """Show top processes using network"""
        try:
            connections = psutil.net_connections()
            process_connections = defaultdict(list)
            
            for conn in connections:
                if conn.pid:
                    process_connections[conn.pid].append(conn)
            
            top_processes = sorted(process_connections.items(), key=lambda x: len(x[1]), reverse=True)[:5]
            
            process_report = ["🖥️ TOP NETWORK PROCESSES:"]
            
            for pid, conns in top_processes:
                try:
                    process = psutil.Process(pid)
                    process_report.append(f"  • {process.name()} (PID: {pid}): {len(conns)} connections")
                    process_report.append(f"    Status: {process.status()} | CPU: {process.cpu_percent()}%")
                except:
                    process_report.append(f"  • Unknown Process (PID: {pid}): {len(conns)} connections")
            
            if not top_processes:
                process_report.append("  • No active network processes found")
            
            return "\n".join(process_report)
        except Exception as e:
            return f"❌ Process scan error: {e}"
    
    def _show_bandwidth(self, args=None):
        """Show bandwidth usage statistics"""
        try:
            net_io = psutil.net_io_counters()
            
            bandwidth_report = ["📊 BANDWIDTH USAGE:"]
            
            bandwidth_report.append(f"  📤 Data Sent: {self._format_bytes(net_io.bytes_sent)}")
            bandwidth_report.append(f"  📥 Data Received: {self._format_bytes(net_io.bytes_recv)}")
            bandwidth_report.append(f"  📦 Packets Sent: {net_io.packets_sent:,}")
            bandwidth_report.append(f"  📦 Packets Received: {net_io.packets_recv:,}")
            bandwidth_report.append(f"  ❌ Errors In: {net_io.errin}")
            bandwidth_report.append(f"  ❌ Errors Out: {net_io.errout}")
            bandwidth_report.append(f"  🚫 Packets Dropped In: {net_io.dropin}")
            bandwidth_report.append(f"  🚫 Packets Dropped Out: {net_io.dropout}")
            
            # Calculate error rates
            total_packets = net_io.packets_sent + net_io.packets_recv
            error_rate = (net_io.errin + net_io.errout) / max(1, total_packets) * 100
            
            if error_rate > 1:
                bandwidth_report.append(f"  ⚠️  Error Rate: {error_rate:.2f}% (High)")
            else:
                bandwidth_report.append(f"  ✅ Error Rate: {error_rate:.2f}% (Normal)")
            
            return "\n".join(bandwidth_report)
        except Exception as e:
            return f"❌ Bandwidth monitoring error: {e}"
    
    def _show_connections(self, args=None):
        """Show detailed active network connections"""
        try:
            connections = psutil.net_connections()
            established_conns = [c for c in connections if c.status == 'ESTABLISHED']
            
            connection_report = ["🔗 ACTIVE CONNECTIONS:"]
            connection_report.append(f"  Total Established: {len(established_conns)}")
            
            # Show top 10 established connections
            connection_report.append("\n  🌐 RECENT ESTABLISHED CONNECTIONS:")
            for conn in established_conns[:10]:
                local_addr = f"{conn.laddr.ip}:{conn.laddr.port}" if conn.laddr else "N/A"
                remote_addr = f"{conn.raddr.ip}:{conn.raddr.port}" if conn.raddr else "N/A"
                
                connection_report.append(f"    • {local_addr} ↔ {remote_addr}")
                if conn.pid:
                    try:
                        process = psutil.Process(conn.pid)
                        connection_report.append(f"      Process: {process.name()} (PID: {conn.pid})")
                    except:
                        connection_report.append(f"      Process: Unknown (PID: {conn.pid})")
            
            # Connection type breakdown
            status_count = {}
            for conn in connections:
                status_count[conn.status] = status_count.get(conn.status, 0) + 1
            
            connection_report.append(f"\n  📈 CONNECTION BREAKDOWN:")
            for status, count in status_count.items():
                connection_report.append(f"    • {status}: {count}")
            
            return "\n".join(connection_report)
        except Exception as e:
            return f"❌ Connection monitoring error: {e}"
    
    def _show_interfaces(self, args=None):
        """Show detailed network interface information"""
        try:
            interfaces = psutil.net_if_stats()
            interface_addrs = psutil.net_if_addrs()
            
            interface_report = ["📡 NETWORK INTERFACES:"]
            
            for interface, stats in list(interfaces.items())[:8]:  # Show top 8 interfaces
                status_icon = "✅" if stats.isup else "❌"
                duplex = "Full" if stats.duplex == 2 else "Half" if stats.duplex == 1 else "Unknown"
                
                interface_report.append(f"\n  {status_icon} {interface}:")
                interface_report.append(f"    Status: {'UP' if stats.isup else 'DOWN'}")
                interface_report.append(f"    Speed: {stats.speed} Mbps")
                interface_report.append(f"    Duplex: {duplex}")
                interface_report.append(f"    MTU: {stats.mtu}")
                
                # Show IP addresses for this interface
                if interface in interface_addrs:
                    for addr in interface_addrs[interface]:
                        if addr.family == socket.AF_INET:
                            interface_report.append(f"    IP: {addr.address}/{addr.netmask}")
            
            return "\n".join(interface_report)
        except Exception as e:
            return f"❌ Interface monitoring error: {e}"
    
    def _exit_chat(self, args=None):
        """Exit the chat interface"""
        return "exit"
    
    def _format_bytes(self, bytes):
        """Format bytes to human readable format"""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if bytes < 1024.0:
                return f"{bytes:.1f}{unit}"
            bytes /= 1024.0
        return f"{bytes:.1f}TB"
    

def display_menu():
    """Display the main menu"""
    print("\n" + "="*70)
    print("🤖 INTELLIGENT NETWORK MANAGEMENT SYSTEM")
    print("="*70)
    print("\n" + "="*70)
    print("📋 MAIN MENU - Choose a module to run:")
    print("="*70)
    print("1. 📊 Network Log Summarization")
    print("   - Analyze system logs and generate insights")
    print("   - Pattern recognition and trend analysis")
    print("   - Health scoring and recommendations")
    print()
    print("2. 🚨 Automated Alert Classification") 
    print("   - Real-time system monitoring")
    print("   - Severity-based alert classification")
    print("   - Critical/Warning/Info alert prioritization")
    print()
    print("3. 💬 ChatOps Network Assistant")
    print("   - Interactive troubleshooting interface")
    print("   - Real-time diagnostics and status")
    print("   - Step-by-step problem resolution")
    print()
    print("4. 🎯 Run All Modules (Complete Demo)")
    print("   - Execute all three modules sequentially")
    print("   - Comprehensive system demonstration")
    print()
    print("0. ❌ Exit System")
    print("="*70)


def main():
    """Main function with menu-driven system"""
    
    # Check for required package
    try:
        import psutil
        print("✅ Required package 'psutil' is available")
    except ImportError:
        print("❌ ERROR: Required package 'psutil' is not installed.")
        print("   Please install it using: pip install psutil")
        return
    
    # Initialize the three core modules
    log_summarizer = NetworkLogSummarization()
    alert_classifier = AutomatedAlertClassification()
    chat_ops = ChatOpsAssistant(log_summarizer, alert_classifier)
    
    while True:
        # Clear screen and display menu
        os.system('cls' if os.name == 'nt' else 'clear')
        display_menu()
        
        try:
            choice = input("\n🎯 Enter your choice (0-4): ").strip()
            
            if choice == '1':
                log_summarizer.run_module()
                
            elif choice == '2':
                alert_classifier.run_module()
                
            elif choice == '3':
                chat_ops.run_module()
                
            elif choice == '4':
                print("\n" + "="*70)
                print("🚀 RUNNING ALL MODULES - COMPLETE DEMONSTRATION")
                print("="*70)
                
                # Run Module 1
                log_summarizer.run_module()
                
                # Run Module 2  
                alert_classifier.run_module()
                
                # Run Module 3
                chat_ops.run_module()
                
                print("\n✅ All modules completed successfully!")
                input("Press Enter to return to main menu...")
                
            elif choice == '0':
                print("\n👋 Thank you for using the Intelligent Network Management System!")
                print("   Goodbye! 🚀")
                break
                
            else:
                print("\n❌ Invalid choice! Please enter a number between 0 and 4.")
                input("Press Enter to continue...")
                
        except KeyboardInterrupt:
            print("\n\n👋 System interrupted. Goodbye!")
            break
        except Exception as e:
            print(f"\n❌ An error occurred: {e}")
            input("Press Enter to continue...")


if __name__ == "__main__":
    main()