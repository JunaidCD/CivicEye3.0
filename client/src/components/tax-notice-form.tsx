import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Info, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Property } from "@shared/schema";

const taxNoticeSchema = z.object({
  propertyId: z.string().min(1, "Please select a property"),
  penaltyType: z.string().min(1, "Please select penalty type"),
  penaltyAmount: z.string().min(1, "Please enter penalty amount"),
  dueDate: z.string().min(1, "Please select due date"),
});

type TaxNoticeFormData = z.infer<typeof taxNoticeSchema>;

export function TaxNoticeForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [transactionResult, setTransactionResult] = useState<string | null>(null);

  const form = useForm<TaxNoticeFormData>({
    resolver: zodResolver(taxNoticeSchema),
    defaultValues: {
      propertyId: "",
      penaltyType: "",
      penaltyAmount: "",
      dueDate: "",
    },
  });

  // Fetch confirmed vacant properties
  const { data: properties = [] } = useQuery({
    queryKey: ["/api/properties"],
    select: (data: Property[]) => data.filter(p => p.status === "Confirmed Vacant"),
  });

  const createTaxNoticeMutation = useMutation({
    mutationFn: async (data: TaxNoticeFormData) => {
      const response = await apiRequest("POST", "/api/tax-notices", {
        propertyId: parseInt(data.propertyId),
        penaltyType: data.penaltyType,
        penaltyAmount: data.penaltyAmount,
        dueDate: new Date(data.dueDate).toISOString(),
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tax-notices"] });
      setTransactionResult(data.transactionHash);
      toast({
        title: "Smart Contract Executed Successfully!",
        description: "Tax penalty notice has been recorded on the blockchain.",
      });
      form.reset();
      setSelectedProperty(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to execute smart contract. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generatePdfMutation = useMutation({
    mutationFn: async (taxNoticeId: number) => {
      const response = await apiRequest("POST", "/api/generate-pdf", { taxNoticeId });
      return response.json();
    },
    onSuccess: (data) => {
      // In a real app, this would download the PDF
      toast({
        title: "PDF Generated Successfully!",
        description: "Tax notice PDF is ready for download.",
      });
    },
  });

  const onSubmit = async (data: TaxNoticeFormData) => {
    await createTaxNoticeMutation.mutateAsync(data);
  };

  const onPropertySelect = (propertyId: string) => {
    const property = properties.find(p => p.id === parseInt(propertyId));
    setSelectedProperty(property || null);
    if (property) {
      form.setValue("penaltyAmount", property.estimatedTaxLoss || "");
    }
  };

  const recentTransactions = [
    { address: "456 Residential Blvd", amount: "$5,230", time: "2 hours ago", status: "Confirmed" },
    { address: "789 Industrial Way", amount: "$15,670", time: "1 day ago", status: "Confirmed" },
  ];

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white">
        <CardTitle className="text-xl">Tax Notice Generation System</CardTitle>
        <p className="text-blue-100">Generate and issue automated tax penalty notices for verified vacant properties</p>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Property Selection */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Select Property for Notice</h4>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="propertyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value);
                            onPropertySelect(value);
                          }}
                          value={field.value}
                        >
                          <div className="space-y-4">
                            {properties.map((property) => (
                              <div
                                key={property.id}
                                className="border rounded-lg p-4 hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-pointer"
                              >
                                <div className="flex items-center space-x-3">
                                  <RadioGroupItem value={property.id.toString()} id={property.id.toString()} />
                                  <Label htmlFor={property.id.toString()} className="flex-1 cursor-pointer">
                                    <div>
                                      <h5 className="font-medium">{property.address}</h5>
                                      <p className="text-sm text-muted-foreground">
                                        Status: {property.status} | {property.reportCount} Reports | Score: {property.vacancyScore}%
                                      </p>
                                      <p className="text-sm text-destructive">
                                        Estimated Tax Loss: ${property.estimatedTaxLoss ? parseFloat(property.estimatedTaxLoss).toLocaleString() : 'N/A'}
                                      </p>
                                    </div>
                                  </Label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Penalty Configuration */}
                <div className="space-y-4">
                  <h5 className="font-medium">Penalty Configuration</h5>
                  
                  <FormField
                    control={form.control}
                    name="penaltyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Penalty Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select penalty type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="vacancy-tax">Vacancy Tax Penalty</SelectItem>
                            <SelectItem value="maintenance-violation">Property Maintenance Violation</SelectItem>
                            <SelectItem value="registration-compliance">Registration Non-Compliance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="penaltyAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Penalty Amount</FormLabel>
                        <FormControl>
                          <Input placeholder="$0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col gap-4 pt-6 border-t">
                  <Button
                    type="submit"
                    className="w-full h-12 font-semibold"
                    disabled={createTaxNoticeMutation.isPending}
                  >
                    {createTaxNoticeMutation.isPending ? "Processing..." : "Execute Smart Contract"}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => generatePdfMutation.mutate(1)}
                      disabled={generatePdfMutation.isPending}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Generate PDF
                    </Button>
                    <Button type="button" variant="outline" className="flex-1">
                      Preview Notice
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>

          {/* Smart Contract Simulation */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Blockchain Transaction</h4>
            
            {/* Transaction Preview */}
            <Card className="bg-muted/50">
              <CardContent className="p-6 font-mono text-sm">
                <div className="text-muted-foreground mb-4">Smart Contract Preview:</div>
                <div className="space-y-2">
                  <div>Contract: <span className="text-primary">VacancyPenaltyContract_v2.1</span></div>
                  <div>Property ID: <span className="text-secondary">{selectedProperty ? `0x${selectedProperty.id}...${selectedProperty.address.slice(0, 5)}` : 'None selected'}</span></div>
                  <div>Penalty Amount: <span className="text-destructive">{form.watch('penaltyAmount') || '$0.00'}</span></div>
                  <div>Gas Fee: <span className="text-muted-foreground">$12.34</span></div>
                  <div>Status: <span className="text-yellow-600">Ready to Execute</span></div>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Network Info */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Network: Ethereum Sepolia Testnet</strong><br />
                This is a simulation environment. No real funds will be transferred.
              </AlertDescription>
            </Alert>

            {/* Recent Transactions */}
            <div>
              <h5 className="font-medium mb-3">Recent Penalty Transactions</h5>
              <div className="space-y-2">
                {recentTransactions.map((tx, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg text-sm">
                    <div>
                      <div className="font-medium">{tx.address}</div>
                      <div className="text-muted-foreground">{tx.time}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-destructive font-medium">{tx.amount}</div>
                      <Badge variant="secondary" className="text-xs">
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Message */}
            {transactionResult && (
              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <strong className="text-green-900 dark:text-green-100">Transaction Successful!</strong><br />
                  <span className="text-green-700 dark:text-green-300">
                    Tax penalty notice has been recorded on the blockchain and sent to property owner.
                  </span><br />
                  <span className="text-xs text-green-600 dark:text-green-400 font-mono">
                    Transaction Hash: {transactionResult}
                  </span>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
