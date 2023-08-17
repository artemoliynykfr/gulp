const stylelint = require("stylelint");

const { report, validateOptions, ruleMessages } = stylelint.utils;
const ruleName = "kiforks/media-query-nesting";
const messages = ruleMessages(ruleName, {
	expected: 'Selector can\'t be nested within a media query (but media query should be nested within the selector).',
});

module.exports = stylelint.createPlugin(ruleName, (enabled) => {
	if (!enabled) {
		return;
	}
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				// No options for now...
			}
		);

		if (!validOptions) {
			return;
		}

		root.walkAtRules('include', atRule => {
			if (!atRule) {
				return;
			}

			const { nodes: node, params, parent } = atRule;

			const nodes = JSON.stringify(node);

			if (typeof nodes !== 'string' || typeof params !== 'string') {
				return;
			}

			const hasNesting = !!nodes.includes('selector') && !!params.includes('media') && parent.type === "rule";

			if (!hasNesting) {
				return;
			}

			report({
				result,
				ruleName,
				message: messages.expected,
				node: atRule,
				word: atRule.value
			});
		})
	}
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
