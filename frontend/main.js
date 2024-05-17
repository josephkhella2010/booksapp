let name=document.querySelector("#name-of-user")
let choosenBook=document.querySelector(".choosen-book");
let num=document.querySelector(".num")

let bookList=document.querySelector(".book-list")
let registerLink=document.querySelector("#register-link")
let loginLink=document.querySelector("#login-link")
let registerContainer=document.querySelector(".register")
let loginContainer=document.querySelector(".login")
///
let registerUsername=document.querySelector("#register-username")
let registerEmail=document.querySelector("#register-email")
let registerPassword=document.querySelector("#register-password")
let registerBtn=document.querySelector("#register-btn")

let loginUsername=document.querySelector("#login-username")
let loginPassword=document.querySelector("#login-password")
let loginBtn=document.querySelector("#login-btn")
let logoutBtn=document.querySelector("#logout-link")
///
let searchBar=document.querySelector("#search-bar")
let searchBtn=document.querySelector("#search")


// console.log(choosenBook)
///
//show and hide login and register
registerLink.addEventListener("click",()=>{
   registerContainer.classList.add("show")
})

loginLink.addEventListener("click",()=>{

   loginContainer.classList.add("show")
})

//

 let getData=async(url)=>{
    let response=await axios.get(url)
    return response.data.data
 }
 async function showBook(){
let response= await  getData("http://localhost:1337/api/books?populate=*")
response.forEach((el)=>{
   //console.log(el.attributes.users)
   let newDiv=document.createElement("div")
   newDiv.className="section"
   newDiv.innerHTML=`
   <img src="http://localhost:1337${el.attributes.img.data.attributes.url}">
            <div class="text">
                <h3>Title: <span>${el.attributes.title}</span> </h3>
                </h2>
                <h3> Författare: <span> ${el.attributes.author}</span></h3>
                <h3>Antal sidor:<span> ${el.attributes.number_of_page} sidor</span>
                </h3>
                <h3>Utgivningsdatum:<span> ${el.attributes.publish_date}</span></h3>
            </div>
            <button onclick="addToFavourite(${el.id})">spara till favourite</button>
   
   `
   bookList.append(newDiv)
   searchFunction(newDiv)
   //console.log(el.attributes)
   // foto console.log(el.attributes.img.data.attributes.url)
})
 }
 showBook()
// add user
let registerUser=async()=>{
   let response= await axios.post("http://localhost:1337/api/auth/local/register",{
      username:registerUsername.value,
      email:registerEmail.value,
      password:registerPassword.value,
   })
   //console.log(response)
   loginContainer.classList.add("show")
   registerContainer.classList.remove("show")
}
registerBtn.addEventListener("click",registerUser)
// login function

let loginUser=async()=>{
   let response= await axios.post("http://localhost:1337/api/auth/local",{
      identifier:loginUsername.value,
      password:loginPassword.value,
   })
   console.log(response,response.data.jwt,response.data.user)
   sessionStorage.setItem("token",response.data.jwt)
   sessionStorage.setItem("user",JSON.stringify(response.data.user))
   loginContainer.classList.remove("show")
 // add current username
 let currentUserName=JSON.parse(sessionStorage.getItem("user")).username
 name.innerHTML=`welcome ${currentUserName} !`

 //location.reload()

 fun()
}
if(sessionStorage.getItem("user")){
    let currentUserName=JSON.parse(sessionStorage.getItem("user")).username
    name.innerHTML=`welcome ${currentUserName} !`
    logoutBtn.style.display="block";
    registerLink.style.display="none";
    loginLink.style.display="none";
   }

loginBtn.addEventListener("click",loginUser)



 // add current username


// search book function
async function searchBookList(){
   let response= await  getData("http://localhost:1337/api/books?populate=*")

}
 
function searchFunction(newdev){
    let title=newdev.children[1].children[0].children[0].innerHTML
    title=title.toLowerCase()
searchBar.addEventListener("keyup",()=>{
    if(title.includes(searchBar.value)){
      newdev.style.display=""
   }
   else{
      newdev.style.display="none"

   }
})
}
/// checked status
/*
async function checkstatus(){
   let status;
   try {
     await axios.get("http://localhost:1337/api/users/me", {
       headers: {
         Authorization: `Bearer ${sessionStorage.getItem("token")}`,
       },
     });
     status = true;

   } catch (error) {
     //console.log(error);
     status = false;
   } finally {

     return status;
}
}
let choosenItem=async()=>{
let loggedin= await  checkstatus()
if(loggedin){

}
}

choosenItem()


let fun=async()=>{
   let response= await axios.get("http://localhost:1337/api/users/me?populate=deep,3", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    console.log(response)
}

async function addToFavourite(ind){  
   choosenBook.innerHTML=""
   let user = JSON.parse(sessionStorage.getItem("user"));
let userId = user.id.toString();
   let putResponse= await axios.put(`http://localhost:1337/api/books/${ind}?populate=*`,{
      data:{
         users:userId
      }
   })

   showChoosenBook()



   //location.reload()

}

async function showChoosenBook(){
   let response= await axios.get("http://localhost:1337/api/users?populate=deep,3",{
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,

   })
   let nameOfUser= JSON.parse(sessionStorage.getItem("user")).username;


   
   let filteredBook=response.data.filter((el)=>{
      return el.username===nameOfUser
   })
    //console.log(filteredBook)
   filteredBook.forEach((item)=>{
     // console.log(item)
      let books=item.books
      books.forEach((el)=>{
         console.log(el.id)
         //console.log(el.img.url)
        let newDiv=document.createElement("div")
   newDiv.className="section"
   newDiv.innerHTML=`
               <img src="http://localhost:1337${el.img.url}">

            <div class="text">

                <h3>Title: <span>${el.title}</span> </h3>
                </h2>
                <h3> Författare: <span> ${el.author}</span></h3>
                <h3>Antal sidor:<span> ${el.number_of_page} sidor</span>
                </h3>
                <h3>Utgivningsdatum:<span> ${el.publish_date}</span></h3>
                <button onclick="deleteFunction(${el.id})">Delete</button>
            </div>
   
   `
   choosenBook.append(newDiv)
   
      })
   })
//console.log(choosenBook.childElementCount)
num.innerHTML=choosenBook.childElementCount
}
showChoosenBook()


/// delete function
let deleteFunction=async(bookId)=>{
   choosenBook.innerHTML=""
let putresponse= await axios.put(`http://localhost:1337/api/books/${bookId}?populate=*`,{
   data:{
      users:null,
   }
})
showChoosenBook()

}

 //logout function

 logoutBtn.addEventListener("click",()=>{
   choosenBook.innerHTML=""
   num.innerHTML=""
   name.innerHTML=""
   logoutBtn.style.display="none";
   registerLink.style.display="block";
   loginLink.style.display="block";
   sessionStorage.clear()
   showChoosenBook()

})
*/

//logout function

logoutBtn.addEventListener("click",()=>{
  
   logoutBtn.style.display="none";
   registerLink.style.display="block";
   loginLink.style.display="block";
   sessionStorage.clear()
   //showChoosenBook()

})




////
let getUser=async()=>{
   let response=await axios.get("http://localhost:1337/api/api/book-privates?populate=deep,3",{
      headers:{
         Authorization: `Bearer ${sessionStorage.getItem("token")}`,

      }
   })
   console.log(response)
}
getUser()