const express = require('express');
const app = express();

const caesarShift = function (text, shift) {
    if (shift < 0) return caesarShift(text, shift + 26);
    
    let r = "";
    for (var i = 0; i < text.length; i++) {
      let c = text[i];
      if (c.match(/[a-z]/i)) {
        let code = text.charCodeAt(i);
        if (code >= 65 && code <= 90) {
          c = String.fromCharCode(((code - 65 + shift) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
          c = String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
      }
      r += c;
    }
  
    return r;
};

const generateLottoString = function (s,u,l,a){
    return `<pre>${s}\nYour Numbers: ${u.join(" ")}\nLotto numbers: ${l.join(" ")}\nYou matched: ${a}</pre>`;
}

app.get('/', (req, res) => {
  res.send('Hello Express!');
});

app.get('/sum', (req, res) => {
    const a = req.query.a;
    const b = req.query.b;
  
    if(!a) return res.status(400).send('Please provide a');
  
    if(!b) return res.status(400).send('Please provide b');
    
    const c = parseFloat(a) + parseFloat(b);

    const r = `The sum of ${a} and ${b} is ${c}`;
  
    res.send(r);
});

app.get('/cipher', (req, res) => {
    const text = req.query.text;
    const shift = req.query.shift;
  
    if(!text) return res.status(400).send('Please provide text');
  
    if(!shift) return res.status(400).send('Please provide shift');
  
    res.send(caesarShift(text,shift));
});

app.get('/lotto', (req, res) => {
    const nums = req.query.numbers;
  
    if(!nums) return res.status(400).send('Please provide numbers');
    
    const uniq = nums.filter((v,i,s) => s.indexOf(v) === i).filter( q => !isNaN(parseInt(q)) ).map( q => parseInt(q) );

    if(uniq.length !== 6) return res.status(400).send('Please specify exactly 6 unique numbers');

    const numbers = Array(20).fill().map((_, index) => index + 1);
    numbers.sort(() => Math.random() - 0.5);

    const lotto = numbers.slice(0,6);
    lotto.sort( (a,b)=> a - b );
    uniq.sort( (a,b)=> a - b );
    
    const amountRight = uniq.reduce( (a,n) => a += (lotto.includes(n) ? 1 : 0), 0 )

    const s1 = "Sorry, you lose";
    const s2 = "Congratulations, you win a free ticket";
    const s3 = "Congratulations! You win $100!";
    const s4 = "Wow! Unbelievable! You could have won the mega millions!";

    if(amountRight === 4) return res.send(generateLottoString(s2,uniq,lotto,amountRight));
    if(amountRight === 5) return res.send(generateLottoString(s3,uniq,lotto,amountRight));
    if(amountRight === 6) return res.send(generateLottoString(s4,uniq,lotto,amountRight));

    res.send(generateLottoString(s1,uniq,lotto,amountRight));
});

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
});
  