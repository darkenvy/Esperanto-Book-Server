const path = require('path');
const fs = require('fs-extra');
const Datastore = require('nedb')
const readline = require('linebyline');
const stemmer = require('./stemmer');

const db = new Datastore({ filename: path.join(__dirname, 'espdic.db'), autoload: true });

const rl = readline(path.join(__dirname, 'espdic.txt'));
rl.on('error', e => console.log('error', e));
rl.on('line', (line, lineCount, byteCount) => {
  const [ esperanto, definition ] = line.split(' : ');
  const stem = stemmer.Stem(esperanto);
  const aggroStem = stemmer.StemAggressive(esperanto);

  const doc = {
    esperanto,
    definition,
  };

  if (stem !== esperanto) doc.stem = stem;
  if (aggroStem !== esperanto && aggroStem !== stem) doc.aggroStem = aggroStem;

  db.insert(doc);
});
rl.on('end', () => {
  db.persistence.compactDatafile();
  console.log('all done');
})