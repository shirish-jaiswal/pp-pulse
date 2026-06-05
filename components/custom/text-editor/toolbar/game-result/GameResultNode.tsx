"use client";

import React from "react";
import ReactDOMServer from "react-dom/server";
import { 
  DecoratorNode, 
  NodeKey, 
  SerializedLexicalNode, 
  Spread, 
  LexicalEditor, 
  DOMExportOutput,
  EditorConfig
} from "lexical";
import { UniversalGameConfig, MultiGameResultConfig } from "./types";
import { getGameRenderer } from "./registry";

export type SerializedGameResultNode = Spread<
  { configJson: string },
  SerializedLexicalNode
>;

export class GameResultNode extends DecoratorNode<React.JSX.Element> {
  __configJson: string;

  static getType(): string { return "game-result-block-router"; }
  static clone(node: GameResultNode): GameResultNode { return new GameResultNode(node.__configJson, node.__key); }

  constructor(configJson: string, key?: NodeKey) {
    super(key);
    this.__configJson = configJson;
  }

  static importJSON(serializedNode: SerializedGameResultNode): GameResultNode {
    return $createGameResultNode(serializedNode.configJson);
  }

  exportJSON(): SerializedGameResultNode {
    return {
      type: "game-result-block-router",
      version: 1,
      configJson: this.__configJson,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement("div");
    div.className = "game-result-router-node-wrapper my-4 block clear-both select-none";
    return div;
  }

  updateDOM(): false { return false; }

  private parseConfig(): UniversalGameConfig | MultiGameResultConfig | null {
    try {
      if (!this.__configJson) return null;
      
      // Explicitly check if it's already an object representation to prevent triple-parsing edge cases
      if (typeof this.__configJson === "object") {
        return this.__configJson;
      }
      
      return JSON.parse(this.__configJson);
    } catch (e) {
      console.error("❌ [GameResultNode] Malformed mixed-game JSON parsing error:", e, "Raw data stream:", this.__configJson);
      return null;
    }
  }

  private renderRounds(parsedConfig: UniversalGameConfig | MultiGameResultConfig): React.JSX.Element {
    if (!parsedConfig) {
      return <div className="text-xs text-red-500 font-mono">Empty rendering dataset metadata provided.</div>;
    }

    // 1. Handle Multi-Round Configurations
    if ("rounds" in parsedConfig && Array.isArray(parsedConfig.rounds)) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }} className="multi-round-stack">
          {parsedConfig.rounds.map((roundData, rIdx) => {
            const TargetRenderer = getGameRenderer(roundData.gameType);
            
            return (
              <div 
                key={rIdx} 
                className="round-item-wrapper" 
                style={{ 
                  borderBottom: rIdx < parsedConfig.rounds.length - 1 ? "2px dashed #cbd5e1" : "none", 
                  paddingBottom: rIdx < parsedConfig.rounds.length - 1 ? "20px" : "0px" 
                }}
              >
                <TargetRenderer config={roundData} />
              </div>
            );
          })}
        </div>
      );
    }

    // 2. Fallback to single round rendering loop structures
    if (parsedConfig.gameType) {
      const SingleRenderer = getGameRenderer(parsedConfig.gameType);
      return <SingleRenderer config={parsedConfig} />;
    }

    return <div className="text-xs text-amber-500 font-mono">Unrecognized dynamic configuration shape structure payload.</div>;
  }

  override exportDOM(editor: LexicalEditor): DOMExportOutput {
    const parsedConfig = this.parseConfig();
    const container = document.createElement("div");
    container.setAttribute("data-game-block", "true"); 
    container.style.margin = "16px 0";
    container.style.fontFamily = "Arial, sans-serif";

    if (parsedConfig) {
      try {
        container.innerHTML = ReactDOMServer.renderToStaticMarkup(this.renderRounds(parsedConfig));
      } catch (err) {
        console.error("❌ [GameResultNode] Static SSR generation compilation crash:", err);
        container.innerText = "[Crash compilation execution context trace]";
      }
    } else {
      container.innerText = "[Empty/Invalid Game Result Block]";
    }

    return { element: container };
  }

  decorate(editor: LexicalEditor, config: EditorConfig): React.JSX.Element {
    const parsedConfig = this.parseConfig();

    return (
      <div 
        key={this.__key} 
        contentEditable={false}
        className="border border-slate-200 rounded-xl p-4 bg-white block pointer-events-auto shadow-sm select-text text-slate-900"
      >
        {parsedConfig ? (
          this.renderRounds(parsedConfig)
        ) : (
          <div className="text-xs text-red-500 font-mono p-2 bg-red-50 rounded border border-red-200">
            Error reading platform block configuration parameters. Check inspector terminal console logs.
          </div>
        )}
      </div>
    );
  }
}

export function $createGameResultNode(configJson: string): GameResultNode { return new GameResultNode(configJson); }
export function $isGameResultNode(node: unknown): node is GameResultNode { return node instanceof GameResultNode; }