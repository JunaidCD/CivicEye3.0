import React, { useState } from "react";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";
import { useTheme } from "../hooks/use-theme";
import { FaChartBar, FaFileDownload, FaUserCircle, FaSyncAlt, FaBuilding, FaRupeeSign, FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { PDFGenerator } from "../lib/pdf-generator";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const years = [2025, 2024, 2023];
const cities = ["All", "Mumbai", "Kolkata", "Delhi", "Chennai"];

const statData = {
  2025: {
    All: { reports: 122, penalties: 177000, detection: 87, cities: 4 },
    Mumbai: { reports: 45, penalties: 72000, detection: 91, cities: 1 },
    Kolkata: { reports: 32, penalties: 34000, detection: 85, cities: 1 },
    Delhi: { reports: 27, penalties: 41000, detection: 82, cities: 1 },
    Chennai: { reports: 18, penalties: 30000, detection: 80, cities: 1 },
  },
  2024: {
    All: { reports: 98, penalties: 120000, detection: 82, cities: 4 },
    Mumbai: { reports: 36, penalties: 48000, detection: 86, cities: 1 },
    Kolkata: { reports: 28, penalties: 26000, detection: 80, cities: 1 },
    Delhi: { reports: 20, penalties: 32000, detection: 78, cities: 1 },
    Chennai: { reports: 14, penalties: 14000, detection: 75, cities: 1 },
  },
  2023: {
    All: { reports: 80, penalties: 90000, detection: 78, cities: 4 },
    Mumbai: { reports: 28, penalties: 32000, detection: 80, cities: 1 },
    Kolkata: { reports: 22, penalties: 18000, detection: 76, cities: 1 },
    Delhi: { reports: 18, penalties: 26000, detection: 74, cities: 1 },
    Chennai: { reports: 12, penalties: 14000, detection: 70, cities: 1 },
  },
};

function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const startTime = Date.now();
    function animate() {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.floor(start + (target - start) * progress));
      if (progress < 1) requestAnimationFrame(animate);
    }
    animate();
    // eslint-disable-next-line
  }, [target]);
  return value;
}

const barData = {
  labels: ["Kolkata", "Mumbai", "Delhi", "Chennai"],
  datasets: [
    {
      label: "Reports",
      data: [32, 45, 27, 18],
      backgroundColor: ["#6366f1", "#22d3ee", "#f59e42", "#10b981"],
      borderRadius: 12,
      borderSkipped: false,
      barPercentage: 0.6,
    },
  ],
};
const barOptions = {
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true, backgroundColor: "#222", borderRadius: 8, padding: 12 },
    title: { display: false },
  },
  animation: { duration: 1200, easing: "easeOutQuart" as const },
  scales: {
    x: { grid: { display: false }, ticks: { font: { weight: "bold" as const } } },
    y: { grid: { color: "#333", borderDash: [4, 4] }, beginAtZero: true },
  },
};

const pieData = {
  labels: ["AI Detection", "Citizen Reports", "Utility Checks", "Legal Records"],
  datasets: [
    {
      data: [40, 30, 20, 10],
      backgroundColor: ["#6366f1", "#f59e42", "#10b981", "#f43f5e"],
      borderWidth: 2,
      borderColor: "#fff",
    },
  ],
};
const pieOptions = {
  plugins: {
    legend: { position: "bottom" as const, labels: { font: { weight: "bold" as const } } },
    tooltip: { enabled: true, backgroundColor: "#222", borderRadius: 8, padding: 12 },
  },
  animation: { animateRotate: true, duration: 1200, easing: "easeOutQuart" as const },
};

const lineData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Penalty Recovery (₹K)",
      data: [12, 20, 18, 25, 30, 34, 38],
      fill: true,
      borderColor: "#22d3ee",
      backgroundColor: "rgba(34,211,238,0.15)",
      tension: 0.5,
      pointRadius: 6,
      pointBackgroundColor: "#22d3ee",
      pointBorderColor: "#fff",
      pointHoverRadius: 9,
    },
  ],
};
const lineOptions = {
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true, backgroundColor: "#222", borderRadius: 8, padding: 12 },
  },
  animation: { duration: 1200, easing: "easeOutQuart" as const },
  scales: {
    x: { grid: { display: false }, ticks: { font: { weight: "bold" as const } } },
    y: { grid: { color: "#333", borderDash: [4, 4] }, beginAtZero: true },
  },
};

const hBarData = {
  labels: ["Confirmed Vacant", "Suspected", "Under Review", "Disputed"],
  datasets: [
    {
      label: "Properties",
      data: [54, 38, 21, 9],
      backgroundColor: ["#10b981", "#f59e42", "#6366f1", "#f43f5e"],
      borderRadius: 12,
      borderSkipped: false,
      barPercentage: 0.6,
    },
  ],
};
const hBarOptions = {
  indexAxis: "y" as const,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true, backgroundColor: "#222", borderRadius: 8, padding: 12 },
  },
  animation: { duration: 1200, easing: "easeOutQuart" as const },
  scales: {
    x: { grid: { color: "#333", borderDash: [4, 4] }, beginAtZero: true },
    y: { grid: { display: false }, ticks: { font: { weight: "bold" as const } } },
  },
};

const doughnutData = {
  labels: ["Paid", "Pending", "Overdue", "Processing"],
  datasets: [
    {
      data: [50, 30, 15, 5],
      backgroundColor: ["#10b981", "#f59e42", "#f43f5e", "#6366f1"],
      borderWidth: 2,
      borderColor: "#fff",
    },
  ],
};
const doughnutOptions = {
  plugins: {
    legend: { position: "bottom" as const, labels: { font: { weight: "bold" as const } } },
    tooltip: { enabled: true, backgroundColor: "#222", borderRadius: 8, padding: 12 },
  },
  animation: { animateRotate: true, duration: 1200, easing: "easeOutQuart" as const },
};

