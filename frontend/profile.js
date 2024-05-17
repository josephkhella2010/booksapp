/*

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








//  function to add book to user 
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
             <div class="text">
             <img src="http://localhost:1337${el.img.url}">
 
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
    logoutBtn.style.display="none"
    sessionStorage.clear()
    showChoosenBook()
 
 })
 */
///html
<!--  -->
<div class="rating-wrapper">
    <div data-productid="12" class="ratings">
        <span data-rating="5">&#9733</span>
        <span data-rating="4">&#9733</span>
        <span data-rating="3">&#9733</span>
        <span data-rating="2">&#9733</span>
        <span data-rating="1">&#9733</span>

    </div>
</div>
<div class="rating-wrapper">
    <div data-productid="22" class="ratings">
        <span data-rating="5">&#9733</span>
        <span data-rating="4">&#9733</span>
        <span data-rating="3">&#9733</span>
        <span data-rating="2">&#9733</span>
        <span data-rating="1">&#9733</span>

    </div>
</div>
<!--  -->
// css

/* another rating */

.rating-wrapper {
   border: 2px solid #555;
   display: inline-block;
   margin-bottom: 20px;
   padding: 0 10px;
   width: 100px;
}

.ratings {
   display: flex;
   flex-direction: row-reverse;
}

.ratings span {
   cursor: pointer;
   transition: color 0.2 ease;
   -webkit-transition: color 0.2 ease;
   -moz-transition: color 0.2 ease;
   -ms-transition: color 0.2 ease;
   -o-transition: color 0.2 ease;
}

.ratings span:hover {
   color: gold;
   transform: scale(1.3);
   -webkit-transform: scale(1.3);
   -moz-transform: scale(1.3);
   -ms-transform: scale(1.3);
   -o-transform: scale(1.3);
}

.ratings span:hover~span {
   color: orange
}

.ratings span[data-clicked] {
   color: orange
}

.ratings span[data-clicked]~span {
   color: orange
}


/*  */
// js











let stars=document.querySelectorAll(".ratings span")
let products=document.querySelectorAll(".ratings")
let ratings=[]
for(let star of stars){
   star.addEventListener("click",function(){
      let children= star.parentElement.children
      console.log(children)
      for(let child of children){
      if(child.getAttribute("data-clicked")){
         return false
      }

   }



      this.setAttribute("data-clicked","true")
      let rating=this.dataset.rating;
      let productId=this.parentElement.dataset.productId;
      let data={
         star:rating,
         "product-id":productId
      }
      ratings.push(data)
      localStorage.setItem("rating",JSON.stringify(ratings))
   })
}


if(localStorage.getItem("rating")){
   ratings=JSON.parse(localStorage.getItem("rating"))
   for(let rating of ratings){
      console.log(rating)
      for(let product of products){
         if(rating["product-id"]===product.dataset.productId){
            let reversedStar=Array.from(product.children).reverse()
            let index=parseInt(rating["star"])-1
            console.log(reversedStar[index])
            reversedStar[index].setAttribute("data-clicked","true")
         }
      }
   }
}



// let addfoto=document.querySelector(".add-foto")
// addfoto.addEventListener("click",()=>{
//     let imageFiles = document.querySelector("#fileInput").files
//       let fotoData = new FormData();
//       fotoData.append("files", imageFiles[0]);
//       axios.post("http://localhost:1337/api/upload", fotoData).then((response) => {
//     axios.post("http://localhost:1337/api/view",
//       {
//         data: {
//             img_theme: response.data[0].id,
//           // completed:false <--- Behövs inte, pga default-värde i Strapi
//         },
//       }
//       ,
//       {
//         headers: {
//           Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//         },
//       }
      
//     );
//   });
      

// })

// let imageFiles = document.querySelector("#fileInput").files;
//   let formData = new FormData();
//   formData.append("files", imageFiles[0]);

//   axios.post("http://localhost:1337/api/upload", formData).then((response) => {
//     axios.post(
//       "http://localhost:1337/api/todos",
//       {
//         data: {
//           title: todoTitle,
//           user: userId,
//           img: response.data[0].id,
//           // completed:false <--- Behövs inte, pga default-värde i Strapi
//         },
//       },