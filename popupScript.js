let savedStore = JSON.parse(localStorage.getItem("saved-lists")) || []  //check if localStorage have already savcd lists and convert it to usable Object using JSON.parse.  Else if empty then manually assign empty array []

const inputEle = document.querySelector('#inputBox input');
const saveInputBtn = document.getElementById('saveInputBtn');
const saveTabBtn = document.getElementById('saveTabBtn');
const clearBtn = document.getElementById('clearBtn');
const savedTextEle = document.querySelector('#savedText ul');
const copyAllBtn = document.getElementById('copyAllBtn');

function renderSavedText(){
    savedTextEle.innerHTML = ""; // clear old content first
    for(let i=0; i<savedStore.length; i++){ //render latest lists
        savedTextEle.innerHTML += `<li><a href="${savedStore[i]}" target="_blank">${savedStore[i]}</a></li>`
    }
}

//Save Input button Event listener
saveInputBtn.addEventListener("click", function(){
    const inputValue = inputEle.value; //get entered text
    if(inputValue){ 
        savedStore.push(inputValue);      //push the entered text in store array
        localStorage.setItem("saved-lists", JSON.stringify(savedStore)); //convert savedStore array to String and store in localStorage called "saved-lists"
        inputEle.value = '' ;            //clear input field
    }
    renderSavedText(); //render latest lists in UI
})

//Save Tab Url button Event listener
saveTabBtn.addEventListener("click", async function(){
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});  // we use cosnt [tab] instead of const tab to destruct the array directly so that we get the first object directly and can access tab.url directly instead of tab[0].url 
    //console.log(tab.url);
    savedStore.push(tab.url);
    localStorage.setItem("saved-lists", JSON.stringify(savedStore));
    renderSavedText(); 
})

//Clear button Event listener
clearBtn.addEventListener("click", function(){
    savedStore = [];     //clear savedStore array
    localStorage.clear(); //clear localStorage       //or use localStorage.removeItem("saved-lists") to avoid clearing the whole localStorage which is safer
    inputEle.value = '' ;  //clear input field (optinal)
    renderSavedText();
})

//Copy All button Event listener
copyAllBtn.addEventListener("click", function(){
    if(savedStore.length === 0){
        alert("Nothing to copy! 😵‍💫")
    }
    else{
        const allLinks = savedStore.join("\n"); //join all saved urls with new lines between each 

        // navigator.clipboard.writeText() API to copy and using .then instead of using async/await and try catch (same but lesser/easier way)
        navigator.clipboard.writeText(allLinks).then(() => {
            alert("All links copied to clipboard! 😺");
        }).catch(err => {
            console.error("Failed to copy: ", err);
            alert("Failed to copy links! 😿");
        });
    }
})


//Render any saved content on startup
renderSavedText(); 

