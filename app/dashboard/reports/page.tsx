import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileText, Download, Share2, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">View and download your bias analysis reports</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <Input placeholder="Search reports..." />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="gender">Gender Bias</SelectItem>
              <SelectItem value="age">Age Bias</SelectItem>
              <SelectItem value="ethnicity">Ethnicity Bias</SelectItem>
              <SelectItem value="custom">Custom Analysis</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6">
            {[
              {
                title: "Employee Hiring Data Analysis",
                description: "Comprehensive analysis of hiring patterns across departments",
                date: "May 1, 2025",
                type: "Gender & Ethnicity Bias",
                pages: 24,
              },
              {
                title: "Customer Feedback Sentiment Analysis",
                description: "Analysis of customer feedback responses by demographic",
                date: "April 28, 2025",
                type: "Age & Location Bias",
                pages: 18,
              },
              {
                title: "Marketing Campaign Response Analysis",
                description: "Evaluation of campaign effectiveness across different demographics",
                date: "April 15, 2025",
                type: "Multiple Bias Factors",
                pages: 32,
              },
              {
                title: "Product Usage Patterns",
                description: "Analysis of how different user groups interact with the product",
                date: "April 10, 2025",
                type: "Accessibility Bias",
                pages: 15,
              },
              {
                title: "Salary Distribution Analysis",
                description: "Examination of compensation patterns across the organization",
                date: "March 28, 2025",
                type: "Gender & Seniority Bias",
                pages: 28,
              },
            ].map((report, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle>{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">Generated:</span>
                      <span>{report.date}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">Type:</span>
                      <span>{report.type}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">Pages:</span>
                      <span>{report.pages}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Reports generated in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Your recent reports will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shared" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shared Reports</CardTitle>
              <CardDescription>Reports shared with team members</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Your shared reports will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archived" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Archived Reports</CardTitle>
              <CardDescription>Reports you've archived</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Your archived reports will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
