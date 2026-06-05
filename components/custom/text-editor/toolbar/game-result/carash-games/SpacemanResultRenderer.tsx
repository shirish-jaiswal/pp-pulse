"use client";

import React from "react";

export function SpacemanResultRenderer({ config }: { config: any }) {
  const { header, sections } = config;

  return (
    <table
      data-game-block="true"
      cellPadding="0"
      cellSpacing="0"
      style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px", fontFamily: "Arial, sans-serif", fontSize: "13px" }}
    >
      <tbody data-game-block="true">
        {/* 1. Header Global Round Block Context */}
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

        {/* 2. Map Consolidated Operational Sections */}
        {sections?.map((bet: any, idx: number) => {
          let statusBg = "#fee2e2"; 
          let statusColor = "#991b1b";
          if (bet.statusVariant === "success") { statusBg = "#dcfce7"; statusColor = "#14532d"; }
          else if (bet.statusVariant === "warning") { statusBg = "#fef3c7"; statusColor = "#92400e"; }

          return (
            <tr key={idx} data-game-block="true">
              <td
                data-game-block="true"
                style={{ padding: "16px", border: "1px solid #cbd5e1", borderLeft: "4px solid #a855f7", borderRadius: "8px", backgroundColor: "#f8fafc" }}
              >
                {/* Section Title Container Header */}
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

                {/* Primary Financial Layout Metrics Context Grid */}
                <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "separate", borderSpacing: "6px 0", marginBottom: "16px" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "33.33%", padding: "8px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
                        <div style={{ fontSize: "10px", color: "#64748b" }}>Initial Bet Wager</div>
                        <strong style={{ fontSize: "12px", display: "block", marginTop: "2px" }}>IDR {bet.wageredAmount.toLocaleString()}</strong>
                      </td>
                      <td style={{ width: "33.33%", padding: "8px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
                        <div style={{ fontSize: "10px", color: "#64748b" }}>Total Combined Return</div>
                        <strong style={{ fontSize: "12px", display: "block", marginTop: "2px", color: bet.totalPayout > 0 ? "#16a34a" : "#64748b" }}>IDR {bet.totalPayout.toLocaleString()}</strong>
                      </td>
                      <td style={{ width: "33.33%", padding: "8px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
                        <div style={{ fontSize: "10px", color: "#64748b" }}>Execution Scheme</div>
                        <strong style={{ fontSize: "11px", display: "block", marginTop: "2px", color: "#6d28d9" }}>{bet.cashOutTypeDisplay}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Side-by-Side Split View Table Breakdown Matrix */}
                <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "separate", borderSpacing: "8px 0", marginBottom: "16px" }}>
                  <tbody>
                    <tr>
                      {/* SUB-SECTION CARD 1: HALF CASHOUT */}
                      <td valign="top" style={{ width: "50%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "#ffffff" }}>
                        <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse", borderBottom: "1px solid #f1f5f9", paddingBottom: "4px", marginBottom: "8px" }}>
                          <tbody>
                            <tr>
                              <td style={{ fontSize: "11px", fontWeight: "bold", color: "#4338ca" }}>1. HALF CASHOUT (HC)</td>
                              <td style={{ textAlign: "right", fontSize: "10px", color: "#4338ca", fontWeight: "bold" }}>{bet.hc.typeName}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "11px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748b" }}>Auto Target Mult:</span> <span style={{ fontFamily: "monospace" }}>{bet.hc.target}</span></div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748b" }}>Wager Allocation:</span> <span>IDR {bet.hc.allocation.toLocaleString()}</span></div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748b" }}>Executed Mult:</span> <span style={{ fontFamily: "monospace", fontWeight: "bold", color: bet.hc.isBusted ? "#ef4444" : "#4338ca" }}>{bet.hc.multiplier}</span></div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", paddingTop: "4px", borderTop: "1px dashed #f1f5f9" }}>
                            <span>Requested Value:</span> <span style={{ fontFamily: "monospace" }}>{bet.hc.requested}</span>
                          </div>
                          <div style={{ fontSize: "10px", color: "#94a3b8", fontFamily: "monospace", marginTop: "4px" }}>
                            <div>Req Time: {bet.hc.requestTime}</div>
                            <div>Settle Time: {bet.hc.settleTime}</div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", paddingTop: "6px", borderTop: "1px dashed #cbd5e1" }}>
                            <strong style={{ color: "#1e293b" }}>HC Split Return:</strong>
                            <strong style={{ color: bet.hc.payout > 0 ? "#16a34a" : "#1e293b" }}>IDR {bet.hc.payout.toLocaleString()}</strong>
                          </div>
                        </div>
                      </td>

                      {/* SUB-SECTION CARD 2: COMPLETE CASHOUT */}
                      <td valign="top" style={{ width: "50%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "#ffffff" }}>
                        <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse", borderBottom: "1px solid #f1f5f9", paddingBottom: "4px", marginBottom: "8px" }}>
                          <tbody>
                            <tr>
                              <td style={{ fontSize: "11px", fontWeight: "bold", color: "#6d28d9" }}>2. COMPLETE CASHOUT (CO)</td>
                              <td style={{ textAlign: "right", fontSize: "10px", color: "#6d28d9", fontWeight: "bold" }}>{bet.co.typeName}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "11px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748b" }}>Auto Target Mult:</span> <span style={{ fontFamily: "monospace" }}>{bet.co.target}</span></div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748b" }}>Wager Allocation:</span> <span>IDR {bet.co.allocation.toLocaleString()}</span></div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748b" }}>Executed Mult:</span> <span style={{ fontFamily: "monospace", fontWeight: "bold", color: bet.co.isBusted ? "#ef4444" : "#6d28d9" }}>{bet.co.multiplier}</span></div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", paddingTop: "4px", borderTop: "1px dashed #f1f5f9" }}>
                            <span>Requested Value:</span> <span style={{ fontFamily: "monospace" }}>{bet.co.requested}</span>
                          </div>
                          <div style={{ fontSize: "10px", color: "#94a3b8", fontFamily: "monospace", marginTop: "4px" }}>
                            <div>Req Time: {bet.co.requestTime}</div>
                            <div>Settle Time: {bet.co.settleTime}</div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", paddingTop: "6px", borderTop: "1px dashed #cbd5e1" }}>
                            <strong style={{ color: "#1e293b" }}>CO Split Return:</strong>
                            <strong style={{ color: bet.co.payout > 0 ? "#16a34a" : "#1e293b" }}>IDR {bet.co.payout.toLocaleString()}</strong>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Diagnostics System Metrics Timelines Footer Section */}
                <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", color: "#64748b", fontFamily: "monospace" }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: "3px 0", borderBottom: "1px solid #f1f5f9" }}>Created Timestamp:</td>
                      <td style={{ padding: "3px 0", borderBottom: "1px solid #f1f5f9", textAlign: "right", color: "#334155" }}>{bet.meta.createdOn}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "3px 0", borderBottom: "1px solid #f1f5f9" }}>Context Check (ck):</td>
                      <td style={{ padding: "3px 0", borderBottom: "1px solid #f1f5f9", textAlign: "right", color: "#334155" }}>{bet.meta.ck}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "3px 0", borderBottom: "1px solid #f1f5f9" }}>Updated Timestamp:</td>
                      <td style={{ padding: "3px 0", borderBottom: "1px solid #f1f5f9", textAlign: "right", color: "#334155" }}>{bet.meta.updatedOn}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "3px 0", borderBottom: "1px solid #f1f5f9" }}>Processed Value:</td>
                      <td style={{ padding: "3px 0", borderBottom: "1px solid #f1f5f9", textAlign: "right", color: "#334155" }}>{bet.meta.processedCashout}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "3px 0" }}>Network Interrupted:</td>
                      <td style={{ padding: "3px 0", textAlign: "right", fontWeight: "bold", color: bet.meta.isDisconnected === "Yes" ? "#d97706" : "#16a34a" }}>{bet.meta.isDisconnected}</td>
                    </tr>
                    <tr>
                      <td colSpan={2} style={{ padding: "8px 0 0 0", fontSize: "10px", color: "#94a3b8", borderTop: "1px solid #e2e8f0", wordBreak: "break-all" }}>
                        <strong>SYSTEM TRANSACTION HASH (BET ID):</strong> {bet.bet_id}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}