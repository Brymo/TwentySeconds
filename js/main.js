grabFile =  async (index, folderName) => {
    const Octokit = require('@octokit/rest');
    const octokit = new Octokit();
    const stuff = await octokit.repos.getContents({
      owner:"Brymo",
      repo:"TwentySeconds",
      path:`./src/blogs/${folderName}/${folderName}${index}.md`
    })
    const content = await Buffer.from(stuff.data.content,'Base64').toString();
    return content;
  }