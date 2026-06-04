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
      if (this.__configJson) {
        return typeof this.__configJson === "string" ? JSON.parse(this.__configJson) : this.__configJson;
      }
    } catch (e) {
      console.error("Malformed mixed-game block payload stream:", e);
    }
    return null;
  }

  private renderRounds(parsedConfig: UniversalGameConfig | MultiGameResultConfig): React.JSX.Element {
    // 1. Handle Multi-Round Configurations (Can contain mixed games)
    if ("rounds" in parsedConfig && Array.isArray(parsedConfig.rounds)) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }} className="multi-round-stack">
          {parsedConfig.rounds.map((roundData, rIdx) => {
            // Dynamically resolve renderer based on EACH round's specific game type
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

    // 2. Fallback to single round rendering if structure isn't an array wrapper
    const SingleRenderer = getGameRenderer(parsedConfig.gameType);
    return <SingleRenderer config={parsedConfig} />;
  }

  override exportDOM(editor: LexicalEditor): DOMExportOutput {
    const parsedConfig = this.parseConfig();
    const container = document.createElement("div");
    container.setAttribute("data-game-block", "true"); 
    container.style.margin = "16px 0";
    container.style.fontFamily = "Arial, sans-serif";

    if (parsedConfig) {
      container.innerHTML = ReactDOMServer.renderToStaticMarkup(this.renderRounds(parsedConfig));
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
          <div className="text-xs text-red-500 font-mono">Error reading platform block configuration parameters.</div>
        )}
      </div>
    );
  }
}

export function $createGameResultNode(configJson: string): GameResultNode { return new GameResultNode(configJson); }
export function $isGameResultNode(node: unknown): node is GameResultNode { return node instanceof GameResultNode; }