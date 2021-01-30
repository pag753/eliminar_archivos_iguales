const fs = require('fs').promises
const utf8 = require('utf8');
const md5File = require('md5-file')
//let ruta = "/media/pablo/TI10716000F/Users/pa_75/Documents/MEGA/Libros/Programación/"
let ruta = "/media/pablo/TI10716000F/Users/pa_75/Documents/MEGA/Libros/"
let filesList = [];
let terminados = [];

inicia().then(function () {/*console.log("finalizado todo")*/}).catch(function (e) {console.log("Error: " + e.message)})

/*
let array = [0,1,2,3,4,5,6]
for (let i = array.length - 1; i >= 0; i --) {
    let a = array[i]
    console.log(a)
    let pop = array.pop()
    console.log(array)
}
*/

async function inicia() {
    try {
        console.log("MAPEANDO TODOS LOS ARCHIVOS")
        await abreDirectorio(ruta)
        //console.log(filesList.length)
        console.log("ELIMINANDO REPETIDOS")
        await repetidos()
        console.log("TERMINANDO")
        //await terminar()
    } catch (e) {
        throw e
    }
}

async function abreDirectorio(path = '') {
    try {
        let res = await fs.readdir(path)
        for (let i = 0; i < res.length; i ++) {
            await isAFile(path + res[i])
        }
    } catch (e) {
        throw e
    }
}

async function isAFile(directory = '') {
    try {
        const stats = await fs.stat(directory)
        if (await stats.isFile()) {
            await filesList.push({
                directory,
                size: stats.size,
                md5: await md5File(directory)
            })
        }
        else
            await abreDirectorio(directory + "/")
    } catch (e) {
        throw e
    }
}

async function repetidos() {
    try {
        for (let i = filesList.length - 1; i >= 0; i --) {
            let pop = await filesList.pop()
            await terminados.push(pop)
            await encuentra(pop)
        }
    } catch (e) {
        throw e
    }
}

async function encuentra(buscar) {
    try {
        let encontrado = filesList.findIndex(a => a.size === buscar.size && a.md5 === buscar.md5)
        let encontrado2 = filesList.find(a => a.size === buscar.size && a.md5 === buscar.md5)
        //console.log(encontrado)
        if (encontrado > -1) {
            await filesList.splice(encontrado, 1)
            //eliminarlo
            await fs.unlink(encontrado2.directory)
            await encuentra(encontrado2)
        }
    } catch (e) {
        throw e
    }
}

async function terminar() {
    try {
        for (let i = 0; i < terminados.length; i++) {
            let a = terminados[i]
            if (a) {
                //console.log(`${(a.directory)}@@@${a.size}@@@${a.md5}`)
            }

            //console.log(JSON.stringify(a))
        }
    } catch (e) {
        throw e
    }
}
