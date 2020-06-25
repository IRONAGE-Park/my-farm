var container = document.querySelector('#quillJS')
var Font = Quill.import('formats/font')
Font.whitelist = ['KoPubWorld돋음체', 'KoPubWorld바탕체']
Quill.register(Font, true)
var options = {
    modules: {
        toolbar: '#toolbarJS',
    },
    placeholder: '공지사항을 입력해주세요.',
    theme: 'snow'
}
var editor = new Quill(container, options);

let submitButton = document.querySelector('.sbm-button')
let hidden = document.querySelector('.hidden-JS')

submitButton.addEventListener('click', function () {
    var data = editor.getContents();
    hidden.value = JSON.stringify(editor.getContents());
})