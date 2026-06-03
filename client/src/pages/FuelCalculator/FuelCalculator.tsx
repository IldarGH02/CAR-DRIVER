import { useCalculator } from "@features/calculator/hooks/useCalculator";
import { CalculatorForm } from "@features/calculator/components/CalculatorForm";
import { CalculatorResults } from "@features/calculator/components/CalculatorResults";
import { CalculatorEmptyState } from "@features/calculator/components/CalculatorEmptyState";

export function FuelCalculator() {
  const {
    inputs,
    results,
    updateInput,
    calculateResults,
    resetForm,
  } = useCalculator();

  return (
      <div className="flex-1 overflow-auto bg-background">
        <div className="p-4 md:p-8">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Топливный калькулятор</h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Рассчитайте стоимость топлива и амортизацию для поездки
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CalculatorForm
                distance={inputs.distance}
                fuelConsumption={inputs.fuelConsumption}
                fuelPrice={inputs.fuelPrice}
                amortizationRate={inputs.amortizationRate}
                onDistanceChange={(value) => updateInput("distance", value)}
                onFuelConsumptionChange={(value) => updateInput("fuelConsumption", value)}
                onFuelPriceChange={(value) => updateInput("fuelPrice", value)}
                onAmortizationRateChange={(value) => updateInput("amortizationRate", value)}
                onCalculate={calculateResults}
                onReset={resetForm}
            />

            {results ? (
                <CalculatorResults
                    fuelAmount={results.fuelAmount}
                    fuelCost={results.fuelCost}
                    amortization={results.amortization}
                    total={results.total}
                    distance={inputs.distance}
                    fuelConsumption={inputs.fuelConsumption}
                />
            ) : (
                <CalculatorEmptyState />
            )}
          </div>
        </div>
      </div>
  );
}