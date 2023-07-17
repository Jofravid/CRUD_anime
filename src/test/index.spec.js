import app from "../index.js";
import anime from '../anime.json' assert { type: 'json'}
import chaiHttp from "chai-http";
import chai, {expect} from "chai";

chai.use(chaiHttp)

describe('GET /', ()=>{
    it('debería retornar status 200', async ()=>{
        const respuesta = await chai.request(app).get('/').send()
        expect(respuesta.statusCode).to.equal(200)
    })
    it('debería retornar el archivo', async ()=>{
        const respuesta = await chai.request(app).get('/').send()
        expect(respuesta.body).to.deep.equal(anime)
    })
})