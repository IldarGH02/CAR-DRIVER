import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
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

  useEffect(() => {
    fetchTrips();
  }, []);

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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <TripStats
                totalTrips={stats.totalTrips}
                totalDistance={stats.totalDistance}
                totalAmortization={stats.totalAmortization}
                totalFuelAmount={stats.totalFuelAmount}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Все поездки</CardTitle>
            </CardHeader>
            <CardContent>
              <TripTable
                  trips={trips}
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