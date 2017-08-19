/*
The following is not free software. You may use it for educational purposes, but you may not redistribute or use it commercially.
(C) All Rights Reserved, Burak Kanber 2013
*/

const Bayes = () => {
    const classifier = {}
    let storage = {}

    Array.prototype.unique = function () {
        var u = {}, a = []
        for (var i = 0, l = this.length; i < l; ++i) {
            if (u.hasOwnProperty(this[i])) {
                continue
            }
            a.push(this[i])
            u[this[i]] = 1
        }
        return a
    }

    var stemKey = function (stem, label) {
        return '_Bayes::stem:' + stem + '::label:' + label
    }

    var docCountKey = function (label) {
        return '_Bayes::docCount:' + label
    }

    var stemCountKey = function (stem) {
        return '_Bayes::stemCount:' + stem
    }

    var tokenize = function (text) {
        text = text.toLowerCase().replace(/\W/g, ' ').replace(/\s+/g, ' ').trim().split(' ').unique()
        return text
    }

    var getLabels = function () {
        var labels = storage['_Bayes::registeredLabels']
        if (!labels) labels = ''
        return labels.split(',').filter(function (a) {
            return a.length
        })
    }

    var registerLabel = function (label) {
        var labels = getLabels()
        if (labels.indexOf(label) === -1) {
            labels.push(label)
            storage['_Bayes::registeredLabels'] = labels.join(',')
        }
        return true
    }

    var stemLabelCount = function (stem, label) {
        var count = parseInt(storage[stemKey(stem, label)])
        if (!count) count = 0
        return count
    }

    var stemInverseLabelCount = function (stem, label) {
        var labels = getLabels()
        var total = 0
        for (var i = 0, length = labels.length; i < length; i++) {
            if (labels[i] === label)
                continue
            total += parseInt(stemLabelCount(stem, labels[i]))
        }
        return total
    }

    var stemTotalCount = function (stem) {
        var count = parseInt(storage[stemCountKey(stem)])
        if (!count) count = 0
        return count
    }

    var docCount = function (label) {
        var count = parseInt(storage[docCountKey(label)])
        if (!count) count = 0
        return count
    }

    var docInverseCount = function (label) {
        var labels = getLabels()
        var total = 0
        for (var i = 0, length = labels.length; i < length; i++) {
            if (labels[i] === label)
                continue
            total += parseInt(docCount(labels[i]))
        }
        return total
    }

    var increment = function (key) {
        var count = parseInt(storage[key])
        if (!count) count = 0
        storage[key] = parseInt(count) + 1
        return count + 1
    }

    var incrementStem = function (stem, label) {
        increment(stemCountKey(stem))
        increment(stemKey(stem, label))
    }

    var incrementDocCount = function (label) {
        return increment(docCountKey(label))
    }

    classifier.train = function (text, label) {
        registerLabel(label)
        var words = tokenize(text)
        var length = words.length
        for (var i = 0; i < length; i++)
            incrementStem(words[i], label)
        incrementDocCount(label)
    }

    classifier.guess = function (text) {
        var words = tokenize(text)
        var length = words.length
        var labels = getLabels()
        var totalDocCount = 0
        var docCounts = {}
        var docInverseCounts = {}
        var scores = {}
        var labelProbability = {}

        for (var j = 0; j < labels.length; j++) {
            var label = labels[j]
            docCounts[label] = docCount(label)
            docInverseCounts[label] = docInverseCount(label)
            totalDocCount += parseInt(docCounts[label])
        }

        for (var k = 0; k < labels.length; k++) {
            var kLabel = labels[k]
            var logSum = 0
            labelProbability[kLabel] = docCounts[kLabel] / totalDocCount

            for (var i = 0; i < length; i++) {
                var word = words[i]
                var _stemTotalCount = stemTotalCount(word)
                if (_stemTotalCount === 0) {
                    continue
                } else {
                    var wordProbability = stemLabelCount(word, kLabel) / docCounts[kLabel]
                    var wordInverseProbability = stemInverseLabelCount(word, kLabel) / docInverseCounts[kLabel]
                    var wordicity = wordProbability / (wordProbability + wordInverseProbability)

                    // cache maxed and we have a NaN, continue
                    if ( !wordicity ) continue

                    wordicity = ( (1 * 0.5) + (_stemTotalCount * wordicity) ) / ( 1 + _stemTotalCount )
                    if (wordicity === 0)
                        wordicity = 0.01
                    else if (wordicity === 1)
                        wordicity = 0.99
                }

                logSum += (Math.log(1 - wordicity) - Math.log(wordicity))
                // console.log(kLabel + '-icity of ' + word + ': ' + wordicity)
            }
            scores[kLabel] = 1 / ( 1 + Math.exp(logSum) )
        }
        return scores
    }

    classifier.extractWinner = function (scores) {
        var bestScore = 0
        var bestLabel = null
        for (var label in scores) {
            if (scores[label] > bestScore) {
                bestScore = scores[label]
                bestLabel = label
            }
        }
        return {label: bestLabel, score: bestScore}
    }

    classifier.toJSON = () => {
        return JSON.stringify(storage)
    }

    classifier.fromJSON = json => {
        storage = JSON.parse(json)
        return storage
    }

    return classifier
}

module.exports = Bayes
