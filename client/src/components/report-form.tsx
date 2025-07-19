import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const reportFormSchema = z.object({
  address: z.string().min(10, "Address must be at least 10 characters"),
  reason: z.string().min(1, "Please select a reason"),
  duration: z.string().min(1, "Please select duration"),
  propertyType: z.string().min(1, "Please select property type"),
  description: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  imageFile: z.any().optional(),
});

type ReportFormData = z.infer<typeof reportFormSchema>;

// Helper function to compress image
const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export function ReportForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      address: "",
      reason: "",
      duration: "",
      propertyType: "",
      description: "",
      contactName: "",
      contactEmail: "",
    },
  });

  const createReportMutation = useMutation({
    mutationFn: async (data: ReportFormData) => {
      try {
        // First create property if it doesn't exist
        const propertyResponse = await apiRequest("POST", "/api/properties", {
          address: data.address,
          propertyType: data.propertyType,
          estimatedTaxLoss: "5000.00", // Default estimate
        });
        
        const property = await propertyResponse.json();
        
        // Then create the report
        const reportData = {
          propertyId: property.id,
          reason: data.reason,
          duration: data.duration,
          description: data.description,
          contactName: data.contactName,
          contactEmail: data.contactEmail,
          imageUrl: uploadedImage || null, // Include the uploaded image
        };
        
        const reportResponse = await apiRequest("POST", "/api/reports", reportData);
        
        return reportResponse.json();
      } catch (error: any) {
        console.error("Report submission error:", error);
        if (error.message?.includes("413")) {
          throw new Error("Image file is too large. Please compress the image or choose a smaller file.");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      toast({
        title: "Report Submitted Successfully!",
        description: "You've earned 50 points for your contribution to the community.",
      });
      
      form.reset();
      setUploadedImage(null);
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true);
    try {
      await createReportMutation.mutateAsync(data);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      // Compress the image
      const compressedImage = await compressImage(file, 800, 0.8);
      setUploadedImage(compressedImage);
      form.setValue('imageFile', file);
      
      toast({
        title: "Photo uploaded successfully!",
        description: "Your evidence photo has been attached to the report.",
      });
    } catch (error) {
      console.error("Image upload error:", error);
      toast({
        title: "Upload failed",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Submit a Property Report</CardTitle>
        <p className="text-muted-foreground">
          Help your community by reporting suspected vacant properties. Every report helps build a better city.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Property Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Address *</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main Street, City, State, ZIP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reason for Report */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Vacancy Report *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reason..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="no-occupancy">No signs of occupancy for extended period</SelectItem>
                      <SelectItem value="utilities-disconnected">Utilities disconnected/no usage</SelectItem>
                      <SelectItem value="property-disrepair">Property in disrepair or abandoned</SelectItem>
                      <SelectItem value="mail-accumulating">Mail accumulating/no tenant activity</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration and Property Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How long has it been vacant?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="less-than-3-months">Less than 3 months</SelectItem>
                        <SelectItem value="3-6-months">3-6 months</SelectItem>
                        <SelectItem value="6-12-months">6-12 months</SelectItem>
                        <SelectItem value="more-than-1-year">More than 1 year</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Residential - Single Family">Residential - Single Family</SelectItem>
                        <SelectItem value="Residential - Multi-Family">Residential - Multi-Family</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                        <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Evidence Upload */}
            <div>
              <FormLabel>Upload Evidence (Photos)</FormLabel>
              <div 
                className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(file);
                    }
                  }}
                />
                {uploadedImage ? (
                  <div className="space-y-2">
                    <img src={uploadedImage} alt="Uploaded evidence" className="w-32 h-32 object-cover rounded-lg mx-auto" />
                    <p className="text-green-600 font-medium">Photo uploaded successfully!</p>
                    <p className="text-sm text-muted-foreground">Click to replace</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide any additional observations or details that might help verify the vacancy..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Junaid" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="junaid@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                className="flex-1 h-12 font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
                <Award className="w-4 h-4 ml-2" />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12"
                onClick={() => {
                  form.reset();
                  setUploadedImage(null);
                  toast({
                    title: "Form Reset",
                    description: "All form fields have been cleared.",
                  });
                }}
              >
                Reset Form
              </Button>
            </div>

            {/* Reward Info */}
            <Card className="bg-gradient-to-r from-secondary/10 to-primary/10 border-secondary/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Earn Rewards!</h4>
                    <p className="text-sm text-muted-foreground">
                      Get points for valid reports and climb the leaderboard. Verified reports earn 50-200 points!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
