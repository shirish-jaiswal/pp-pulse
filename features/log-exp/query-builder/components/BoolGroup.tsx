import React, { useCallback } from "react";
import { ConditionRow } from "./ConditionRow";
import { useQueryBuilder } from "../context/QueryBuilderContext";
import { LogicalDivider } from "./LogicalDivider";

interface BoolGroupProps {
    id: string;
    isRoot?: boolean;
}

export const BoolGroup: React.FC<BoolGroupProps> = ({ id, isRoot = false }) => {
    const { state, actions } = useQueryBuilder();
    const node = state.nodes[id];

    if (!node || node.type !== "bool") return null;

    const handleDeleteGroup = useCallback(() => {
        actions.deleteNode(node.id);
    }, [actions, node.id]);

    const handleAddSubgroup = useCallback(() => {
        actions.addGroup(node.id);
    }, [actions, node.id]);

    const handleToggleRelation = useCallback((childId: string, currentRelation: "AND" | "OR") => {
        const nextRelation = currentRelation === "AND" ? "OR" : "AND";
        actions.updateRelation(node.id, childId, nextRelation);
    }, [actions, node.id]);

    const containerStyles = isRoot
        ? "bg-slate-50/70 border-slate-200"
        : "bg-blue-50/30 border-blue-100";

    return (
        <div className={`space-y-2 rounded-md border-2 p-2 ${containerStyles}`}>
            <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {isRoot ? "Global Filter Group" : "Nested Logic Subgroup"}
                </span>
                {!isRoot && (
                    <button
                        type="button"
                        onClick={handleDeleteGroup}
                        className="text-[11px] font-semibold text-red-500 transition-colors hover:text-red-700"
                    >
                        Delete
                    </button>
                )}
            </div>

            <div className="space-y-1.5 border-l-[3px] border-slate-300 pl-2.5">
                {node.children.map((childRef, index) => {
                    const child = state.nodes[childRef.id];
                    if (!child) return null;

                    const activeRelation = childRef.relation || "AND";

                    return (
                        <React.Fragment key={child.id}>
                            {index > 0 && (
                                <LogicalDivider
                                    relation={activeRelation}
                                    onToggle={() => handleToggleRelation(child.id, activeRelation)}
                                />
                            )}

                            {child.type === "bool" ? (
                                <BoolGroup id={child.id} isRoot={false} />
                            ) : (
                                <ConditionRow node={child} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            <div className="flex gap-1.5 pl-2.5 pt-1">
                <button
                    type="button"
                    onClick={handleAddSubgroup}
                    className="flex items-center gap-1 rounded border border-blue-200 bg-white px-2.5 py-1 text-[11px] font-bold text-blue-600 shadow-sm transition-colors hover:bg-blue-50"
                >
                    Add Subgroup
                </button>
            </div>
        </div>
    );
};