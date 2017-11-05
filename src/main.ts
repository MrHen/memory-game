import * as d3 from 'd3';
import * as _ from 'lodash-es';

export default function () {
  var tick = 800;

  var size = 15;

  var colors = d3.scaleOrdinal(d3.schemeCategory20);
  colors.range(_.shuffle(colors.range()));

  var cards = _.flatten(_.range(size).map(function (d) {
    return [{
      value: d,
      revealed: false,
      solved: false
    }, {
      value: d,
      revealed: false,
      solved: false
    }]
  }));

  getSelection().call(build, cards);

  function getSelection() {
    return d3.select("#memory-container")
             .selectAll(".card")

  }

  function build(selection, data, delay) {
    if (delay) {
      setTimeout(build.bind(null, selection, data), delay);
      return;
    }

    data = data || selection.data();

    _.forEach(data, function (d) {
      d.solved = false;
      d.revealed = false;
    });

    selection.data(_.shuffle(data))
      .call(layout)
      .call(draw);
  }

  function layout(selection) {
    var added = selection.enter()
      .append("div")
      .attr("class", "card")
      .on("click", function (d) {
        if (!d.revealed) {
          d.revealed = true;
          d3.select(this).call(draw);
          getSelection().call(update); // TODO selection reference had to change when moving to d3 v4 but not sure why
        }
      })
      .append("div")
      .attr("class", "card-container");

    added.append("div")
      .attr("class", "front");

    added.append("div")
      .attr("class", "back")
      .style("background-color", colors('' + size))
  }

  function draw(selection, delay) {
    if (delay) {
      setTimeout(draw.bind(null, selection), delay);
      return;
    }

    selection.classed('solved', (d) => d.solved)
    selection.classed('revealed', (d) => d.revealed)
    selection.classed('shuffling', false)
    // selection.classed({
    //   "solved": function (d) {
    //     return d.solved;
    //   },
    //   "revealed": function (d) {
    //     return d.revealed;
    //   },
    //   "shuffling": false
    // });

    selection.select(".front")
      .text(function (d) {
        return d.value;
      })
      .style("background-color", function (d) {
        return colors(d.value);
      });

  }

  function reset(selection, delay) {
    if (delay) {
      setTimeout(reset.bind(null, selection), delay);
      return;
    }

    selection.classed({
      "shuffling": true
    });

    // give the CSS animation time to finish
    selection.call(build, null, tick);
  }

  function update(selection) {
    var revealed: {
      resolved: boolean,
      solved: boolean,
      value: any,
      revealed: boolean
    }[] = _.filter(selection.data(), {
      "revealed": true,
      "solved": false
    });

    if (revealed.length <= 1) {
      return;
    }

    if (revealed[0].value === revealed[1].value) {
      revealed[0].solved = true;
      revealed[1].solved = true;
      selection.call(draw);
    } else {
      revealed[0].revealed = false;
      revealed[1].revealed = false;
      selection.call(draw, tick); // wait a tick before hiding a failed attempt
    }

    var unsolved = _.reject(selection.data(), "solved");
    if (!unsolved.length) {
      selection.call(reset, tick); // wait a tick before reseting the whole board
    }
  }
}
