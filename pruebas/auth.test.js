import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Autenticación', () => {
  it('Debería iniciar sesión correctamente', async () => {
    const response = await chai
      .request(app)
      .post('/api/auth/signin')
      .send({
        correo: 'hugo@token.cl',
        contrasena: 'developer',
      });

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('token');
  });

  it('Debería devolver un error para credenciales incorrectas', async () => {
    const response = await chai
      .request(app)
      .post('/api/auth/signin')
      .send({
        correo: 'hola@gmail.com',
        contrasena: 'incorrecta',
      });

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('message').that.equals('Usuario o Contraseña Incorrecta');
  });
});