//Variables
const cards = document.getElementById('cards');//aki pinto templateCard
const items = document.getElementById('items');//aki pinto templateCarrito
const footer = document.getElementById('footer');//aki pinto templateFooter
const templateCard = document.getElementById('template-card').content//template
const templateFooter = document.getElementById('template-footer').content//template
const  templateCarrito = document.getElementById('template-carrito').content//template
const fragment = new DocumentFragment();
let carrito = {} //

//pintar el fecth
document.addEventListener('DOMContentLoaded', () => {
   fetchData()

   //en caso de q exista carrito en el localstorage, llenamos el objeto carrito con los datos que se encuentren ahi
   //"carrito es la key"
   if(localStorage.getItem('carrito')){
      carrito = JSON.parse(localStorage.getItem('carrito'))
      pintarCarrito() //luego lo pintamos
      //sigue en la linea 113 q es donde guardo esto
   }
})

//capturar el evento click dentro de las cards
cards.addEventListener('click', (e) => {
   addCarrito(e)
})

//voy a capturar las acciones de los botones sumar y restar (templeCarrito>items)
items.addEventListener('click', (e) => {
   btnAccion(e)
})

//conexion Api
const fetchData = async  () =>{
   try{
      const res = await fetch('api.json');
      const data = await res.json();
      //console.log(data)
      pintarCards(data)
   }catch(error){
      console.log(error)
   }
}

//pintar el template de las cards
const pintarCards = (data) => {

   data.forEach(producto => {
      //console.log(data)
      templateCard.querySelector('h5').textContent = producto.title
      templateCard.querySelector('p').textContent = producto.precio
      templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl)
      templateCard.querySelector('.btn-dark').dataset.id = producto.id
   
      //const clone = document.importNode(templateCard, true)
      const clone = templateCard.cloneNode(true)
      fragment.append(clone)
   });
   cards.appendChild(fragment)
}

//agregar elementos al carrito (el "e" viene del eventlistener de arriba)
const addCarrito = (e) => {
   //console.log(e.target)
   //console.log(e.target.classList.contains('btn-dark'))
   if(e.target.classList.contains('btn-dark')){//
      setCarrito(e.target.parentElement)//todo el elemnto q esta en el card
   }
   e.stopPropagation()
}

//empujar el objeto seleccionado al carrito
const setCarrito = (objeto) => {
   //console.log(objeto)
   //los objetos q voy a empujar
   const producto = {
      id: objeto.querySelector('.btn-dark').dataset.id,
      title: objeto.querySelector('h5').textContent,
      precio: objeto.querySelector('p').textContent,
      cantidad:1
   }

   //devuelvo un booleano si la propiedad requerida se encuentra en mi objeto carrito
   if(carrito.hasOwnProperty(producto.id)){
      producto.cantidad = carrito[producto.id].cantidad +1
   }
   carrito[producto.id] = {...producto}
   //console.log(carrito)
   pintarCarrito()
}

const pintarCarrito = () => {
   //console.log(carrito)
   //con el "object.values" estoy permitiendo que el objeto se pasado por el bucle de un array
   items.innerHTML = '';//estoy limpiando el item, de no hacer de esta forma se repetiria el array cada vez q  elijo el producto en la fila de abajo
   Object.values(carrito).forEach((productos) => {
      templateCarrito.querySelector('th').textContent = productos.id
      templateCarrito.querySelectorAll('td')[0].textContent = productos.title
      templateCarrito.querySelectorAll('td')[1].textContent = productos.cantidad
      templateCarrito.querySelector('.btn-info').dataset.id = productos.id
      templateCarrito.querySelector('.btn-danger').dataset.id = productos.id
      templateCarrito.querySelector('span').textContent = productos.cantidad * productos.precio

      const clone = document.importNode(templateCarrito, true);
      //const clone = templateCarrito.cloneNode(true)
      fragment.appendChild(clone)
   })
   items.appendChild(fragment)

   pintarFooter()

   //voy a guardar en el locl estora usando la llave "carrito" q me invente alla arriba
   localStorage.setItem('carrito', JSON.stringify(carrito))
}

//footer
const pintarFooter = () => {
   footer.innerHTML = ''  // lo limpio
   if(Object.keys(carrito).length === 0){
      footer.innerHTML = `
      <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
      `
      return //evito q siga hacia abajo
   }
   //cantidad de productos totales
   const nCantidad = Object.values(carrito).reduce((acumulador, {cantidad}) => acumulador + cantidad, 0);

   //precio total de todos los productos
   const nPrecio = Object.values(carrito).reduce((acumulador, {cantidad, precio}) => acumulador + cantidad * precio, 0)

   //pintar valores en el footer
   templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
   templateFooter.querySelector('span').textContent = nPrecio;

   const clone = templateFooter.cloneNode(true);
   fragment.appendChild(clone);
   footer.appendChild(fragment)

   //vaciar el carrito con el boton vaciar
   const btnVaciar = document.getElementById('vaciar-carrito')
   btnVaciar.addEventListener('click', () => {
      carrito = {} //lo dejo vacio
      pintarCarrito() //vuelvo a pintar mi funcion 
   })
}

const btnAccion = (e) =>{
   console.log(e.target)
   //accion aumentar
   if(e.target.classList.contains('btn-info')){//selecciono boton
      //console.log(carrito[e.target.dataset.id])
      const producto = carrito[e.target.dataset.id]//asigno constante
      //producto.cantidad = carrito[e.target.dataset.id].cantidad + 1//sumo uno
      producto.cantidad++//es lo mismo q lo de arriba, sumo uno
      carrito[e.target.dataset.id] = {...producto}//agrego al objeto
      pintarCarrito();
   }

   //accion restar
   if(e.target.classList.contains('btn-danger')){
      const producto = carrito[e.target.dataset.id]
      producto.cantidad--

      //cuando el producto llega a cero se elimina
      if(producto.cantidad === 0){
         delete  carrito[e.target.dataset.id]
      }
      pintarCarrito();
   }

   e.stopPropagation()
}




