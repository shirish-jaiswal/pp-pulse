import { Loader2, Sparkles } from "lucide-react";

type GenerateFilterButtonProps = {
  isGenerating: boolean;
  onGenerate: () => void;
};

export function FetchDataAndLoadTemplates({
  isGenerating,
  onGenerate,
}: GenerateFilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onGenerate}
      disabled={isGenerating}
      className="group inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-linear-to-r from-violet-50 to-indigo-50 px-2.5 py-1.5 text-sm font-semibold text-violet-700 shadow-sm transition-all duration-200 hover:border-violet-300 hover:from-violet-100 hover:to-indigo-100 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110" />
        </>
      )}
    </button>
  );
}