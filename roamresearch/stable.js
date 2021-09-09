// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
// modify from https://serene-williams-db0c75.netlify.app/js/stable.js
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"zviG":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIntervalHumanReadable = exports.getRoamDate = exports.dailyPageUIDToCrossBrowserDate = exports.goToUid = exports.removeSelector = exports.createUid = exports.sleep = void 0;

const sleep = m => {
  var t = m ? m : 10;
  return new Promise(r => setTimeout(r, t));
}; // From roam42 based on https://github.com/ai/nanoid#js version 3.1.2


exports.sleep = sleep;

const nanoid = (t = 21) => {
  let e = "",
      r = crypto.getRandomValues(new Uint8Array(t));

  for (; t--;) {
    let n = 63 & r[t];
    e += n < 36 ? n.toString(36) : n < 62 ? (n - 26).toString(36).toUpperCase() : n < 63 ? "_" : "-";
  }

  return e;
};

const createUid = () => {
  return nanoid(9);
};

exports.createUid = createUid;

const removeSelector = selector => {
  document.querySelectorAll(selector).forEach(element => {
    element.remove();
  });
};

exports.removeSelector = removeSelector;

const goToUid = uid => {
  var baseUrl = "/" + new URL(window.location.href).hash.split("/").slice(0, 3).join("/");
  var url = uid ? baseUrl + "/page/" + uid : baseUrl;
  location.assign(url);
};

exports.goToUid = goToUid;

const dailyPageUIDToCrossBrowserDate = str => {
  if (!str) return null;
  let strSplit = str.split("-"); // if we use "null" as input for a new Date, we get the lowest possible Date (1970...)

  if (strSplit.length != 3) return null;

  try {
    let date = new Date(strSplit[2] + "-" + strSplit[0] + "-" + strSplit[1]);
    date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    return date;
  } catch (e) {
    console.log(e);
  }
};

exports.dailyPageUIDToCrossBrowserDate = dailyPageUIDToCrossBrowserDate;

const getRoamDate = date => {
  if (!date || date == 0) date = new Date();
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var suffix = (d => {
    if (d > 3 && d < 21) return "th";

    switch (d % 10) {
      case 1:
        return "st";

      case 2:
        return "nd";

      case 3:
        return "rd";

      default:
        return "th";
    }
  })(date.getDate());

  var pad = n => n.toString().padStart(2, "0");

  var roamDate = {
    title: months[date.getMonth()] + " " + date.getDate() + suffix + ", " + date.getFullYear(),
    uid: pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + "-" + date.getFullYear()
  };
  return roamDate;
};

exports.getRoamDate = getRoamDate;

const getIntervalHumanReadable = n => {
  if (n == 0) return "<10 min";else if (n > 0 && n <= 15) return n + " d";else if (n <= 30) return (n / 7).toFixed(1) + " w";else if (n <= 365) return (n / 30).toFixed(1) + " m";
};

exports.getIntervalHumanReadable = getIntervalHumanReadable;
},{}],"A7lJ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCurrentCardIndex = exports.toggleLimitActivation = exports.setLimitActivation = exports.addExtraCardToQueue = exports.addCardToQueue = exports.incrementCurrentCardIndex = exports.setCards = exports.standbyState = exports.inquiryState = exports.answerState = exports.questionState = exports.setStatus = void 0;

// possible states
// inquiry: roaming around, "Return"-button is visible
// question: answer closed
// answer: answer open
// standby: in Roam
// all mutation of state is located here
const setStatus = status => {
  console.log("roamsr is entering state: " + status);
  roamsr.state = { ...roamsr.state,
    status
  };
};

exports.setStatus = setStatus;

const questionState = () => setStatus("question");

exports.questionState = questionState;

const answerState = () => setStatus("answer");

exports.answerState = answerState;

const inquiryState = () => setStatus("inquiry");

exports.inquiryState = inquiryState;

const standbyState = () => setStatus("standby");

exports.standbyState = standbyState;

const setCards = (queue, extraCards) => {
  roamsr.state = { ...roamsr.state,
    queue,
    extraCards
  };
};

exports.setCards = setCards;

const incrementCurrentCardIndex = () => {
  roamsr.state.currentIndex++;
};

exports.incrementCurrentCardIndex = incrementCurrentCardIndex;

const addCardToQueue = card => {
  roamsr.state.queue.push(card);
};

exports.addCardToQueue = addCardToQueue;

const addExtraCardToQueue = j => {
  const extraCard = roamsr.state.extraCards[j].shift();
  if (extraCard) roamsr.state.queue.push(extraCard);
};

exports.addExtraCardToQueue = addExtraCardToQueue;

const setLimitActivation = activation => {
  roamsr.state = { ...roamsr.state,
    limits: activation
  };
};

exports.setLimitActivation = setLimitActivation;

const toggleLimitActivation = () => {
  roamsr.state.limits = !roamsr.state.limits;
};

exports.toggleLimitActivation = toggleLimitActivation;

const setCurrentCardIndex = index => {
  roamsr.state.currentIndex = index;
};

exports.setCurrentCardIndex = setCurrentCardIndex;
},{}],"EWnE":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hideAnswerAndCloze = exports.showAnswerAndCloze = exports.removeRoamsrMainviewCSS = exports.setCustomStyle = exports.removeCustomStyle = exports.addBasicStyles = void 0;

var _state = require("../core/state");

const basicCSS = `
.roamsr-widget__review-button {
  color: #5C7080 !important;
}

.roamsr-widget__review-button:hover {
  color: #F5F8FA !important;
}

.roamsr-return-button-container {
  z-index: 100000;
  margin: 5px 0px 5px 45px;
}

.roamsr-wrapper {
  pointer-events: none;
  position: relative;
  bottom: 180px;
  justify-content: center;
}

.roamsr-container {
  width: 100%;
  max-width: 600px;
  justify-content: center;
  align-items: center;
  padding: 5px 20px;
}

.roamsr-button {
  z-index: 10000;
  pointer-events: all;
}

.roamsr-response-area {
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 15px;
}

.roamsr-flag-button-container {
  width: 100%;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

const addBasicStyles = () => {
  var basicStyles = Object.assign(document.createElement("style"), {
    id: "roamsr-css-basic",
    innerHTML: basicCSS
  });
  document.getElementsByTagName("head")[0].appendChild(basicStyles);
};

exports.addBasicStyles = addBasicStyles;
const roamsrCustomStyleCSSID = "roamsr-css-custom";

const removeCustomStyle = () => {
  const element = document.getElementById(roamsrCustomStyleCSSID);
  if (element) element.remove();
};

exports.removeCustomStyle = removeCustomStyle;

const setCustomStyle = () => {
  removeCustomStyle(); // Query new style

  const styleQuery = window.roamAlphaAPI.q(`[:find (pull ?style [:block/string]) :where [?roamsr :node/title "roam\/sr"] [?roamsr :block/children ?css] [?css :block/refs ?roamcss] [?roamcss :node/title "roam\/css"] [?css :block/children ?style]]`); // this is necessary because having three ` breaks Roam-code-blocks
  // other solutions have lead to the minifier appending three `

  const replaceStrPartial = "``";

  if (styleQuery && styleQuery.length != 0) {
    const customStyle = styleQuery[0][0].string.replace("`" + replaceStrPartial + "css", "").replace("`" + replaceStrPartial, "");
    const roamsrCSS = Object.assign(document.createElement("style"), {
      id: roamsrCustomStyleCSSID,
      innerHTML: customStyle
    });
    document.getElementsByTagName("head")[0].appendChild(roamsrCSS);
  }
};

