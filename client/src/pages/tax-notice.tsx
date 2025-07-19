import { TaxNoticeForm } from "@/components/tax-notice-form";

export default function TaxNotice() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Smart Contract Enforcement</h1>
          <p className="text-lg text-muted-foreground">
            Automated tax penalty system using blockchain technology for transparent and immutable enforcement.
          </p>
        </div>
        
        <TaxNoticeForm />
      </div>
    </div>
  );
}
