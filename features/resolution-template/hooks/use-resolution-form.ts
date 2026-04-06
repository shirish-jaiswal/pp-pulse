import { useState, useEffect } from "react";
import { CategoryType, Resolution } from "@/features/resolution-template/types/types";
import { useSaveResolution } from "@/features/resolution-template/hooks/use-save-resolution";
import { useSubcategories } from "@/features/resolution-template/hooks/use-subcategories";
import { useGames } from "@/features/resolution-template/hooks/use-games";
import { DropdownOption } from "@/features/resolution-template/components/form/selector";

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    initialData: Resolution | null;
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
    const [category, setCategory] =
        useState<CategoryType>("Resolution Summary");
    const [content, setContent] = useState("");

    const { data: games = [] } = useGames();
    const { data: subcategories = [] } = useSubcategories();
    const { mutateAsync, isPending } = useSaveResolution(onSave);

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
            setCategory("Resolution Summary");
            setContent("");
            setGame(null);
            setSubcategory(null);
        }
    }, [initialData, isOpen]);

    useEffect(() => {
        if (!initialData && games.length) setGame(games[0]);
    }, [games]);

    useEffect(() => {
        if (!initialData && subcategories.length)
            setSubcategory(subcategories[0]);
    }, [subcategories]);

    const handleSave = async () => {
        if (!title || !content || !game || !subcategory) return;

        await mutateAsync({
            title,
            game: game.value,
            subcategory: subcategory.value,
            category,
            content,
        });

        onOpenChange(false);
    };

    const tabValue =
        category === "Operator Response" ? "response" : "summary";

    const setTabValue = (val: string) => {
        setCategory(
            val === "response"
                ? "Operator Response"
                : "Resolution Summary"
        );
    };

    return {
        title,
        setTitle,
        game,
        setGame,
        subcategory,
        setSubcategory,
        category,
        content,
        setContent,
        games,
        subcategories,
        handleSave,
        isPending,
        tabValue,
        setTabValue,
        onOpenChange,
    };
}