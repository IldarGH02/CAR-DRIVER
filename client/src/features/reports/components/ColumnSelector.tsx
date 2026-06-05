import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@shared/ui/card";
import { Label } from "@shared/ui/label";
import { availableColumns, ReportColumn } from "../config/reportTypes";

interface ColumnSelectorProps {
    visibleColumns: string[];
    onToggleColumn: (columnId: string) => void;
}

export const ColumnSelector = ({ visibleColumns, onToggleColumn }: ColumnSelectorProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Настройка отображения</CardTitle>
                <CardDescription>
                    Выберите параметры, которые будут отображаться в отчёте
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {availableColumns.map((column: ReportColumn) => (
                        <label
                            key={column.id}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-2 rounded-lg transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={visibleColumns.includes(column.id)}
                                onChange={() => onToggleColumn(column.id)}
                                className="w-4 h-4 text-primary rounded focus:ring-primary"
                            />
                            <span className="text-sm">{column.label}</span>
                        </label>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};