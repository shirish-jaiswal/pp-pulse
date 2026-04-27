import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconBgClass?: string;
  className?: string;
}

const StatCard = ({ 
  label, 
  value, 
  icon: Icon, 
  iconBgClass = "bg-slate-900", 
  className = "bg-slate-50 ring-slate-200" 
}: StatCardProps) => (
  <Card className={`border-none shadow-sm ring-1 p-0 ${className}`}>
    <CardContent className="p-4 flex items-center gap-3">
      <div className={`p-2 rounded text-white ${iconBgClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="overflow-hidden">
        <p className="text-[10px] font-bold uppercase text-slate-500">{label}</p>
        <p className="text-sm font-mono font-bold truncate tracking-tight text-slate-900">
          {value}
        </p>
      </div>
    </CardContent>
  </Card>
);

export default StatCard;