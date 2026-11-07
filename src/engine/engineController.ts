import { EngineEvaluation, LevelConfig } from '../types/chess';

export type BestMoveCallback = (bestMove: string, ponder?: string) => void;
export type EvalCallback = (evaluation: EngineEvaluation) => void;

export class EngineController {
  private worker: Worker | null = null;
  private isReady: boolean = false;
  private isThinking: boolean = false;
  private currentLevel: LevelConfig | null = null;
  private onBestMove: BestMoveCallback | null = null;
  private onEval: EvalCallback | null = null;

  // Stored multi-PV lines during current search
  private pvMoves: Map<number, { move: string; scoreCp: number | null; scoreMate: number | null }> = new Map();
  private latestEvaluation: EngineEvaluation = {
    depth: 0,
    scoreCp: 0,
    scoreMate: null,
    isThinking: false,
  };

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    try {
      // Stockfish JS/WASM worker from public/stockfish/stockfish.js
      this.worker = new Worker('/stockfish/stockfish.js');
      this.worker.onmessage = this.handleWorkerMessage.bind(this);
      this.worker.onerror = (err) => {
        console.error('Stockfish Worker Error:', err);
      };

      this.sendCommand('uci');
      this.sendCommand('isready');
    } catch (err) {
      console.error('Failed to create Stockfish worker:', err);
    }
  }

  private sendCommand(cmd: string) {
    if (this.worker) {
      this.worker.postMessage(cmd);
    }
  }

  private handleWorkerMessage(e: MessageEvent) {
    const line: string = typeof e.data === 'string' ? e.data : '';

    if (line === 'uciok' || line === 'readyok') {
      this.isReady = true;
      return;
    }

    // Parse engine search info: info depth 4 score cp 35 multipv 1 pv e2e4 ...
    if (line.startsWith('info') && line.includes('score')) {
      this.parseInfoLine(line);
      return;
    }

    // Parse bestmove: bestmove e7e5 ponder g1f3
    if (line.startsWith('bestmove')) {
      this.isThinking = false;
      this.latestEvaluation.isThinking = false;
      if (this.onEval) {
        this.onEval({ ...this.latestEvaluation });
      }

      const parts = line.split(' ');
      const rawBestMove = parts[1];
      const ponder = parts[3];

      let selectedMove = rawBestMove;

      // Handle probabilistic sub-optimal move selection for beginner levels (1-6)
      if (
        this.currentLevel &&
        this.currentLevel.probSuboptimal &&
        this.currentLevel.probSuboptimal > 0 &&
        this.pvMoves.size > 1
      ) {
        if (Math.random() < this.currentLevel.probSuboptimal) {
          // Choose from non-first PV lines (e.g. line 2 to 5)
          const availableLines = Array.from(this.pvMoves.entries())
            .filter(([multipvIndex]) => multipvIndex > 1)
            .map(([_, data]) => data.move);

          if (availableLines.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableLines.length);
            selectedMove = availableLines[randomIndex];
          }
        }
      }

      if (this.onBestMove && selectedMove && selectedMove !== '(none)') {
        this.onBestMove(selectedMove, ponder);
      }
    }
  }

  private parseInfoLine(line: string) {
    // Extract depth
    const depthMatch = line.match(/depth\s+(\d+)/);
    const depth = depthMatch ? parseInt(depthMatch[1], 10) : 0;

    // Extract multipv index
    const multipvMatch = line.match(/multipv\s+(\d+)/);
    const multipv = multipvMatch ? parseInt(multipvMatch[1], 10) : 1;

    // Extract score
    let scoreCp: number | null = null;
    let scoreMate: number | null = null;

    const cpMatch = line.match(/score\s+cp\s+(-?\d+)/);
    if (cpMatch) {
      scoreCp = parseInt(cpMatch[1], 10);
    }

    const mateMatch = line.match(/score\s+mate\s+(-?\d+)/);
    if (mateMatch) {
      scoreMate = parseInt(mateMatch[1], 10);
    }

    // Extract first move in pv
    const pvIndex = line.indexOf(' pv ');
    let firstMove = '';
    if (pvIndex !== -1) {
      const pvTokens = line.substring(pvIndex + 4).trim().split(' ');
      firstMove = pvTokens[0];
    }

    if (firstMove) {
      this.pvMoves.set(multipv, { move: firstMove, scoreCp, scoreMate });
    }

    // Only update eval UI from primary line (multipv 1)
    if (multipv === 1) {
      this.latestEvaluation = {
        depth,
        scoreCp,
        scoreMate,
        bestMove: firstMove || undefined,
        isThinking: this.isThinking,
      };

      if (this.onEval) {
        this.onEval({ ...this.latestEvaluation });
      }
    }
  }

  public setLevel(level: LevelConfig) {
    this.currentLevel = level;
    this.sendCommand('stop');

    // Reset UCI options
    if (level.uciLimitStrength && level.uciElo) {
      this.sendCommand('setoption name UCI_LimitStrength value true');
      this.sendCommand(`setoption name UCI_Elo value ${level.uciElo}`);
    } else {
      this.sendCommand('setoption name UCI_LimitStrength value false');
      if (typeof level.skillLevel === 'number') {
        this.sendCommand(`setoption name Skill Level value ${level.skillLevel}`);
      }
    }

    // Configure MultiPV for natural variety on lower levels
    const multiPv = level.multiPv || 1;
    this.sendCommand(`setoption name MultiPV value ${multiPv}`);
    this.sendCommand('isready');
  }

  public evaluateAndPlay(
    fen: string,
    level: LevelConfig,
    onMove: BestMoveCallback,
    onEvaluation?: EvalCallback
  ) {
    this.setLevel(level);
    this.onBestMove = onMove;
    this.onEval = onEvaluation || null;
    this.pvMoves.clear();
    this.isThinking = true;

    this.sendCommand(`position fen ${fen}`);
    // Search with depth according to level
    this.sendCommand(`go depth ${level.depth}`);
  }

  public evaluatePositionOnly(fen: string, depth: number = 10, onEvaluation: EvalCallback) {
    this.onBestMove = null;
    this.onEval = onEvaluation;
    this.isThinking = true;
    this.sendCommand(`position fen ${fen}`);
    this.sendCommand(`go depth ${depth}`);
  }

  public stop() {
    this.sendCommand('stop');
    this.isThinking = false;
  }

  public destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

export const engine = new EngineController();
