"use client";

export interface HighFlyerResultConfig {
  gameType: string;
  header?: {
    roundId: string;
    playerId: string;
    gameId: string;
    gameCrashedAt: string;
  };
  sections: Array<{
    title: string;
    subtitle: string;
    wager: number;
    payout: number;
    status: {
      label: string;
      variant: "success" | "danger" | "warning" | "default";
    };
    metrics: Array<{ label: string; value: string }>;
  }>;
}

export function HighflyerResultRenderer({ config }: { config: HighFlyerResultConfig }) {
  const { header, sections, gameType } = config;

  return (
    <table
      data-game-block="true"
      cellPadding="0"
      cellSpacing="0"
      style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px", fontFamily: "Arial, sans-serif", fontSize: "13px" }}
    >
      <tbody data-game-block="true">
        {/* 1. Header Metadata Summary Row */}
        {header && (
          <tr data-game-block="true">
            <td
              data-game-block="true"
              style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontFamily: "monospace", fontSize: "11px", backgroundColor: "#ffffff" }}
            >
              <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: 0, border: "none" }}>
                      <span style={{ marginRight: "16px" }}><strong>ROUND:</strong> {header.roundId}</span>
                      <span style={{ marginRight: "16px" }}><strong>PLAYER ID:</strong> {header.playerId}</span>
                      <span style={{ marginRight: "16px" }}><strong>GAME:</strong> {header.gameId}</span>
                    </td>
                    <td style={{ padding: 0, border: "none", textAlign: "right", color: "#dc2626", fontWeight: "bold" }}>
                      CRASHED AT: {header.gameCrashedAt}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        )}

        {/* 2. Map Multi-Betspot Sub-column Content Cards */}
        <tr data-game-block="true">
          <td data-game-block="true" style={{ padding: 0, border: "none" }}>
            <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "separate", borderSpacing: "8px 0" }}>
              <tbody>
                <tr>
                  {sections?.map((section, idx) => {
                    const isBusted = section.status.variant === "danger";
                    const statusBg = isBusted ? "#fee2e2" : "#dcfce7";
                    const statusColor = isBusted ? "#991b1b" : "#14532d";
                    const themeBorderColor = gameType === "highflyer" ? "#4f46e5" : gameType === "spaceman" ? "#a855f7" : "#0284c7";

                    // SAFE TYPE CONVERSIONS: Prevents runtime crashes on string/undefined data properties
                    const safeWager = Number(section.wager || 0).toLocaleString("en-US");
                    const safePayout = Number(section.payout || 0).toLocaleString("en-US");

                    return (
                      <td
                        key={idx}
                        valign="top"
                        style={{ 
                          width: sections.length > 1 ? "50%" : "100%", 
                          padding: "12px", 
                          border: "1px solid #cbd5e1", 
                          borderTop: `4px solid ${themeBorderColor}`, 
                          borderRadius: "8px", 
                          backgroundColor: "#f8fafc" 
                        }}
                      >
                        {/* Title Action Bar Component Block */}
                        <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                          <tbody>
                            <tr>
                              <td style={{ padding: 0, border: "none" }}>
                                <div style={{ fontSize: "12px", fontWeight: "bold", color: "#1e293b" }}>{section.title}</div>
                                <div style={{ fontSize: "10px", color: "#94a3b8", fontFamily: "monospace" }}>{section.subtitle}</div>
                              </td>
                              <td style={{ padding: 0, border: "none", textAlign: "right" }}>
                                <span style={{ fontSize: "10px", fontWeight: "bold", padding: "2px 6px", borderRadius: "4px", backgroundColor: statusBg, color: statusColor, fontFamily: "monospace" }}>
                                  {section.status.label}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Financial Ledger Section */}
                        <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "separate", borderSpacing: "4px 0", marginBottom: "10px" }}>
                          <tbody>
                            <tr>
                              <td style={{ padding: "6px 8px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px", width: "50%" }}>
                                <div style={{ fontSize: "10px", color: "#64748b" }}>Wager Allocated</div>
                                <div style={{ fontSize: "12px", fontWeight: "bold", fontFamily: "monospace", marginTop: "2px" }}>
                                  IDR {safeWager}
                                </div>
                              </td>
                              <td style={{ padding: "6px 8px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px", width: "50%" }}>
                                <div style={{ fontSize: "10px", color: "#64748b" }}>Net Return</div>
                                <div style={{ fontSize: "12px", fontWeight: "bold", fontFamily: "monospace", marginTop: "2px", color: Number(section.payout || 0) > 0 ? "#16a34a" : "#64748b" }}>
                                  IDR {safePayout}
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Internal Telemetry Metrics Matrix */}
                        <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
                          <tbody>
                            {section.metrics.map((metric, mIdx) => (
                              <tr key={mIdx}>
                                <td style={{ padding: "4px 0", borderBottom: "1px solid #f1f5f9", fontSize: "11px", color: "#64748b" }}>{metric.label}</td>
                                <td style={{ padding: "4px 0", borderBottom: "1px solid #f1f5f9", fontSize: "11px", fontWeight: "bold", fontFamily: "monospace", textAlign: "right", color: "#334155" }}>
                                  {metric.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}