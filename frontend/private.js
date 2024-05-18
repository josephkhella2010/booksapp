
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
let wrapper=document.querySelector(".wrapper")
let sorteringRateDiv=document.querySelector(".sortering-wrapper")
let searchbarChoosenbook=document.querySelector("#search-choosenBook")
let main=document.querySelector(".wrapper .choosen-book")
let closeBtns=document.querySelectorAll(".close")
//new list
let newlist=document.querySelector(".newlist")
let sorteringSection=document.querySelector(".sortering-section")

// close function

let closeDiv=()=>{
    closeBtns.forEach((btn)=>{
    
        btn.addEventListener("click",(e)=>{
             e.target.parentElement.parentElement.parentElement.classList.remove("show")
        })
    })

}
closeDiv()
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

// show  public books
  async function showBook(){
    let response= await  getData("http://localhost:1335/api/books?populate=*")
    response.forEach((el)=>{
       let newDiv=document.createElement("div")
       newDiv.className="section"
       newDiv.innerHTML=`
       <img src="http://localhost:1335${el.attributes.img.data.attributes.url}">
                <div class="text">
                    <h3>Title: <span>${el.attributes.title}</span> </h3>
                    </h2>
                    <h3> Författare: <span> ${el.attributes.author}</span></h3>
                    <h3>Antal sidor:<span> ${el.attributes.number_of_page} sidor</span>
                    </h3>
                    <h3>Utgivningsdatum:<span> ${el.attributes.publish_date}</span></h3>
                    </div>
                    <div class="sms">

                    <button onclick="showsms(${el.id},this)">spara till favourite</button>
                    </div>
                </div>
               
       `
      
    //    btn.addEventListener("click",()=>{
    //    h3.classList.add("show")
    //     h3.innerHTML="please login frist to can add book to favourite"
    //    })
       //newDiv.append(h3,btn)

       bookList.append(newDiv)
       searchFunction(newDiv)

    })
    sorteringTwo(response)
}

//register function
let registerUser=async()=>{
   let response= await axios.post("http://localhost:1335/api/auth/local/register",{
      username:registerUsername.value,
      email:registerEmail.value,
      password:registerPassword.value,
   })
   loginContainer.classList.add("show")
   registerContainer.classList.remove("show")
}
registerBtn.addEventListener("click",registerUser)


// login function
let loginUser=async()=>{
   let response= await axios.post("http://localhost:1335/api/auth/local",{
      identifier:loginUsername.value,
      password:loginPassword.value,
   })
   console.log(response,response.data.jwt,response.data.user)
   sessionStorage.setItem("token",response.data.jwt)
   sessionStorage.setItem("user",JSON.stringify(response.data.user))
   loginContainer.classList.remove("show")
 // add current username
 let currentUserName=JSON.parse(sessionStorage.getItem("user")).username
 //name.innerHTML=`welcome ${currentUserName} ! <i class="fa-solid fa-hand"></i>`

 location.reload()
 choosenItem()


}
if(sessionStorage.getItem("user")){

    let currentUserName=JSON.parse(sessionStorage.getItem("user")).username
    name.classList.add("show")
    choosenBook.classList.add("show")
    sorteringRateDiv.classList.add("show")
    searchbarChoosenbook.classList.add("show")

    name.innerHTML=`welcome ${currentUserName} ! <i class="fa-solid fa-hand"></i> `
    logoutBtn.style.display="block";
    registerLink.style.display="none";
    loginLink.style.display="none";

   }

loginBtn.addEventListener("click",loginUser)



 // add current username



