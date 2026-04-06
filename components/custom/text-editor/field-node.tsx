"use client";

import {
  DecoratorNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
  $applyNodeReplacement,
} from "lexical";
import * as React from "react";
import { FieldComponent } from "@/components/custom/text-editor/field-component";

export type SerializedFieldNode = Spread<
  { keyName: string; display: string },
  SerializedLexicalNode
>;

export class FieldNode extends DecoratorNode<React.ReactNode> {
  __keyName: string;
  __display: string;

  static getType(): string { return "field"; }

  static clone(node: FieldNode): FieldNode {
    return new FieldNode(node.__keyName, node.__display, node.__key);
  }

  constructor(keyName: string, display: string, key?: NodeKey) {
    super(key);
    this.__keyName = keyName;
    this.__display = display;
  }

  isInline(): boolean { return true; }

  static importJSON(serializedNode: SerializedFieldNode): FieldNode {
    return $createFieldNode(serializedNode.keyName, serializedNode.display);
  }

  exportJSON(): SerializedFieldNode {
    return {
      ...super.exportJSON(),
      keyName: this.__keyName,
      display: this.__display,
      type: "field",
      version: 1,
    };
  }

  createDOM(): HTMLElement {
    const span = document.createElement("span");
    span.style.display = "inline-block";
    return span;
  }

  updateDOM(): false { return false; }

  decorate(): React.ReactNode {
    return (
      <FieldComponent 
        keyName={this.__keyName} 
        display={this.__display} 
        nodeKey={this.getKey()} 
      />
    );
  }
}

export function $createFieldNode(keyName: string, display: string): FieldNode {
  return $applyNodeReplacement(new FieldNode(keyName, display));
}