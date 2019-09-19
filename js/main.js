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


function getRequests(){
    const axios = require('axios');
    axios.get('https://www.plainlaundry.com')
    .then((result) => {
        const data = result.data.wishers;
        const wishers = Object.keys(data);

        const wisherData = wishers.map((name) => {
            return {name: name, wish: data[name]}
        })
        
        const maxImages = 10;
        const cdnURL = "https://d3ccubkld17jql.cloudfront.net/"
        let lrtoggle = true;
        let imgCount = 0;
        wisherData.forEach(element => {
        
            const main = document.querySelector("#root");
            const newMessage = document.createElement('div');
            const newText = document.createElement("div");

            newText.innerHTML = element.wish +" - "+element.name;

            const newImg = document.createElement("img");

            newImg.src =  cdnURL+((imgCount++ % maxImages)+1);

            if(lrtoggle){
                newText.className = "msgtxtl";
                newImg.className = "msgimgr";
                newMessage.className = "messageframel";
                newMessage.appendChild(newImg);
                newMessage.appendChild(newText);
            }else{
                newText.className = "msgtxtr";
                newImg.className = "msgimgl";
                newMessage.className = "messageframer";
                newMessage.appendChild(newText);
                newMessage.appendChild(newImg);
            }
            lrtoggle = !lrtoggle;

            //newElem.innerHTML = element.name +": "+ element.wish;
            main.appendChild(newMessage);
        });

    })
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

const mainframe = document.getElementById("mainframe");
mainframe.style.height = window.innerHeight + "px";
getRequests();