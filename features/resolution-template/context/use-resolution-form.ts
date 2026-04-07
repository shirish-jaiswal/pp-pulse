import { useState, useEffect } from "react";
import { useSubcategories } from "@/features/resolution-template/hooks/use-subcategories";
import { useGames } from "@/hooks/excel-db/use-games";
import { DropdownOption } from "@/features/resolution-template/components/form/selector";
import { ResolutionTemplate } from "@/lib/excel-engine/resolution-template/get";
import { useCategories } from "@/hooks/excel-db/use-categories";

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    initialData: ResolutionTemplate | null;
    onSave: (data: any) => Promise<void>;
}

export function useResolutionForm({
    isOpen,
    initialData,
    onSave,
    onOpenChange,
}: Props) {
    const [title, setTitle] = useState("");
    const [game, setGame] = useState<DropdownOption | null>(null);
    const [subcategory, setSubcategory] = useState<DropdownOption | null>(null);
    const [category, setCategory] = useState<string>("");
    const [content, setContent] = useState("");

    const { data: games = [] } = useGames();
    const { data: subcategories = [] } = useSubcategories();
    const { data: categories = [] } = useCategories();
    const [isPending, setIsPending] = useState(false);

    const handleSave = async () => {
        try {
            setIsPending(true);

            await onSave({
                title,
                content,
                game: game?.value,
                category,
                subcategory: subcategory?.value,
            });

            onOpenChange(false);
        } catch (err) {
            console.error("Save failed:", err);
        } finally {
            setIsPending(false);
        }
    };
    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            setTitle(initialData.title || "");
            setCategory(initialData.category);
            setContent(initialData.content);
            setGame({ key: initialData.game, value: initialData.game });
            setSubcategory({
                key: initialData.subcategory,
                value: initialData.subcategory,
            });
        } else {
            setTitle("");
            setContent("");
            setGame(null);
            setSubcategory(null);

            if (categories.length > 0) {
                const defaultCat = categories.find(c => c.title === "Resolution Summary") || categories[0];
                setCategory(defaultCat.title);
            }
        }
    }, [initialData, isOpen, categories]);

    useEffect(() => {
        if (!initialData && games.length && !game) setGame(games[0]);
    }, [games, initialData, game]);

    useEffect(() => {
        if (!initialData && subcategories.length && !subcategory)
            setSubcategory(subcategories[0]);
    }, [subcategories, initialData, subcategory]);

    const tabValue = category;

    const setTabValue = (val: string) => {
        setCategory(val);
    };

    return {
        title,
        setTitle,
        game,
        setGame,
        subcategory,
        setSubcategory,
        category,
        categories,
        content,
        setContent,
        games,
        subcategories,
        tabValue,
        setTabValue,
        onOpenChange,
        handleSave,
        isPending,
    };
}