import React from "react";
import { Badge } from "../components/ui/badge";
import { useTheme } from "../hooks/use-theme";

const notifications = [
  {
    id: 1,
    icon: "🔔",
    title: "Penalty Notice Sent",
    desc: "12B, Sector 5, Mumbai – Sent on 20 July 2025",
    date: "20 July 2025, 10:32 AM",
    badge: "System",
  },
  {
    id: 2,
    icon: "📢",
    title: "Property Report Updated",
    desc: "201 Marine Drive, Colaba – Citizen report status changed.",
    date: "19 July 2025, 4:15 PM",
    badge: "Manual",
  },
  {
    id: 3,
    icon: "🤖",
    title: "AI Confirmation",
    desc: "AI confirmed vacancy for 7A, Bandra West, Mumbai.",
    date: "19 July 2025, 2:01 PM",
    badge: "System",
  },
  {
    id: 4,
    icon: "⚠️",
    title: "Urgent: Owner Appeal Filed",
    desc: "Appeal received for 9C, Andheri East, Mumbai.",
    date: "18 July 2025, 6:45 PM",
    badge: "Urgent",
  },
  {
    id: 5,
    icon: "📨",
    title: "Forwarded to Government",
    desc: "Case for 15D, Powai, Mumbai sent to municipal office.",
    date: "18 July 2025, 3:20 PM",
    badge: "System",
  },
  {
    id: 6,
    icon: "✅",
    title: "Manual Inspection Completed",
    desc: "Inspection done for 3B, Dadar, Mumbai.",
    date: "17 July 2025, 11:10 AM",
    badge: "Manual",
  },
  {
    id: 7,
    icon: "🔄",
    title: "Status Auto-Updated",
    desc: "AI auto-updated status for 8F, Malad, Mumbai.",
    date: "16 July 2025, 9:00 AM",
    badge: "System",
  },
  {
    id: 8,
    icon: "📋",
    title: "New Property Reported",
    desc: "Citizen reported 22A, Chembur, Mumbai.",
    date: "15 July 2025, 7:45 PM",
    badge: "Manual",
  },
  {
    id: 9,
    icon: "🚨",
    title: "Urgent: Penalty Overdue",
    desc: "Penalty overdue for 5E, Kurla, Mumbai.",
    date: "15 July 2025, 2:30 PM",
    badge: "Urgent",
  },
  {
    id: 10,
    icon: "🔍",
    title: "AI Review Scheduled",
    desc: "AI review scheduled for 11C, Borivali, Mumbai.",
    date: "14 July 2025, 5:00 PM",
    badge: "System",
  },
];

export default function NotificationCenter() {
  const { theme } = useTheme();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Notification Center</h1>
      <p className="text-muted-foreground mb-8">
        This page displays system activity logs such as penalty notices, property report updates, AI confirmations, and forwarded government actions.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="flex flex-row w-full bg-background dark:bg-background-dark rounded-2xl shadow-lg overflow-hidden items-center p-0 transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer"
            style={{ minHeight: 100 }}
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-24 h-24 bg-gray-100 dark:bg-gray-800 text-4xl md:text-5xl flex-shrink-0 rounded-l-2xl">
              {n.icon}
            </div>
            {/* Info */}
            <div className="flex-1 flex flex-col justify-center p-6">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-semibold text-lg">{n.title}</span>
                {n.badge && (
                  <Badge variant={n.badge === "Urgent" ? "destructive" : n.badge === "Manual" ? "secondary" : "default"}>
                    {n.badge}
                  </Badge>
                )}
              </div>
              <div className="text-muted-foreground text-sm mb-1">{n.desc}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{n.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 