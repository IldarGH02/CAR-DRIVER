import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Fuel, TrendingUp, DollarSign, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useTripsStoreData } from "@features/trips/model/tripsStore";
import { useUserStoreData } from "@entities/user/model/userStore";
import { useSettingsStoreData } from "@features/settings/model/settingsStore";
import { formatCurrency, formatDistance, roundToTwo } from "@shared/utils/formatters";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";

export function Dashboard() {
  const { trips, fetchTrips } = useTripsStoreData();
  const { user } = useUserStoreData();
  const { settings, fetchSettings } = useSettingsStoreData();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [stats, setStats] = useState({
    totalDistance: 0,
    totalFuelCost: 0,
    totalAmortization: 0,
    totalExpenses: 0,
    monthlyData: [] as any[]
  });

  useEffect(() => {
    if (user) {
      fetchTrips();
      fetchSettings();
    }
  }, [user, fetchTrips, fetchSettings]);

  useEffect(() => {
    if (trips.length > 0) {
      const totalDistance = trips.reduce((sum, t) => sum + t.distance, 0);
      const totalFuelCost = trips.reduce((sum, t) => sum + t.fuelCost, 0);
      const totalAmortization = trips.reduce((sum, t) => sum + t.amortization, 0);

      const monthlyData = trips.reduce((acc: any, trip) => {
        const month = new Date(trip.date).toLocaleString('ru', { month: 'short' });
        if (!acc[month]) {
          acc[month] = { month, fuel: 0, amortization: 0 };
        }
        acc[month].fuel += trip.fuelCost;
        acc[month].amortization += trip.amortization;
        return acc;
      }, {});

      setStats({
        totalDistance,
        totalFuelCost,
        totalAmortization,
        totalExpenses: totalFuelCost + totalAmortization,
        monthlyData: Object.values(monthlyData)
      });
    }
  }, [trips]);

  const recentTrips = trips.slice(0, 3);
  const amortizationRate = settings?.amortization_rate || 2.68;

  return (
      <div className="flex-1 overflow-auto bg-background">
        <div className="p-4 md:p-8">
          <div className={`mb-6 md:mb-8 ${isMobile ? "mt-2" : ""}`}>
            <h2 className="text-xl md:text-3xl font-semibold mb-2">Дашборд</h2>
            <p className="text-sm md:text-base text-muted-foreground">Обзор расходов и статистики поездок</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Пробег за всё время
                </CardTitle>
                <MapPin className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold">{formatDistance(stats.totalDistance)}</div>
                <p className="text-xs text-muted-foreground mt-1">Всего поездок: {trips.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Расход топлива
                </CardTitle>
                <Fuel className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold">{formatCurrency(stats.totalFuelCost)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Амортизация
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold">{formatCurrency(stats.totalAmortization)}</div>
                <p className="text-xs text-muted-foreground mt-1">{roundToTwo(amortizationRate)} ₽/км</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Всего расходов
                </CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold">{formatCurrency(stats.totalExpenses)}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 md:mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-xl">Динамика расходов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: isMobile ? 10 : 12 }} />
                      <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                      <Tooltip />
                      <Bar dataKey="fuel" fill="#2563eb" name="Топливо" />
                      <Bar dataKey="amortization" fill="#64748b" name="Амортизация" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-xl">Тренд расходов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: isMobile ? 10 : 12 }} />
                      <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="fuel" stroke="#2563eb" strokeWidth={2} name="Топливо" />
                      <Line type="monotone" dataKey="amortization" stroke="#64748b" strokeWidth={2} name="Амортизация" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-xl">Последние поездки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                {recentTrips.map((trip) => (
                    <div key={trip.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg gap-2">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm md:text-base">{trip.from} → {trip.to} → {trip.from}</p>
                          <p className="text-xs md:text-sm text-muted-foreground">{new Date(trip.date).toLocaleDateString('ru-RU')}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-medium text-sm md:text-base">{formatDistance(trip.distance)}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{formatCurrency(trip.fuelCost)}</p>
                      </div>
                    </div>
                ))}
                {recentTrips.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">Нет добавленных поездок</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}