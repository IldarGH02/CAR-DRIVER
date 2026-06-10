import { Card, CardContent } from "@shared/ui/card";
import { Download } from "lucide-react";

export const TipCard = () => (
    <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 sm:p-6 pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Download className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <div>
                    <h3 className="font-medium text-sm sm:text-base mb-1">Совет</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Формируйте отчёты ежемесячно для удобного учёта расходов
                        и подготовки документов для бухгалтерии
                    </p>
                </div>
            </div>
        </CardContent>
    </Card>
);