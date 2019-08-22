const path = require('path');
const express = require('express');
const atob = require('atob');
const Datastore = require('nedb');
const async = require('async');
const stemmer = require('./stemmer');

const db = new Datastore({ filename: path.join(__dirname, 'espdic.db'), autoload: true });
const app = express();
app.use(express.static('public'))


function search(query, callback) {
  db.findOne(query, (err, doc) => {
    if (err) console.log(err); // eslint-disable-line no-console
    callback(doc);
  });
}

function translate(word) {
  return new Promise((resolve, reject) => {
    const queries = [
      { esperanto: word },
      { stem: stemmer.Stem(word) },
      { aggroStem: stemmer.StemAggressive(word) },
    ];

    // abusing 'error' as our result. Once one search yields a result, we want to abort async.
    async.eachSeries(queries, search, result => {
      const definition = result && result.definition;
      if (!result) reject(' ');
      else resolve(definition);
    })
  });
}

app.get('/', (req, res) => {
  const { word } = req.query;
  if (!word) {
    res.status(404).send();
    return;
  }

  translate(word)
    .then(results => res.status(200).send(results))
    .catch(error => res.status(200).send(error));
});

console.log('Listening on port 3000');
app.listen(3000);
