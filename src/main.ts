import * as d3 from 'd3';
import * as _ from './lodash';

import {
  MemoryCard,
  buildGame,
  endTurn,
  revealCard
} from './state';

type MemoryCardElement = d3.BaseType;
type MemoryCardSelection = d3.Selection<MemoryCardElement, MemoryCard, MemoryCardElement, MemoryCard[] | undefined>;

export default function () {
  var config = {
    tick: 800,
    size: 15,
    colors: d3.schemeCategory10,
    ids: {
      root: "#memory-container"
    },
    classes: {
      back: "back",
      card: 'card',
      cardContainer: 'card-container',
      front: "front",
      solved: 'solved',
      revealed: 'revealed',
      shuffling: 'shuffling'
    }
  }

  var colors = d3.scaleSequential(d3.interpolateRainbow)
    .domain([0, config.size])

  var game = buildGame(config.size);
  getSelection().call(build, game);

  function getSelection(): MemoryCardSelection {
    return d3.select<HTMLDivElement, MemoryCard[]>(config.ids.root)
      .selectAll(`.${config.classes.card}`)
  }

  function build(selection: MemoryCardSelection, data: MemoryCard[], delay: number) {
    if (delay) {
      setTimeout(build.bind(null, selection, data), delay);
      return;
    }

    data = data || selection.data();

    _.forEach(data, function (d) {
      d.solved = false;
      d.revealed = false;
    });

    data = _.shuffle(data)

    selection.data(data)
      .call(layout)
      .call(draw);
  }

  function layout(selection: MemoryCardSelection) {
    var added = selection.enter()
      .append("div")
      .attr("class", config.classes.card)
      .on("click", onClick)
      .append("div")
      .attr("class", config.classes.cardContainer);

    added.append("div")
      .attr("class", config.classes.front);

    added.append("div")
      .attr("class", config.classes.back)
      .style("background-color", colors(config.size))
  }

  function draw(selection: MemoryCardSelection, delay: number) {
    if (delay) {
      setTimeout(draw.bind(null, selection), delay);
      return;
    }

    selection.classed(config.classes.solved, (d: MemoryCard) => d.solved)
    selection.classed(config.classes.revealed, (d: MemoryCard) => d.revealed)
    selection.classed(config.classes.shuffling, false)

    selection.select(`.${config.classes.front}`)
      .text(function (d: MemoryCard) {
        return d.value;
      })
      .style("background-color", function (d: MemoryCard) {
        return colors(+d.value);
      });

  }

  function reset(selection: MemoryCardSelection, delay: number) {
    if (delay) {
      setTimeout(reset.bind(null, selection), delay);
      return;
    }

    selection.classed(config.classes.shuffling, true);

    // give the CSS animation time to finish
    selection.call(build, null, config.tick);
  }

  function onClick(this: MemoryCardElement, card: MemoryCard) {
    let selection = getSelection()
    let move = revealCard(selection.data(), card);
    if (move.success) {
      // paint reveal immediately then check if we can end the turn
      d3.select<MemoryCardElement, MemoryCard>(this).call(draw);

      if (move.endTurn) {
        selection.call(update);
      }
    }
}

  function update(selection: MemoryCardSelection) {
    var turn = endTurn(selection.data());
    if (turn.match) {
      selection.call(draw);
    } else {
      selection.call(draw, config.tick); // wait a tick before hiding a failed attempt
    }

    if (turn.solved) {
      selection.call(reset, config.tick); // wait a tick before reseting the whole board
    }
  }
}
