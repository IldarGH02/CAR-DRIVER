import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import { useTripsStoreData } from "@features/trips/model/tripsStore";
import { TripForm } from "@features/trips/components/TripForm";
import { TripTable } from "@features/trips/components/TripTable";
import { TripStats } from "@features/trips/components/TripStats";
import { calculateTotalStats } from "@features/trips/utils/tripHelpers";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";

export function Trips() {
  const { trips, isLoading, fetchTrips, addTrip, deleteTrip } = useTripsStoreData();
  const stats = calculateTotalStats(trips);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchTrips();
  }, []);

  // Фильтрация поездок по статусу с учётом даты
  const getFilteredTrips = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return trips.filter(trip => {
      const tripDate = new Date(trip.date);
      tripDate.setHours(0, 0, 0, 0);

      let effectiveStatus = trip.status;
      if (trip.status !== "cancelled") {
        if (tripDate <= today) {
          effectiveStatus = "completed";
        } else {
          effectiveStatus = "planned";
        }
      }

      if (statusFilter === "all") return true;
      return effectiveStatus === statusFilter;
    });
  };

  const filteredTrips = getFilteredTrips();
  const filteredStats = calculateTotalStats(filteredTrips);

  // Подсчёт количества для вкладок
  const getCounts = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completed = trips.filter(t => {
      if (t.status === "cancelled") return false;
      const tripDate = new Date(t.date);
      tripDate.setHours(0, 0, 0, 0);
      return tripDate <= today;
    }).length;

    const planned = trips.filter(t => {
      if (t.status === "cancelled") return false;
      const tripDate = new Date(t.date);
      tripDate.setHours(0, 0, 0, 0);
      return tripDate > today;
    }).length;

    const cancelled = trips.filter(t => t.status === "cancelled").length;

    return { completed, planned, cancelled };
  };

  const counts = getCounts();

  return (
      <div className="flex-1 overflow-auto bg-background">
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Поездки</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Управление всеми вашими командировками
              </p>
            </div>
            <TripForm onAddTrip={addTrip} />
          </div>

          {/* Stats Cards */}
          <TripStats
              totalTrips={filteredStats.totalTrips}
              totalDistance={filteredStats.totalDistance}
              totalAmortization={filteredStats.totalAmortization}
              totalFuelAmount={filteredStats.totalFuelAmount}
          />

          {/* Trips Table */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-lg md:text-xl">Все поездки</CardTitle>
                <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
                  <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
                    <TabsTrigger value="all">Все ({trips.length})</TabsTrigger>
                    <TabsTrigger value="completed">Завершённые ({counts.completed})</TabsTrigger>
                    <TabsTrigger value="planned">Запланированные ({counts.planned})</TabsTrigger>
                    <TabsTrigger value="cancelled">Отменённые ({counts.cancelled})</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-0 md:p-6">
              <TripTable
                  trips={filteredTrips}
                  isLoading={isLoading}
                  onDeleteTrip={deleteTrip}
                  isMobile={isMobile}
              />
            </CardContent>
          </Card>
        </div>
      </div>
  );
}