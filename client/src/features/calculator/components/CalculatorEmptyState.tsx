import { Card, CardContent } from "@shared/ui/card";
import { Calculator } from "lucide-react";

export const CalculatorEmptyState = () => {
    return (
        <Card className="h-full flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <CardContent className="text-center p-4 sm:p-8 py-8 sm:py-12">
                <Calculator className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-muted-foreground max-w-[250px] sm:max-w-none mx-auto">
                    Заполните форму слева, чтобы увидеть результаты расчёта
                </p>
            </CardContent>
        </Card>
    );
};