exports.setCustomStyle = setCustomStyle;
const roamsrMainviewCSSID = "roamsr-css-mainview"; // we use to nearly identical functions here because they have different intentions
// as expressed in the state-set call

const removeRoamsrMainviewCSS = () => {
  const element = document.getElementById(roamsrMainviewCSSID);
  if (element) element.remove();
};

exports.removeRoamsrMainviewCSS = removeRoamsrMainviewCSS;

const showAnswerAndCloze = () => {
  // change to standby first to prevent unwanted key processing
  (0, _state.standbyState)();
  removeRoamsrMainviewCSS();
  (0, _state.answerState)();
};

exports.showAnswerAndCloze = showAnswerAndCloze;

const hideAnswerAndCloze = () => {
  removeRoamsrMainviewCSS();
  const clozeStyle = roamsr.settings.clozeStyle || "highlight";
  const style = `
    .roam-article .rm-reference-main,
    .roam-article .rm-block-children
    {
      visibility: hidden;  
    }

    .roam-article .rm-${clozeStyle} {
      background-color: #cccccc;
      color: #cccccc;
    }`;
  const basicStyles = Object.assign(document.createElement("style"), {
    id: roamsrMainviewCSSID,
    innerHTML: style
  });
  document.getElementsByTagName("head")[0].appendChild(basicStyles);
};

exports.hideAnswerAndCloze = hideAnswerAndCloze;
},{"../core/state":"A7lJ"}],"zlNU":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ankiScheduler = exports.calcNewFactorAndInterval = exports.defaultConfig = void 0;
const defaultConfig = {
  defaultFactor: 2.5,
  firstFewIntervals: [1, 6],
  factorModifier: 0.15,
  easeBonus: 1.3,
  hardFactor: 1.2,
  minFactor: 1.3,
  jitterPercentage: 0.05,
  maxInterval: 50 * 365,
  responseTexts: ["Again.", "Hard.", "Good.", "Easy."]
};
exports.defaultConfig = defaultConfig;

const getLastFail = history => history ? history.map(review => review.signal).lastIndexOf("1") : 0;

const isLearningPhase = (config, history) => history.length == 0 || history.length <= config.firstFewIntervals.length;

const getLearningPhaseResponses = (config, history) => {
  return [{
    responseText: config.responseTexts[0],
    signal: 1,
    interval: 0
  }, {
    responseText: config.responseTexts[2],
    signal: 3,
    interval: config.firstFewIntervals[history ? Math.max(history.length - 1, 0) : 0]
  }];
}; // TODO: this might be a problem because its not "totally" accurate
// https://swizec.com/blog/a-day-is-not-606024-seconds-long


const dayInMiliseconds = 1000 * 60 * 60 * 24;

const getDelay = (history, prevInterval) => {
  if (history && history.length > 1) {
    const milisecondsSincePenultimateReview = history[history.length - 1].date - history[history.length - 2].date;
    return Math.max(milisecondsSincePenultimateReview / dayInMiliseconds - prevInterval, 0);
  } else return 0;
};

const addJitter = (config, interval) => {
  const jitter = interval * config.jitterPercentage;
  return interval + (-jitter + Math.random() * jitter);
};

const calcNewFactor = (config, prevFactor, signal) => {
  switch (signal) {
    case "1":
      return prevFactor - 0.2;

    case "2":
      return prevFactor - config.factorModifier;

    case "3":
      return prevFactor;

    case "4":
      return prevFactor + config.factorModifier;

    default:
      return prevFactor;
  }
};

const calcNewInterval = (config, prevFactor, prevInterval, delay, signal) => {
  let newInterval;

  switch (signal) {
    case "1":
      newInterval = 0;
      break;

    case "2":
      newInterval = prevInterval * config.hardFactor;
      break;

    case "3":
      newInterval = (prevInterval + delay / 2) * prevFactor;
      break;

    case "4":
      newInterval = (prevInterval + delay) * prevFactor * config.easeBonus;
      break;

    default:
      newInterval = prevInterval * prevFactor;
      break;
  }

  return Math.min(newInterval, config.maxInterval);
};

const calcNewFactorAndInterval = (config, prevFactor, prevInterval, delay, signal) => {
  return [calcNewFactor(config, prevFactor, signal), calcNewInterval(config, prevFactor, prevInterval, delay, signal)];
}; // to get the last factor and interval, we go through the (signal-)history
// and simulate each decision to arrive at each intermediate factor and interval


exports.calcNewFactorAndInterval = calcNewFactorAndInterval;

const calcLastFactorAndInterval = (config, history) => {
  if (!history || history.length <= config.firstFewIntervals.length) {
    return [config.defaultFactor, config.firstFewIntervals[config.firstFewIntervals.length - 1]];
  } else {
    const [prevFactor, prevInterval] = calcLastFactorAndInterval(config, history.slice(0, -1));
    return calcNewFactorAndInterval(config, prevFactor, prevInterval, getDelay(history, prevInterval), history[history.length - 1].signal);
  }
};

const getRetainingPhaseResponse = (config, finalFactor, finalInterval, signal, history) => {
  return {
    responseText: config.responseTexts[parseInt(signal) - 1],
    signal: signal,
    interval: Math.floor(addJitter(config, calcNewInterval(config, finalFactor, finalInterval, getDelay(history, finalInterval), signal)))
  };
};

