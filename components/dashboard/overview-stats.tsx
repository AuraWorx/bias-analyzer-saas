import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart } from "@/components/ui/charts"

export function OverviewStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-normal">Bias Detection Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <LineChart
              data={[
                { name: "Jan", value: 45 },
                { name: "Feb", value: 52 },
                { name: "Mar", value: 48 },
                { name: "Apr", value: 61 },
                { name: "May", value: 55 },
              ]}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-normal">Bias Types Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <BarChart
              data={[
                { name: "Gender", value: 35 },
                { name: "Age", value: 28 },
                { name: "Ethnicity", value: 42 },
                { name: "Location", value: 18 },
                { name: "Other", value: 15 },
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
