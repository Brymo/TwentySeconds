grabFile =  async (user) => {
    const Octokit = require('@octokit/rest');
    const octokit = new Octokit();
    const stuff = await octokit.repos.getContents({
      owner:"Brymo",
      repo:"TwentySeconds",
      path:`./Posts/${user}/message.txt`
    })
    const content = await Buffer.from(stuff.data.content,'Base64').toString();
    console.log(content);
    return "YO YO";
}


/*const p = new Promise((resolve,reject) => {
    const text = grabFile()
    resolve(text);
});*/

const axios = require('axios');
axios.get('https://api.github.com/repos/Brymo/TwentySeconds/git/trees/master')
.then((result) => {
    
    const objects = result.data.tree;
    const sha = objects.filter( (item) => item.path === "Posts");
    
    return sha[0].sha;

}).then((result) => {
    return axios.get(`https://api.github.com/repos/Brymo/TwentySeconds/git/trees/${result}`)
})
.then(
    (result) => {
        const treeData = result.data.tree;
        const enterers = treeData.map((item) => item.path);

        enterers.forEach((enterer) => {
            grabFile(enterer);
        });
    }
)
