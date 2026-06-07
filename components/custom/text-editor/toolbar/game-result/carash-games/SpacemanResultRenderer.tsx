"use client";

import React from "react";

interface SpacemanResultRendererProps {
  config: {
    gameType: string;
    header: {
      roundId: string;
      gameCrashedAt: string | null;
    };
    sections: Array<{
      bet_id: string;
      userId: string;
      gameId: string;
      currency: string;
      wageredAmount: number; // maps to bet.betAmount
      totalPayout: number;    // maps to combined HC + FC cash payouts
      full_cashout_opted_enabled: string; // bet.multiplier > 0 ? ...
      half_cashout_opted_enabled: string; // bet.halfmultiplier > 0 ? ...
      statusVariant: "success" | "danger" | "warning";
      isBustedLabel: string;
      hc: {
        typeName: string;     // half_cashout_type
        target: string;       // half_cashout_requested_at
        allocation: number;   // bet.HC_BetAmount
        multiplier: string;   // half_cashout_executed_at
        payout: number;       // bet.HC_CashPayOut
        requested: string;    // bet.HC_Requested
        requestTime: string;  // bet.HC_RequestTime
        settleTime: string;   // bet.HC_SettleTime
        isBusted: boolean;
      };
      co: {
        typeName: string;     // full_cashout_type
        target: string;       // full_cashout_requested_at
        allocation: number;   // bet.FC_BetAmount
        multiplier: string;   // full_cashout_executed_at
        payout: number;       // bet.FC_CashPayOut
        requested: string;    // bet.FC_Requested
        requestTime: string;  // bet.FC_RequestTime
        settleTime: string;   // bet.FC_SettleTime
        isBusted: boolean;
      };
      meta: {
        createdOn: string;
        ck: string;
        updatedOn: string;
        processedCashout: string | number;
        isDisconnected: boolean;
      };
    }>;
  } | null;
}

const formatDate = (date?: string | null) => {
  if (!date) return "—";
  return new Date(date).toUTCString();
};

