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
            className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left w-full active:scale-[0.98] ${
                isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
            }`}
        >
            <div className="flex items-start gap-2 sm:gap-3">
                <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                    }`}
                >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base mb-0.5 sm:mb-1 truncate">
                        {type.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-none">
                        {type.description}
                    </p>
                </div>
            </div>
        </button>
    );
};