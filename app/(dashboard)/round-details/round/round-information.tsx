"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Activity, Zap, Landmark, Gamepad2, Fingerprint, Hash, User, Clock, Copy, Check
} from "lucide-react";

interface RoundInformationProps {
    data: any;
    common: any;
}

export function RoundInformation({ data, common }: RoundInformationProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const roundId = data?.exists?.roundId;
        const playerId = data?.exists?.userId;
        const gameId = data?.exists?.gameId;

        let textToCopy = "";
        if (playerId || gameId) {
            textToCopy = `${roundId} or (${playerId || ''} and ${gameId || 'N/A'})`;
        } else if (roundId) {
            textToCopy = roundId;
        }

        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Card className="border-none shadow-lg ring-1 ring-border bg-white overflow-hidden p-0 flex flex-col gap-1">
            <div className="bg-slate-50 border-b border-slate-200 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                    <InfoBlock
                        icon={<Hash className="h-3 w-3" />}
                        label="Game ID"
                        value={data.exists.gameId}
                        color="text-indigo-600"
                    />
                    <InfoBlock
                        icon={<Activity className="h-3 w-3" />}
                        label="Round ID"
                        value={data.exists.roundId}
                        color="text-emerald-600"
                    />
                    <InfoBlock
                        icon={<User className="h-3 w-3" />}
                        label="User ID"
                        value={data.exists.userId}
                        color="text-blue-600"
                    />
                    <InfoBlock
                        icon={<Clock className="h-3 w-3" />}
                        label="Game Started"
                        value={common.gameStart}
                        isDateTime={true}
                    />
                    <InfoBlock
                        icon={<Landmark className="h-3 w-3" />}
                        label="Casino Name"
                        value={common.casinoDesc || "N/A"}
                    />
                    <InfoBlock
                        icon={<Fingerprint className="h-3 w-3" />}
                        label="Casino ID"
                        value={common.casinoId}
                    />
                </div>
            </div>

            <CardContent className="p-4 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {/* Game Environment Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Gamepad2 className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Game Environment</span>
                        </div>
                        <div className="space-y-3 pl-5 border-l-2 border-slate-100">
                            <DetailItem label="Type" value={common.gameType} />
                            <div>
                                <span className="text-[8px] font-bold text-slate-400 uppercase block">Name (id)</span>
                                <p className="text-[11px] font-bold text-slate-700 break-all">
                                    {common.tableName} <span className="text-slate-400 font-normal">({common.tableId})</span>
                                </p>
                            </div>
                            <DetailItem label="Mode" value={common.gameMode} className="capitalize" />
                        </div>
                    </div>

                    {/* Currency Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Zap className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Currency</span>
                        </div>
                        <div className="space-y-2 pl-5 border-l-2 border-slate-100">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-[9px] font-mono bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-none">
                                    {common.betCurrency}
                                </Badge>
                            </div>
                            {(common.megaSlot || common.megaPayout) && (
                                <div className="bg-amber-50/50 p-2 rounded border border-amber-100">
                                    <p className="text-[9px] font-bold text-amber-700 flex justify-between gap-2">
                                        <span className="truncate">Slot: {common.megaSlot}</span>
                                        <span className="font-black text-amber-900 shrink-0">{common.megaPayout}x</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>

            <div className="px-4 pb-4">
                <Button
                    variant="secondary"
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center gap-2 h-auto py-2 border-none shadow-none"
                    onClick={handleCopy}
                >
                    {copied ? (
                        <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Query Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy className="h-3.5 w-3.5 shrink-0" />
                            <span className="text-[10px] font-bold tracking-widest text-center leading-tight">
                                QUERY : roundId or (playerId and gameId)
                            </span>
                        </>
                    )}
                </Button>
            </div>
        </Card>
    );
}

function InfoBlock({ icon, label, value, color = "text-slate-400", isDateTime = false }: any) {
    const renderValue = () => {
        if (isDateTime && typeof value === 'string') {
            const parts = value.split(' '); 
            return (
                <div className="flex flex-col">
                    <span>{parts[0]}</span>
                    {parts[1] && (
                        <span >
                            {parts[1]}
                        </span>
                    )}
                </div>
            );
        }
        return value;
    };

    return (
        <div className="space-y-1 min-w-0">
            <span className={`text-[9px] font-black ${color} uppercase tracking-widest flex items-center gap-1`}>
                {icon} {label}
            </span>
            <div className="text-xs font-mono font-bold text-slate-900 break-all leading-tight">
                {renderValue()}
            </div>
        </div>
    );
}

function DetailItem({ label, value, className = "" }: any) {
    return (
        <div className="min-w-0">
            <span className="text-[8px] font-bold text-slate-400 uppercase block">{label}</span>
            <p className={`text-[11px] font-bold text-slate-700 break-all ${className}`}>{value}</p>
        </div>
    );
}