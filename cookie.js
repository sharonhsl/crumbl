async function initPopupWindow() {
    chrome.cookies.getAll({}, (cookies) => {
        console.log(cookies.length);
        let jar = document.getElementById("jar");
        jar.innerText = cookies.length ;
    });

};

document.addEventListener('DOMContentLoaded', function () {
    initPopupWindow();
});
  