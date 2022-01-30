let downbtn = document.getElementById("sb-btn");
let url = document.getElementById("url");
let link = "";
downbtn.onclick = function () {
  if (downbtn.innerHTML == "Proceed") {
    downbtn.classList.add("disabled");
    downbtn.innerHTML = "Please Wait...";
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "download", true);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    params = "url=" + url.value;
    xhr.onload = function () {
      if (this.status == 200) {
        console.log(this.status);
        downbtn.classList.remove("disabled");
        downbtn.innerHTML = "Download";
        link = xhr.responseText;
        console.log(xhr.responseText);
      } else {
        console.log(this.status);
        downbtn.classList.remove("disabled");
        downbtn.innerHTML = "Proceed";
        alert("Invalid Url");
      }
    };
    xhr.send(params);
  }
  if (downbtn.innerHTML == "Download") {
    let ank = document.createElement("a");
    ank.href = link;
    ank.setAttribute("target", "_blank");
    console.log("link : " + link);
    document.body.appendChild(ank);
    ank.click();
    ank.remove();
  }
};