/// checked status
async function checkstatus(){
   let status;
   try {
     await axios.get("http://localhost:1335/api/users/me", {
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
 showPrivateBook()
 showChoosenBook()


}
else{
    showBook()


}
}

choosenItem()

// show private-books function
async function showPrivateBook(){


     let response=await axios.get("http://localhost:1335/api/book-privates?populate=*",{
       headers:{
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
 
       }
           })

    //console.log(response.data.data)
    
    response.data.data.forEach((el)=>{
       let newDiv=document.createElement("div")
       newDiv.className="section"
       newDiv.innerHTML=`
                 <img src="http://localhost:1335${el.attributes.img.data.map((el)=>{
                         return el.attributes.url
                    })}">
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
   
     })
     sortering(response.data.data)

     }

     // ass sms function if user is not logged in
     let h3=document.createElement("h3");
h3.id="please-login"
function showsms(id,event){
    h3.innerHTML="please login frist to can add book to favourite"
    event.parentElement.prepend(h3)
}

// add book function
     async function addToFavourite(ind){  

        choosenBook.innerHTML=""
        let user = JSON.parse(sessionStorage.getItem("user"));
     let userId = user.id.toString();
        let putResponse= await axios.put(`http://localhost:1335/api/book-privates/${ind}?populate=*`,{
           data:{
              users:userId
           }
        },{
            headers:{
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,

            }
        }
    )
    showChoosenBook()
     
     }

     async function showChoosenBook(){
        let response= await axios.get("http://localhost:1335/api/users?populate=deep,3",
            {
                headers:{
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    
                }     
        })

        let nameOfUser= JSON.parse(sessionStorage.getItem("user")).username;
   
        let filteredBook=response.data.filter((el)=>{
           // console.log(el.attributes.users)
           return el.username===nameOfUser
        })
        

        filteredBook.forEach((item)=>{
           //console.log(item)
           let books=item.book_privates

           books.forEach((el)=>{
           
             let newDiv=document.createElement("div")
        newDiv.classList.add("section")
        newDiv.innerHTML=`
                    <img src="http://localhost:1335${el.img.map((foto)=>{
                        return foto.url
                    })}">
     
                 <div class="text">
     
                     <h3>Title: <span>${el.title}</span> </h3>
                     </h2>
                     <h3> Författare: <span> ${el.author}</span></h3>
                     <h3>Antal sidor:<span> ${el.number_of_page} sidor</span>
                     </h3>
                     <h3>Utgivningsdatum:<span> ${el.publish_date}</span></h3>
                 
             </div>
             </div>
             <div class="rating-box">
             <h4>Please enter your rate for this book</h4>
             
              <div class="stars">
              <i class="fa-solid fa-star" data-rate="1"></i>
              <i class="fa-solid fa-star" data-rate="2"></i>
              <i class="fa-solid fa-star" data-rate="3"></i>
              <i class="fa-solid fa-star" data-rate="4"></i>
              <i class="fa-solid fa-star" data-rate="5"></i>
              </div>
              <p>The rate of book is: <span id="rateValue"></span></p>
              <button onclick="rateFunction(${el.id},this)">rate</button>

              </div>

                 <button onclick="deleteFunction(${el.id})">Delete</button>


        `

let ratevalues=document.querySelectorAll("#rateValue")
        choosenBook.append(newDiv)
        searchChoosenFunction(newDiv)

      resetRating(el.id,newDiv)

       
        })
        sorteringChoosenBook(books)

        sorteringRate(books)

        let stars=document.querySelectorAll(".stars")
        addRating(stars)
        })
     num.innerHTML=choosenBook.childElementCount
     showbookdiv(num,choosenBook)
         }
     
     //showChoosenBook()
    
/// delete function
let deleteFunction=async(bookId,event)=>{
    choosenBook.innerHTML=""
 let putresponse= await axios.put(`http://localhost:1335/api/book-privates/${bookId}?populate=*`,{
    data:{
       users:null
    }
 },{
     headers:{
         Authorization: `Bearer ${sessionStorage.getItem("token")}`,

     }
 }

)

 showChoosenBook()
 
 }
// logout function
logoutBtn.addEventListener("click",()=>{
    window.location = "index.html"
    name.classList.remove("show")
    bookList.classList.remove("show")
    choosenBook.classList.remove("show")
    sorteringRateDiv.classList.remove("show")
    searchbarChoosenbook.classList.remove("show")
  name.innerHTML=""
  num.innerHTML=""
    logoutBtn.style.display="none";
    registerLink.style.display="block";
    loginLink.style.display="block";
    sessionStorage.clear()
    //location.reload()
 
 })

// add ration function
function addRating(starDiv){
    
    starDiv.forEach((el)=>{
        let all=Array.from(el.children)
        all.forEach((item,index1)=>{
        item.addEventListener("click",(e)=>{
                 item.classList.add("active")
                //console.log(e.target.parentElement.nextElementSibling.children[0])
                //console.log(e.target.dataset.rate)
                localStorage.setItem("rate",e.target.dataset.rate)


         // console.log(e.target)
            e.target.parentElement.nextElementSibling.children[0].innerHTML=`${e.target.dataset.rate}`
             e.target.dataset.rate==="1"? e.target.parentElement.nextElementSibling.children[0].innerHTML=`${e.target.dataset.rate}<i class="fa-solid fa-face-sad-tear"></i>`:""    
              e.target.dataset.rate==="5"? e.target.parentElement.nextElementSibling.children[0].innerHTML=`${e.target.dataset.rate}    <i class="fa-solid fa-face-smile"></i>`:""
            all.forEach((item,index2)=>{
                index1>=index2?item.classList.add("active"):item.classList.remove("active")
            })
        })
        })
    })
}


async function rateFunction(idBook,e){
    let storageRate= localStorage.getItem("rate")
    //console.log(storageRate)
    let putResponse= await axios.put(`http://localhost:1335/api/book-privates/${idBook}?populate=*`,{
        data:{
            rateValue:storageRate,

        }
     },{
         headers:{
             Authorization: `Bearer ${sessionStorage.getItem("token")}`,

         }
     }
 )
 let Response= await axios.get(`http://localhost:1335/api/book-privates/${idBook}?populate=*`,{
headers:{
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,

}
 })

 let rateDiv=e.parentElement.children[1]
    if(Response.data.data.attributes.rateValue==="1"){
        rateDiv.children[0].classList.add("active")
       

    }
    if(Response.data.data.attributes.rateValue==="2"){
       
       rateDiv.children[0].classList.add("active")
       rateDiv.children[1].classList.add("active")
   

    }
    if(Response.data.data.attributes.rateValue==="3"){
        
        rateDiv.children[0].classList.add("active")
        rateDiv.children[1].classList.add("active")
        rateDiv.children[2].classList.add("active")

    }
    if(Response.data.data.attributes.rateValue==="4"){
        
       rateDiv.children[0].classList.add("active")
       rateDiv.children[1].classList.add("active")
       rateDiv.children[2].classList.add("active")
       rateDiv.children[3].classList.add("active")


    }
    if(Response.data.data.attributes.rateValue==="5"){
       
        rateDiv.children[0].classList.add("active")
        rateDiv.children[1].classList.add("active")
        rateDiv.children[2].classList.add("active")
        rateDiv.children[3].classList.add("active")
        rateDiv.children[4].classList.add("active")


    }
    location.reload()
}

// add ration function

async function resetRating(idBook,div){

    let Response= await axios.get(`http://localhost:1335/api/book-privates/${idBook}?populate=*`,{
        headers:{
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        
        }
        })
    
let rateDiv=div.children[2].children[1]
//console.log(rateDiv)
    if(Response.data.data.attributes.rateValue==="1"){
        rateDiv.children[0].classList.add("active")
        div.children[2].children[2].children[0].innerHTML=`${Response.data.data.attributes.rateValue}  <i class="fa-solid fa-face-sad-tear"></i>`
    }
    if(Response.data.data.attributes.rateValue==="2"){
        rateDiv.children[0].classList.add("active")
        rateDiv.children[1].classList.add("active")
        div.children[2].children[2].children[0].innerHTML=`${Response.data.data.attributes.rateValue}`

    }
    if(Response.data.data.attributes.rateValue==="3"){
        rateDiv.children[0].classList.add("active")
        rateDiv.children[1].classList.add("active")
        rateDiv.children[2].classList.add("active")
        div.children[2].children[2].children[0].innerHTML=`${Response.data.data.attributes.rateValue}`
    }
    if(Response.data.data.attributes.rateValue==="4"){
        rateDiv.children[0].classList.add("active")
        rateDiv.children[1].classList.add("active")
        rateDiv.children[2].classList.add("active")
        rateDiv.children[3].classList.add("active")
        div.children[2].children[2].children[0].innerHTML=`${Response.data.data.attributes.rateValue}`

    }
    if(Response.data.data.attributes.rateValue==="5"){
        rateDiv.children[0].classList.add("active")
        rateDiv.children[1].classList.add("active")
        rateDiv.children[2].classList.add("active")
        rateDiv.children[3].classList.add("active")
        rateDiv.children[4].classList.add("active")
        div.children[2].children[2].children[0].innerHTML=`${Response.data.data.attributes.rateValue} <i class="fa-solid fa-face-smile"></i> `

    }

}
/**/
/// ADD theme fuction to single collection
let theme=async()=>{
let response=await axios.get("http://localhost:1335/api/view?populate=deep,3")
//console.log(response.data.data.attributes.img_theme.data[0].attributes.url)
let img=response.data.data.attributes.img_theme.data[0].attributes.url
let theme=`http://localhost:1335${img}`
wrapper.style.backgroundImage=`url(${theme})`



}
theme()



function sortering(books){

let sorteringInputs=document.querySelectorAll(".sortering input")
sorteringInputs.forEach((radio)=>{
    radio.addEventListener("click",(e)=>{
        bookList.innerHTML=""
        if(e.target.value==="AZ"){
            let sortAZ = books.sort((a, b) => {
                // return a.tidestimat - b.tidestimat
                if (a.attributes.title < b.attributes.title) {
                    return -1;
                }
                if (b.attributes.title > a.attributes.title) {
                    return 1;
                }
                return 0;
            })
            let arr= createBooks(sortAZ)
            bookList.innerHTML=arr
            let bookarr=Array.from(bookList.children)
            bookarr.forEach((el)=>{
                searchFunction(el)
            })

            
          }

        

        else if(e.target.value==="ZA")
        {

            let sortZA = books.sort((a, b) => {
                bookList.innerHTML=""

                // return a.tidestimat - b.tidestimat
                if (b.attributes.title <a.attributes.title) {
                    return -1;
                }
                if (a.attributes.title > b.attributes.title) {
                    return 1;
                }
                return 0;
            })
           // console.log(sortZA)
          let arr= createBooks(sortZA)
           bookList.innerHTML=arr
           let bookarr=Array.from(bookList.children)
            bookarr.forEach((el)=>{
                searchFunction(el)
            })
        }
})

})

}
///////

///////7 FUNCTION CREATE BOOKS
function createBooks(sortedarray){

    let sectiondiv= sortedarray.map((el)=>{
         //console.log(el.attributes.users)
         return(
             `
          <div class="section">
          <img src="http://localhost:1335${el.attributes.img.data.map((el)=>{
                return el.attributes.url
              })}">
                  <div class="text">
                      <h3>Title: <span>${el.attributes.title}</span> </h3>
                      </h2>
                      <h3> Författare: <span> ${el.attributes.author}</span></h3>
                      <h3>Antal sidor:<span> ${el.attributes.number_of_page} sidor</span>
                      </h3>
                      <h3>Utgivningsdatum:<span> ${el.attributes.publish_date}</span></h3>
                  </div>
                  <button onclick="addToFavourite(${el.id})">spara till favourite</button>
         
                  </div>
                  `
         )
     })
     return sectiondiv
 }

/// sortering choosenbook
let test=document.querySelector(".test")

function sorteringChoosenBook(books){
   
    let sorteringChoosenInput=document.querySelectorAll(".sorted-title input")
//console.log(sorteringChoosenInput)
    sorteringChoosenInput.forEach((radio)=>{
        radio.addEventListener("click",(e)=>{
            choosenBook.innerHTML="";
        
            if(e.target.value==="AZ"){
                let sortAZ = books.sort((a, b) => {
        //             // return a.tidestimat - b.tidestimat
                    if (a.title < b.title) {
                        return -1;
                    }
                    if (b.title > a.title) {
                        return 1;
                    }
                    return 0;
                })

             
                sortAZ.forEach((el)=>{
                    //console.log(el.img.url)
                   let newDiv=document.createElement("div")
              newDiv.classList.add("section")
              newDiv.innerHTML=`
                          <img src="http://localhost:1335${el.img.map((foto)=>{
                              return foto.url
                          })}">
           
                       <div class="text">
           
                           <h3>Title: <span>${el.title}</span> </h3>
                           </h2>
                           <h3> Författare: <span> ${el.author}</span></h3>
                           <h3>Antal sidor:<span> ${el.number_of_page} sidor</span>
                           </h3>
                           <h3>Utgivningsdatum:<span> ${el.publish_date}</span></h3>
                       
                   </div>
                   </div>
                   <div class="rating-box">
                   <h4>Please enter your rate for this book</h4>
                   
                    <div class="stars">
                    <i class="fa-solid fa-star" data-rate="1"></i>
                    <i class="fa-solid fa-star" data-rate="2"></i>
                    <i class="fa-solid fa-star" data-rate="3"></i>
                    <i class="fa-solid fa-star" data-rate="4"></i>
                    <i class="fa-solid fa-star" data-rate="5"></i>
                    </div>
                    <p>The rate of book is: <span id="rateValue"></span></p>
                    <button onclick="rateFunction(${el.id},this)">rate</button>
      
                    </div>
                       <button onclick="deleteFunction(${el.id})">Delete</button>
      
              `
              searchChoosenFunction(newDiv)
            resetRating(el.id,newDiv)
             choosenBook.append(newDiv)
             
              })
              sorteringChoosenBook(books)

              let stars=document.querySelectorAll(".stars")
             // console.log(stars)
              addRating(stars)
      
              //(stars)
              
    
            }
            else if(e.target.value==="ZA")
            {
    
                let sortZA = books.toSorted((a, b) => {
    
                    // return a.tidestimat - b.tidestimat
                    if (b.title <a.title) {
                        return -1;
                    }
                    if (a.title > b.title) {
                        return 1;
                    }
                    return 0;
                })
               sortZA.forEach((el)=>{
                   let newDiv=document.createElement("div")
              newDiv.classList.add("section")
              newDiv.innerHTML=`
                          <img src="http://localhost:1335${el.img.map((foto)=>{
                              return foto.url
                          })}">
           
                       <div class="text">
           
                           <h3>Title: <span>${el.title}</span> </h3>
                           </h2>
                           <h3> Författare: <span> ${el.author}</span></h3>
                           <h3>Antal sidor:<span> ${el.number_of_page} sidor</span>
                           </h3>
                           <h3>Utgivningsdatum:<span> ${el.publish_date}</span></h3>
                       
                   </div>
                   </div>
                   <div class="rating-box">
                   <h4>Please enter your rate for this book</h4>
                   
                    <div class="stars">
                    <i class="fa-solid fa-star" data-rate="1"></i>
                    <i class="fa-solid fa-star" data-rate="2"></i>
                    <i class="fa-solid fa-star" data-rate="3"></i>
                    <i class="fa-solid fa-star" data-rate="4"></i>
                    <i class="fa-solid fa-star" data-rate="5"></i>
                    </div>
                    <p>The rate of book is: <span id="rateValue"></span></p>
                    <button onclick="rateFunction(${el.id},this)">rate</button>
      
                    </div>
      
                       <button onclick="deleteFunction(${el.id})">Delete</button>

              `
              searchChoosenFunction(newDiv)
            resetRating(el.id,newDiv)
            choosenBook.appendChild(newDiv)
             })
           
              sorteringChoosenBook(books)

              let stars=document.querySelectorAll(".stars")
              //console.log(stars)
              addRating(stars)
      
              //(stars)
           
            }
        
    })   
    })   
    }
    
    // filter fuction  with search for publich book 
async function searchBookList(){
    let response= await  getData("http://localhost:1335/api/books?populate=*")
 
 }
  
 function searchFunction(newdev){
     let title=newdev.children[1].children[0].children[0].innerHTML
     let author= newdev.children[1].children[1].children[0].innerHTML
        
     title=title.toLowerCase()
     author=author.toLowerCase()
 searchBar.addEventListener("keyup",()=>{
     if(title.includes(searchBar.value)||author.includes(searchBar.value)){
       newdev.style.display=""
    }
    else{
       newdev.style.display="none"
 
    }
 })
 }
 

    /// filter function with search bar for choosen user book
    function searchChoosenFunction(newdev){

    let title=newdev.children[1].children[0].children[0].innerHTML
    let author= newdev.children[1].children[1].children[0].innerHTML
    title=title.toLowerCase()
    author=author.toLowerCase()
searchbarChoosenbook.addEventListener("keyup",()=>{
    if(title.includes(searchbarChoosenbook.value)||author.includes(searchbarChoosenbook.value)){
      newdev.style.display=""
   }
   else{
      newdev.style.display="none"
   }
})
    }
    // sortering rat function
    function sorteringRate(books,rate){
        let sorteringRateInput=document.querySelectorAll(".sorted-rate input")

    sorteringRateInput.forEach((radio)=>{
radio.addEventListener("click",(e)=>{
    choosenBook.innerHTML=""

    if(e.target.value==="ascending"){
        let ascendingsort=books.sort((a,b)=>{
            return(Number(a.rateValue)-Number(b.rateValue))
        })
        ascendingsort.forEach((el)=>{
            //console.log(el.img.url)

           let newDiv=document.createElement("div")
      newDiv.classList.add("section")
      newDiv.innerHTML=`
                  <img src="http://localhost:1335${el.img.map((foto)=>{
                      return foto.url
                  })}">
   
               <div class="text">
   
                   <h3>Title: <span>${el.title}</span> </h3>
                   </h2>
                   <h3> Författare: <span> ${el.author}</span></h3>
                   <h3>Antal sidor:<span> ${el.number_of_page} sidor</span>
                   </h3>
                   <h3>Utgivningsdatum:<span> ${el.publish_date}</span></h3>
               
           </div>
           </div>
           <div class="rating-box">
           <h4>Please enter your rate for this book</h4>
           
            <div class="stars">
            <i class="fa-solid fa-star" data-rate="1"></i>
            <i class="fa-solid fa-star" data-rate="2"></i>
            <i class="fa-solid fa-star" data-rate="3"></i>
            <i class="fa-solid fa-star" data-rate="4"></i>
            <i class="fa-solid fa-star" data-rate="5"></i>
            </div>
            <p>The rate of book is: <span id="rateValue"></span></p>
            <button onclick="rateFunction(${el.id},this)">rate</button>

            </div>

               <button onclick="deleteFunction(${el.id})">Delete</button>

      `
      searchChoosenFunction(newDiv)
      choosenBook.append(newDiv)

    resetRating(el.id,newDiv)


      })
    sorteringChoosenBook(books)

      let stars=document.querySelectorAll(".stars")
      addRating(stars)
        
    }

    
    else if (e.target.value==="descending"){
        let decendingsort=books.sort((a,b)=>{
            return(Number(b.rateValue)-Number(a.rateValue))
        })
        decendingsort.forEach((el)=>{
           let newDiv=document.createElement("div")
      newDiv.classList.add("section")
      newDiv.innerHTML=`
                  <img src="http://localhost:1335${el.img.map((foto)=>{
                      return foto.url
                  })}">
   
               <div class="text">
   
                   <h3>Title: <span>${el.title}</span> </h3>
                   </h2>
                   <h3> Författare: <span> ${el.author}</span></h3>
                   <h3>Antal sidor:<span> ${el.number_of_page} sidor</span>
                   </h3>
                   <h3>Utgivningsdatum:<span> ${el.publish_date}</span></h3>
               
           </div>
           </div>
           <div class="rating-box">
           <h4>Please enter your rate for this book</h4>
           
            <div class="stars">
            <i class="fa-solid fa-star" data-rate="1"></i>
            <i class="fa-solid fa-star" data-rate="2"></i>
            <i class="fa-solid fa-star" data-rate="3"></i>
            <i class="fa-solid fa-star" data-rate="4"></i>
            <i class="fa-solid fa-star" data-rate="5"></i>
            </div>
            <p>The rate of book is: <span id="rateValue"></span></p>
            <button onclick="rateFunction(${el.id},this)">rate</button>

            </div>

               <button onclick="deleteFunction(${el.id})">Delete</button>

      `
    choosenBook.appendChild(newDiv)
      searchChoosenFunction(newDiv)
      resetRating(el.id,newDiv)

      
    })
      
      sorteringChoosenBook(books)

      let stars=document.querySelectorAll(".stars")
      addRating(stars)
        

    }
   
})
    })
}

///sorteringtwo
 function sorteringTwo(books){

    let sorteringInputs=document.querySelectorAll(".sortering input")
    sorteringInputs.forEach((radio)=>{
        radio.addEventListener("click",(e)=>{
            bookList.innerHTML=""
            if(e.target.value==="AZ"){
                let sortAZ = books.sort((a, b) => {
                    // return a.tidestimat - b.tidestimat
                    if (a.attributes.title < b.attributes.title) {
                        return -1;
                    }
                    if (b.attributes.title > a.attributes.title) {
                        return 1;
                    }
                    return 0;
                })

                let arr= createPublicSort(sortAZ)
                bookList.innerHTML=arr
                let bookarr=Array.from(bookList.children)
                 bookarr.forEach((el)=>{
                     searchFunction(el)
                 })
                
              }
    
            
    
            else if(e.target.value==="ZA")
            {
    
                let sortZA = books.sort((a, b) => {
                    bookList.innerHTML=""
    
                    // return a.tidestimat - b.tidestimat
                    if (b.attributes.title <a.attributes.title) {
                        return -1;
                    }
                    if (a.attributes.title > b.attributes.title) {
                        return 1;
                    }
                    return 0;
                })
        
    let arr= createPublicSort(sortZA)
    bookList.innerHTML=arr
    let bookarr=Array.from(bookList.children)
     bookarr.forEach((el)=>{
         searchFunction(el)
     })

            }
    })
    
    })
    
    }
    ///////
     function createPublicSort(books){
 let sectiondiv= books.map((el)=>{
       return(

            ` 
          <div class="section">
<img src="http://localhost:1335${el.attributes.img.data.attributes.url}">
<div class="text">
    <h3>Title: <span>${el.attributes.title}</span> </h3>
    </h2>
    <h3> Författare: <span> ${el.attributes.author}</span></h3>
    <h3>Antal sidor:<span> ${el.attributes.number_of_page} sidor</span>
    </h3>
    <h3>Utgivningsdatum:<span> ${el.attributes.publish_date}</span></h3>
    </div>
    <div class="sms">

    <button onclick="showsms(${el.id},this)">spara till favourite</button>
    </div>
            
          </div>
                  `
        )
    })
     return sectiondiv
 }

function showbookdiv(num,choosenBook){
if(num.innerHTML<1){
    choosenBook.classList.remove("show")
}
else{
    choosenBook.classList.add("show")
  
}
}
