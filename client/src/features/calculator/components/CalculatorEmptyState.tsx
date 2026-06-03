import { Card, CardContent } from "@shared/ui/card";
import { Calculator } from "lucide-react";

export const CalculatorEmptyState = () => {
    return (
        <Card className="h-full flex items-center justify-center min-h-[400px]">
            <CardContent className="text-center py-12">
                <Calculator className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                    Заполните форму слева, чтобы увидеть результаты расчёта
                </p>
            </CardContent>
        </Card>
    );
};