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
    return content;
}


const axios = require('axios');
axios.get('https://www.plainlaundry.com')
.then((result) => {
    const data = result.data.wishers;
    const wishers = Object.keys(data);

    const wisherData = wishers.map((name) => {
        return {name: name, wish: data[name]}
    })
    
    decoratePage(wisherData);

})


function decoratePage(wisherData){

    wisherData.forEach(element => {
        
        const main = document.getElementById("mainframe");
        const newElem = document.createElement('div');
        newElem.innerHTML = element.name +": "+ element.wish;
        main.appendChild(newElem);
    });

}