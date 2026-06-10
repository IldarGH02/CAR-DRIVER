import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Download } from "lucide-react";
import { Separator } from "@shared/ui/separator";
import { reportTypes } from "@features/reports/config/reportTypes";
import { ReportTypeCard } from "@features/reports/components/ReportTypeCard";
import { StatsCard } from "@features/reports/components/StatsCard";
import { AveragesCard } from "@features/reports/components/AveragesCard";
import { TipCard } from "@features/reports/components/TipCard";
import { ColumnSelector } from "@features/reports/components/ColumnSelector";
import { useReports } from "@features/reports/hooks/useReports";

export function Reports() {
  const {
    trips,
    filteredTrips,
    stats,
    dateFrom,
    dateTo,
    reportType,
    isGenerating,
    visibleColumns,
    setDateFrom,
    setDateTo,
    setReportType,
    handleGenerateReport,
    toggleColumn,
  } = useReports();

  return (
      <div className="flex-1 overflow-auto bg-background">
        <div className="p-4 md:p-8">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Отчёты</h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Создание и экспорт отчётов о расходах и поездках
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Выберите тип отчёта</CardTitle>
                  <CardDescription>
                    Определите, какую информацию вы хотите включить в отчёт
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {reportTypes.map((type) => (
                        <ReportTypeCard
                            key={type.id}
                            type={type}
                            isSelected={reportType === type.id}
                            onSelect={() => setReportType(type.id)}
                        />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {reportType === "custom" && (
                  <ColumnSelector visibleColumns={visibleColumns} onToggleColumn={toggleColumn} />
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Параметры отчёта</CardTitle>
                  <CardDescription>
                    Укажите период для выгрузки данных
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateFrom">Дата от</Label>
                      <Input
                          id="dateFrom"
                          type="date"
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateTo">Дата до</Label>
                      <Input
                          id="dateTo"
                          type="date"
                          value={dateTo}
                          onChange={(e) => setDateTo(e.target.value)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <Button
                      onClick={handleGenerateReport}
                      className="w-full gap-2"
                      disabled={isGenerating || filteredTrips.length === 0}
                  >
                    <Download className="w-4 h-4" />
                    {isGenerating ? "Генерация..." : "Сформировать и скачать отчёт"}
                  </Button>

                  {filteredTrips.length === 0 && trips.length > 0 && (
                      <p className="text-sm text-amber-600 text-center">
                        Нет поездок за выбранный период. Измените даты.
                      </p>
                  )}

                  {trips.length === 0 && (
                      <p className="text-sm text-amber-600 text-center">
                        Нет добавленных поездок. Добавьте поездки в разделе "Поездки".
                      </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <StatsCard stats={stats} />
              <AveragesCard stats={stats} />
              <TipCard />
            </div>
          </div>
        </div>
      </div>
  );
}