const getRetainingPhaseResponses = (config, history) => {
  const [finalFactor, finalInterval] = calcLastFactorAndInterval(config, history.slice(0, -1));
  return [getRetainingPhaseResponse(config, finalFactor, finalInterval, "1", history), getRetainingPhaseResponse(config, finalFactor, finalInterval, "2", history), getRetainingPhaseResponse(config, finalFactor, finalInterval, "3", history), getRetainingPhaseResponse(config, finalFactor, finalInterval, "4", history)];
};

const ankiScheduler = userConfig => {
  const config = Object.assign(defaultConfig, userConfig);

  const algorithm = history => {
    const lastFail = getLastFail(history);
    history = history ? lastFail == -1 ? history : history.slice(lastFail + 1) : [];

    if (isLearningPhase(config, history)) {
      return getLearningPhaseResponses(config, history);
    } else {
      return getRetainingPhaseResponses(config, history);
    }
  };

  return algorithm;
};

exports.ankiScheduler = ankiScheduler;
},{}],"TaZ9":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadCards = exports.filterCardsOverLimit = exports.isLastRelevantDeck = exports.isNew = void 0;

var _ankiScheduler = require("../schedulers/ankiScheduler");

var _helperFunctions = require("./helperFunctions");

var _uiElements = require("../ui/uiElements");

const recurDeck = part => {
  const result = []; // decks are tags, so we need to evaluate the included tags

  if (part.refs) result.push(...part.refs); // if this query result has _children, it might be a review-block
  // so to get the real tags we need to recur until we find the original

  if (part._children && part._children.length > 0) result.push(...recurDeck(part._children[0]));
  return result;
};

const getDecks = (res, settings) => {
  const possibleDecks = recurDeck(res).map(deck => deck.title);
  return possibleDecks.filter(deckTag => settings.customDecks.map(customDeck => customDeck.tag).includes(deckTag));
};

const getAlgorithm = (res, settings) => {
  const decks = getDecks(res, settings);
  let preferredDeck;

  if (decks && decks.length > 0) {
    preferredDeck = settings.customDecks.filter(customDeck => customDeck.tag == decks[decks.length - 1])[0];
  } else preferredDeck = settings.defaultDeck;

  const scheduler = preferredDeck.scheduler || preferredDeck.algorithm;
  const config = preferredDeck.config;
  let algorithm;

  if (!scheduler || scheduler === "anki") {
    algorithm = (0, _ankiScheduler.ankiScheduler)(config);
  } else algorithm = scheduler(config);

  return algorithm;
};

const isReviewBlock = block => // is a child-block
block._children && // first parent has refs
block._children[0].refs ? // refs of parent include "roam/sr/review" = parent is a review-parent-block
block._children[0].refs.map(ref2 => ref2.title).includes("roam/sr/review") : false; // first ref is always a r/x-page where x is the repetition count / signal value
// r/x -> x is done via the slice


const extractSignalFromReviewBlock = block => block.refs && block.refs[0] && block.refs[0].title.slice(2);

const reviewBlockToHistoryUnit = block => {
  return {
    date: (0, _helperFunctions.dailyPageUIDToCrossBrowserDate)(block.page.uid),
    signal: extractSignalFromReviewBlock(block),
    uid: block.uid,
    string: block.string
  };
};

const extractHistoryFromQueryResult = result => {
  // having history means that the card-block is ref'ed by at least one review block
  // that can be found nested under the "roam/sr/review"-block / review-parent-block on the respective daily-page
  if (result._refs) {
    return result._refs.filter(isReviewBlock).map(reviewBlockToHistoryUnit).sort((a, b) => a.date - b.date);
  } else return [];
};

const isDue = (card, dateBasis) => card.history.length > 0 ? // if one history unit contains no signal and fits the date, the card is due
card.history.some(review => {
  return !review.signal && new Date(review.date) <= dateBasis;
}) : true;

const srPageTagsToClause = tags => "(or " + tags.map(tag => `[?srPage :node/title "${tag}"]`).join("\n") + ")"; //cards with the flag-tag or the "query"-tag are not permissible


const createQueryForAllPermissibleCards = settings => `[
			:find (pull ?card [
			  :block/string 
			  :block/uid 
			  {:block/refs [:node/title]} 
			  {:block/_refs 
				[:block/uid :block/string 
				 {:block/_children 
						[:block/uid {:block/refs [:node/title]}]} 
				 {:block/refs [:node/title]} 
				 {:block/page [:block/uid]}]}
			  {:block/_children ...}
			])
			:where 
			  ${srPageTagsToClause(settings.mainTags)}
			  [?card :block/refs ?srPage] 
			  (not-join [?card] 
				[?flagPage :node/title "${settings.flagTag}"]
				[?card :block/refs ?flagPage])
			  (not-join [?card] 
				[?queryPage :node/title "query"]
				[?card :block/refs ?queryPage])
			]`;

const isNew = res => {
  return res._refs ? res._refs.filter(isReviewBlock).length === 0 : true;
};

exports.isNew = isNew;

const queryDueCards = async (settings, dateBasis, asyncQueryFunction) => {
  const allPermissibleCardsQuery = createQueryForAllPermissibleCards(settings);
  const allPermissibleCardsQueryResults = await asyncQueryFunction(allPermissibleCardsQuery);
  return allPermissibleCardsQueryResults.map(result => {
    let res = result[0];
    let card = {
      uid: res.uid,
      isNew: isNew(res),
      decks: getDecks(res, settings),
      algorithm: getAlgorithm(res, settings),
      string: res.string,
      history: extractHistoryFromQueryResult(res)
    };
    return card;
  }).filter(card => isDue(card, dateBasis)).filter(card => card.uid);
};

const getTodayQuery = (settings, todayUid) => `[
    :find (pull ?card 
      [:block/uid 
      {:block/refs [:node/title]} 
      {:block/_refs 
		[
			{:block/page [:block/uid]}
			{:block/_children 
				[:block/uid {:block/refs [:node/title]}]}
		]}]) 
      (pull ?review [:block/refs])
    :where 
	  ${srPageTagsToClause(settings.mainTags)}
      [?card :block/refs ?srPage] 
      [?review :block/refs ?card] 
      [?reviewPage :node/title "roam/sr/review"] 
      [?reviewParent :block/refs ?reviewPage] 
      [?reviewParent :block/children ?review] 
      [?todayPage :block/uid "${todayUid}"] 
      [?reviewParent :block/page ?todayPage] 
    ]`;

