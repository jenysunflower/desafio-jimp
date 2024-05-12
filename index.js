const express =  require('express')
const app = express()
const exphbs = require('express-handlebars')
const Jimp = require('jimp')
const {v4:uuidv4} = require('uuid')
const port = 3000

app.use('/public', express.static(__dirname + '/public'))
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css'))

app.set('view engine', 'handlebars')
const handlebars = exphbs.create({
    defaultLayout: __dirname + '/views/layout/main.handlebars',
    layoutsDir: __dirname + '/views',
    partialsDir: __dirname + '/views'
})
app.engine('handlebars', handlebars.engine)


//creamos rutas
app.get("/", (req, res) => {
        res.render('home')
})

app.get('/subir', async (req, res) => {
    const { imagen } = req.query;

    // Validación de los formatos recibidos
    const formatosPermitidos = ['jpeg', 'jpg', 'png'];
    const extension = imagen.split('.').pop().toLowerCase(); 

    if (!formatosPermitidos.includes(extension)) {
        //window.history.back() para volver a la página anterior
        return res.status(400).send('<script>alert("Formato de imagen inválido. Solo se permiten JPEG, JPG y PNG."); window.history.back();</script>');
    }

    const nombreImg = `${uuidv4().slice(30)}.jpeg`;
    try {
        const img = await Jimp.read(imagen);
        await img
            .resize(350, Jimp.AUTO)
            .grayscale()
            .writeAsync(__dirname + '/public/img/' + nombreImg);

        res.sendFile(__dirname + '/public/img/' + nombreImg);
    } catch (err) {
        console.error("Error al procesar la imagen:", err);
        res.status(500).send('<script>alert("Error al procesar la imagen."); window.history.back();</script>');
    }
});

//levantamos puertos
app.listen(port, () => {
    console.log ('El puerto está arriba')
})


