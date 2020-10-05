var async = require('express-async-await');
const fetch = require('node-fetch');


(async function getdata() { // async function expression assigned to a variable
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

    arrData = [jsonData, redditData];
  
    return arrData;
  })().then(  arrData =>{
    githubActivity = arrData[0];

    // Get github data that I want to present
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

    //Get Reddit data that I want to present
    redditActivity;

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
      'askprogramming'
    ]

    redditActivity = arrData[1].data.children.map((item)=> item.data);
  
    const latestRedditComment = redditActivity.find(
      event => allowedSubreddits.indexOf(event.subreddit) >= 0,
    )
  
    var text = 
    `{ 
    "githubLabel":"${githubLabel}", 
    "repo":"${githubRepo}",
    "date":"${date}"
    }`;
  
    var githubData = JSON.parse(text)
  
    var jsonBundle = [githubData, latestRedditComment]

    return  jsonBundle;
  }).catch( ()=>{

  var text =
  `{ 
  "githubLabel":"Developing on ", 
  "repo":"d-Esparza19/desp",
  "date": 2
  }`;

    var githubData = JSON.parse(text)

    var text1 =
  `{ 
  "subreddit_name_prefixed":"r/AskProgramming", 
  "repo":"https://www.reddit.com/r/AskProgramming/comments/j4ywp5/what_was_the_most_important_recourses_that_you",
  }`;

    var redditData = JSON.parse(text1)

    var jsonBundle = [githubData, redditData]
    
    console.log ("JS Fetch failed - catch block");

    return  jsonBundle
    
  })

module.exports.getdata = getdata;