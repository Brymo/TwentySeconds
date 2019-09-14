grabFile =  async () => {
    const Octokit = require('@octokit/rest');
    const octokit = new Octokit();
    const stuff = await octokit.repos.getContents({
      owner:"Brymo",
      repo:"TwentySeconds",
      path:`./Posts/Bryan/message.txt`
    })
    const content = await Buffer.from(stuff.data.content,'Base64').toString();
    return content;
}


const p = new Promise((resolve,reject) => {
    const text = grabFile()
    resolve(text);
});

p.then( (result) => {
    document.write(result);
});