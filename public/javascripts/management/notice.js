const insert = document.querySelector('#write_notice-js');
const remove = document.querySelector('#delete_notice-js');
const checkbox_head = document.querySelector('#head-checkbox-JS');
const checkbox_element = document.querySelectorAll('#checkbox-JS');

const logout = document.querySelector('#logout-js');
insert.addEventListener('click', function () {
    window.location.href = '/admin/write-notice';
})
logout.addEventListener('click', function () {
    window.location.href = '/admin/logout';
})
checkbox_head.addEventListener('click', function () {
    // 체크박스 헤드의 상태가 true면 false 
    // 체크박스 헤드가 상태가 false면 true
    if (checkbox_head.checked) {
        for (let i = 0; i < checkbox_element.length; i++) {
            checkbox_element[i].checked = true;
        }
    }
    else {
        for (let i = 0; i < checkbox_element.length; i++) {
            checkbox_element[i].checked = false;
        }
    }
})
