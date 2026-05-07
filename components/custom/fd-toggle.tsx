import clsx from "clsx";

export function FDToggle({ checked, onChange }: any) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={clsx(
        "transition-transform duration-200",
        checked ? "scale-105" : "opacity-70"
      )}
    >
      <svg
        width="20"
        height="26"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background changes color */}
        <circle
          cx="32"
          cy="32"
          r="32"
          fill={checked ? "#22C55E" : "#64748B"}
        />

        {/* Headphone icon */}
        <path
          d="M46 32V38C46 39.1 45.1 40 44 40H40V30H44C45.1 30 46 30.9 46 32Z"
          fill="white"
        />
        <path
          d="M18 32V38C18 39.1 18.9 40 20 40H24V30H20C18.9 30 18 30.9 18 32Z"
          fill="white"
        />
        <path
          d="M32 16C23.16 16 16 23.16 16 32V34H20V32C20 25.37 25.37 20 32 20C38.63 20 44 25.37 44 32V34H48V32C48 23.16 40.84 16 32 16Z"
          fill="white"
        />
        <path
          d="M44 40C44 42.21 42.21 44 40 44H36V46H40C43.31 46 46 43.31 46 40V38H44V40Z"
          fill="white"
        />
        <circle cx="34" cy="46" r="2" fill="white" />
      </svg>
    </button>
  );
}