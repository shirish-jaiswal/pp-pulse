"use client";

export interface HighFlyerResultConfig {
  gameType: string;
  header?: {
    roundId: string;
    playerId: string;
    gameId: string;
    gameCrashedAt: string;
    totalBet?: number;   // Config properties aligned with updated transformer values
    totalPayout?: number; 
    currency?: string;
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
  const currencyCode = header?.currency || "IDR";

  return (
    <div style={{ width: "100%", fontFamily: "Arial, sans-serif", fontSize: "13px" }}>
      <table
        data-game-block="true"
        cellPadding="0"
        cellSpacing="0"
        style={{ width: "100%", borderCollapse: "separate", border: "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden", backgroundColor: "#ffffff" }}
      >
        <tbody data-game-block="true">
          
          {/* 1. Header Metadata Summary Row */}
          {header && (
            <tr data-game-block="true">
              <td
                data-game-block="true"
                style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}
              >
                <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: 0, border: "none" }}>
                        <div style={{ marginBottom: "8px" }}>
                          <span style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", backgroundColor: "#e2e8f0", color: "#64748b", fontFamily: "monospace" }}>
                            {sections.length} ACTIVE {sections.length === 1 ? "BET POSITION" : "BET POSITIONS"}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                          <span style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontFamily: "monospace", backgroundColor: "#e2e8f0", color: "#0f172a" }}>
                            User ID: {header.playerId}
                          </span>
                          <span style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontFamily: "monospace", backgroundColor: "#e2e8f0", color: "#64748b" }}>
                            Game ID: {header.gameId}
                          </span>
                          <span style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontFamily: "monospace", backgroundColor: "#e2e8f0", color: "#64748b" }}>
                            Round ID: {header.roundId}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: 0, border: "none", textAlign: "right", verticalAlign: "top" }}>
                        <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Game Crashed</p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "18px", fontWeight: "bold", fontFamily: "monospace", color: "#dc2626" }}>
                          {header.gameCrashedAt}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          )}

          {/* 2. Workspace Body & Summary Aggregates */}
          <tr data-game-block="true">
            <td style={{ padding: "20px" }}>
              
              {/* Total Summary Metrics Block */}
              {header && (
                <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "separate", borderSpacing: "16px 0", marginBottom: "20px", marginLeft: "-16px", marginRight: "-16px" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "50%", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "rgba(241, 245, 249, 0.4)" }}>
                        <p style={{ margin: 0, fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>Total Bet</p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "20px", fontWeight: "bold", fontFamily: "monospace", color: "#0f172a" }}>
                          {currencyCode} {Number(header.totalBet || 0).toLocaleString("en-US")}
                        </p>
                      </td>
                      <td style={{ 
                        width: "50%", 
                        padding: "16px", 
                        borderRadius: "12px", 
                        border: Number(header.totalPayout || 0) > 0 ? "1px solid #dcfce7" : "1px solid #e2e8f0", 
                        backgroundColor: Number(header.totalPayout || 0) > 0 ? "rgba(220, 252, 231, 0.2)" : "rgba(241, 245, 249, 0.4)" 
                      }}>
                        <p style={{ margin: 0, fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>Total Win</p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "20px", fontWeight: "bold", fontFamily: "monospace", color: Number(header.totalPayout || 0) > 0 ? "#16a34a" : "#0f172a" }}>
                          {currencyCode} {Number(header.totalPayout || 0).toLocaleString("en-US")}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {/* Parallel Betspot Multi-Columns */}
              <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "separate", borderSpacing: "16px 0" }}>
                <tbody>
                  <tr>
                    {sections?.map((section, idx) => {
                      const isBusted = section.status.variant === "danger";
                      const statusBg = isBusted ? "#fee2e2" : "#dcfce7";
                      const statusColor = isBusted ? "#991b1b" : "#14532d";
                      const themeColor = gameType === "highflyer" ? "#4f46e5" : gameType === "spaceman" ? "#a855f7" : "#0284c7";

                      return (
                        <td
                          key={idx}
                          valign="top"
                          style={{
                            width: sections.length > 1 ? "50%" : "100%",
                            padding: "16px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            backgroundColor: "rgba(241, 245, 249, 0.2)"
                          }}
                        >
                          {/* Spot Header Indicator */}
                          <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
                            <tbody>
                              <tr>
                                <td style={{ padding: "0 0 8px 0", border: "none" }}>
                                  <h3 style={{ margin: 0, fontSize: "12px", fontWeight: "bold", color: themeColor, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "monospace" }}>
                                    {section.title.replace("BET SPOT ", "")}
                                  </h3>
                                </td>
                                <td style={{ padding: "0 0 8px 0", border: "none", textAlign: "right" }}>
                                  <span style={{ fontSize: "12px", fontWeight: "medium", padding: "2px 8px", borderRadius: "4px", backgroundColor: statusBg, color: statusColor }}>
                                    {section.status.label}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          {/* Subrow Financial KPIs */}
                          <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "separate", borderSpacing: "12px 0", marginBottom: "16px" }}>
                            <tbody>
                              <tr>
                                <td style={{ padding: "12px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", width: "50%" }}>
                                  <div style={{ fontSize: "12px", color: "#64748b" }}>Bet Amount</div>
                                  <div style={{ fontSize: "16px", fontWeight: "semibold", marginTop: "4px", color: "#0f172a" }}>
                                    {currencyCode} {Number(section.wager || 0).toLocaleString("en-US")}
                                  </div>
                                </td>
                                <td style={{ padding: "12px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", width: "50%" }}>
                                  <div style={{ fontSize: "12px", color: "#64748b" }}>Payout Received</div>
                                  <div style={{ fontSize: "16px", fontWeight: "semibold", marginTop: "4px", color: Number(section.payout || 0) > 0 ? "#16a34a" : "#64748b" }}>
                                    {currencyCode} {Number(section.payout || 0).toLocaleString("en-US")}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          {/* Settlement Configuration Card Container */}
                          <div style={{ border: "1px solid #e0e7ff", backgroundColor: "rgba(238, 242, 255, 0.4)", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
                            <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
                              <tbody>
                                {section.metrics.map((metric, mIdx) => (
                                  <tr key={mIdx}>
                                    <td style={{ padding: "6px 0", borderBottom: mIdx === section.metrics.length - 1 ? "none" : "1px solid rgba(226, 232, 240, 0.6)", fontSize: "13px", color: "#64748b" }}>
                                      {metric.label}
                                    </td>
                                    <td style={{ padding: "6px 0", borderBottom: mIdx === section.metrics.length - 1 ? "none" : "1px solid rgba(226, 232, 240, 0.6)", fontSize: "13px", fontWeight: "medium", fontFamily: "monospace", textAlign: "right", color: metric.label.includes("Mult") ? themeColor : "#334155" }}>
                                      {metric.value}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Hash Identifier Footer Card */}
                          <div style={{ backgroundColor: "rgba(241, 245, 249, 0.4)", padding: "8px", borderRadius: "8px", border: "1px solid rgba(226, 232, 240, 0.6)", fontSize: "11px", fontFamily: "monospace" }}>
                            <span style={{ display: "block", color: "#64748b", marginBottom: "2px" }}>Bet ID</span>
                            <span style={{ color: "#0f172a", wordBreak: "break-all" }}>{section.subtitle.replace("Bet ID: ", "")}</span>
                          </div>

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
    </div>
  );
}