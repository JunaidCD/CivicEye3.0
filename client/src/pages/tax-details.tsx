import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Calendar, 
  Download,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

export default function TaxDetails() {
  const { data: taxData = [], isLoading } = useQuery({
    queryKey: ["/api/tax-notices"],
  });

  // Mock comprehensive tax data
  const taxStats = {
    totalPenalties: "$127,450",
    collected: "$89,320",
    pending: "$38,130",
    collectionRate: 70.1,
    activeNotices: 23,
    paidNotices: 45,
    overdueNotices: 8
  };

  const recentNotices = [
    {
      id: 1,
      property: "1247 Oak Street, District 5",
      amount: "$8,450",
      dueDate: "2024-02-15",
      status: "Paid",
      transactionHash: "0x4a7b...9e2f",
      penalties: ["Late Payment Fee: $150", "Interest: $300"],
      daysOverdue: 0
    },
    {
      id: 2,
      property: "892 Commercial Ave, Downtown",
      amount: "$23,680",
      dueDate: "2024-02-20",
      status: "Pending",
      transactionHash: "0x8c1d...3f4a",
      penalties: ["Vacancy Penalty: $20,000", "Administrative Fee: $3,680"],
      daysOverdue: 15
    },
    {
      id: 3,
      property: "789 Industrial Way, West Side",
      amount: "$45,200",
      dueDate: "2024-01-30",
      status: "Overdue",
      transactionHash: null,
      penalties: ["Chronic Vacancy: $40,000", "Legal Fees: $5,200"],
      daysOverdue: 35
    },
    {
      id: 4,
      property: "321 Elm Avenue, Eastside",
      amount: "$12,750",
      dueDate: "2024-02-25",
      status: "Processing",
      transactionHash: "0x2e9a...7b1c",
      penalties: ["Vacancy Assessment: $10,000", "Processing Fee: $2,750"],
      daysOverdue: 5
    }
  ];

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
              <div className="text-2xl font-bold">{taxStats.totalPenalties}</div>
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
              <div className="text-2xl font-bold text-green-600">{taxStats.collected}</div>
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
              <div className="text-2xl font-bold text-yellow-600">{taxStats.pending}</div>
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
                        {notice.daysOverdue > 0 && (
                          <span className="text-red-600">
                            {notice.daysOverdue} days overdue
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
                        <div className="text-xs text-muted-foreground">Penalties:</div>
                        {notice.penalties.map((penalty, idx) => (
                          <div key={idx} className="text-xs text-muted-foreground ml-2">
                            • {penalty}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold">{notice.amount}</div>
                      <div className="text-xs text-muted-foreground">Total Due</div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                      <Button size="sm">
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
    </div>
  );
}