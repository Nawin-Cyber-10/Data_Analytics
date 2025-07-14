"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { calculateStatistics } from "@/lib/statistics"
import type { AnalysisData } from "@/app/page"

interface StatisticalSummaryProps {
  data: AnalysisData
}

export function StatisticalSummary({ data }: StatisticalSummaryProps) {
  const statistics = calculateStatistics(data)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Statistical Summary</CardTitle>
          <CardDescription>Comprehensive statistical analysis of numeric columns</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Column</TableHead>
                <TableHead>Mean</TableHead>
                <TableHead>Median</TableHead>
                <TableHead>Std Dev</TableHead>
                <TableHead>Min</TableHead>
                <TableHead>Max</TableHead>
                <TableHead>Missing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(statistics).map(([column, stats]) => (
                <TableRow key={column}>
                  <TableCell className="font-medium">{column}</TableCell>
                  <TableCell>{stats.mean.toFixed(2)}</TableCell>
                  <TableCell>{stats.median.toFixed(2)}</TableCell>
                  <TableCell>{stats.stdDev.toFixed(2)}</TableCell>
                  <TableCell>{stats.min.toFixed(2)}</TableCell>
                  <TableCell>{stats.max.toFixed(2)}</TableCell>
                  <TableCell>
                    {stats.missing > 0 ? (
                      <Badge variant="destructive">{stats.missing}</Badge>
                    ) : (
                      <Badge variant="secondary">0</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Complete Records</span>
                <Badge variant="secondary">
                  {Math.round(
                    ((data.summary.totalRows -
                      Object.values(statistics).reduce((sum, stat) => sum + stat.missing, 0) /
                        Object.keys(statistics).length) /
                      data.summary.totalRows) *
                      100,
                  )}
                  %
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Numeric Columns</span>
                <Badge variant="default">{data.summary.numericColumns.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Categorical Columns</span>
                <Badge variant="outline">{data.summary.categoricalColumns.length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dataset Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Total Records</span>
                <Badge variant="secondary">{data.summary.totalRows.toLocaleString()}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Columns</span>
                <Badge variant="secondary">{data.summary.totalColumns}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Memory Usage</span>
                <Badge variant="outline">{Math.round(JSON.stringify(data.data).length / 1024)} KB</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
