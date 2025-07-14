"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CorrelationHeatmap } from "@/components/visualizations/correlation-heatmap"
import { TrendChart } from "@/components/visualizations/trend-chart"
import { ClusterVisualization } from "@/components/visualizations/cluster-visualization"
import { StatisticalSummary } from "@/components/statistical-summary"
import { Brain, TrendingUp, ScatterChartIcon as Scatter3D, BarChart3 } from "lucide-react"
import type { AnalysisData } from "@/app/page"

interface AnalysisResultsProps {
  data: AnalysisData
}

export function AnalysisResults({ data }: AnalysisResultsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>AI-Generated Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{data.insights}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="correlations" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="clusters">Clusters</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="correlations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Correlation Analysis</span>
              </CardTitle>
              <CardDescription>Discover relationships between numeric variables in your data</CardDescription>
            </CardHeader>
            <CardContent>
              {data.mlAnalysis?.correlations && data.mlAnalysis.correlations.length > 0 ? (
                <div className="space-y-4">
                  <CorrelationHeatmap correlations={data.mlAnalysis.correlations} />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.mlAnalysis.correlations
                      .filter((c) => Math.abs(c.correlation) > 0.5)
                      .slice(0, 6)
                      .map((corr, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">
                                  {corr.x} × {corr.y}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {Math.abs(corr.correlation) > 0.7 ? "Strong" : "Moderate"} correlation
                                </p>
                              </div>
                              <Badge variant={corr.correlation > 0 ? "default" : "destructive"}>
                                {corr.correlation.toFixed(3)}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No significant correlations found in the data.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Trend Analysis</span>
              </CardTitle>
              <CardDescription>Identify patterns and trends in your numeric data</CardDescription>
            </CardHeader>
            <CardContent>
              {data.mlAnalysis?.trends && data.mlAnalysis.trends.length > 0 ? (
                <div className="space-y-4">
                  <TrendChart data={data.data} trends={data.mlAnalysis.trends} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.mlAnalysis.trends.map((trend, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{trend.column}</p>
                              <p className="text-sm text-gray-600 capitalize">{trend.trend} trend</p>
                            </div>
                            <Badge
                              variant={
                                trend.trend === "increasing"
                                  ? "default"
                                  : trend.trend === "decreasing"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {trend.trend}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No clear trends detected in the numeric data.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clusters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scatter3D className="w-5 h-5" />
                <span>Cluster Analysis</span>
              </CardTitle>
              <CardDescription>Discover natural groupings in your data using machine learning</CardDescription>
            </CardHeader>
            <CardContent>
              {data.mlAnalysis?.clusters && data.mlAnalysis.clusters.length > 0 ? (
                <div className="space-y-4">
                  <ClusterVisualization
                    data={data.data}
                    clusters={data.mlAnalysis.clusters}
                    numericColumns={data.summary.numericColumns}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data.mlAnalysis.clusters.map((cluster, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{cluster.size}</p>
                            <p className="text-sm text-gray-600">Cluster {cluster.cluster + 1} size</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Clustering analysis not available for this dataset.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <StatisticalSummary data={data} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
