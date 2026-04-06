// components/kb/KBExplorer.tsx
"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Search, 
  BookOpen, 
  Clock, 
  User, 
  Tag, 
  FileText, 
  LayoutGrid, 
  List as ListIcon,
  ChevronRight 
} from "lucide-react";
import { getKBArticles } from "@/lib/api/knowledge-base/get";
import { AddArticleDrawer } from "./add-article-drawer";

export default function KBExplorer() {
  const [articles, setArticles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isPending, startTransition] = useTransition();

  const fetchArticles = useCallback((term: string = "") => {
    startTransition(async () => {
      const results = await getKBArticles(term);
      setArticles(results);
    });
  }, []);

  useEffect(() => {
    fetchArticles("");
  }, [fetchArticles]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground text-sm">Managing documentation in Excel.</p>
        </header>
        
        <div className="flex items-center gap-3">
          {/* View Switcher */}
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")} className="w-[120px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid"><LayoutGrid className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="list"><ListIcon className="h-4 w-4" /></TabsTrigger>
            </TabsList>
          </Tabs>
          <AddArticleDrawer onRefresh={() => fetchArticles(searchTerm)} />
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, publisher, or ID..."
          className="pl-10 h-12 text-lg shadow-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            fetchArticles(e.target.value);
          }}
        />
      </div>

      <ScrollArea className="h-[650px] pr-4 border rounded-xl p-4 bg-muted/10">
        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Search className="h-10 w-10 mb-2 opacity-20" />
            <p>No articles found.</p>
          </div>
        ) : viewMode === "grid" ? (
          // GRID VIEW
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => (
              <div key={article.id} onClick={() => setSelectedArticle(article)}>
                <KBArticleCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          // LIST VIEW
          <div className="space-y-2">
            <div className="grid grid-cols-12 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-1">ID</div>
              <div className="col-span-5">Title</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Publisher</div>
              <div className="col-span-2 text-right">Updated</div>
            </div>
            {articles.map((article) => (
              <KBArticleListRow 
                key={article.id} 
                article={article} 
                onClick={() => setSelectedArticle(article)} 
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* READ DIALOG (Stays the same as before) */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedArticle && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex gap-2 mb-2">
                  <Badge variant="outline" className="bg-primary/5">{selectedArticle.category}</Badge>
                  <Badge variant="secondary">{selectedArticle.status}</Badge>
                </div>
                <DialogTitle className="text-3xl font-bold">{selectedArticle.systitle}</DialogTitle>
                <DialogDescription className="flex items-center gap-4 pt-4 border-b pb-4">
                  <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {selectedArticle.publisher}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {new Date(selectedArticle.sysupdated_at).toLocaleDateString()}</span>
                </DialogDescription>
              </DialogHeader>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed text-foreground/80">
                  {selectedArticle.content || "No content body available."}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function KBArticleCard({ article }: { article: any }) {
  return (
    <Card className="hover:border-primary/50 transition-all cursor-pointer h-full group">
      <CardHeader className="pb-2 space-y-2">
        <Badge className="w-fit font-normal" variant="secondary">{article.category}</Badge>
        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">{article.systitle}</CardTitle>
      </CardHeader>
      <CardFooter className="text-[10px] text-muted-foreground flex justify-between border-t pt-3">
        <span>By {article.publisher}</span>
        <span>{new Date(article.sysupdated_at).toLocaleDateString()}</span>
      </CardFooter>
    </Card>
  );
}

function KBArticleListRow({ article, onClick }: { article: any, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="grid grid-cols-12 items-center px-4 py-3 bg-background border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer text-sm"
    >
      <div className="col-span-1 font-mono text-xs text-muted-foreground">#{article.id}</div>
      <div className="col-span-5 font-medium truncate pr-4">{article.systitle}</div>
      <div className="col-span-2">
        <Badge variant="outline" className="text-[10px] py-0">{article.category}</Badge>
      </div>
      <div className="col-span-2 text-muted-foreground truncate">{article.publisher}</div>
      <div className="col-span-2 text-right text-xs text-muted-foreground flex items-center justify-end gap-2">
        {new Date(article.sysupdated_at).toLocaleDateString()}
        <ChevronRight className="h-4 w-4 opacity-30" />
      </div>
    </div>
  );
}