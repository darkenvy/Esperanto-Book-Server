
//roots represents standalone root words
const roots = ["ĉar", "ĉi", "ĉu", "kaj", "ke", "la", "minus", "plus",
	"se", "ĉe", "da", "de", "el", "ekster", "en", "ĝis", "je", "kun", "na",
	"po", "pri", "pro", "sen", "tra", "ajn", "do", "ja", "jen", "ju", "ne",
	"pli", "tamen", "tre", "tro", "ci", "ĝi", "ili", "li", "mi", "ni", "oni",
	"ri", "si", "ŝi", "ŝli", "vi", "unu", "du", "tri", "kvin", "ĵus", "nun", "plu",
	"tuj", "amen", "bis", "boj", "fi", "ha", "he", "ho", "hu", "hura", "nu", "ve",
	"esperanto",
];

//correlative roots
const correlatives = [
	"kia", "kial", "kiam", "kie", "kiel", "kies", "kio", "kiom", "kiu",
	"tia", "tial", "tiam", "tie", "tiel", "ties", "tio", "tiom", "tiu",
	"ia", "ial", "iam", "ie", "iel", "ies", "io", "iom", "iu",
	"ĉia", "ĉial", "ĉiam", "ĉie", "ĉiel", "ĉies", "ĉio", "ĉiom", "ĉiu",
	"nenia", "nenial", "neniam", "nenie", "neniel", "nenies", "nenio", "neniom", "neniu",
];

//Stem returns the word's base form.
function Stem(word) {
  word = word.toLowerCase().trim();

  //standalone rootst
  if (roots.indexOf(word) !== -1) return word;

	//l\' l' → la
	if (word === "l\'" || word === "l'") return "la";

	//un\' un' unuj → unu
	if (word === "un\'" || word === "un'" || word === "unuj") return "unu";

	//-\' -' → -o
	word = replaceSuffix(word, "'", "o")
	word = replaceSuffix(word, "\'", "o")

	//\'st- 'st- → est-
	word = replacePrefix(word, "\'st", "est")
	word = replacePrefix(word, "'st", "est")

	// nouns, adjectives, -u correlatives:
	// -oj -on -ojn → o
	// -aj -an -ajn → a
	// -uj -un -ujn → u
	word = replaceSuffix(word, "oj", "o")
	word = replaceSuffix(word, "on", "o")
	word = replaceSuffix(word, "ojn", "o")
	word = replaceSuffix(word, "aj", "a")
	word = replaceSuffix(word, "an", "a")
	word = replaceSuffix(word, "ajn", "a")
	word = replaceSuffix(word, "uj", "u")
	word = replaceSuffix(word, "un", "u")
  word = replaceSuffix(word, "ujn", "u")
  
	//correlatives: -en → -e
	for (let s in ["kien", "tien", "ien", "nenien", "ĉien"]) {
		if (word === s) return word[word.length - 1];
	}

	//correlative roots
	for (let s in correlatives) {
		if (word === s) return word;
	}

	//accusative pronouns: -in → -i
	if (word.endsWith("in")) return replaceSuffix(word, "in", "i");

	//accusative adverbs: -en → -o
  word = replaceSuffix(word, "en", "o")

	//verbs: -is -as -os -us -u → -i
	word = replaceSuffix(word, "is", "i")
	word = replaceSuffix(word, "as", "i")
	word = replaceSuffix(word, "os", "i")
	word = replaceSuffix(word, "us", "i")
  word = replaceSuffix(word, "u", "i")

  //lexical aspect: ek- el-
	if (!word.startsWith("ekscit")) {
    if (word.startsWith("ek")) word = word.slice(2);
  }
	if (!word.startsWith("elefant")) {
    if (word.startsWith('el')) word = word.slice(2);
  }
  
	//imperfective verbs & action nouns: -adi -ado → -i
	if (word.endsWith("adi")) return replaceSuffix(word, "adi", "i")
	else if (word.endsWith("ado")) return replaceSuffix(word, "ado", "i")

	// compound verbs:
	// -inti -anti -onti -iti -ati -oti → -i
	// -inte -ante -onte -ite -ate -ote → -i
	// -inta -anta -onta -ita -ata -ota → -i
  if (word.endsWith("inti")) return replaceSuffix(word, "inti", "i")
  if (word.endsWith("anti")) return replaceSuffix(word, "anti", "i")
  if (word.endsWith("onti")) return replaceSuffix(word, "onti", "i")
  if (word.endsWith("iti")) return replaceSuffix(word, "iti", "i")
  if (word.endsWith("ati")) return replaceSuffix(word, "ati", "i")
  if (word.endsWith("oti")) return replaceSuffix(word, "oti", "i")
  if (word.endsWith("inte")) return replaceSuffix(word, "inte", "i")
  if (word.endsWith("ante")) return replaceSuffix(word, "ante", "i")
  if (word.endsWith("onte")) return replaceSuffix(word, "onte", "i")
  if (word.endsWith("ite")) return replaceSuffix(word, "ite", "i")
  if (word.endsWith("ate")) return replaceSuffix(word, "ate", "i")
  if (word.endsWith("ote")) return replaceSuffix(word, "ote", "i")
  if (word.endsWith("inta")) return replaceSuffix(word, "inta", "i")
  if (word.endsWith("anta")) return replaceSuffix(word, "anta", "i")
  if (word.endsWith("onta")) return replaceSuffix(word, "onta", "i")
  if (word.endsWith("ita")) return replaceSuffix(word, "ita", "i")
  if (word.endsWith("ata")) return replaceSuffix(word, "ata", "i")
  if (word.endsWith("ota")) return replaceSuffix(word, "ota", "i")

	// participle nouns:
	// -into -anto -onto → -anto
	// -ito  -ato  -oto  → -ato
	if (word.endsWith("into")) return replaceSuffix(word, "into", "anto")
	if (word.endsWith("anto")) return replaceSuffix(word, "anto", "anto")
	if (word.endsWith("onto")) return replaceSuffix(word, "onto", "anto")
	if (word.endsWith("ito")) return replaceSuffix(word, "ito", "ato")
	if (word.endsWith("ato")) return replaceSuffix(word, "ato", "ato")
	if (word.endsWith("oto")) return replaceSuffix(word, "oto", "ato")

	return word;
}

