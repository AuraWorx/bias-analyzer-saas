import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function RecentUploads() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Uploads</CardTitle>
        <CardDescription>Your most recent file uploads</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            {
              name: "employee_data_2025.csv",
              type: "CSV",
              date: "May 1, 2025",
              status: "Analyzed",
            },
            {
              name: "customer_feedback.json",
              type: "JSON",
              date: "April 28, 2025",
              status: "Analyzed",
            },
            {
              name: "marketing_campaign_results.csv",
              type: "CSV",
              date: "April 15, 2025",
              status: "Analyzed",
            },
            {
              name: "product_usage_data.json",
              type: "JSON",
              date: "April 10, 2025",
              status: "Processing",
            },
          ].map((file, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{file.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{file.type}</span>
                  <span>•</span>
                  <span>{file.date}</span>
                </div>
              </div>
              <Badge variant={file.status === "Analyzed" ? "success" : "outline"}>{file.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
