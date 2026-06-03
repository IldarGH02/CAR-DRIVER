import { reportTypes } from "../config/reportTypes";

interface ReportTypeCardProps {
    type: typeof reportTypes[0];
    isSelected: boolean;
    onSelect: () => void;
}

export const ReportTypeCard = ({ type, isSelected, onSelect }: ReportTypeCardProps) => {
    const Icon = type.icon;

    return (
        <button
            onClick={onSelect}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
            }`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                    }`}
                >
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h3 className="font-medium mb-1">{type.title}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
            </div>
        </button>
    );
};