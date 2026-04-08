import type {
  SerializedRootNode,
  SerializedTextNode,
  SerializedElementNode,
  SerializedLexicalNode
} from 'lexical';

export interface SerializedFieldNode extends SerializedLexicalNode {
  type: 'field';
  keyName: string;
  display: string;
}

export type SerializedAppNode =
  | SerializedRootNode<any>
  | SerializedElementNode<any>
  | SerializedTextNode
  | SerializedFieldNode;

export interface SerializedEditorState {
  root: SerializedRootNode<SerializedAppNode>;
}

export function fillAndTransformData(
  node: any,
  data: Record<string, string>
): any {
  console.log("Filling node:", node);
  if (!node) return node;

  if (node.type === 'field') {
    const value = data[node.keyName];
    if (value !== undefined && value !== null) {
      return {
        type: 'text',
        version: 1,
        text: String(value),
        detail: 0,
        format: 0,
        mode: 'normal',
        style: '',
      };
    }
    return node;
  }

  if (node.type === 'text') {
    let updatedText = node.text;
    let hasChanged = false;

    Object.entries(data).forEach(([key, val]) => {
      const placeholderRegex = new RegExp(`{+${key}}+`, 'g');

      if (placeholderRegex.test(updatedText)) {
        updatedText = updatedText.replace(placeholderRegex, String(val));
        hasChanged = true;
      }
    });

    if (hasChanged) {
      return { ...node, text: updatedText };
    }
    return node;
  }

  if (node.children && Array.isArray(node.children)) {
    return {
      ...node,
      children: node.children.map((child: any) =>
        fillAndTransformData(child, data)
      ),
    };
  }

  return node;
}