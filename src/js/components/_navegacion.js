let $menuBar = document.querySelector(".menu-bar");
let $menu = document.querySelector(".menu");
let $menuItem = document.querySelectorAll(".menu-item");

$menuBar.addEventListener("click", () => {
  $menuBar.classList.toggle("active");
  $menu.classList.toggle("active");
});

$menuItem.forEach((Item)=>{
  Item.addEventListener("click",()=>{
    $menuBar.click();
  })
})


