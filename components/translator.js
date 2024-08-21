const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

class Translator {
  americanToBritish(text, shouldHighlight = false) {
    let spanTextFP = "";
    let spanTextSP = "";
    if (shouldHighlight) {
      spanTextFP = '<span class="highlight">';
      spanTextSP = "</span>";
    }

    let i = 0;
    let wordArr = [];
    for (const word in americanOnly) {
      const regex = new RegExp(`\\b${word}\\b`, "ig");
      if (regex.test(text)) {
        text = text.replace(regex, `PL(${i})`);
        wordArr.push(americanOnly[word]);
        i++;
      }
    }

    for (const word in americanToBritishSpelling) {
      const regex = new RegExp(`\\b${word}\\b`, "ig");
      if (regex.test(text)) {
        text = text.replace(regex, `PL(${i})`);
        wordArr.push(americanToBritishSpelling[word]);
        i++;
      }
    }

    for (const word in americanToBritishTitles) {
      const britishTitle =
        americanToBritishTitles[word][0].toUpperCase() +
        americanToBritishTitles[word].substring(1);
      const regex = new RegExp("\\b" + word.replace(".", "\\.") + " ", "ig");
      if (regex.test(text)) {
        text = text.replaceAll(regex, `PL(${i}) `);
        wordArr.push(britishTitle);
        i++;
      }
    }

    text = text.replace(/(\d?\d):(\d\d?)/g, `${spanTextFP}$1.$2${spanTextSP}`);

    wordArr.forEach(
      (x, i) =>
        (text = text.replaceAll(`PL(${i})`, spanTextFP + x + spanTextSP))
    );

    return text;
  }

  britishToAmerican(text, shouldHighlight = false) {
    let spanTextFP = "";
    let spanTextSP = "";
    if (shouldHighlight) {
      spanTextFP = '<span class="highlight">';
      spanTextSP = "</span>";
    }

    let i = 0;
    let wordArr = [];

    for (const word in britishOnly) {
      const regex = new RegExp(`\\b${word}\\b`, "ig");
      if (regex.test(text)) {
        text = text.replace(regex, `PL(${i})`);
        wordArr.push(britishOnly[word]);
        i++;
      }
    }

    for (const [americanSpelling, britishSpelling] of Object.entries(
      americanToBritishSpelling
    )) {
      const regex = new RegExp(`\\b${britishSpelling}\\b`, "ig");
      if (regex.test(text)) {
        text = text.replace(regex, `PL(${i})`);
        wordArr.push(americanSpelling);
        i++;
      }
    }

    for (const [americanTitle, britishTitle] of Object.entries(
      americanToBritishTitles
    )) {
      const titleRegex = new RegExp(`\\b${britishTitle} `, "gi");
      const title = americanTitle[0].toUpperCase() + americanTitle.substring(1);
      if (titleRegex.test(text)) {
        text = text.replaceAll(titleRegex, `PL(${i}) `);
        wordArr.push(title);
        i++;
      }
    }

    text = text.replace(/(\d?\d)\.(\d\d?)/g, `${spanTextFP}$1:$2${spanTextSP}`);

    wordArr.forEach(
      (x, i) =>
        (text = text.replaceAll(`PL(${i})`, spanTextFP + x + spanTextSP))
    );

    return text;
  }

  translate(text, locale) {
    if (locale === "american-to-british") {
      return this.americanToBritish(text, true);
    } else if (locale === "british-to-american") {
      return this.britishToAmerican(text, true);
    } else {
      return null;
    }
  }
}
module.exports = Translator;
/*
text = `Mangoes are my favorite favorite fruit.
I ate yogurt for breakfast.
We had a party at my friend's condo. 
Can you toss this in the trashcan for me? 
The parking lot was full. 
Like a high tech Rube Goldberg machine. 
To play hooky means to skip class or work. 
No Mr. Bond, I expect you to die. 
Dr. Grosh will see you now. 
Lunch is at 12:15 today. 



We watched the footie match for a while. 
Paracetamol takes up to an hour to work. 
First, caramelise the onions. 
I spent the bank holiday at the funfair.
I had a bicky then went to the chippy.
I've just got bits and bobs in my bum bag.
The car boot sale at Boxted Airfield was called off. 
Have you met Mrs Kalyani? 
Prof Joyner of King's College, London. 
Tea time is usually around 4 or 4.30.  `;
t = new Translator();
console.log(t.britishToAmerican(text));
*/
