export default function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">

            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {title}
            </div>

            {children}
        </div>
    );
}