import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Chessground } from 'chessground';
import { Api } from 'chessground/api';
import { DrawShape } from 'chessground/draw';
import { Chess, Square } from 'chess.js';
import { Key } from 'chessground/types';
import { Color, BoardTheme } from '../types/chess';

interface ChessBoardProps {
  chess: Chess;
  orientation: Color;
  playerColor: Color;
  isBotThinking: boolean;
  onUserMove: (orig: string, dest: string, promotion?: string) => void;
  customShapes?: DrawShape[];
  theme?: BoardTheme;
  boardSize?: string;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  chess,
  orientation,
  playerColor,
  isBotThinking,
  onUserMove,
  customShapes = [],
  theme = 'green',
  boardSize,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<Api | null>(null);

  // Stable refs to prevent ANY stale closures in Chessground event listeners
  const onUserMoveRef = useRef(onUserMove);
  onUserMoveRef.current = onUserMove;

  const chessRef = useRef(chess);
  chessRef.current = chess;

  const playerColorRef = useRef(playerColor);
  playerColorRef.current = playerColor;

  const isBotThinkingRef = useRef(isBotThinking);
  isBotThinkingRef.current = isBotThinking;

  // Promotion modal state
  const [pendingPromotion, setPendingPromotion] = useState<{ orig: string; dest: string } | null>(null);

  // Calculate legal destination squares for movable configuration using latest ref
  const getDests = useCallback((): Map<Key, Key[]> => {
    const dests = new Map<Key, Key[]>();
    const currentChess = chessRef.current;
    const isPlayerTurn =
      (currentChess.turn() === 'w' && playerColorRef.current === 'white') ||
      (currentChess.turn() === 'b' && playerColorRef.current === 'black');

    if (!isPlayerTurn || isBotThinkingRef.current || currentChess.isGameOver()) {
      return dests;
    }

    const legalMoves = currentChess.moves({ verbose: true });
    for (const move of legalMoves) {
      const from = move.from as Key;
      const to = move.to as Key;
      if (!dests.has(from)) {
        dests.set(from, []);
      }
      dests.get(from)!.push(to);
    }
    return dests;
  }, []);

  // Stable handleMove callback referencing latest state
  const handleMove = useCallback((orig: Key, dest: Key) => {
    const currentChess = chessRef.current;
    const piece = currentChess.get(orig as Square);
    const isPawn = piece?.type === 'p';
    const isPromotionRank =
      (piece?.color === 'w' && dest.endsWith('8')) ||
      (piece?.color === 'b' && dest.endsWith('1'));

    if (isPawn && isPromotionRank) {
      setPendingPromotion({ orig, dest });
      return;
    }

    onUserMoveRef.current(orig, dest);
  }, []);

  // Select promotion piece
  const handleSelectPromotion = (promotionPiece: 'q' | 'r' | 'b' | 'n') => {
    if (pendingPromotion) {
      onUserMoveRef.current(pendingPromotion.orig, pendingPromotion.dest, promotionPiece);
      setPendingPromotion(null);
    }
  };

  // Initialize Chessground
  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const ground = Chessground(containerRef.current, {
      fen: chessRef.current.fen(),
      orientation,
      turnColor: chessRef.current.turn() === 'w' ? 'white' : 'black',
      movable: {
        free: false,
        color: playerColorRef.current,
        dests: getDests(),
        events: {
          after: handleMove,
        },
      },
      drawable: {
        enabled: true,
        visible: true,
        shapes: customShapes,
      },
      animation: {
        enabled: true,
        duration: 200,
      },
      highlight: {
        lastMove: true,
        check: true,
      },
    });

    groundRef.current = ground;

    requestAnimationFrame(() => {
      ground.redrawAll();
    });

    const ro = new ResizeObserver(() => {
      ground.redrawAll();
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      ground.destroy();
      groundRef.current = null;
    };
  }, []); // Mount once

  // Synchronize state on every chess state change
  useEffect(() => {
    if (!groundRef.current) return;

    const currentChess = chessRef.current;
    groundRef.current.set({
      fen: currentChess.fen(),
      orientation,
      turnColor: currentChess.turn() === 'w' ? 'white' : 'black',
      check: currentChess.inCheck(),
      movable: {
        color: playerColor,
        dests: getDests(),
        events: {
          after: handleMove,
        },
      },
      drawable: {
        shapes: customShapes,
      },
    });

    requestAnimationFrame(() => {
      groundRef.current?.redrawAll();
    });
  }, [chess, chess.fen(), orientation, playerColor, isBotThinking, customShapes, getDests, handleMove]);

  const themeClass = {
    green: 'theme-green',
    wood: 'theme-wood',
    blue: 'theme-blue',
    graphite: 'theme-graphite',
  }[theme];

  return (
    <div 
      className="flex-shrink-0 aspect-square select-none relative max-w-full"
      style={{
        width: boardSize || 'min(480px, 58vh, 100%)',
        height: boardSize || 'min(480px, 58vh, 100%)',
      }}
    >
      {/* Chessground Container - dedicated isolated element for Chessground DOM */}
      <div 
        ref={containerRef}
        className={`w-full h-full shadow-2xl rounded-lg overflow-hidden border-3 md:border-4 border-slate-800 relative ${themeClass}`}
      />

      {/* Promotion Modal Dialog - rendered outside containerRef so React reconciles cleanly */}
      {pendingPromotion && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn rounded-lg">
          <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl text-center space-y-3">
            <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Выберите фигуру для превращения
            </h4>
            <div className="flex gap-2.5 justify-center">
              {[
                { type: 'q', label: 'Ферзь', symbol: playerColor === 'white' ? '♕' : '♛' },
                { type: 'r', label: 'Ладья', symbol: playerColor === 'white' ? '♖' : '♜' },
                { type: 'b', label: 'Слон', symbol: playerColor === 'white' ? '♗' : '♝' },
                { type: 'n', label: 'Конь', symbol: playerColor === 'white' ? '♘' : '♞' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => handleSelectPromotion(item.type as 'q' | 'r' | 'b' | 'n')}
                  className="w-12 h-14 bg-slate-800 hover:bg-emerald-600 border border-slate-700 hover:border-emerald-400 rounded-lg flex flex-col items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-md"
                >
                  <span className="text-2xl leading-none">{item.symbol}</span>
                  <span className="text-[9px] text-slate-300 mt-1 font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
