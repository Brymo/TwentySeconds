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
axios.get('https://api.github.com/repos/Brymo/TwentySeconds/git/trees/5309173b8271c4def4c3458ead1a9714f8a4a4f0')
.then(
    (result) => {
        const treeData = result.data.tree;
        const enterers = treeData.map((item) => item.path);

        enterers.forEach((enterer) => {
            grabFile(enterer);
        });
    }
)