const cardClass =
  "bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center w-full h-full transition-transform duration-300 hover:scale-105 hover:shadow-2xl";

export default function Insights() {
  const { theme } = useTheme();
  const [year, setYear] = useState(2025);
  const [city, setCity] = useState("All");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const stats = statData[year as 2025 | 2024 | 2023][city as 'All' | 'Mumbai' | 'Kolkata' | 'Delhi' | 'Chennai'];
  const reports = useCountUp(stats.reports);
  const penalties = useCountUp(stats.penalties);
  const detection = useCountUp(stats.detection);
  const activeCities = useCountUp(stats.cities);

  function handleRefresh() {
    setLastUpdated(new Date());
  }

  async function handleDownload() {
    const property = {
      propertyAddress: "201 Marine Drive, Colaba, Mumbai",
      penaltyAmount: "₹18,250",
      penaltyType: "Vacancy Penalty",
      dueDate: "31 July 2025",
      transactionHash: "0xA1B2C3D4E5F6G7H8I9J0",
      issueDate: "20 July 2025",
    };
    const url = await PDFGenerator.generateTaxNotice(property);
    PDFGenerator.downloadPDF(url, "CivicEye-Tax-Notice.pdf");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      {/* Greeting and Download */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 text-white text-2xl shadow-lg">
            <FaChartBar />
          </span>
          <div>
            <h1 className="text-3xl font-bold">Insights & Analytics</h1>
            <div className="text-muted-foreground text-sm">Welcome back, Junaid!</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-tr from-blue-500 to-teal-400 text-white font-semibold shadow-md hover:scale-105 transition-transform">
            <FaFileDownload /> Download Report
          </button>
          <span className="text-3xl text-gray-400 dark:text-gray-600"><FaUserCircle /></span>
        </div>
      </div>
      {/* Subtext */}
      <p className="text-muted-foreground mb-6">
        This dashboard provides a visual summary of CivicEye’s performance — including citizen reports, vacancy detection methods, and enforcement activity.
      </p>
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 items-center mb-8">
        <div className="flex items-center gap-2">
          <label className="font-medium">Year:</label>
          <select value={year} onChange={e => setYear(Number(e.target.value))} className="rounded-lg px-3 py-1 bg-background dark:bg-background-dark border border-gray-300 dark:border-gray-700">
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-medium">City:</label>
          <select value={city} onChange={e => setCity(e.target.value)} className="rounded-lg px-3 py-1 bg-background dark:bg-background-dark border border-gray-300 dark:border-gray-700">
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 ml-auto text-xs text-muted-foreground">
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <button onClick={handleRefresh} className="ml-2 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:scale-110 transition-transform"><FaSyncAlt /></button>
        </div>
      </div>
      {/* Stat Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-xl p-5 flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
          <FaBuilding className="text-blue-500 text-2xl mb-2" />
          <div className="text-2xl font-bold">{reports}</div>
          <div className="text-xs text-muted-foreground">Total Reports</div>
        </div>
        <div className="bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-xl p-5 flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
          <FaRupeeSign className="text-green-500 text-2xl mb-2" />
          <div className="text-2xl font-bold">₹{penalties.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Penalties Collected</div>
        </div>
        <div className="bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-xl p-5 flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
          <FaCheckCircle className="text-teal-500 text-2xl mb-2" />
          <div className="text-2xl font-bold">{detection}%</div>
          <div className="text-xs text-muted-foreground">Detection Rate</div>
        </div>
        <div className="bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-xl p-5 flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
          <FaMapMarkerAlt className="text-fuchsia-500 text-2xl mb-2" />
          <div className="text-2xl font-bold">{activeCities}</div>
          <div className="text-xs text-muted-foreground">Active Cities</div>
        </div>
      </div>
      {/* Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className={cardClass} style={{ animationDelay: "0.1s" }}>
          <h2 className="font-semibold text-lg mb-4">Reports Per City</h2>
          <Bar data={barData} options={barOptions} height={220} />
        </div>
        {/* Pie Chart */}
        <div className={cardClass} style={{ animationDelay: "0.2s" }}>
          <h2 className="font-semibold text-lg mb-4">How Vacancies Were Confirmed</h2>
          <Pie data={pieData} options={pieOptions} height={220} />
        </div>
        {/* Line Chart */}
        <div className={cardClass} style={{ animationDelay: "0.3s" }}>
          <h2 className="font-semibold text-lg mb-4">Penalty Recovery Trend (Last 7 Months)</h2>
          <Line data={lineData} options={lineOptions} height={220} />
        </div>
        {/* Horizontal Bar Chart */}
        <div className={cardClass} style={{ animationDelay: "0.4s" }}>
          <h2 className="font-semibold text-lg mb-4">Current Property Status Summary</h2>
          <Bar data={hBarData} options={hBarOptions} height={220} />
        </div>
      </div>
      {/* Centered Doughnut Chart Card */}
      <div className="flex justify-center mt-8">
        <div className={cardClass + " w-full max-w-md"} style={{ animationDelay: "0.5s" }}>
          <h2 className="font-semibold text-lg mb-4">Tax Notice Types Issued</h2>
          <Doughnut data={doughnutData} options={doughnutOptions} height={220} />
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 1.2s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
} 