const queryTodayReviewedCards = async (settings, asyncQueryFunction) => {
  // Query for today's review
  const todayUid = (0, _helperFunctions.getRoamDate)().uid;
  const todayQuery = getTodayQuery(settings, todayUid);
  const todayQueryResult = await asyncQueryFunction(todayQuery);
  return todayQueryResult.filter(result => result[1].refs.length == 2).map(result => {
    const res = result[0];
    const card = {
      uid: res.uid,
      isNew: isNew(res),
      decks: getDecks(res, settings)
    };
    return card;
  });
};

const isLastRelevantDeck = (currentDeckTag, iterationDeckTags, cardDecksTags) => {
  // assumes the current deck tag is included in cardDecksTags
  const curTagIndex = iterationDeckTags.indexOf(currentDeckTag);
  const indicesInIteration = cardDecksTags.map(tag => iterationDeckTags.indexOf(tag));
  return indicesInIteration.filter(index => index > curTagIndex).length === 0;
};

exports.isLastRelevantDeck = isLastRelevantDeck;

const filterCardsOverLimit = (settings, cards, todayReviewedCards) => {
  const extraCards = [[], []];
  const filteredCards = [...cards];
  const resCardsUIDs = [];
  const resCards = [];
  const decks = settings.customDecks.concat(settings.defaultDeck); // to simplify the algorithm, we assume that the provided cards work with the provided limits
  // in the case of multi-deck cards this might not always be the case
  // example:
  // if we have X cards that belong to deck1 with limit X AND deck2 with limit X-1,
  // then the limit of deck2 will not be adhered to, the higher limit "wins"
  // if we have multi-deck cards AND single-deck cards,
  // then both limits might be adhered to depending on the ordering of the cards

  const deckTags = decks.map(deck => deck.tag);

  for (let deck of decks) {
    const reviewUIDs = [];
    const todayReviews = [0, 0];

    for (let i = 0; i < todayReviewedCards.length; i++) {
      const card = todayReviewedCards[i];

      if (deck.tag ? card.decks.includes(deck.tag) : card.decks.length == 0) {
        // need to check, because a card can be reviewed multiple times per day
        if (!reviewUIDs.includes(card.uid)) {
          reviewUIDs.push(card.uid);
          todayReviews[card.isNew ? 0 : 1]++;
        }
      }
    } // because we support multi-deck cards, we need to make sure we include already picked cards in the limit


    let alreadyPickedNew = 0;
    let alreadyPickedOld = 0;

    if (deck.tag) {
      const alreadyPicked = resCards.filter(card => card.decks.includes(deck.tag));
      alreadyPickedNew = alreadyPicked.filter(card => card.isNew).length;
      alreadyPickedOld = alreadyPicked.filter(card => !card.isNew).length;
    }

    const limits = [deck.newCardLimit !== undefined ? Math.max(0, deck.newCardLimit - todayReviews[0] - alreadyPickedNew) : Infinity, deck.reviewLimit !== undefined ? Math.max(0, deck.reviewLimit - todayReviews[1] - alreadyPickedOld) : Infinity];

    for (let i = filteredCards.length - 1; i >= 0; i--) {
      const card = filteredCards[i];

      if (deck.tag ? card.decks.includes(deck.tag) : card.decks.length == 0) {
        const j = card.isNew ? 0 : 1; // with multi-deck cards its possible that the card was already added
        // because we include this case in the limits, we dont need to do anything

        if (!resCardsUIDs.includes(card.uid)) {
          if (limits[j] === Infinity || limits[j] > 0) {
            resCards.push(card); // for performance we maintain a second UID arr

            resCardsUIDs.push(card.uid);

            if (limits[j] !== Infinity) {
              limits[j]--;
            }
          } else {
            // card is only in default deck
            if (!deck.tag) {
              extraCards[j].push(card);
            } // if multiple decks then only the last deck should put it into the extraCards
            // because otherwise a different deck might be able to still use it!
            else if (card.decks.length > 1) {
                if (isLastRelevantDeck(deck.tag, deckTags, card.decks)) {
                  extraCards[j].push(card);
                }
              } else {
                // single deck case
                extraCards[j].push(card);
              }
          }
        }
      }
    }
  }

  return {
    extraCards,
    filteredCards: resCards
  };
};

exports.filterCardsOverLimit = filterCardsOverLimit;

const loadCards = async (hasLimits, settings, asyncQueryFunction, dateBasis = new Date()) => {
  (0, _uiElements.setLoading)(true);
  await (0, _helperFunctions.sleep)(50);
  let cards = await queryDueCards(settings, dateBasis, asyncQueryFunction);
  const todayReviewedCards = await queryTodayReviewedCards(settings, asyncQueryFunction);
  (0, _uiElements.setLoading)(false);
  let extraCardsResult;

  if (hasLimits) {
    const {
      extraCards,
      filteredCards
    } = filterCardsOverLimit(settings, cards, todayReviewedCards);
    extraCardsResult = extraCards;
    cards = filteredCards;
  } else {
    extraCardsResult = [[], []];
  }

  if (settings.startWithNewCards) {
    cards.sort((a, b) => a.history.length - b.history.length);
    extraCardsResult[0].sort((a, b) => a.history.length - b.history.length);
    extraCardsResult[1].sort((a, b) => a.history.length - b.history.length);
  } else {
    cards.sort((a, b) => b.history.length - a.history.length);
    extraCardsResult[0].sort((a, b) => b.history.length - a.history.length);
    extraCardsResult[1].sort((a, b) => b.history.length - a.history.length);
  }

  return {
    extraCards: extraCardsResult,
    cards
  };
};

exports.loadCards = loadCards;
},{"../schedulers/ankiScheduler":"zlNU","./helperFunctions":"zviG","../ui/uiElements":"b2AS"}],"b2AS":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setLoading = exports.addWidget = exports.addDelimiter = exports.removeReturnButton = exports.addReturnButton = exports.addResponseButtons = exports.addShowAnswerButton = exports.clearAndGetResponseArea = exports.removeContainer = exports.addContainer = exports.updateCounters = exports.getCounter = void 0;

var _helperFunctions = require("../core/helperFunctions");

var _loadingCards = require("../core/loadingCards");

var _mainFunctions = require("../core/mainFunctions");

var _sessions = require("../core/sessions");

var _state = require("../core/state");

var _styles = require("./styles");