export function SpacemanResultRenderer({ config }: SpacemanResultRendererProps) {
  if (!config || !config.sections || config.sections.length === 0) {
    return (
      <div style={{ padding: "32px", border: "1px dashed #cbd5e1", borderRadius: "12px", backgroundColor: "#f8fafc", textAlign: "center", color: "#64748b", fontSize: "13px", fontFamily: "Arial, sans-serif" }}>
        No crash game investigation data found.
      </div>
    );
  }

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
              style={{ padding: "10px 12px", borderBottom: "1px solid #cbd5e1", color: "#64748b", fontFamily: "monospace", fontSize: "11px", backgroundColor: "#ffffff" }}
            >
              <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: 0, border: "none" }}>
                      <span><strong>ROUND SPECIFICATION ID:</strong> {header.roundId}</span>
                    </td>
                    <td style={{ padding: 0, border: "none", textAlign: "right", color: "#dc2626", fontWeight: "bold" }}>
                      GAME CRASHED MULTIPLIER: {header.gameCrashedAt ? `${header.gameCrashedAt}x` : "BUST"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        )}

        {sections.map((bet, idx) => {
          let statusBg = "#fee2e2"; 
          let statusColor = "#991b1b";
          if (bet.statusVariant === "success") { 
            statusBg = "#dcfce7"; 
            statusColor = "#14532d"; 
          } else if (bet.statusVariant === "warning") { 
            statusBg = "#fef3c7"; 
            statusColor = "#92400e"; 
          }

          const currencySymbol = bet.currency ? bet.currency.trim() + " " : "";

          return (
            <tr key={bet.bet_id || idx} data-game-block="true">
              <td
                data-game-block="true"
                style={{ padding: "16px", border: "1px solid #cbd5e1", borderLeft: "4px solid #a855f7", borderRadius: "8px", backgroundColor: "#ffffff" }}
              >
                {/* HEADER ROW */}
                <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: 0, border: "none" }}>
                        <span style={{ fontSize: "10px", fontWeight: "bold", padding: "3px 6px", borderRadius: "4px", backgroundColor: statusBg, color: statusColor, marginRight: "8px" }}>
                          {bet.isBustedLabel}
                        </span>
                        <span style={{ fontSize: "11px", fontWeight: "bold", fontFamily: "monospace", backgroundColor: "#e2e8f0", padding: "3px 6px", borderRadius: "4px", color: "#334155" }}>
                          BET POSITION SPOT #0{idx + 1}
                        </span>
                        <div style={{ marginTop: "6px", fontSize: "11px", color: "#64748b", fontFamily: "monospace" }}>
                          <span style={{ marginRight: "16px" }}><strong>USER ID:</strong> {bet.userId}</span>
                          <span><strong>GAME ID:</strong> {bet.gameId}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* KPI METRICS BLOCK */}
                <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "separate", borderSpacing: "6px 0", marginBottom: "16px" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "50%", padding: "8px", backgroundColor: "rgba(241, 245, 249, 0.3)", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
                        <div style={{ fontSize: "10px", color: "#64748b" }}>Initial Bet Amount</div>
                        <strong style={{ fontSize: "14px", display: "block", marginTop: "2px" }}>
                          {currencySymbol}{bet.wageredAmount.toLocaleString()}
                        </strong>
                      </td>
                      <td style={{ width: "50%", padding: "8px", backgroundColor: "rgba(241, 245, 249, 0.3)", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
                        <div style={{ fontSize: "10px", color: "#64748b" }}>Total Payout Received</div>
                        <strong style={{ fontSize: "14px", display: "block", marginTop: "2px", color: "#16a34a" }}>
                          {currencySymbol}{bet.totalPayout.toLocaleString()}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* SLICE SPLIT CARD WRAPPER */}
                <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "separate", borderSpacing: "8px 0", marginBottom: "16px" }}>
                  <tbody>
                    <tr>
                      {/* CARD 1: HALF CASHOUT */}
                      <td valign="top" style={{ width: "50%", padding: "12px", border: "1px solid #e0e7ff", borderRadius: "8px", backgroundColor: "rgba(238, 242, 255, 0.1)" }}>
                        <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse", borderBottom: "1px solid rgba(224, 231, 255, 0.5)", paddingBottom: "8px", marginBottom: "12px" }}>
                          <tbody>
                            <tr>
                              <td style={{ fontSize: "11px", fontWeight: "bold", color: "#4338ca" }}>1. HALF CASHOUT (HC)</td>
                              <td style={{ textAlign: "right", fontSize: "11px", color: "#4338ca", fontWeight: "medium", backgroundColor: "#eef2ff", padding: "2px 8px", borderRadius: "4px" }}>{bet.hc.typeName}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "#64748b" }}>Auto Cashout Enabled at</span> 
                            <span style={{ fontFamily: "monospace", fontWeight: "semibold", fontSize: "12px", color: bet.half_cashout_opted_enabled !== "-" ? "#4338ca" : "#64748b" }}>
                              {bet.half_cashout_opted_enabled}
                            </span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#64748b" }}>Requested Cashout Multiplier</span> 
                            <span style={{ fontFamily: "monospace", fontWeight: "medium" }}>{bet.hc.target}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#64748b" }}>Executed Cashout Multiplier</span> 
                            <span style={{ fontFamily: "monospace", fontWeight: "medium" }}>{bet.hc.multiplier}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#64748b" }}>BET Amount</span> 
                            <span style={{ fontWeight: "medium" }}>{currencySymbol}{bet.hc.allocation.toLocaleString()}</span>
                          </div>

                          {/* HC SEQUENCE LOGS */}
                          <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(224, 231, 255, 0.4)", backgroundColor: "rgba(238, 242, 255, 0.4)", padding: "10px", borderRadius: "8px", fontFamily: "monospace", fontSize: "11px", color: "rgba(30, 27, 75, 0.7)" }}>
                            <div style={{ fontFamily: "sans-serif", fontWeight: "bold", color: "rgba(67, 56, 202, 0.8)", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.05em", marginBottom: "6px" }}>
                              HC Sequence Logs
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span>Req Time:</span> <span>{formatDate(bet.hc.requestTime)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span>Settle Time:</span> <span>{formatDate(bet.hc.settleTime)}</span>
                            </div>
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", paddingTop: "8px", borderTop: "1px dashed #e0e7ff" }}>
                            <span style={{ color: "rgba(30, 27, 75, 0.6)", fontSize: "12px", fontWeight: "medium" }}>Payout :</span>
                            <strong style={{ color: "#16a34a", fontSize: "14px" }}>
                              {currencySymbol}{bet.hc.payout.toLocaleString()}
                            </strong>
                          </div>
                        </div>
                      </td>

                      {/* CARD 2: COMPLETE CASHOUT */}
                      <td valign="top" style={{ width: "50%", padding: "12px", border: "1px solid #fae8ff", borderRadius: "8px", backgroundColor: "rgba(250, 232, 255, 0.1)" }}>
                        <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse", borderBottom: "1px solid rgba(250, 232, 255, 0.5)", paddingBottom: "8px", marginBottom: "12px" }}>
                          <tbody>
                            <tr>
                              <td style={{ fontSize: "11px", fontWeight: "bold", color: "#6d28d9" }}>2. COMPLETE / FULL CASHOUT (CO)</td>
                              <td style={{ textAlign: "right", fontSize: "11px", color: "#6d28d9", fontWeight: "medium", backgroundColor: "#fae8ff", padding: "2px 8px", borderRadius: "4px" }}>{bet.co.typeName}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "#64748b" }}>Auto Cashout Enabled at</span> 
                            <span style={{ fontFamily: "monospace", fontWeight: "semibold", fontSize: "12px", color: bet.full_cashout_opted_enabled !== "-" ? "#7c3aed" : "#ef4444" }}>
                              {bet.full_cashout_opted_enabled}
                            </span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#64748b" }}>Requested Cashout Multiplier</span> 
                            <span style={{ fontFamily: "monospace", fontWeight: "medium" }}>{bet.co.target}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#64748b" }}>Executed Cashout Multiplier</span> 
                            <span style={{ fontFamily: "monospace", fontWeight: "medium" }}>{bet.co.multiplier}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#64748b" }}>BET Amount</span> 
                            <span style={{ fontWeight: "medium" }}>{currencySymbol}{bet.co.allocation.toLocaleString()}</span>
                          </div>

                          {/* CO SEQUENCE LOGS */}
                          <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(250, 232, 255, 0.4)", backgroundColor: "rgba(250, 232, 255, 0.4)", padding: "10px", borderRadius: "8px", fontFamily: "monospace", fontSize: "11px", color: "rgba(76, 29, 149, 0.7)" }}>
                            <div style={{ fontFamily: "sans-serif", fontWeight: "bold", color: "rgba(109, 40, 217, 0.8)", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.05em", marginBottom: "6px" }}>
                              CO Sequence Logs
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span>Req Time:</span> <span>{formatDate(bet.co.requestTime)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span>Settle Time:</span> <span>{formatDate(bet.co.settleTime)}</span>
                            </div>
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", paddingTop: "8px", borderTop: "1px dashed #fae8ff" }}>
                            <span style={{ color: "rgba(76, 29, 149, 0.6)", fontSize: "12px", fontWeight: "medium" }}>Payout :</span>
                            <strong style={{ color: "#16a34a", fontSize: "14px" }}>
                              {currencySymbol}{bet.co.payout.toLocaleString()}
                            </strong>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* TIMELINES, CONTEXTS, AND SYSTEM LOGS */}
                <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "separate", borderSpacing: "16px 0", marginBottom: "16px" }}>
                  <tbody>
                    <tr>
                      {/* Timeline Specifications */}
                      <td valign="top" style={{ width: "50%", padding: "16px", backgroundColor: "rgba(241, 245, 249, 0.2)", border: "1px solid rgba(226, 232, 240, 0.6)", borderRadius: "12px" }}>
                        <p style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", margin: "0 0 12px 0" }}>
                          Timeline Specifications
                        </p>
                        <table cellPadding="0" cellSpacing="0" style={{ width: "100%", fontSize: "12px", fontFamily: "monospace", borderCollapse: "separate", borderSpacing: "0 8px" }}>
                          <tbody>
                            <tr>
                              <td style={{ color: "#64748b" }}>Created Timestamp</td>
                              <td style={{ textAlign: "right", color: "#0f172a", backgroundColor: "rgba(255, 255, 255, 0.5)", padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(226, 232, 240, 0.4)" }}>
                                {formatDate(bet.meta.createdOn)}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ color: "#64748b" }}>Context Check (ck)</td>
                              <td style={{ textAlign: "right", color: "#0f172a", backgroundColor: "rgba(255, 255, 255, 0.5)", padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(226, 232, 240, 0.4)" }}>
                                {formatDate(bet.meta.ck)}
                              </td>
                            </tr>
                            {bet.meta.updatedOn && (
                              <tr>
                                <td style={{ color: "#64748b" }}>Updated Timestamp</td>
                                <td style={{ textAlign: "right", color: "#0f172a", backgroundColor: "rgba(255, 255, 255, 0.5)", padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(226, 232, 240, 0.4)" }}>
                                  {formatDate(bet.meta.updatedOn)}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </td>

                      {/* Technical Specifications */}
                      <td valign="top" style={{ width: "50%", padding: "16px", backgroundColor: "rgba(241, 245, 249, 0.2)", border: "1px solid rgba(226, 232, 240, 0.6)", borderRadius: "12px" }}>
                        <p style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", margin: "0 0 12px 0" }}>
                          Technical Specifications
                        </p>
                        <table cellPadding="0" cellSpacing="0" style={{ width: "100%", fontSize: "12px", fontFamily: "monospace", borderCollapse: "separate", borderSpacing: "0 8px", alignItems: "center" }}>
                          <tbody>
                            <tr>
                              <td style={{ color: "#64748b", padding: "4px 0" }}>Processed Value</td>
                              <td style={{ textAlign: "right", color: "#0f172a", backgroundColor: "rgba(255, 255, 255, 0.5)", padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(226, 232, 240, 0.4)" }}>
                                {bet.meta.processedCashout || "—"}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ color: "#64748b", padding: "4px 0" }}>Network Interrupted</td>
                              <td style={{ 
                                textAlign: "right", 
                                fontWeight: "semibold", 
                                padding: "4px 8px", 
                                borderRadius: "4px", 
                                border: bet.meta.isDisconnected ? "1px solid rgba(245, 158, 11, 0.2)" : "1px solid rgba(16, 185, 129, 0.2)",
                                backgroundColor: bet.meta.isDisconnected ?  "rgba(245, 158, 11, 0.1)" : "rgba(16, 185, 129, 0.1)",
                                color: bet.meta.isDisconnected ? "#d97706" : "#10b981",
                              }}>
                                {bet.meta.isDisconnected ? "YES" : "NO"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* TRACKING IDENTIFIER FOOTER */}
                <div style={{ backgroundColor: "rgba(241, 245, 249, 0.4)", padding: "8px", borderRadius: "8px", border: "1px solid rgba(226, 232, 240, 0.6)", display: "flex", flexDirection: "column", gap: "4px", fontFamily: "monospace", fontSize: "11px" }}>
                  <span style={{ color: "#64748b" }}>System Transaction Hash (Bet ID)</span>
                  <span style={{ color: "#0f172a", userSelect: "all", wordBreak: "break-all" }}>{bet.bet_id || "—"}</span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}