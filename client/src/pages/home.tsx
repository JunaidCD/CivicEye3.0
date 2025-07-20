import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Building } from "lucide-react";
import { IndianRupee } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

export default function Home() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  // Overwrite stats for landing page
  const landingStats = [
    {
      icon: Building,
      value: 16,
      label: "Properties Reported"
    },
    {
      icon: IndianRupee,
      value: "₹84 crore",
      label: "Tax Revenue Recovered"
    },
    {
      icon: Users,
      value: 56,
      label: "Active Reporters"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-blue-600 to-secondary py-20 lg:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-white bg-opacity-5 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_2px,transparent_2px)] bg-[length:60px_60px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Detect Report<br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Reclaim Your City
              </span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto"
            >
              Join thousands of citizens using AI-powered tools to identify vacant properties, reduce urban decay, and build stronger communities.
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/reports">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-4 text-lg">
                  Start Reporting
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 text-lg">
                  View Dashboard
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Stats Cards */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {landingStats.map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-6 text-center">
                    <stat.icon className="w-8 h-8 text-white mx-auto mb-2" />
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-blue-100">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How CivicEye Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform makes it easy to identify, report, and track vacant properties in your community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">AI Detection</h3>
                <p className="text-muted-foreground">
                  Advanced algorithms analyze property data to identify potential vacant properties with high accuracy.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Community Reporting</h3>
                <p className="text-muted-foreground">
                  Citizens can easily report suspected vacant properties with photos and detailed descriptions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Smart Enforcement</h3>
                <p className="text-muted-foreground">
                  Blockchain-powered smart contracts automatically issue tax penalties for verified vacant properties.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community of civic-minded citizens and help build better cities through technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reports">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-4">
                Submit Your First Report
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4">
                View Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