// COMMON
const getCounter = (state, deck) => {
  // Getting the number of new cards
  var cardCount = [0, 0];

  if (state.queue) {
    var remainingQueue = state.queue.slice(Math.max(state.currentIndex, 0));
    var filteredQueue = !deck ? remainingQueue : remainingQueue.filter(card => card.decks.includes(deck));
    cardCount = filteredQueue.reduce((a, card) => {
      if (card.isNew) a[0]++;else a[1]++;
      return a;
    }, [0, 0]);
  } // Create the element


  var counter = Object.assign(document.createElement("div"), {
    className: "roamsr-counter",
    innerHTML: `<span style="color: dodgerblue; padding-right: 8px">` + cardCount[0] + `</span> <span style="color: green;">` + cardCount[1] + `</span>`
  });
  return counter;
};

exports.getCounter = getCounter;

const updateCounters = state => {
  document.querySelectorAll(".roamsr-counter").forEach(counter => {
    counter.innerHTML = getCounter(state).innerHTML;
    counter.style.cssText = !state.limits ? "font-style: italic;" : "font-style: inherit;";
  });
}; // CONTAINER


exports.updateCounters = updateCounters;

const addContainer = state => {
  if (!document.querySelector(".roamsr-container")) {
    var wrapper = Object.assign(document.createElement("div"), {
      className: "flex-h-box roamsr-wrapper"
    });
    var container = Object.assign(document.createElement("div"), {
      className: "flex-v-box roamsr-container"
    });
    var flagButtonContainer = Object.assign(document.createElement("div"), {
      className: "flex-h-box roamsr-flag-button-container"
    });
    var flagButton = Object.assign(document.createElement("button"), {
      className: "bp3-button roamsr-button",
      innerHTML: "Flag.",
      onclick: async () => {
        await (0, _mainFunctions.flagCard)();
        (0, _mainFunctions.stepToNext)();
      }
    });
    var skipButton = Object.assign(document.createElement("button"), {
      className: "bp3-button roamsr-button",
      innerHTML: "Skip.",
      onclick: _mainFunctions.stepToNext
    });
    flagButtonContainer.style.cssText = "justify-content: space-between;";
    flagButtonContainer.append(flagButton, skipButton);
    var responseArea = Object.assign(document.createElement("div"), {
      className: "flex-h-box roamsr-container__response-area"
    });
    container.append(getCounter(state), responseArea, flagButtonContainer);
    wrapper.append(container);
    var bodyDiv = document.querySelector(".roam-body-main");
    bodyDiv.append(wrapper);
  }
};

exports.addContainer = addContainer;

const removeContainer = () => {
  (0, _helperFunctions.removeSelector)(".roamsr-wrapper");
};

exports.removeContainer = removeContainer;

const clearAndGetResponseArea = () => {
  var responseArea = document.querySelector(".roamsr-container__response-area");
  if (responseArea) responseArea.innerHTML = "";
  return responseArea;
};

exports.clearAndGetResponseArea = clearAndGetResponseArea;

const addShowAnswerButton = () => {
  var responseArea = clearAndGetResponseArea();
  var showAnswerAndClozeButton = Object.assign(document.createElement("button"), {
    className: "bp3-button roamsr-container__response-area__show-answer-button roamsr-button",
    innerHTML: "Show answer.",
    onclick: () => {
      (0, _styles.showAnswerAndCloze)();
      addResponseButtons();
    }
  });
  showAnswerAndClozeButton.style.cssText = "margin: 5px;";
  responseArea.append(showAnswerAndClozeButton);
};

exports.addShowAnswerButton = addShowAnswerButton;

const addResponseButtons = () => {
  var responseArea = clearAndGetResponseArea(); // Add new responses

  var responses = (0, _sessions.getCurrentCard)().algorithm((0, _sessions.getCurrentCard)().history);

  for (let res of responses) {
    var responseButton = Object.assign(document.createElement("button"), {
      id: "roamsr-response-" + res.signal,
      className: "bp3-button roamsr-container__response-area__response-button roamsr-button",
      innerHTML: res.responseText + "<sup>" + (0, _helperFunctions.getIntervalHumanReadable)(res.interval) + "</sup>",
      onclick: async () => {
        if (res.interval != 0) {
          (0, _mainFunctions.responseHandler)((0, _sessions.getCurrentCard)(), res.interval, res.signal.toString());
        } else {
          await (0, _mainFunctions.responseHandler)((0, _sessions.getCurrentCard)(), res.interval, res.signal.toString());
        }

        (0, _mainFunctions.stepToNext)();
      }
    });
    responseButton.style.cssText = "margin: 5px;";
    responseArea.append(responseButton);
  }
}; // RETURN BUTTON


exports.addResponseButtons = addResponseButtons;

const addReturnButton = () => {
  var returnButtonClass = "roamsr-return-button-container";
  if (document.querySelector(returnButtonClass)) return;
  var main = document.querySelector(".roam-main");
  var body = document.querySelector(".roam-body-main");
  var returnButtonContainer = Object.assign(document.createElement("div"), {
    className: "flex-h-box " + returnButtonClass
  });
  var returnButton = Object.assign(document.createElement("button"), {
    className: "bp3-button bp3-large roamsr-return-button",
    innerText: "Return.",
    onclick: _mainFunctions.goToCurrentCard
  });
  returnButtonContainer.append(returnButton);
  main.insertBefore(returnButtonContainer, body);
};

exports.addReturnButton = addReturnButton;

const removeReturnButton = () => {
  (0, _helperFunctions.removeSelector)(".roamsr-return-button-container");
}; // SIDEBAR WIDGET


exports.removeReturnButton = removeReturnButton;

const pushBeforeStarredPages = element => {
  var sidebar = document.querySelector(".roam-sidebar-content");
  var starredPages = document.querySelector(".starred-pages-wrapper");
  sidebar.insertBefore(element, starredPages);
};

const addDelimiter = () => {
  (0, _helperFunctions.removeSelector)(".roamsr-widget-delimiter");
  var delimiter = Object.assign(document.createElement("div"), {
    className: "roamsr-widget-delimiter"
  });
  delimiter.style.cssText = "flex: 0 0 1px; background-color: rgb(57, 75, 89); margin: 8px 20px;";
  pushBeforeStarredPages(delimiter);
};

exports.addDelimiter = addDelimiter;

const createWidgetContainer = () => {
  var widgetContainer = Object.assign(document.createElement("div"), {
    className: "log-button flex-h-box roamsr-widget"
  });
  widgetContainer.style.cssText = "align-items: center; justify-content: space-around; padding-top: 8px; height: 47px;";
  return widgetContainer;
};

