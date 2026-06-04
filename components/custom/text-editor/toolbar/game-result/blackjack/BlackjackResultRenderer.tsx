"use client";

import React from "react";

export interface Card {
    rank: string | number;
    suit: "spades" | "hearts" | "diamonds" | "clubs" | "s" | "h" | "d" | "c"; 
}

export interface Status {
    label: string;
    variant: "success" | "danger" | "warning" | "default";
}

export interface Section {
    title: string;
    subtitle: string;
    score: string;
    status?: Status;
    cards?: Card[];
    actions?: string[];
}

export interface BlackjackResultConfig {
    gameType: string;
    header?: {
        title: string;
        playerId: string;
        roundId: string;
        gameId: string;
    };
    sections: Section[];
}

export function BlackjackResultRenderer({ config }: { config: BlackjackResultConfig }) {
    const { header, sections } = config;

    return (
        <table
            data-game-block="true"
            cellPadding="0"
            cellSpacing="0"
            style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px", fontFamily: "Arial, sans-serif", fontSize: "13px" }}
        >
            <tbody data-game-block="true">
                {header && (
                    <tr data-game-block="true">
                        <td
                            data-game-block="true"
                            {...{ bgColor: "#ffffff" }}
                            style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontFamily: "monospace", fontSize: "11px", backgroundColor: "#ffffff" }}
                        >
                            <span data-game-block="true" style={{ marginRight: "16px" }}><strong>ROUND:</strong> {header.roundId}</span>
                            <span data-game-block="true" style={{ marginRight: "16px" }}><strong>PLAYER:</strong> {header.playerId}</span>
                            <span data-game-block="true"><strong>GAME:</strong> {header.gameId}</span>
                        </td>
                    </tr>
                )}

                {sections?.map((section, idx) => {
                    let statusBg = "#f1f5f9"; 
                    let statusColor = "#334155"; 
                    if (section.status?.variant === "success") { statusBg = "#e2e8f0"; statusColor = "#334155"; } 
                    else if (section.status?.variant === "danger") { statusBg = "#fee2e2"; statusColor = "#991b1b"; } 
                    else if (section.status?.variant === "warning") { statusBg = "#fef3c7"; statusColor = "#92400e"; }

                    return (
                        <tr key={idx} data-game-block="true">
                            <td
                                data-game-block="true"
                                {...{ bgColor: "#f8fafc" }}
                                style={{ padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", backgroundColor: "#f8fafc" }}
                            >
                                {/* Meta Rows Table */}
                                <table data-game-block="true" cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "8px" }}>
                                    <tbody data-game-block="true">
                                        <tr data-game-block="true">
                                            <td data-game-block="true" style={{ padding: 0, backgroundColor: "transparent", border: "none" }}>
                                                <div data-game-block="true" style={{ fontSize: "14px", fontWeight: "bold", color: "#0f172a" }}>{section.title}</div>
                                                <div data-game-block="true" style={{ fontSize: "11px", color: "#94a3b8" }}>{section.subtitle}</div>
                                            </td>
                                            <td data-game-block="true" style={{ padding: 0, backgroundColor: "transparent", border: "none", textAlign: "right", verticalAlign: "middle" }}>
                                                {section.status && (
                                                    <span data-game-block="true" style={{
                                                        fontSize: "10px",
                                                        fontWeight: "bold",
                                                        padding: "3px 8px",
                                                        borderRadius: "4px",
                                                        backgroundColor: statusBg,
                                                        color: statusColor,
                                                        marginRight: "8px",
                                                        display: "inline-block"
                                                    }}>
                                                        {section.status.label}
                                                    </span>
                                                )}
                                                <span data-game-block="true" style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", fontFamily: "monospace" }}>{section.score}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Cards Mapping Table */}
                                {section.cards && section.cards.length > 0 && (
                                    <table data-game-block="true" cellPadding="0" cellSpacing="0" style={{ borderCollapse: "separate", borderSpacing: "4px 0", marginBottom: "6px" }}>
                                        <tbody data-game-block="true">
                                            <tr data-game-block="true">
                                                {section.cards.map((card, cIdx) => {
                                                    const suitStr = String(card.suit).toLowerCase().trim();
                                                    const isRed = suitStr === "hearts" || suitStr === "h" || suitStr === "diamonds" || suitStr === "d";
                                                    
                                                    let symbol = "♣";
                                                    if (suitStr === "spades" || suitStr === "s") symbol = "♠";
                                                    else if (suitStr === "hearts" || suitStr === "h") symbol = "♥";
                                                    else if (suitStr === "diamonds" || suitStr === "d") symbol = "♦";

                                                    let displayRank = String(card.rank).trim();
                                                    if (displayRank === "1") displayRank = "A";
                                                    else if (displayRank === "11") displayRank = "J";
                                                    else if (displayRank === "12") displayRank = "Q";
                                                    else if (displayRank === "13") displayRank = "K";

                                                    return (
                                                        <td
                                                            key={cIdx}
                                                            data-game-block="true"
                                                            {...{ bgColor: "#ffffff" }}
                                                            style={{
                                                                width: "42px",
                                                                height: "58px",
                                                                backgroundColor: "#ffffff",
                                                                border: "1px solid #cbd5e1",
                                                                borderRadius: "4px",
                                                                padding: "6px",
                                                                verticalAlign: "top"
                                                            }}
                                                        >
                                                            <div data-game-block="true" style={{ fontSize: "12px", fontWeight: "bold", color: "#0f172a", lineHeight: "1" }}>
                                                                {displayRank}
                                                            </div>
                                                            <div data-game-block="true" style={{ 
                                                                textAlign: "right", 
                                                                marginTop: "12px", 
                                                                color: isRed ? "#ef4444" : "#0f172a", 
                                                                fontSize: "14px", 
                                                                fontWeight: "bold", 
                                                                lineHeight: "1" 
                                                            }}>
                                                                {symbol}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        </tbody>
                                    </table>
                                )}

                                {/* Actions Mapping Table */}
                                {section.actions && !!section.actions.length && (
                                    <table data-game-block="true" cellPadding="0" cellSpacing="0" style={{ borderCollapse: "separate", borderSpacing: "4px 0" }}>
                                        <tbody data-game-block="true">
                                            <tr data-game-block="true">
                                                {section.actions.map((act, aIdx) => (
                                                    <td
                                                        key={aIdx}
                                                        data-game-block="true"
                                                        {...{ bgColor: "#ffffff" }}
                                                        style={{
                                                            fontSize: "10px",
                                                            fontFamily: "monospace",
                                                            padding: "2px 6px",
                                                            backgroundColor: "#ffffff",
                                                            border: "1px solid #e2e8f0",
                                                            borderRadius: "4px",
                                                            color: "#64748b"
                                                        }}
                                                    >
                                                        {act}
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                )}

                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}