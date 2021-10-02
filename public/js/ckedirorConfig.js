const BaseUrl = 'http://localhost:3000'
ClassicEditor.create(document.querySelector('#editor'), {
  toolbar: [
    'heading',
    'bold',
    'italic',
    'link',
    'uploadImage',
    'undo',
    'redo',
    'numberedList',
    'bulletedList'
  ],
  ckfinder: {
    uploadUrl: `${BaseUrl}/admin/products/upload`
  }
}).catch((error) => {
  console.error(error)
})
