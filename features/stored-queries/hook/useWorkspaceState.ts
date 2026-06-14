// hooks/excel-db/use-workspace-state.ts
import { useState } from "react";
import { toast } from "sonner";
import { STORED_QUERIES_TEMPLATE_TYPE } from "@/lib/excel-engine/kibana/stored-queries/get-all";
import { useAllStoredQueries } from "@/hooks/excel-db/use-queries-template";
import { useFindStoredQueries } from "@/hooks/excel-db/use-find-stored-queries";
import { useStoredQueriesMutations } from "@/hooks/excel-db/useStoredQueriesMutations";

export interface FilterRuleItem {
  id: string;
  field: string;
  type: "phrases" | "exists";
  negate: boolean;
  value: string;
}

export function useWorkspaceState() {
  const [searchInput, setSearchInput] = useState("");
  const [committedKeyword, setCommittedKeyword] = useState("");
  const [isConfigSheetOpen, setIsConfigSheetOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<STORED_QUERIES_TEMPLATE_TYPE | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [queryString, setQueryString] = useState("");
  const [defaultColumns, setDefaultColumns] = useState("");
  const [indexPattern, setIndexPattern] = useState("");
  const [description, setDescription] = useState("");
  const [filterRules, setFilterRules] = useState<FilterRuleItem[]>([]);

  // Row Builder Inputs
  const [inputField, setInputField] = useState("");
  const [inputType, setInputType] = useState<"phrases" | "exists">("phrases");
  const [inputNegate, setInputNegate] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Queries Fetching & Mutations
  const { data: allQueries, isLoading } = useAllStoredQueries();
  const { data: searchedQueries } = useFindStoredQueries({
    keywords: committedKeyword ? [committedKeyword] : [],
    enabled: !!committedKeyword,
  });
  const { saveTemplate, updateTemplate, deleteTemplate, isSaving, isUpdating } = useStoredQueriesMutations();

  const visibleQueries = committedKeyword ? searchedQueries : allQueries;

  const handleExecuteSearch = () => setCommittedKeyword(searchInput.trim());

  const handleOpenCreate = () => {
    setSelectedTemplate(null);
    setTitle("");
    setQueryString("");
    setDefaultColumns("");
    setIndexPattern("");
    setDescription("");
    setFilterRules([]);
    setIsConfigSheetOpen(true);
  };

  const handleOpenEdit = (tpl: STORED_QUERIES_TEMPLATE_TYPE) => {
    setSelectedTemplate(tpl);
    setTitle(tpl.title);
    setQueryString(tpl.query_string);
    setDefaultColumns(tpl.default_columns);
    setIndexPattern(tpl.index);
    setDescription(tpl.description);
    try {
      setFilterRules(tpl.filters ? JSON.parse(tpl.filters) : []);
    } catch {
      setFilterRules([]);
    }
    setIsConfigSheetOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, query_string: queryString, default_columns: defaultColumns, index: indexPattern, description, filters: JSON.stringify(filterRules) };
    try {
      if (selectedTemplate?.id) {
        await updateTemplate({ id: selectedTemplate.id, updates: payload });
        toast.success("Updated successfully.");
      } else {
        await saveTemplate(payload);
        toast.success("Saved successfully.");
      }
      setIsConfigSheetOpen(false);
    } catch (err: any) {
      toast.error("Failed: " + err.message);
    }
  };

  const handleDelete = async (id: string | number, currentTitle: string) => {
    try {
      await deleteTemplate(id as any);
      toast.success(`Removed "${currentTitle}".`);
    } catch (err: any) {
      toast.error("Delete failed: " + err.message);
    }
  };

  const handleAddFilterRule = () => {
    const newRule: FilterRuleItem = {
      id: `f_${Date.now()}`,
      field: inputField,
      type: inputType,
      negate: inputNegate,
      value: inputType === "exists" ? "exists" : inputValue,
    };
    setFilterRules((prev) => [...prev, newRule]);
    setInputField("");
    setInputValue("");
  };

  const handleRemoveFilterRule = (id: string) => {
    setFilterRules((prev) => prev.filter((r) => r.id !== id));
  };

  return {
    searchInput, setSearchInput, handleExecuteSearch,
    visibleQueries, isLoading,
    isConfigSheetOpen, setIsConfigSheetOpen,
    handleOpenCreate, handleOpenEdit, handleDelete, handleSave,
    form: {
      title, setTitle,
      queryString, setQueryString,
      defaultColumns, setDefaultColumns,
      indexPattern, setIndexPattern,
      description, setDescription,
      filterRules, handleRemoveFilterRule,
      inputField, setInputField,
      inputType, setInputType,
      inputNegate, setInputNegate,
      inputValue, setInputValue,
      handleAddFilterRule,
      selectedTemplate,
      isSaving, isUpdating
    }
  };
}