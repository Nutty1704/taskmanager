import labelColors from '../../config/labelColors.json' with { type: 'json' };

/**
 * Determines if a given color is valid.
 *
 * @param {number} color
 * @returns {boolean}
 */
export const isValidColor = (color) => {
    return Object.hasOwn(labelColors, `${color}`);
}