import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, MapPin, Calendar, AlertTriangle, TrendingUp, Users, DollarSign } from "lucide-react";

const verificationRules = [
  {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />, text: "3 or more citizen reports submitted for the same property"
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />, text: "AI vacancy detection score greater than 80%"
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />, text: "No electricity or water usage in the last 6+ months"
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />, text: "Property flagged in public grievance portal more than once"
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />, text: "Owner is deceased and no legal heir has filed mutation"
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />, text: "No access/movement detected via CCTV or smart meter"
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />, text: "Property tax unpaid for more than 2 years"
  },
];

const sampleProperties = [
  {
    address: "201 Marine Drive, Colaba, Mumbai",
    lastChecked: "18 July 2025",
    rules: [true, true, true, false, true, true, false],
    final: "suspected",
    image: "https://plus.unsplash.com/premium_photo-1680281937048-735543c5c0f7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDA%3D", // Mumbai escalator/urban
    vacancyScore: 87,
    reports: 3,
    lastUtility: "8 months ago",
    estimatedTaxLoss: 718250
  },
  {
    address: "14 Linking Road, Bandra West, Mumbai",
    lastChecked: "15 July 2025",
    rules: [true, true, true, true, true, true, true],
    final: "confirmed",
    image: "https://plus.unsplash.com/premium_photo-1678903964473-1271ecfb0288?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D", // Mumbai street/building
    vacancyScore: 94,
    reports: 7,
    lastUtility: "14 months ago",
    estimatedTaxLoss: 2012800
  },
  {
    address: "88 Sion Trombay Road, Chembur, Mumbai",
    lastChecked: "12 July 2025",
    rules: [false, true, false, false, false, false, false],
    final: "suspected",
    image: "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D", // Mumbai construction/lot
    vacancyScore: 72,
    reports: 2,
    lastUtility: "3 months ago",
    estimatedTaxLoss: 444550
  },
];

function formatINR(amount: number | string) {
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^\d.]/g, '')) : amount;
  if (isNaN(num)) return amount;
  return `₹${num.toLocaleString('en-IN')}`;
}

export default function VerifyStatus() {
  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Vacancy Verification Rules & Status</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          This page outlines the conditions under which a property is marked as vacant by the system, using citizen input, AI analysis, utility records, and government data.
        </p>

        {/* Verification Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {verificationRules.map((rule, idx) => (
            <Card key={idx} className="flex items-center border border-muted-foreground/10">
              <CardContent className="flex items-center gap-3 py-4">
                {rule.icon}
                <span className="text-base text-foreground">{rule.text}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sample Property Status Cards */}
        <h2 className="text-2xl font-bold mb-4">Sample Property Status</h2>
        <div className="space-y-6">
          {sampleProperties.map((prop, idx) => (
            <Card
              key={idx}
              className="flex flex-col md:flex-row overflow-hidden border border-muted-foreground/10 transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.025] hover:shadow-2xl bg-background rounded-2xl"
              style={{ minHeight: 220, maxWidth: 900, margin: 'auto' }}
            >
              <div
                className="flex flex-row w-full bg-background dark:bg-background-dark rounded-2xl shadow-lg overflow-hidden"
                style={{ minHeight: 220, maxWidth: 900, margin: 'auto' }}
              >
                {/* Left: Image */}
                <div
                  className="md:w-64 w-full h-full flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
                  style={{ borderTopLeftRadius: 16, borderBottomLeftRadius: 16, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                >
                  <img
                    src={prop.image}
                    alt={prop.address}
                    className="w-full h-full object-cover md:rounded-l-2xl md:rounded-tr-none rounded-t-2xl md:rounded-t-none"
                    style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800&auto=format&fit=crop";
                    }}
                  />
                </div>
                {/* Right: Info and Rules */}
                <div className="flex-1 flex flex-col justify-between p-6">
                  <div className="flex flex-wrap gap-4 items-center mb-2">
                    {prop.final === "confirmed" ? (
                      <Badge className="bg-green-600 text-white text-base px-4 py-2 rounded-full shadow-lg">✅ Confirmed Vacant</Badge>
                    ) : (
                      <Badge className="bg-orange-500 text-white text-base px-4 py-2 rounded-full shadow-lg flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Suspected – Manual Inspection Required
                      </Badge>
                    )}
                    <span className="bg-gray-900/80 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2 shadow-md">
                      <TrendingUp className="w-4 h-4 inline mr-1 text-blue-400" />
                      Vacancy Score: <span className="font-bold">{prop.vacancyScore}%</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-6 mb-2 text-xs text-muted-foreground">
                    <span><MapPin className="w-4 h-4 inline mr-1 text-primary" /> <span className="font-semibold text-foreground">{prop.address}</span></span>
                    <span><Users className="w-4 h-4 inline mr-1" /> Reports: <span className="font-semibold text-foreground">{prop.reports}</span></span>
                    <span><Calendar className="w-4 h-4 inline mr-1" /> Last Utility Reading: <span className="font-semibold text-foreground">{prop.lastUtility}</span></span>
                    <span><DollarSign className="w-4 h-4 inline mr-1 text-red-400" /> Estimated Tax Loss: <span className="font-semibold text-destructive">{formatINR(prop.estimatedTaxLoss)}</span></span>
                  </div>
                  <div className="space-y-2 mt-2">
                    {verificationRules.map((rule, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        {prop.rules[i] ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={prop.rules[i] ? "text-foreground" : "text-muted-foreground italic"}>{rule.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 