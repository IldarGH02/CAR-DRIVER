import { Card, CardContent } from "@shared/ui/card";
import { Download } from "lucide-react";

export const TipCard = () => (
    <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Download className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                    <h3 className="font-medium mb-1">Совет</h3>
                    <p className="text-sm text-muted-foreground">
                        Формируйте отчёты ежемесячно для удобного учёта расходов
                        и подготовки документов для бухгалтерии
                    </p>
                </div>
            </div>
        </CardContent>
    </Card>
);