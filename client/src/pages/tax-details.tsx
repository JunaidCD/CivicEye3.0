import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Calendar, 
  Download,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock,
  Info
} from "lucide-react";
import { useState } from "react";

function formatINR(amount: number | string) {
  // Accepts number or string, returns Indian formatted string with ₹
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^\d.]/g, '')) : amount;
  if (isNaN(num)) return amount;
  return `₹${num.toLocaleString('en-IN')}`;
}

export default function TaxDetails() {
  // Mock comprehensive tax data (all INR)
  const taxStats = {
    totalPenalties: 127450,
    collected: 89320,
    pending: 38130,
    collectionRate: 70.1,
    activeNotices: 23,
    paidNotices: 45,
    overdueNotices: 8
  };

  // Dummy data for recent notices (Mumbai addresses)
  const recentNotices = [
    {
      id: 1,
      property: "201 Marine Drive, Colaba, Mumbai",
      basePenalty: 7000,
      interest: 900,
      fees: 550,
      totalDue: 8450,
      dueDate: "2025-07-15",
      status: "Paid",
      transactionHash: "0x4a7b...9e2f",
      legalOwnershipInfo: "Owner deceased — No mutation filed",
      noticeSent: "2025-06-30",
      reminder: "2025-07-10"
    },
    {
      id: 2,
      property: "14 Linking Road, Bandra West, Mumbai",
      basePenalty: 20000,
      interest: 1800,
      fees: 1880,
      totalDue: 23680,
      dueDate: "2025-07-20",
      status: "Pending",
      transactionHash: "0x8c1d...3f4a",
      legalOwnershipInfo: "No legal heir found",
      noticeSent: "2025-07-01",
      reminder: "2025-07-15"
    },
    {
      id: 3,
      property: "88 Sion Trombay Road, Chembur, Mumbai",
      basePenalty: 40000,
      interest: 3200,
      fees: 2000,
      totalDue: 45200,
      dueDate: "2025-06-30",
      status: "Overdue",
      transactionHash: null,
      legalOwnershipInfo: "Forwarded to Municipality",
      noticeSent: "2025-06-10"
    },
    {
      id: 4,
      property: "501 Hiranandani Gardens, Powai, Mumbai",
      basePenalty: 10000,
      interest: 1200,
      fees: 1550,
      totalDue: 12750,
      dueDate: "2025-07-25",
      status: "Processing",
      transactionHash: "0x2e9a...7b1c",
      noticeSent: "2025-07-05"
    },
    {
      id: 5,
      property: "77 Palm Beach Road, Navi Mumbai",
      basePenalty: 15000,
      interest: 1200,
      fees: 1250,
      totalDue: 17450,
      dueDate: "2025-07-18",
      status: "Paid",
      transactionHash: "0x7f2c...1b9d",
      legalOwnershipInfo: null,
      noticeSent: "2025-07-01",
      reminder: "2025-07-10"
    }
  ];

  // Dialog state
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);
  const openDialog = (id: number) => setOpenDialogId(id);
  const closeDialog = () => setOpenDialogId(null);

  // Dialog content component
  function NoticeDialog({ notice }: { notice: typeof recentNotices[0] }) {
    const statusColor =
      notice.status === "Confirmed Vacant"
        ? "#ef4444"
        : notice.status === "Reported"
        ? "#22c55e"
        : notice.status === "Pending"
        ? "#eab308"
        : notice.status === "Paid"
        ? "#22c55e"
        : notice.status === "Overdue"
        ? "#ef4444"
        : "#3b82f6";
    return (
      <div
        style={{
          minWidth: 340,
          maxWidth: 420,
          borderRadius: 18,
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.25)",
          padding: 28,
          background: "#23272f",
          color: "#fff",
          fontFamily: "inherit",
          lineHeight: 1.7,
          position: "relative",
        }}
      >
        <button
          onClick={closeDialog}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontSize: 20,
            zIndex: 2,
          }}
        >
          ×
        </button>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 20 }}>{notice.property}</span>
          <span
            style={{
              marginLeft: 12,
              padding: "4px 16px",
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              background: statusColor,
              display: "inline-block",
            }}
          >
            {notice.status}
          </span>
        </div>
        <div style={{ fontSize: 15, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 7 }}>
            <Calendar size={16} color="#60a5fa" style={{ marginRight: 8 }} />
            <span>
              Due: <span style={{ fontWeight: 600 }}>{notice.dueDate}</span>
            </span>
          </div>
          {notice.noticeSent && (
            <div style={{ display: "flex", alignItems: "center", marginBottom: 7 }}>
              <Calendar size={16} color="#60a5fa" style={{ marginRight: 8 }} />
              <span>
                Notice Sent: <span style={{ fontWeight: 600 }}>{notice.noticeSent}</span>
              </span>
            </div>
          )}
          {notice.reminder && (
            <div style={{ display: "flex", alignItems: "center", marginBottom: 7 }}>
              <Calendar size={16} color="#60a5fa" style={{ marginRight: 8 }} />
              <span>
                Reminder: <span style={{ fontWeight: 600 }}>{notice.reminder}</span>
              </span>
            </div>
          )}
          {notice.transactionHash && (
            <div style={{ display: "flex", alignItems: "center", marginBottom: 7 }}>
              <ExternalLink size={16} color="#a3a3a3" style={{ marginRight: 8 }} />
              <span style={{ fontWeight: 600 }}>{notice.transactionHash}</span>
            </div>
          )}
        </div>
        <div style={{ fontSize: 15, marginBottom: 10 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Penalty Breakdown:</div>
          <div style={{ marginLeft: 8 }}>
            <div>Base Penalty: <span style={{ fontWeight: 500 }}>{formatINR(notice.basePenalty)}</span></div>
            <div>Interest: <span style={{ fontWeight: 500 }}>{formatINR(notice.interest)}</span></div>
            <div>Legal/Admin Fees: <span style={{ fontWeight: 500 }}>{formatINR(notice.fees)}</span></div>
            <div style={{ fontWeight: 700, marginTop: 6 }}>Total Due: <span style={{ color: "#38bdf8" }}>{formatINR(notice.totalDue)}</span></div>
          </div>
        </div>
        {notice.legalOwnershipInfo && (
          <div
            style={{
              borderLeft: '4px solid #6366f1',
              background: 'rgba(99,102,241,0.08)',
              borderRadius: 8,
              padding: '12px 16px',
              marginTop: 18,
              marginBottom: 8,
              minHeight: 48,
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            <Info size={20} color="#6366f1" style={{ marginRight: 12, marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#6366f1', marginBottom: 2 }}>Legal Ownership Info</div>
              <div style={{ fontSize: 16, color: '#6366f1', fontStyle: 'italic', fontWeight: 500 }}>{notice.legalOwnershipInfo}</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <CheckCircle className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Overdue":
        return <AlertTriangle className="w-4 h-4" />;
      case "Processing":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Tax Details & Enforcement</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Comprehensive overview of tax penalties, collection status, and enforcement actions for vacant properties.
          </p>
        </div>

        {/* Tax Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Total Penalties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatINR(taxStats.totalPenalties)}</div>
              <p className="text-xs text-muted-foreground">+12.3% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Collected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatINR(taxStats.collected)}</div>
              <div className="flex items-center mt-2">
                <Progress value={taxStats.collectionRate} className="flex-1 mr-2" />
                <span className="text-xs text-muted-foreground">{taxStats.collectionRate}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{formatINR(taxStats.pending)}</div>
              <p className="text-xs text-muted-foreground">{taxStats.activeNotices} active notices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{taxStats.overdueNotices}</div>
              <p className="text-xs text-muted-foreground">notices overdue</p>
            </CardContent>
          </Card>
        </div>

        {/* Collection Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Collection Progress Overview</CardTitle>
            <p className="text-sm text-muted-foreground">
              Year-to-date performance and collection efficiency metrics
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">{taxStats.paidNotices}</div>
                <div className="text-sm text-muted-foreground">Paid Notices</div>
                <div className="text-xs text-green-600 mt-1">+8 this month</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">{taxStats.activeNotices}</div>
                <div className="text-sm text-muted-foreground">Active Notices</div>
                <div className="text-xs text-blue-600 mt-1">Processing</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-3xl font-bold text-red-600 mb-2">{taxStats.overdueNotices}</div>
                <div className="text-sm text-muted-foreground">Overdue Notices</div>
                <div className="text-xs text-red-600 mt-1">Requires action</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tax Notices */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tax Notices</CardTitle>
            <p className="text-sm text-muted-foreground">
              Latest enforcement actions and penalty assessments
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(notice.status)}
                      <Badge className={getStatusColor(notice.status)}>
                        {notice.status}
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{notice.property}</h4>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Due: {notice.dueDate}
                        </span>
                        {notice.noticeSent && (
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Notice Sent: {notice.noticeSent}
                          </span>
                        )}
                        {notice.reminder && (
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Reminder: {notice.reminder}
                          </span>
                        )}
                        {notice.transactionHash && (
                          <span className="flex items-center">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            {notice.transactionHash}
                          </span>
                        )}
                      </div>
                      <div className="mt-2">
                        <div className="text-xs text-muted-foreground mb-1">Penalty Breakdown:</div>
                        <div className="ml-2 text-xs">
                          <div>Base Penalty: <span className="font-medium">{formatINR(notice.basePenalty)}</span></div>
                          <div>Interest: <span className="font-medium">{formatINR(notice.interest)}</span></div>
                          <div>Legal/Admin Fees: <span className="font-medium">{formatINR(notice.fees)}</span></div>
                          <div className="font-bold mt-1">Total Due: <span className="text-primary">{formatINR(notice.totalDue)}</span></div>
                        </div>
                        {notice.legalOwnershipInfo && (
                          <div
                            className="mt-3 mb-1 flex items-start"
                            style={{
                              borderLeft: '4px solid #6366f1',
                              background: 'rgba(99,102,241,0.08)',
                              borderRadius: 8,
                              padding: '10px 14px',
                              marginTop: 14,
                              marginBottom: 6,
                              minHeight: 48
                            }}
                          >
                            <Info size={18} color="#6366f1" style={{ marginRight: 10, marginTop: 2, flexShrink: 0 }} />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 14, color: '#6366f1', marginBottom: 2 }}>Legal Ownership Info</div>
                              <div style={{ fontSize: 15, color: '#6366f1', fontStyle: 'italic', fontWeight: 500 }}>{notice.legalOwnershipInfo}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold">{formatINR(notice.totalDue)}</div>
                      <div className="text-xs text-muted-foreground">Total Due</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                      <Button size="sm" onClick={() => openDialog(notice.id)}>
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog Overlay */}
      {openDialogId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.45)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <NoticeDialog notice={recentNotices.find(n => n.id === openDialogId)!} />
        </div>
      )}
    </div>
  );
}