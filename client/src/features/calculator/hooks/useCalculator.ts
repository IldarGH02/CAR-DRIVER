import { useState, useCallback } from "react";

interface CalculatorInputs {
    distance: string;
    fuelConsumption: string;
    fuelPrice: string;
    amortizationRate: string;
}

interface CalculatorResults {
    fuelAmount: number;
    fuelCost: number;
    amortization: number;
    total: number;
}

export const useCalculator = () => {
    const [inputs, setInputs] = useState<CalculatorInputs>({
        distance: "",
        fuelConsumption: "",
        fuelPrice: "",
        amortizationRate: "2.68",
    });
    const [results, setResults] = useState<CalculatorResults | null>(null);

    const updateInput = useCallback((field: keyof CalculatorInputs, value: string) => {
        setInputs(prev => ({ ...prev, [field]: value }));
    }, []);

    const calculateResults = useCallback(() => {
        const dist = parseFloat(inputs.distance);
        const consumption = parseFloat(inputs.fuelConsumption);
        const price = parseFloat(inputs.fuelPrice);
        const rate = parseFloat(inputs.amortizationRate);

        if (isNaN(dist) || isNaN(consumption) || isNaN(price) || isNaN(rate)) {
            return;
        }

        const fuelAmount = (consumption * dist) / 100;
        const fuelCost = fuelAmount * price;
        const amortization = dist * rate;
        const total = fuelCost + amortization;

        setResults({
            fuelAmount,
            fuelCost,
            amortization,
            total,
        });
    }, [inputs]);

    const resetForm = useCallback(() => {
        setInputs({
            distance: "",
            fuelConsumption: "",
            fuelPrice: "",
            amortizationRate: "2.68",
        });
        setResults(null);
    }, []);

    return {
        inputs,
        results,
        updateInput,
        calculateResults,
        resetForm,
    };
};