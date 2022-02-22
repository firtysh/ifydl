const subbtn = document.getElementById("submitbtn");
const advbtn = document.getElementById("advbtn");
const url = document.getElementById("url");
const form_sel = document.getElementById("format-sel");
function toggle_submit_btn() {
  subbtn.classList.toggle("disabled");
  advbtn.classList.toggle("disabled");
  if (subbtn.innerHTML == "Proceed") {
    subbtn.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
  } else {
    subbtn.innerHTML = "Proceed";
  }
}
if (window.location.pathname == "/download/youtube") {
  subbtn.onclick = function () {
    if (url.value == "") {
      alert("URL cannot be blank.");
    } else {
      toggle_submit_btn();
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/download/youtube", true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.onload = function () {
        if (this.status == 400) {
          alert("Invalid Url");
          toggle_submit_btn();
        } else if (this.status == 200) {
          toggle_submit_btn();
          const ank = document.createElement("a");
          ank.href = this.responseText;
          ank.download = "hello.mp4";
          ank.target = "_blank";
          document.body.appendChild(ank);
          ank.click();
          ank.remove();
        }
      };
      xhr.send(`url=${url.value}`);
    }
  };
  advbtn.onclick = function () {
    if (advbtn.innerHTML === "Advanced") {
      if (url.value == "") {
        alert("URL cannot be blank.");
      } else {
        subbtn.hidden = true;
        advbtn.classList.add("disabled");
        advbtn.innerHTML =
          '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/download/format", true);
        xhr.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        xhr.onload = function () {
          if (this.status == 400) {
            alert("Invalid URL");
            subbtn.hidden = false;
            advbtn.innerHTML = "Advanced";
            advbtn.classList.remove("disabled");
          } else if (this.status == 200) {
            const formats = JSON.parse(this.responseText);
            form_sel.innerHTML ="<option value=999 selected>Choose...</option>";
            for (let i = 0; i < formats.length; i++) {
              let option = document.createElement("option");
              option.text = formats[i].format;
              option.value = formats[i].itag;
              form_sel.add(option);
            }
            document.getElementById("format-dropdown").hidden = false;
            advbtn.innerHTML = "Download";
            advbtn.classList.remove("disabled");
            console.log(this.responseText);
          } else {
            alert("An error occured");
            subbtn.hidden = false;
            advbtn.innerHTML = "Advanced";
            advbtn.classList.remove("disabled");
          }
        };
        xhr.send(`url=${url.value}`);
      }
    } else {
      const frrm = document.getElementById('form');
      frrm.method = 'POST';
      frrm.action = '/download/youtube'
      frrm.submit();
    }
  };
} else if (window.location.pathname == "/download/instagram") {
  subbtn.onclick = function () {
    if (url.value == "") {
      alert("URL cannot be blank.");
    } else {
      toggle_submit_btn();
      let uri = url.value.split("?")[0];
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/download/instagram", true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.onload = function () {
        if (this.status === 400) {
          alert(this.responseText);
          toggle_submit_btn();
        } else if (this.status === 200) {
          toggle_submit_btn();
          const ank = document.createElement("a");
          ank.href = JSON.parse(this.response)[1].url;
          ank.target = "_blank";
          document.body.appendChild(ank);
          ank.click();
          ank.remove();
        }
      };
      xhr.send(`url=${uri + "?__a=1"}`);
    }
  };
  // advbtn.onclick = function () {
  //   alert("Still under development");
  // };
} else if (window.location.pathname == "/download/instadp") {
  subbtn.onclick = function () {
    if (url.value == "") {
      alert("URL cannot be blank.");
    } else {
      subbtn.classList.add("disabled");
      subbtn.innerHTML=`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/download/instadp", true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.responseType = "blob";
      xhr.onload = function () {
        if (this.status === 400) {
          alert("Ivalid URL");
          subbtn.classList.remove("disabled");
          subbtn.innerHTML= "Proceed";
          
        } else if (this.status === 200) {
          subbtn.classList.remove("disabled");
          subbtn.innerHTML= "Proceed";
          var urlCreator = window.URL || window.webkitURL;
          var imageUrl = urlCreator.createObjectURL(this.response);
          let html = `<div class="d-grid gap-2 mt-3">
          <img src="${imageUrl}" class="rounded mx-auto d-block" alt="...">
          <a href="${URL.createObjectURL(this.response)}" class="btn btn-primary" target="_blank" download="profile.jpg" >Download</a>
          </div>`
          document.getElementById('image').innerHTML = html;
        }
      };
      xhr.send(`url=${url.value + "?__a=1"}`);
    }
  };
}
