const container = document.querySelector('#quillJS')
const options = {
    modules: {
        toolbar: '#toolbarJS',
    },
    placeholder: '일기를 작성하세요!',
    theme: 'snow'
}
const editor = new Quill(container, options);

let submitButton = document.querySelector('.sbm-button');
let hidden = document.querySelector('.hidden-JS');

submitButton.addEventListener('click', function (e) {
  const date = document.querySelector('.hidden-Date').value;
  const title = document.querySelector('#title').value;
  const content = editor.getContents();
  if (title && content) {
    axios({
      method: 'POST',
      url: '/diary/api',
      responseType: 'json',
      data: {
        diary_date: date,
        diary_title: title,
        diary_content: JSON.stringify(content)
      }
    }).then(function (res) {
      console.log(res);
      alert('등록되었습니다.');
      location.reload(true);
    });
  } else {
    alert('내용을 똑바로 입력해주세요.');
  }
  
  e.preventDefault();
})