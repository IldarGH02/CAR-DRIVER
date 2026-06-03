interface AdminHeaderProps {
    title: string;
    description: string;
}

export const AdminHeader = ({ title, description }: AdminHeaderProps) => (
    <div className="mb-8">
        <h2 className="text-3xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
    </div>
);