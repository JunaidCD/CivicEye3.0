import { ReportForm } from "@/components/report-form";

export default function Reports() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Submit a Report</h1>
          <p className="text-lg text-muted-foreground">
            Help your community by reporting suspected vacant properties. Every report helps build a better city.
          </p>
        </div>
        
        <ReportForm />
      </div>
    </div>
  );
}
