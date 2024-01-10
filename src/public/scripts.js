const socket = io();

socket.on('conexion-establecida', (mensaje) => {
  console.log('Mensaje del servidor:', mensaje);
  
  
});

socket.on('newProduct', (data) => {
  console.log(data)
  const productsElements = document.getElementById("products");
  console.log(productsElements)
  const productElement = document.createElement('li');
  productElement.innerHTML = `${data.title} - ${data.description}`;
  productsElements.appendChild(productElement);

});

socket.on('deleteProduct', (id) => {
  console.log(id)
  const productElement = document.getElementById(id).remove();
  console.log(productElement)
  
});

document.addEventListener("DOMContentLoaded", () => {
console.log("DOMContentLoaded se ha ejecutado correctamente.");
  const detalleButtons = document.querySelectorAll(".detalle-button");
  detalleButtons.forEach((button) => {
    
    button.addEventListener("click", function (event) {
      const productId = event.currentTarget.dataset.productId;
      window.location.href = `/product/${productId}`;
    });

  }); 


  const carritoBtn = document.getElementById("carrito-compra");
  console.log(carritoBtn);
  async function obtenerIdCarrito() {
    console.log('Ejecutando obtenerIdCarrito')
    try {
      console.log("pasando1")
      const response = await fetch("/api/carts/getusercart", {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.cart; 
      } else {
        const errorData = await response.json();
        console.error('No se pudo obtener el ID del carrito:', errorData);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el ID del carrito:', error);
      return null;
    }
  }

  if (carritoBtn) {
    carritoBtn.addEventListener("click", async () => {
      try {
        const carritoId = await obtenerIdCarrito();
        if (carritoId) {
          window.location.href = `/cart/detail/${carritoId}`;
        } else {
          console.error("No se pudo obtener el ID del carrito.");
        }
      } catch (error) {
        console.error("Error al obtener el ID del carrito:", error);
      }
    });
  }

  
  const formulario = document.getElementById("messageForm");
  if(formulario){
    formulario.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const nombre = document.getElementById("nombre").value;
      const apellido = document.getElementById("apellido").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const message = document.getElementById("message").value;
      const datos = { nombre, apellido, email, password, message };
     
      try {
        const response = await fetch("/Register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos)
        });
  
        if (response.ok) {
          alert("Usuario y mensaje guardados con éxito");
          formulario.reset();
        } else {
          if(response.status === 400){
            alert("El correo ya esta registrado")
          } else {
            alert("Error al guardar el usuario y el mensaje");
          }
        }
      } catch (error) {
        console.error(error);
        alert("Error al registrarse");
      }
    });
  }
  const loginForm = document.getElementById("loginForm");
  if(loginForm){
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      if (email.trim() === "" || password.trim() === "") {
        alert("Por favor, ingresa tu email y contraseña.");
        return;
      }
      try {
  
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });
        console.log("response", response)
        if (response.ok) {
          const data = await response.json();
          const token = data.token;
          console.log(token)
          const userResponse = await fetch("/api/sessions/user", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
  
          if (userResponse.ok) {
            const userData = await userResponse.json();
            const { rol } = userData;
  
            if (rol === "admin") {
              window.location.href = "/profile"; 
            } else {
              window.location.href = "/allproducts"; 
            }
          } else {
            alert("Error al obtener información del usuario. Por favor, inténtalo de nuevo más tarde.");
          }
        } else {
          alert("Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.");
        }
      } catch (error) {
        console.error(error);
        alert("Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.");
      }
    });
  }
  
  
  

});




