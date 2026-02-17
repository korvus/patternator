module.exports = {
  extends: ["stylelint-config-standard"],
  rules: {
    "no-descending-specificity": null,
    "rule-empty-line-before": null,
    "comment-empty-line-before": null,
    "comment-whitespace-inside": null,
    "function-url-quotes": null,
    "length-zero-no-unit": null,
    "font-family-no-missing-generic-family-keyword": null,
    "selector-class-pattern": null,
    "selector-id-pattern": null,
    "shorthand-property-no-redundant-values": null,
    "color-hex-length": null,
    "declaration-property-value-no-unknown": null,
    "no-duplicate-selectors": null,
    "property-no-vendor-prefix": null,
    "declaration-block-single-line-max-declarations": null,
    "property-no-unknown": [
      true,
      {
        ignoreProperties: [/^_/, /^\d/]
      }
    ],
    "color-function-notation": null,
    "alpha-value-notation": null,
    "selector-pseudo-element-colon-notation": null
  }
};
