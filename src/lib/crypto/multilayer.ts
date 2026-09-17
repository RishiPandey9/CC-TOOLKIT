import { caesarEncrypt, caesarDecrypt } from './caesar';
import { monoEncrypt, monoDecrypt } from './monoalphabetic';
import { playfairEncrypt, playfairDecrypt } from './playfair';
import { vigenereEncrypt, vigenereDecrypt } from './vigenere';
import { railfenceEncrypt, railfenceDecrypt } from './railfence';
import { rowEncrypt, rowDecrypt } from './rowcolumn';
import { affineEncrypt, affineDecrypt } from './affine';
import { rot13, atbash } from './atbash';

export type SupportedAlgorithm =
  | 'caesar'
  | 'mono'
  | 'playfair'
  | 'vigenere'
  | 'railfence'
  | 'rowcolumn'
  | 'affine'
  | 'rot13'
  | 'atbash';

export interface CipherLayer {
  id: string;
  algorithm: SupportedAlgorithm;
  key: string;
  extraKey?: string; // e.g. for Affine (a, b)
}

export interface LayerExecutionLog {
  layerIndex: number;
  layerId: string;
  algorithm: SupportedAlgorithm;
  key: string;
  inputText: string;
  outputText: string;
  durationMs: number;
}

export interface MultiLayerPipelineResult {
  finalText: string;
  mode: 'encrypt' | 'decrypt';
  logs: LayerExecutionLog[];
}

/**
 * Execute a pipeline of multiple cipher layers in sequence
 */
export function executeMultiLayerPipeline(
  inputText: string,
  layers: CipherLayer[],
  mode: 'encrypt' | 'decrypt'
): MultiLayerPipelineResult {
  if (!inputText || !layers || layers.length === 0) {
    return { finalText: inputText, mode, logs: [] };
  }

  // If decrypting, reverse layer order to undo transformations
  const activeLayers = mode === 'encrypt' ? [...layers] : [...layers].reverse();
  const logs: LayerExecutionLog[] = [];
  let currentText = inputText;

  for (let idx = 0; idx < activeLayers.length; idx++) {
    const layer = activeLayers[idx];
    const startTime = performance.now();
    let stepOutput = currentText;

    try {
      switch (layer.algorithm) {
        case 'caesar': {
          const shift = parseInt(layer.key, 10) || 3;
          stepOutput = mode === 'encrypt'
            ? caesarEncrypt(currentText, shift).text
            : caesarDecrypt(currentText, shift).text;
          break;
        }
        case 'mono': {
          stepOutput = mode === 'encrypt'
            ? monoEncrypt(currentText, layer.key).text
            : monoDecrypt(currentText, layer.key).text;
          break;
        }
        case 'playfair': {
          stepOutput = mode === 'encrypt'
            ? playfairEncrypt(currentText, layer.key).text
            : playfairDecrypt(currentText, layer.key).text;
          break;
        }
        case 'vigenere': {
          stepOutput = mode === 'encrypt'
            ? vigenereEncrypt(currentText, layer.key).text
            : vigenereDecrypt(currentText, layer.key).text;
          break;
        }
        case 'railfence': {
          const rails = parseInt(layer.key, 10) || 3;
          stepOutput = mode === 'encrypt'
            ? railfenceEncrypt(currentText, rails).text
            : railfenceDecrypt(currentText, rails).text;
          break;
        }
        case 'rowcolumn': {
          stepOutput = mode === 'encrypt'
            ? rowEncrypt(currentText, layer.key).text
            : rowDecrypt(currentText, layer.key).text;
          break;
        }
        case 'affine': {
          const a = parseInt(layer.key, 10) || 5;
          const b = parseInt(layer.extraKey || '8', 10) || 8;
          stepOutput = mode === 'encrypt'
            ? affineEncrypt(currentText, a, b).text
            : affineDecrypt(currentText, a, b).text;
          break;
        }
        case 'rot13': {
          stepOutput = rot13(currentText);
          break;
        }
        case 'atbash': {
          stepOutput = atbash(currentText);
          break;
        }
        default:
          throw new Error(`Unsupported algorithm: ${layer.algorithm}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Layer ${idx + 1} (${layer.algorithm}) failed: ${msg}`);
    }

    const durationMs = Math.round((performance.now() - startTime) * 100) / 100;

    logs.push({
      layerIndex: idx + 1,
      layerId: layer.id,
      algorithm: layer.algorithm,
      key: layer.key + (layer.extraKey ? `, ${layer.extraKey}` : ''),
      inputText: currentText,
      outputText: stepOutput,
      durationMs
    });

    currentText = stepOutput;
  }

  return {
    finalText: currentText,
    mode,
    logs
  };
}
