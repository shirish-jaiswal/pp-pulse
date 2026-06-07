'use client';

import React, { useEffect, useState, useRef } from 'react';

// --- Type Definitions ---
interface TableData {
  tableId?: string;
  totalSeatedPlayers?: number;
  tableKey?: string[];
  tableType?: 'BLACKJACK' | string;
  availableSeats?: number;
  [key: string]: any; 
}

interface TableState {
  id: string;
  lastUpdate: number;
}

declare global {
  interface Window {
    xlg?: {
      connect: (domain: string) => void;
      disconnect: () => void;
      available: (casinoId: string) => void;
      subscribe: (casinoId: string, tableKey: string, currency: string, delta: string | null) => void;
      onConnect?: () => void;
      onMessage?: (data: TableData) => void;
    };
    demo?: {
      updateElement: (data: TableData) => void;
    };
  }
}

export default function CasinoDashboard(): React.JSX.Element {
  const [totalPlayerCount, setTotalPlayerCount] = useState<number>(0);
  const [maxPlayersReached, setMaxPlayersReached] = useState<number>(0);
  const [tables, setTables] = useState<TableState[]>([]);

  // Refs prevent internal state array calculation re-trigger loops during heavy live stream bursts
  const tableIdKeyRef = useRef<string[]>([]);
  const tableIdValuesRef = useRef<number[]>([]);
  const maxPlayersRef = useRef<number>(0);

  const getParam = (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    const match = new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)').exec(window.location.search);
    return match ? decodeURIComponent(match[1]) : null;
  };

  const postTeamsMessage = async (totalPlayerCount: number, gameserver: string): Promise<void> => {
    const webhookUrl = "https://outlook.office.com/webhook/5ee7df37-9fe9-441d-af2e-195cd54af2c4@214f6519-cd19-4726-a221-b70378e889f6/IncomingWebhook/7586ab2ba47d4da6ac06c82abba09761/ba106151-ebc9-49a1-9b8a-b8a86e210642";
    const testString = `![TestImage](https://47a92947.ngrok.io/Content/Images/default.png) DGA Total seated players issue in: ${gameserver}`;
    const testString1 = "TotalSeated Players Alert";

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "@type": "MessageCard",
          "@context": "http://schema.org/extensions",
          "themeColor": "0076D7",
          "summary": testString1,
          "sections": [{
            "activityTitle": testString,
            "activitySubtitle": testString1,
            "activityImage": "https://teamsnodesample.azurewebsites.net/static/img/image5.png",
          }]
        })
      });
    } catch (error) {
      console.error("Teams monitoring failure within live context:", error);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let fallbackInterval: NodeJS.Timeout;

    const initializeAPI = (): boolean => {
      // Default live casino fallback initialization key strings
      const casinoId = getParam('casinoId') || 'il9srgw4dna23p47';
      const deltaMessages = getParam('delta');
      
      // Explicitly evaluates 'dga.pragmaticplaylive.net' domain context when embedded or mounted
      const domain = window.location.hostname; 

      const xlg = window.xlg;
      const demo = window.demo;

      if (!xlg) {
        return false; 
      }

      // Establish stream session
      xlg.connect(domain);

      xlg.onConnect = () => {
        xlg.available(casinoId);
      };

      xlg.onMessage = (data: TableData) => {
        if (!data) return;

        // Threshold logic alerts checking engine
        if (data.tableId) {
          if (data.tableId === "701" && data.totalSeatedPlayers !== undefined && data.totalSeatedPlayers < 30) {
            postTeamsMessage(data.totalSeatedPlayers, "GS1");
          }
          if (data.tableId === "201" && data.totalSeatedPlayers !== undefined && data.totalSeatedPlayers < 20) {
            postTeamsMessage(data.totalSeatedPlayers, "GS0");
          }
        }

        // Handle raw payload subscription mapping
        if (data.tableKey != null) {
          const newTables: TableState[] = [];
          data.tableKey.forEach((keyVal, index) => {
            xlg.subscribe(casinoId, keyVal, 'EUR', deltaMessages);
            newTables.push({ id: keyVal, lastUpdate: Date.now() });
            tableIdKeyRef.current[index] = keyVal;
            tableIdValuesRef.current[index] = 0;
          });
          setTables(newTables);
        } else if (data.tableId) {
          const index = tableIdKeyRef.current.indexOf(data.tableId);
          if (index !== -1) {
            if (data.tableType === "BLACKJACK") {
              tableIdValuesRef.current[index] = 7 - (data.availableSeats ?? 0);
            } else {
              tableIdValuesRef.current[index] = data?.totalSeatedPlayers ?? 0;
            }
          }

          if (demo && typeof demo.updateElement === 'function') {
            demo.updateElement(data);
          }

          setTables(prevTables => 
            prevTables.map(t => t.id === data.tableId ? { ...t, lastUpdate: Date.now() } : t)
          );
        }

        // Live metrics summation parsing
        const currentTotal = tableIdValuesRef.current.reduce((acc, val) => acc + (val || 0), 0);
        setTotalPlayerCount(currentTotal);

        if (maxPlayersRef.current < currentTotal) {
          maxPlayersRef.current = currentTotal;
          setMaxPlayersReached(currentTotal);
        }
      };

      return true;
    };

    const isInitialized = initializeAPI();

    if (!isInitialized) {
      fallbackInterval = setInterval(() => {
        if (window.xlg) {
          initializeAPI();
          clearInterval(fallbackInterval);
        }
      }, 100);
    }

    const staleInterval = setInterval(() => {
      setTables(prevTables => [...prevTables]);
    }, 5000);

    return () => {
      clearInterval(staleInterval);
      if (fallbackInterval) clearInterval(fallbackInterval);
      if (window.xlg && typeof window.xlg.disconnect === 'function') {
        window.xlg.disconnect();
      }
    };
  }, []);

  const handleDisconnect = (): void => {
    if (window.xlg) window.xlg.disconnect();
  };

  return (
    <div className="casino-container" style={{ padding: '20px', background: 'transparent' }}>
      <table id="tablesContainer" style={{ margin: "0 auto", width: '100%' }}>
        <tbody>
          <tr>
            <td colSpan={4}>
              <div className="logo"></div>
            </td>
          </tr>
          <tr>
            <td colSpan={4} style={{ color: 'red', fontSize: '20px' }} id="TotalPlayers">
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <span>TotalPlayers : {totalPlayerCount}</span>
                <span>MaxPlayers : {maxPlayersReached}</span>
              </div>
            </td>
          </tr>
          <tr style={{ display: "flex", flexWrap: 'wrap', justifyContent: 'center' }}>
            {tables.length === 0 ? (
              <>
                <td id="t701" className="table" style={{ padding: '15px' }}></td>
                <td id="t702" className="table" style={{ padding: '15px' }}></td>
                <td id="t801" className="table" style={{ padding: '15px' }}></td>
                <td id="t901" className="table" style={{ padding: '15px' }}></td>
              </>
            ) : (
              tables.map((table) => {
                const isStale = table.lastUpdate + 60 * 1000 < Date.now();
                return (
                  <td 
                    key={table.id} 
                    id={`t${table.id}`} 
                    className={`table ${isStale ? 'table_noupdate' : ''}`}
                    style={{ padding: '15px' }}
                  />
                );
              })
            )}
          </tr>
        </tbody>
      </table>
      <div style={{ textAlign: 'center', marginTop: '25px' }}>
        <input onClick={handleDisconnect} type="submit" value="Disconnect" style={{ cursor: 'pointer', padding: '5px 15px' }} />
      </div>
    </div>
  );
}