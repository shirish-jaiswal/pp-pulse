"use client";

import {
  DecoratorNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
  DOMConversionMap,
  DOMConversionOutput,
  $applyNodeReplacement,
} from "lexical";
import * as React from "react";
import { ImageComponent } from "./image-component";

export type SerializedImageNode = Spread<
  { src: string; altText: string },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<React.ReactNode> {
  __src: string;
  __altText: string;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__key);
  }

  constructor(src: string, altText: string, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__altText = altText;
  }

  isInline(): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: convertImageElement,
        priority: 1,
      }),
    };
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    div.style.display = "block";
    return div;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): React.ReactNode {
    return <ImageComponent src={this.__src} alt={this.__altText} nodeKey={this.getKey()} />;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return $createImageNode({
      src: serializedNode.src,
      altText: serializedNode.altText,
    });
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      src: this.__src,
      altText: this.__altText,
      type: "image",
      version: 1,
    };
  }
}

function convertImageElement(domNode: Node): DOMConversionOutput | null {
  if (domNode instanceof HTMLImageElement) {
    return {
      node: $createImageNode({
        src: domNode.src,
        altText: domNode.alt || "",
      }),
    };
  }
  return null;
}

export function $createImageNode({
  src,
  altText,
}: {
  src: string;
  altText: string;
}): ImageNode {
  return $applyNodeReplacement(new ImageNode(src, altText));
}