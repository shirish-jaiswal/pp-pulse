"use client";

type ToggleProps = {
  enabled: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
};

export default function Toggle({
  enabled,
  onChange,
  disabled = false,
}: ToggleProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!enabled)}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition
        ${enabled ? "bg-green-500" : "bg-gray-300"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow transform transition
          ${enabled ? "translate-x-6" : "translate-x-0"}
        `}
      />
    </button>
  );
}