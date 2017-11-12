// Bundle what we need from lodash manually since tree-shaking doesn't quite work
// https://github.com/rollup/rollup/wiki/Troubleshooting#tree-shaking-doesnt-seem-to-be-working

import flatten from 'lodash-es/flatten';
import filter from 'lodash-es/filter';
import forEach from 'lodash-es/forEach';
import range from 'lodash-es/range';
import reject from 'lodash-es/reject';
import shuffle from 'lodash-es/shuffle';

export {
  flatten,
  filter,
  forEach,
  range,
  reject,
  shuffle
}
