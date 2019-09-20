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
            return {name: name, wish: data[name].message, hasPic:data[name]["hasPic"]}
        })
        

        const cdnURL = "https://www.plainlaundry.com/pics/"
        let lrtoggle = true;
        wisherData.forEach(element => {
        
            const main = document.querySelector("#root");
            const newMessage = document.createElement('div');
            const newText = document.createElement("div");

            newText.innerHTML = element.wish +" - "+element.name;

            if(element.hasPic){
                const newImg = document.createElement("img");
                const imgwrap = document.createElement("div");
                imgwrap.className = "imgwrapper";
                imgwrap.appendChild(newImg);
                newImg.src =  cdnURL+element.name;

                if(lrtoggle){
                    newText.className = "msgtxtl";
                    newImg.className = "msgimgr";
                    newMessage.className = "messageframel";
                    newMessage.appendChild(imgwrap);
                    newMessage.appendChild(newText);
                }else{
                    newText.className = "msgtxtr";
                    newImg.className = "msgimgl";
                    newMessage.className = "messageframer";
                    newMessage.appendChild(newText);
                    newMessage.appendChild(imgwrap);
                }
                lrtoggle = !lrtoggle;
            }else{
                newText.className = "msgtxt";
                newMessage.className = "messageframe";
                newMessage.appendChild(newText);
            }
            //newElem.innerHTML = element.name +": "+ element.wish;
            main.appendChild(newMessage);
        });

    })
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

const mainframe = document.getElementById("mainframe");
getRequests();