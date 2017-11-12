import * as _ from './lodash';

export interface MemoryCard {
  value: string,
  revealed: boolean,
  solved: boolean
}

export type MemoryGame = MemoryCard[];

export function buildGame(size: number): MemoryGame {
  var cards = _.range(size).map(function (d) {
    return [{
      value: '' + d,
      revealed: false,
      solved: false
    }, {
      value: '' + d,
      revealed: false,
      solved: false
    }]
  });

  return _.flatten(cards);
}

export function revealCard(game: MemoryGame, card: MemoryCard) {
  var move = {
    success: false,
    endTurn: false
  };

  if (!card.revealed) {
    move.success = true;
    card.revealed = true;
  }

  move.endTurn = isTurnEnd(game);

  return move;
}

export function endTurn(game: MemoryGame) {
  var turn = {
    match: false,
    solved: false
  }
  var revealed: MemoryCard[] = _.filter(game, {
    revealed: true,
    solved: false
  });

  if (revealed.length <= 1) {
    return turn;
  }

  turn.match = revealed[0].value === revealed[1].value

  if (turn.match) {
    revealed[0].solved = true;
    revealed[1].solved = true;
  } else {
    revealed[0].revealed = false;
    revealed[1].revealed = false;
  }

  turn.solved = isSolved(game);

  return turn;
}

function isTurnEnd(game: MemoryGame): boolean {
  let revealed = _.filter(game, {revealed: true,
    solved: false
  });
  return revealed.length >= 2;
}

function isSolved(game: MemoryGame): boolean {
  return !_.reject(game, "solved").length;
}
