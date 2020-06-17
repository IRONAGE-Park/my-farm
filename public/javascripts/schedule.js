const container = document.querySelector('#quillJS')
const options = {
    modules: {
        toolbar: '#toolbarJS',
    },
    placeholder: '일기를 작성하세요!',
    theme: 'snow'
}
const editor = new Quill(container, options);


let submitButton = document.querySelector('.sbm-button')
let hidden = document.querySelector('.hidden-JS')

submitButton.addEventListener('click', function (e) {
  var data = editor.getContents();
  hidden.value = JSON.stringify(editor.getContents());
  var date = document.querySelector('.hidden-Date').value
  example[date] = {
    title: document.querySelector('#title').value,
    content: hidden.value
  };
  loadYYMM(init.today);
  e.preventDefault();
})