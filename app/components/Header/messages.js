/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.components.Header';

export default defineMessages({
  home: {
    id: `${scope}.home`,
    defaultMessage: 'Home',
  },
  part1: {
    id: `${scope}.part1`,
    defaultMessage: 'Part1',
  },
  part2: {
    id: `${scope}.part2`,
    defaultMessage: 'Part2',
  },
});
