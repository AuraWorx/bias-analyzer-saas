import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Filter, FileText, BarChart3, Trash2 } from "lucide-react"
import { UploadButton } from "@/components/dashboard/upload-button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UploadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Uploads</h2>
          <p className="text-muted-foreground">Manage your uploaded files for bias analysis</p>
        </div>
        <UploadButton />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <Input placeholder="Search uploads..." />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="File Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Files</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>View and manage your uploaded files</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  name: "employee_data_2025.csv",
                  type: "CSV",
                  size: "2.4 MB",
                  date: "May 1, 2025",
                  status: "Analyzed",
                },
                {
                  name: "customer_feedback.json",
                  type: "JSON",
                  size: "1.8 MB",
                  date: "April 28, 2025",
                  status: "Analyzed",
                },
                {
                  name: "marketing_campaign_results.csv",
                  type: "CSV",
                  size: "3.2 MB",
                  date: "April 15, 2025",
                  status: "Analyzed",
                },
                {
                  name: "product_usage_data.json",
                  type: "JSON",
                  size: "4.7 MB",
                  date: "April 10, 2025",
                  status: "Processing",
                },
                {
                  name: "salary_distribution.csv",
                  type: "CSV",
                  size: "1.5 MB",
                  date: "March 28, 2025",
                  status: "Analyzed",
                },
              ].map((file, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{file.name}</TableCell>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell>{file.date}</TableCell>
                  <TableCell>
                    <Badge variant={file.status === "Analyzed" ? "success" : "outline"}>{file.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" title="View Report">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="View Analysis">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
