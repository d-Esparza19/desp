const e = require('express');
const express = require('express');
const app     = express();
var async = require('express-async-await');
const fetch = require('node-fetch');

const port    = 3000;



app.use(express.static("public"));
app.set('view engine', 'ejs');

// Root
app.get('/', async(req, res) => {
  (async function () { // async function expression assigned to a variable
    var jsonData;
  
    async function getGit(){
      let url = 'https://api.github.com/users/d-esparza19/events';
  
      return fetch(url).then(res => res.json()).then(response =>{
        jsonData = response;
      })
    }
    await getGit();
  
    return jsonData;
  })().then( githubActivity =>{
    
    const allowedGithubEvents = ['WatchEvent', 'IssueCommentEvent', 'PushEvent']
    
    const latestGithubEvent = githubActivity.find(
      event => allowedGithubEvents.indexOf(event.type) >= 0
    )
    const githubRepo = latestGithubEvent.repo.name
    var githubLabel;
  
    if (latestGithubEvent.type === 'WatchEvent') {
      githubLabel = 'started following'
    } else if (latestGithubEvent.type === 'IssueCommentEvent') {
      githubLabel = 'commented on'
    } else if (latestGithubEvent.type === 'PushEvent') {
      const commits = latestGithubEvent.payload.commits.length
      githubLabel =
        commits > 0
          ? `pushed ${commits} commit${commits > 1 ? 's' : ''} to`
          : `pushed to`
    }
  
    
    var date = new Date(latestGithubEvent.created_at);
  
    var text = 
    `{ 
    "githubLabel":"${githubLabel}", 
    "repo":"${githubRepo}",
    "date":"${date}"
    }`;
  
    var githubData = JSON.parse(text)
  
    res.render('index.ejs', {ghData:githubData});
  }).catch( ()=>{
      console.log ("didnt work");
  })
});


//Setup Server listen
app.listen(port, () => {
  console.log(`Site listening at http://localhost:${port}`);
});

