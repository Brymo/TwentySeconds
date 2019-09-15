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
axios.get('https://api.github.com/repos/Brymo/TwentySeconds/git/trees/02e3aa84e08c43c5ae0a1942ca161bbf782b919f')
.then(
    (result) => {
        const treeData = result.data.tree;
        const enterers = treeData.map((item) => item.path);

        enterers.forEach((enterer) => {
            grabFile(enterer);
        });
    }
)
