import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function RecentAnalyses() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Analyses</CardTitle>
        <CardDescription>Your most recent bias analyses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            {
              title: "Employee Hiring Data",
              description: "Gender & Ethnicity Bias",
              date: "May 1, 2025",
            },
            {
              title: "Customer Feedback",
              description: "Age & Location Bias",
              date: "April 28, 2025",
            },
            {
              title: "Marketing Campaign Response",
              description: "Multiple Bias Factors",
              date: "April 15, 2025",
            },
            {
              title: "Product Usage Patterns",
              description: "Accessibility Bias",
              date: "April 10, 2025",
            },
          ].map((analysis, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{analysis.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{analysis.description}</span>
                  <span>•</span>
                  <span>{analysis.date}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/dashboard/reports">
            <Button variant="outline" size="sm">
              View All Reports
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