const createWidgetContent = () => {
  var widgetContent = Object.assign(document.createElement("div"), {
    className: "flex-h-box roamsr-widget__content"
  });
  widgetContent.style.cssText = "align-items: center; justify-content: space-around; width: 100%;";
  var reviewButton = Object.assign(document.createElement("div"), {
    className: "bp3-button bp3-minimal roamsr-widget__review-button",
    innerHTML: `<span style="padding-right: 8px;"><svg width="16" height="16" version="1.1" viewBox="0 0 4.2333 4.2333" style="color:5c7080;">
  <g id="chat_1_" transform="matrix(.26458 0 0 .26458 115.06 79.526)">
    <g transform="matrix(-.79341 0 0 -.88644 -420.51 -284.7)" fill="currentColor">
      <path d="m6 13.665c-1.1 0-2-1.2299-2-2.7331v-6.8327h-3c-0.55 0-1 0.61495-1 1.3665v10.932c0 0.7516 0.45 1.3665 1 1.3665h9c0.55 0 1-0.61495 1-1.3665l-5.04e-4 -1.5989v-1.1342h-0.8295zm9-13.665h-9c-0.55 0-1 0.61495-1 1.3665v9.5658c0 0.7516 0.45 1.3665 1 1.3665h9c0.55 0 1-0.61495 1-1.3665v-9.5658c0-0.7516-0.45-1.3665-1-1.3665z"
        clip-rule="evenodd" fill="currentColor" fill-rule="evenodd" />
    </g>
  </g></svg></span> REVIEW`,
    //  <span class="bp3-icon bp3-icon-chevron-down expand-icon"></span>`
    onclick: _sessions.startSession
  });
  reviewButton.style.cssText = "padding: 2px 8px;";
  var counter = Object.assign(getCounter(roamsr.state), {
    className: "bp3-button bp3-minimal roamsr-counter",
    onclick: async () => {
      (0, _state.toggleLimitActivation)();
      const {
        cards,
        extraCards
      } = await (0, _loadingCards.loadCards)(roamsr.state.limits, roamsr.settings, window.roamAlphaAPI.q);
      (0, _state.setCards)(cards, extraCards);
      updateCounters(roamsr.state);
    }
  });
  var counterContainer = Object.assign(document.createElement("div"), {
    className: "flex-h-box roamsr-widget__counter"
  });
  counterContainer.style.cssText = "justify-content: center; width: 50%";
  counterContainer.append(counter);
  widgetContent.append(reviewButton, counterContainer);
  return widgetContent;
};

const addWidget = () => {
  if (!document.querySelector(".roamsr-widget")) {
    var widgetContainer = createWidgetContainer();
    var widgetContent = createWidgetContent();
    widgetContainer.append(widgetContent);
    pushBeforeStarredPages(widgetContainer);
  }
};

exports.addWidget = addWidget;

const createLoader = () => {
  return Object.assign(document.createElement("div"), {
    classList: "loader"
  });
};

const setLoading = loading => {
  var widgetContainer = document.querySelector(".roamsr-widget");

  if (widgetContainer) {
    if (loading) {
      widgetContainer.innerHTML = createLoader().outerHTML;
    } else {
      widgetContainer.innerHTML = "";
      widgetContainer.append(createWidgetContent());
    }
  }
};

exports.setLoading = setLoading;
},{"../core/helperFunctions":"zviG","../core/loadingCards":"TaZ9","../core/mainFunctions":"i1em","../core/sessions":"fFPn","../core/state":"A7lJ","./styles":"EWnE"}],"i1em":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.goToCurrentCard = exports.stepToNext = exports.flagCard = exports.responseHandler = exports.scheduleCardIn = void 0;

var _helperFunctions = require("./helperFunctions");

var _sessions = require("./sessions");

var _state = require("./state");

var _styles = require("../ui/styles");

var _uiElements = require("../ui/uiElements");

const scheduleCardIn = async (card, interval) => {
  var nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);
  var nextRoamDate = (0, _helperFunctions.getRoamDate)(nextDate); // Create daily note if it doesn't exist yet

  await window.roamAlphaAPI.createPage({
    page: {
      title: nextRoamDate.title
    }
  });
  await (0, _helperFunctions.sleep)(); // Query for the [[roam/sr/review]] block

  var queryReviewBlock = window.roamAlphaAPI.q('[:find (pull ?reviewBlock [:block/uid]) :in $ ?dailyNoteUID :where [?reviewBlock :block/refs ?reviewPage] [?reviewPage :node/title "roam/sr/review"] [?dailyNote :block/children ?reviewBlock] [?dailyNote :block/uid ?dailyNoteUID]]', nextRoamDate.uid); // Check if it's there; if not, create it

  var topLevelUid;

  if (queryReviewBlock.length == 0) {
    topLevelUid = (0, _helperFunctions.createUid)();
    await window.roamAlphaAPI.createBlock({
      location: {
        "parent-uid": nextRoamDate.uid,
        order: 0
      },
      block: {
        string: "[[roam/sr/review]]",
        uid: topLevelUid
      }
    });
    await (0, _helperFunctions.sleep)();
  } else {
    topLevelUid = queryReviewBlock[0][0].uid;
  } // Generate the block


  var block = {
    uid: (0, _helperFunctions.createUid)(),
    string: "((" + card.uid + "))"
  }; // Finally, schedule the card

  await window.roamAlphaAPI.createBlock({
    location: {
      "parent-uid": topLevelUid,
      order: 0
    },
    block: block
  });
  await (0, _helperFunctions.sleep)();
  return {
    date: nextRoamDate.uid,
    signal: null,
    uid: block.uid,
    string: block.string
  };
};

exports.scheduleCardIn = scheduleCardIn;

const responseHandler = async (card, interval, signal) => {
  console.log("Signal: " + signal + ", Interval: " + interval);
  var hist = card.history; // If new card, make it look like it was scheduled for today

  if (hist.length == 0 || hist[hist.length - 1] && hist[hist.length - 1].date !== new Date()) {
    var last = hist.pop();

    if (last) {
      await window.roamAlphaAPI.deleteBlock({
        block: {
          uid: last.uid
        }
      });
    }

    var todayReviewBlock = await scheduleCardIn(card, 0);
    hist.push(todayReviewBlock);
  } // Record response


  var last = hist.pop();
  last.string = last.string + " #[[r/" + signal + "]]";
  last.signal = signal;
  await window.roamAlphaAPI.updateBlock({
    block: {
      uid: last.uid,
      string: last.string
    }
  });
  hist.push(last); // Schedule card to future

  var nextReview = await scheduleCardIn(card, interval);
  hist.push(nextReview); // If it's scheduled for today, add it to the end of the queue

  if (interval == 0) {
    var newCard = card;
    newCard.history = hist;
    newCard.isNew = false;
    (0, _state.addCardToQueue)(newCard);
  }
};

