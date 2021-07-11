let a = document.createElement("h1");
a.id = "KKUTULIST";
a.textContent = JSON.stringify(__PROPS.data["servers"]);
document.querySelector("body").append(a);