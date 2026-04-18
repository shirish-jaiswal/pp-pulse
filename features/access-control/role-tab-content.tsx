export default function RoleTable({ table }: { table: any }) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Role Management View</div>

      {/* Example custom UI for role table */}
      <div className="space-y-2">
        {table?.data?.map((role: any, idx: number) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 border rounded-lg bg-blue-50"
          >
            <div>
              <div className="font-semibold">{role.name || "Unnamed Role"}</div>
              <div className="text-xs text-gray-600">
                {role.permissions?.length || 0} permissions
              </div>
            </div>

            <div className="text-xs px-2 py-1 bg-blue-100 rounded">
              {role.status || "active"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}