exports.responseHandler = responseHandler;

const flagCard = async () => {
  const card = (0, _sessions.getCurrentCard)();
  await window.roamAlphaAPI.updateBlock({
    block: {
      uid: card.uid,
      string: card.string + " #" + roamsr.settings.flagTag
    }
  });
  const j = (0, _sessions.getCurrentCard)().isNew ? 0 : 1;
  (0, _state.addExtraCardToQueue)(j);
  await stepToNext();
};

exports.flagCard = flagCard;

const stepToNext = async () => {
  if (roamsr.state.currentIndex + 1 >= roamsr.state.queue.length) {
    (0, _sessions.endSession)();
  } else {
    (0, _state.incrementCurrentCardIndex)();
    goToCurrentCard();
  }

  (0, _uiElements.updateCounters)(roamsr.state);
};

exports.stepToNext = stepToNext;

const goToCurrentCard = async () => {
  // change to standby first to prevent unwanted key processing
  (0, _state.standbyState)();

  window.onhashchange = () => {};

  (0, _styles.hideAnswerAndCloze)();
  (0, _uiElements.removeReturnButton)();

  var doStuff = async () => {
    (0, _helperFunctions.goToUid)((0, _sessions.getCurrentCard)().uid);
    await (0, _helperFunctions.sleep)(50);
    (0, _uiElements.addContainer)(roamsr.state);
    (0, _uiElements.addShowAnswerButton)();
  };

  await doStuff();
  (0, _state.questionState)();
  await (0, _helperFunctions.sleep)(200);
  await doStuff();

  window.onhashchange = () => {
    (0, _state.inquiryState)();
    (0, _uiElements.removeContainer)();
    (0, _uiElements.addReturnButton)();
    (0, _styles.removeRoamsrMainviewCSS)();

    window.onhashchange = () => {};
  };
};

exports.goToCurrentCard = goToCurrentCard;
},{"./helperFunctions":"zviG","./sessions":"fFPn","./state":"A7lJ","../ui/styles":"EWnE","../ui/uiElements":"b2AS"}],"unAC":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeKeyListener = exports.addKeyListener = exports.processKeyAlways = exports.processKey = void 0;

var _mainFunctions = require("./mainFunctions");

var _sessions = require("./sessions");

var _styles = require("../ui/styles");

var _uiElements = require("../ui/uiElements");

const questionAndAnswerCodeMap = {
  KeyF: _mainFunctions.flagCard,
  KeyS: e => {
    if (!e.ctrlKey && !e.shiftKey) (0, _mainFunctions.stepToNext)();
  },
  KeyD: e => {
    // TODO: this does not work in any version because alt+d is opening the daily page
    if (e.altKey) (0, _sessions.endSession)();
  }
};
const questionCodeMap = {
  Space: () => {
    (0, _styles.showAnswerAndCloze)();
    (0, _uiElements.addResponseButtons)();
  },
  ...questionAndAnswerCodeMap
};

const handleNthResponse = async (n, responses) => {
  console.log("Handling response: " + n); // TODO: we shouldnt need to check for having responses because we are in the answer-state

  if (n >= 0) {
    const res = responses[n];
    await (0, _mainFunctions.responseHandler)((0, _sessions.getCurrentCard)(), res.interval, res.signal.toString());
    await (0, _mainFunctions.stepToNext)();
  }
};

const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const handleDigitResponse = digit => {
  var responses = (0, _sessions.getCurrentCard)().algorithm((0, _sessions.getCurrentCard)().history);
  var n = Math.min(digit - 1, responses.length - 1);
  handleNthResponse(n, responses);
};

const digitsCodeMap = Object.fromEntries(digits.map(digit => ["Digit" + digit, () => handleDigitResponse(digit)]));
const letters = ["KeyH", "KeyJ", "KeyK", "KeyL"];

const handleLetterResponse = letter => {
  var responses = (0, _sessions.getCurrentCard)().algorithm((0, _sessions.getCurrentCard)().history);
  var n = Math.min(letters.indexOf(letter), responses.length - 1);
  handleNthResponse(n, responses);
};

const lettersCodeMap = Object.fromEntries(letters.map(letter => [letter, () => handleLetterResponse(letter)]));
const answerCodeMap = { ...digitsCodeMap,
  ...lettersCodeMap,
  ...questionAndAnswerCodeMap,
  Space: () => handleDigitResponse(3)
};
const statusCodeMaps = {
  question: questionCodeMap,
  answer: answerCodeMap
}; // note: changing these requires reloading Roam because of the keylistener

const processKey = e => {
  // if we are editing, dont process
  if (document.activeElement.type === "textarea" || document.activeElement.type === "input") return; // this is not be necessary anymore because we have status
  // !location.href.includes(getCurrentCard().uid)

  const statusCodeMap = statusCodeMaps[roamsr.state.status];

  if (statusCodeMap) {
    const func = statusCodeMap[e.code];

    if (func) {
      func(e);
    }
  }
};

exports.processKey = processKey;

const processKeyAlways = e => {// TODO: Alt+enter
};

exports.processKeyAlways = processKeyAlways;

const addKeyListener = () => {
  document.addEventListener("keydown", processKey);
};

exports.addKeyListener = addKeyListener;

const removeKeyListener = () => {
  document.removeEventListener("keydown", processKey);
};

exports.removeKeyListener = removeKeyListener;
},{"./mainFunctions":"i1em","./sessions":"fFPn","../ui/styles":"EWnE","../ui/uiElements":"b2AS"}],"DeCO":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hideLeftSidebar = exports.showLeftSidebar = void 0;

var _helperFunctions = require("../core/helperFunctions");

// simulateClick by Viktor Tabori
const simulateMouseEvents = (element, events, opts) => {
  setTimeout(function () {
    events.forEach(function (type) {
      var _event = new MouseEvent(type, {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1,
        ...opts
      });

      _event.simulated = true;
      element.dispatchEvent(_event);
    });
  }, 0);
};

const showLeftSidebar = async () => {
  var firstButton = document.querySelector(".bp3-icon-menu");
  console.log(firstButton);

  if (firstButton) {
    simulateMouseEvents(firstButton, ["mouseover"]);
    await (0, _helperFunctions.sleep)(150);
    var secondButton = document.querySelector(".bp3-icon-menu-open");
    secondButton.click();
  }
};

