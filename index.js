const keywordsArray = require('./data.json');
const words = require('an-array-of-dutch-words');
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: '' });

var results = [];
var fs = require('fs');

function saved() {
  console.log('saved')
}

var i = 0;

function delayedLoop () {
   setTimeout(function () {
      var keyword = words[i].toLowerCase();
      
      client.search({
        index: 'achtachtacht',
        body: { 'query': {
          'bool': {
            'must': [{
              'simple_query_string': {
                'fields': [
                  'line'
                ],
                'query': '"' + keyword + '"'
              }
            }]}}} 
      }, (err, result) => {
        var amountResults = result.body.hits.total;
        if (err) console.log(err)
        if (amountResults < 30) {
        } else {
          console.log('meer dan 30 ', keyword + ' ' + amountResults)
          results.push(keyword)
          var json = JSON.stringify(results);
          fs.writeFile('results_words.json', json, 'utf8', saved);
        }
      })

      i++;
      if (i < words.length) {
         delayedLoop();
      }                    
   }, 30)
}

delayedLoop();                    
