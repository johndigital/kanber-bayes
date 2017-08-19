# kanber-bayes
Burak Kanber's implementation of a simple naive bayes classifier in javascript.

## What?
This is a simple npm module for naive bayes classification. The code was originally written by Burak Kanber as part of a his "Machine Learning in Javascript" series. This repo represents an adaptation of the code from that article into a useful utility for node js or the browser.

You can [read the original article here to learn more](http://burakkanber.com/blog/machine-learning-naive-bayes-1/).

See the original [jsFiddle implementation here](https://jsfiddle.net/bkanber/gNrdF/).

## Why?
The original code is a great learning tool for very basic natural language processing. It works well for extremely basic tasks, and there's no "black magic" behind the scenes. Use this module to learn from like I did, or use it in a project if you find it useful.

## Installation
```
npm install kanber-bayes --save
```

## Example Use

```js
const Bayes = require('kanber-bayes')

// init classifier
const classifier = Bayes()

// Train classifier to recognize French
classifier.train("L'Italie a été gouvernée pendant un an par un homme qui n'avait pas été élu par le peuple. Dès la nomination de Mario Monti au poste de président du conseil.", 'french');
classifier.train("Il en faut peu, parfois, pour passer du statut d'icône de la cause des femmes à celui de renégate. Lorsqu'elle a été nommée à la tête de Yahoo!", 'french');

// Train classifier to recognize English
classifier.train("One morning in late September 2011, a group of American drones took off from an airstrip the C.I.A. had built in the remote southern expanse of Saudi Arabia.", 'english');
classifier.train("Just months ago, demonstrators here and around Egypt were chanting for the end of military rule.", 'english');

// guess the language of this sentence
classifier.guess('The quick brown fox jumps over the lazy dog.')
// { french: 0.5, english: 0.8333333333333334 }
```
