const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }, { 'font': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'align': [] }, { 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'color': [] }, { 'background': [] }],
    ['blockquote', 'code-block'],
    ['link', 'clean']
  ],
};

const formats = [
  'header', 'font',
  'list', 'bullet',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'align',
  'color', 'background',
  'indent',
  'code-block',
  'link'
];


export { modules, formats };