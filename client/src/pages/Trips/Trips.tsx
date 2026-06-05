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

  return (
      <div className="flex-1 overflow-auto bg-background">
        <div className="p-4 md:p-8">
          <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-2">Поездки</h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Управление всеми вашими командировками
              </p>
            </div>
            <TripForm onAddTrip={addTrip} />
          </div>

          <TripStats
              totalTrips={filteredStats.totalTrips}
              totalDistance={filteredStats.totalDistance}
              totalAmortization={filteredStats.totalAmortization}
              totalFuelAmount={filteredStats.totalFuelAmount}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Все поездки</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter} className="mb-4">
                <TabsList>
                  <TabsTrigger value="all">Все ({trips.length})</TabsTrigger>
                  <TabsTrigger value="completed">Завершённые ({trips.filter(t => {
                    const today = new Date(); today.setHours(0,0,0,0);
                    const tripDate = new Date(t.date); tripDate.setHours(0,0,0,0);
                    return t.status !== "cancelled" && tripDate <= today;
                  }).length})</TabsTrigger>
                  <TabsTrigger value="planned">Запланированные ({trips.filter(t => {
                    const today = new Date(); today.setHours(0,0,0,0);
                    const tripDate = new Date(t.date); tripDate.setHours(0,0,0,0);
                    return t.status !== "cancelled" && tripDate > today;
                  }).length})</TabsTrigger>
                  <TabsTrigger value="cancelled">Отменённые ({trips.filter(t => t.status === "cancelled").length})</TabsTrigger>
                </TabsList>
              </Tabs>
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