function StemAggressive(word) {
	word = Stem(word);

	//root words
	if (roots.indexOf(word) !== -1) return word;

  //remove final suffix if it's a vowel
	if (
    word.endsWith("a") ||
    word.endsWith("e") ||
    word.endsWith("i") ||
    word.endsWith("o") ||
    word.endsWith("u")
  ) {
    word = word.slice(0, word.length - 1);
	}

	//remove suffix for participle nouns:
  //-int- -ant- -ont- -it- -at- -ot-
  // matched, err := regexp.MatchString("[aeiou].*(int|ant|ont|it|at|ot)$", word)
  const matched = word.match(/[aeiou].*(int|ant|ont|it|at|ot)$/);
	if (matched) {
    if (
      word.endsWith("int") ||
      word.endsWith("ant") ||
      word.endsWith("ont")
    ) {
      word = word.slice(0, word.length - 3);
    }
    if (
      word.endsWith("it") ||
      word.endsWith("at") ||
      word.endsWith("ot")
    ) {
      word = word.slice(0, word.length - 2);
    }
	}

	return word
}

//replaceSuffix returns s with the trailing oldSuffix replaced with the newSuffix.
//If s doesn't end with the suffix, s is returned unchanged.
function replaceSuffix(s, oldSuffix, newSuffix) {
  if (s.endsWith(oldSuffix)) {
    return s.slice(0, s.length - oldSuffix.length) + newSuffix;
  }
	return s;
}

//replacePrefix returns s with the leading oldPrefix replaced with the newPrefix.
//If s doesn't start with the prefix, s is returned unchanged.
function replacePrefix(s, oldPrefix, newPrefix) {
  if (s.startsWith(oldPrefix)) {
    return newPrefix + s.slice(oldPrefix.length);
    // return newPrefix + s[oldPrefix.length];
  }
	return s;
}

module.exports = {
  Stem,
  StemAggressive,
};
