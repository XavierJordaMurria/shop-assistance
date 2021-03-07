const deleteProduct = (btn) => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value;
    const productElement = btn.closest('article');

    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrfToken
        }
    })
    .then(r => r.json())
    .then(data => {
        console.log(data)
        productElement.parentNode.removeChild(productElement)
    }) 
    .catch( e => console.error(e))

}; 