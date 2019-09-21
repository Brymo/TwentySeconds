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

        let count = 0;
        wisherData.forEach(element => {
        
            const main = document.querySelector("#root");
            const newMessage = document.createElement('div');
            const newText = document.createElement("div");

            newText.innerHTML = element.wish;
            const colors = ["#D4C685","#FFD700","#FFA630","#D7E8BA","#4DA1A9"];

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
            const bgcol = colors[++count % colors.length];
            newMessage.style.backgroundColor = bgcol;
            newMessage.style.color = LightenDarkenColor(bgcol, -200);


            const wishLabel = document.createElement("div");
            wishLabel.className = "label";
            wishLabel.innerHTML = element.name;
            wishLabel.style.color = LightenDarkenColor(bgcol, 100);

            newMessage.appendChild(wishLabel);
            //newElem.innerHTML = element.name +": "+ element.wish;
            main.appendChild(newMessage);
            
        });

    })
}

function LightenDarkenColor(col, amt) {
  
    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

const mainframe = document.getElementById("mainframe");
getRequests();