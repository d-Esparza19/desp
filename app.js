const e = require('express');
const express = require('express');
const app     = express();
var async = require('express-async-await');
const fetch = require('node-fetch');
var dateFormat = require('dateformat');

const port    = 3000;



app.use(express.static("public"));
app.set('view engine', 'ejs');

// Root
app.get('/', async(req, res) => {
  (async function () { // async function expression assigned to a variable
    var jsonData;
    var redditData;

    async function getGit(){
      let url = 'https://api.github.com/users/d-esparza19/events';
  
      return fetch(url).then(res => res.json()).then(response =>{
        jsonData = response;
      })
    }
    await getGit();

    async function getReddit(){
      let url = 'https://www.reddit.com/user/daesdev/.json';
  
      return fetch(url).then(res => res.json()).then(response =>{
        redditData = response;
      })
    }

    await getReddit();
    
    arrData = [jsonData, redditData];
  
    return arrData;

  })().then( arrData =>{
    
    var githubActivity = arrData[0];

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

    var date = new Date(latestGithubEvent.created_at);

    date = dateFormat(date," mmmm dS, yyyy, h:MM TTd")

    //Get Reddit data that I want to present
    var redditActivity = arrData[1];

    const allowedSubreddits = [
      'web_design',
      'webdev',
      'reactjs',
      'entrepreneur',
      'startups',
      'tech',
      'technology',
      'userexperience',
      'aws',
      'devops',
      'programming',
      'chromeos',
      'javascript',
      'cscareerquestions',
      'learnprogramming',
      'AskProgramming'
    ]

    redditActivity = arrData[1].data.children.map((item)=> item.data);

    const redditData = redditActivity.find(
      event => allowedSubreddits.indexOf(event.subreddit) >= 0,
    )
  
    res.render('index.ejs', {ghData:githubData, rData: redditData});

  }).catch( (err)=>{

    var text = 
    `{ 
    "githubLabel":"none"
    }`;
  
    var githubData = JSON.parse(text)

    var text1 =
    `{
    "link_title": "what was the most important recourses that you used through your programming journey",
    "subreddit_name_prefixed": "r/AskProgramming", 
    "link_permalink": "https://www.reddit.com/r/AskProgramming/comments/j4ywp5/what_was_the_most_important_recourses_that_you"
    }`;
  
      var redditData = JSON.parse(text1)
      
      console.log ("JS Fetch failed - catch block");
      console.log (err);

  
      res.render('index.ejs', {ghData:githubData, rData: redditData});
  })
});


//Setup Server listen
app.listen(port, () => {
  console.log(`Site listening at http://localhost:${port}`);
});

