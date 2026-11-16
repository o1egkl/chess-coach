const { Chess } = require('chess.js');
const fs = require('fs');
const content = fs.readFileSync('src/config/puzzles.ts', 'utf8');

const puzzleRegex = /{\s*id:\s*'([^']+)',[\s\S]*?fen:\s*'([^']+)',[\s\S]*?solutionUci:\s*\[([^\]]+)\]/g;
let match;
while ((match = puzzleRegex.exec(content)) !== null) {
  const id = match[1];
  const fen = match[2];
  const solutionUci = match[3].split(',').map(s => s.trim().replace(/['"]/g, ''));
  console.log(`\n=== Puzzle ${id} ===`);
  console.log(`FEN: ${fen}`);
  console.log(`Solution: ${solutionUci.join(', ')}`);
  
  const ranks = fen.split(' ')[0].split('/');
  if (ranks.length !== 8) {
    console.error(`  [FAIL] FEN rank count: ${ranks.length} (expected 8)`);
  }

  try {
    const c = new Chess(fen);
    for (let i = 0; i < solutionUci.length; i++) {
      const uci = solutionUci[i];
      const from = uci.substring(0, 2);
      const to = uci.substring(2, 4);
      const promotion = uci.length > 4 ? uci[4] : undefined;
      const res = c.move({ from, to, promotion });
      if (!res) {
        console.error(`  [FAIL] Step ${i}: Move ${uci} is ILLEGAL! FEN at step: ${c.fen()}`);
        break;
      }
    }
    console.log(`  State after moves: isCheckmate=${c.isCheckmate()}, inCheck=${c.inCheck()}`);
  } catch (err) {
    console.error(`  [EXCEPTION]: ${err.message}`);
  }
}
