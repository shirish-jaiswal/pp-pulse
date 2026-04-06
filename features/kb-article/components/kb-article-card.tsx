// components/kb/KBArticleCard.tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Tag, Calendar } from "lucide-react";

export function KBArticleCard({ article }: { article: any }) {
  const statusColor = article.status === "Published" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600";

  return (
    <Card className="group hover:border-primary/50 transition-all">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="font-normal">
            <Tag className="mr-1 h-3 w-3" /> {article.category}
          </Badge>
          <Badge className={`${statusColor} border-none`}>
            {article.status}
          </Badge>
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {article.systitle}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="text-sm text-muted-foreground">
        {/* If you have a content field, show it here; otherwise, show metadata */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <User className="mr-2 h-3.5 w-3.5" />
            <span>Published by: <strong>{article.publisher}</strong></span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-3.5 w-3.5" />
            <span>Updated: {new Date(article.sysupdated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
        ID: {article.id} • Created: {new Date(article.created_at).toLocaleDateString()}
      </CardFooter>
    </Card>
  );
}