exports.showLeftSidebar = showLeftSidebar;

const hideLeftSidebar = () => {
  try {
    document.getElementsByClassName("bp3-icon-menu-closed")[0].click();
  } catch (e) {}
};

exports.hideLeftSidebar = hideLeftSidebar;
},{"../core/helperFunctions":"zviG"}],"fFPn":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.endSession = exports.startSession = exports.getCurrentCard = exports.loadState = exports.loadSettings = void 0;

var _helperFunctions = require("./helperFunctions");

var _keybindings = require("./keybindings");

var _loadingCards = require("./loadingCards");

var _mainFunctions = require("./mainFunctions");

var _state = require("./state");

var _styles = require("../ui/styles");

var _uiElements = require("../ui/uiElements");

var _hidingSidebar = require("../ui/hiding-sidebar");

const defaultSettings = {
  closeLeftSideBar: true,
  startWithNewCards: true,
  mainTags: ["sr"],
  flagTag: "f",
  clozeStyle: "highlight",
  // "highlight" or "block-ref"
  defaultDeck: {
    algorithm: null,
    config: {},
    newCardLimit: 20,
    reviewLimit: 100
  },
  customDecks: []
};

const loadSettings = () => {
  roamsr.settings = Object.assign(defaultSettings, window.roamsrUserSettings);

  if (roamsr.settings.mainTag) {
    roamsr.settings.mainTags = [roamsr.settings.mainTag];
  }
};

exports.loadSettings = loadSettings;

const loadState = async i => {
  (0, _state.setLimitActivation)(true);
  (0, _state.setCurrentCardIndex)(i);
  const {
    cards,
    extraCards
  } = await (0, _loadingCards.loadCards)(roamsr.state.limits, roamsr.settings, window.roamAlphaAPI.q);
  (0, _state.setCards)(cards, extraCards);
  (0, _uiElements.updateCounters)(roamsr.state);
  return;
};

exports.loadState = loadState;

const getCurrentCard = () => {
  var card = roamsr.state.queue[roamsr.state.currentIndex];
  return card ? card : {};
};

exports.getCurrentCard = getCurrentCard;

const startSession = async () => {
  if (roamsr.state) {
    loadSettings();
    await loadState(0);

    if (roamsr.state.queue.length > 0) {
      console.log("Starting session.");
      (0, _styles.setCustomStyle)();

      if (roamsr.settings.closeLeftSideBar) {
        (0, _hidingSidebar.hideLeftSidebar)();
      }

      console.log("The queue: ");
      console.log(roamsr.state.queue);
      await (0, _mainFunctions.goToCurrentCard)();
      (0, _keybindings.addKeyListener)(); // Change widget

      var widget = document.querySelector(".roamsr-widget");
      widget.innerHTML = "<div class='flex-h-box' style='padding: 5px 0px; width: 100%; height: 100%; align-items: center; justify-content: space-around'><div><span class='bp3-icon bp3-icon-cross'></span> END SESSION</div></div>";
      widget.firstChild.onclick = endSession;
    }
  }
};

exports.startSession = startSession;

const endSession = async () => {
  window.onhashchange = () => {};

  console.log("Ending session.");
  (0, _state.standbyState)();
  (0, _uiElements.setLoading)(true); // Remove elements

  var doStuff = async () => {
    (0, _uiElements.removeContainer)();
    (0, _uiElements.removeReturnButton)();
    (0, _styles.removeCustomStyle)();
    (0, _styles.removeRoamsrMainviewCSS)();
    (0, _keybindings.removeKeyListener)();
    await (0, _hidingSidebar.showLeftSidebar)();
    (0, _helperFunctions.goToUid)();
  };

  await doStuff();
  await (0, _helperFunctions.sleep)(200);
  await doStuff(); // ... again to make sure

  await (0, _helperFunctions.sleep)(300); // Reload state

  await loadState(-1);
};

exports.endSession = endSession;
},{"./helperFunctions":"zviG","./keybindings":"unAC","./loadingCards":"TaZ9","./mainFunctions":"i1em","./state":"A7lJ","../ui/styles":"EWnE","../ui/uiElements":"b2AS","../ui/hiding-sidebar":"DeCO"}],"jW7e":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buttonClickHandler = void 0;

const buttonClickHandler = async e => {
  if (e.target.tagName === "BUTTON") {
    const text = e.target.textContent;

    if (roamsr.settings.mainTags.some(tag => tag === text)) {
      const block = e.target.closest(".roam-block");

      if (block) {
        const uid = block.id.substring(block.id.length - 9);
        const q = `[:find (pull ?page
						[{:block/children [:block/uid :block/string]}])
					:in $ ?uid
					:where [?page :block/uid ?uid]]`;
        const results = await window.roamAlphaAPI.q(q, uid);
        if (results.length == 0) return;
        const children = results[0][0].children;

        for (let child of children) {
          window.roamAlphaAPI.updateBlock({
            block: {
              uid: child.uid,
              string: child.string.trim() + " #" + text
            }
          });
        }
      }
    }
  }
};

exports.buttonClickHandler = buttonClickHandler;
},{}],"epB2":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = void 0;

var _sessions = require("./core/sessions");

var _srButton = require("./ui/srButton");

var _state = require("./core/state");

var _styles = require("./ui/styles");

var _uiElements = require("./ui/uiElements");

/* roam/sr - Spaced Repetition in Roam Research
   Author: Adam Krivka
   v1.1.0
   https://github.com/aidam38/roamsr
 */
const init = () => {
  var VERSION = "v1.1.0";
  if (!window.roamsr) window.roamsr = {
    state: {},
    settings: {}
  };
  console.log("🗃️ Loading roam/sr " + VERSION + ".");
  (0, _state.standbyState)();
  document.addEventListener("click", _srButton.buttonClickHandler, false);
  (0, _sessions.loadSettings)();
  (0, _styles.addBasicStyles)();
  (0, _sessions.loadState)(-1).then(() => {
    (0, _uiElements.addDelimiter)();
    (0, _uiElements.addWidget)();
  });
  console.log("🗃️ Successfully loaded roam/sr " + VERSION + ".");
};

exports.init = init;
init();
},{"./core/sessions":"fFPn","./ui/srButton":"jW7e","./core/state":"A7lJ","./ui/styles":"EWnE","./ui/uiElements":"b2AS"}]},{},["epB2"], null)