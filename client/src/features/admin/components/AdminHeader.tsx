interface AdminHeaderProps {
    title: string;
    description: string;
}

export const AdminHeader = ({ title, description }: AdminHeaderProps) => (
    <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-2">{title}</h2>
        <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
    </div>
);