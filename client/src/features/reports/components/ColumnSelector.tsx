import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@shared/ui/card";
import { availableColumns, ReportColumn } from "../config/reportTypes";

interface ColumnSelectorProps {
    visibleColumns: string[];
    onToggleColumn: (columnId: string) => void;
}

export const ColumnSelector = ({ visibleColumns, onToggleColumn }: ColumnSelectorProps) => {
    return (
        <Card>
            <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Настройка отображения</CardTitle>
                <CardDescription className="text-sm">
                    Выберите параметры, которые будут отображаться в отчёте
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                    {availableColumns.map((column: ReportColumn) => (
                        <label
                            key={column.id}
                            className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-muted p-2 sm:p-3 rounded-lg transition-colors active:bg-muted/70"
                        >
                            <input
                                type="checkbox"
                                checked={visibleColumns.includes(column.id)}
                                onChange={() => onToggleColumn(column.id)}
                                className="w-4 h-4 sm:w-5 sm:h-5 text-primary rounded focus:ring-primary cursor-pointer flex-shrink-0"
                            />
                            <span className="text-sm sm:text-base truncate">{column.label}</span>
                        </label>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};