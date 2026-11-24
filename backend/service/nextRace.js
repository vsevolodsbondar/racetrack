function doSomething() {
    console.log('Service layer: is doing something')
    return { message: 'Something is done!' }
}

module.exports = {doSomething}
