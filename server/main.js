const API_KEY = "d715a846-50d5-4a8a-8074-3cdedd6b9400"
const API_URL_RANDOM = `https://api.thecatapi.com/v1/images/search?limit=2`;
const API_URL_FAVORITES = `https://api.thecatapi.com/v1/favourites`;
const API_URL_FAVORITES_DELETE = 'https://api.thecatapi.com/v1/favourites/';
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

const spanError = document.getElementById("error");

//Probando axios
const api = axios.create({
    baseURL:'https://api.thecatapi.com/v1/'
});

api.defaults.headers.common['x-api-key']= API_KEY;

//Consumo de la API

// fetch(url)
//     .then(response => response.json())
//     .then(data => {
//         const img = document.querySelector('img');
//         img.src = data[0].url;
//     })

async function loadRandomImages(){
    const response = await fetch(API_URL_RANDOM);
    const jsonData = await response.json();

    //Se asigna la url a la imagen
    console.log('Random');
    console.log(jsonData);

    if (response.status !== 200){
        spanError.innerHTML = "Hay un error: " + response.status;
    }else{
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const btn1 = document.getElementById('bton1');
        const btn2 = document.getElementById('bton2');
    }
    
    img1.src = jsonData[0].url;
    img2.src = jsonData[1].url;

    //Se le asigna la funcion asíncrona para 
    //guardar la foto como fav
    bton1.onclick = () => saveFavoriteImage(jsonData[0].id);
    bton2.onclick = () => saveFavoriteImage(jsonData[1].id);
    
};

async function loadFavoriteImages(){
    const response = await fetch(API_URL_FAVORITES, {
        headers : {
            "x-api-key": API_KEY
        }
    });
    const jsonData = await response.json();

    //Se asigna la url a la imagen
    console.log('Favorites');  
    console.log(jsonData);   

    if (response.status !== 200){
        spanError.innerHTML = `Hay un error: ${response.status} ${jsonData.message}`;
    } else {
        //Llamar a la seccion creada
        const section = document.getElementById('favoriteCats');
        section.innerHTML = "";

        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Favorite images');
        
        //Create grid
        const gridContainer = document.createElement('div');
        const grid = document.createElement('div');

        h2.appendChild(h2Text);
        section.appendChild(h2);

        const urlImages = jsonData.map(item => {        
        //Crear elementos por cada imagen guardada en favoritos
        const article = document.createElement('article');
        const image = document.createElement('img');
        const button = document.createElement('button');
        const btnText = document.createTextNode('Delete');

        //Texto del botón
        button.appendChild(btnText);
        button.onclick = () => deleteFavoriteImage(item.id);

        //Url de la imagen
        image.src = item.image.url;

        //Insertar la imagen y el botón al article 
        article.appendChild(image);
        article.appendChild(button);

        //Añadir los elementos al section
        grid.appendChild(article)
        gridContainer.appendChild(grid);
        section.appendChild(gridContainer);

        //Agregar estilo al container del grid
        gridContainer.style.height = "521.8px";
        gridContainer.style.overflow = "auto";

        //Agregar estilo al grid
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "50% 50%";
        grid.style.padding = "10px";
        grid.style.rowGap = "25px";

        //Agregar flex al article
        article.style.display = "flex";
        article.style.alignItems = "center";
        article.style.justifyContent = "center";
        article.style.flexFlow = "column";

        //Agregar estilo a las imágenes
        image.style.height = "190px";
        image.style.width = "70%";
        image.style.borderRadius = "30px"

        //Agregar estilo a los botones
        button.style.border = "red 2px solid";
        button.style.color = "black";
        button.style.padding = "2px";
        button.style.width = "25%";
        button.style.textAlign = "center";
        button.style.fontSize = "15px";
        button.style.cursor = "pointer";
        button.style.borderRadius = "8px";
        button.style.marginTop = "10px";

        //Agregar estilo a h2
        h2.style.borderBottom = "1px black solid";
        return item.image.url;
    });
    }
};

async function saveFavoriteImage(id){
    const response = await fetch(API_URL_FAVORITES, {
        method: 'POST',
        headers: {
            "Content-type": "application/json",
            "x-api-key": API_KEY
        },
        body: JSON.stringify({
            image_id: id
        }),
    });

    const jsonData = await response.json();
    console.log(jsonData);
    if (response.status !== 200){
        spanError.innerHTML = `Hay un error: ${response.status} ${jsonData.message}`;
    }else{
        console.log('Save an image as favorite', response);
        loadFavoriteImages();
    }
}

async function deleteFavoriteImage(id){
    console.log(`${API_URL_FAVORITES_DELETE}${id}`);
    const response = await fetch(`${API_URL_FAVORITES_DELETE}${id}?api_key=${API_KEY}`, {
        method: 'DELETE',
        headers : {
        "x-api-key": API_KEY
        }
    });

    const jsonData = await response.json();
    console.log(jsonData);
    if (response.status !== 200){
        spanError.innerHTML = `Hay un error: ${response.status} ${jsonData.message}`;
    }else{
        console.log('Delete one favorite image', response);
        loadFavoriteImages();
    }
}

async function uploadImage(){
    const form = document.getElementById("uploadingForm");
    const formData = new FormData(form);
    console.log(formData.get('file'));

    const response = await fetch(API_URL_UPLOAD, {
        method : "POST",
        headers: {
            "x-api-key" : API_KEY
        }, 
        body : formData
    })

    const jsonData = await response.json();
    if (response.status !== 201){
        spanError.innerHTML = `Hay un error: ${response.status} ${jsonData.message}`;
    }else{
        console.log('Image uploaded');
        saveFavoriteImage(jsonData.id);
    }
}

loadRandomImages();
loadFavoriteImages();

async function axiosTest(){
    const response = api.post('favourites', {
        image_id : "alMnwcP68"
    })
    .then(response => console.log(response))
}
