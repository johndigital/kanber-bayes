const tap = require('tap')
const Bayes = require('./')

// init classifier
const classifier = Bayes()

// Simple French Training
classifier.train("L'Italie a été gouvernée pendant un an par un homme qui n'avait pas été élu par le peuple. Dès la nomination de Mario Monti au poste de président du conseil.", 'french');
classifier.train("Il en faut peu, parfois, pour passer du statut d'icône de la cause des femmes à celui de renégate. Lorsqu'elle a été nommée à la tête de Yahoo!", 'french');

// Simple English Training
classifier.train("One morning in late September 2011, a group of American drones took off from an airstrip the C.I.A. had built in the remote southern expanse of Saudi Arabia.", 'english');
classifier.train("Just months ago, demonstrators here and around Egypt were chanting for the end of military rule.", 'english');

// basic test to make sure the math checks out
tap.same(classifier.guess('The quick brown fox jumps over the lazy dog.'), {
    french: 0.5,
    english: 0.8333333333333334
}, 'Predicts simple language example with proper confidence.')

// dump classifier to JSON, parse as object
const savedClassifier = classifier.toJSON()
const parsedClassifier = JSON.parse(savedClassifier)

// expect 3 instances of the token "a"
tap.equal(parsedClassifier['_Bayes::stemCount:a'], 3, 'Successfully dumps memory, maintaining the proper token counts.')

// create new classifier
const secondClassifer = Bayes()

// predict text again, should come back empty
tap.same(secondClassifer.guess('The quick brown fox jumps over the lazy dog.'), {}, 'Returns empty object when no labels to categorize.')

// load model from saved classifier
secondClassifer.fromJSON(savedClassifier)

// test again, result should now match first classifier
tap.same(secondClassifer.guess('The quick brown fox jumps over the lazy dog.'), {
    french: 0.5,
    english: 0.8333333333333334
}, 'Correctly loads a saved model from JSON.')
