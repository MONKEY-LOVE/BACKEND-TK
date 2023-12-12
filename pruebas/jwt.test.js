import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../app.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Autenticación', () => {
  let token;

  before(() => {
    // Genera un token JWT válido antes de ejecutar las pruebas
    const payload = {
      correo: 'hugo@token.cl',
      contrasena: 'developer',
    };
    token = jwt.sign(payload, 'misecreto');
  });

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

it('Debería permitir el acceso con un token válido', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXN1YXJpbyI6Ikh1Z28iLCJpYXQiOjE3MDE2NTc1NTEsImV4cCI6MTcwMTc0Mzk1MX0.U7sJpzf_0aFx2oolB8d8mxvVsQUYhsCHMAHsIZBNW14'; // Reemplaza 'tu_token_en_crudo' con el valor real del token
    const response = await chai
        .request(app)
        .get('/api/auth/verify/')
        .set('Authorization', `Bearer ${token}`);

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('message').that.equals('Acceso permitido');
});

  it('No debería permitir el acceso sin un token', async () => {
    const response = await chai
      .request(app)
      .get('/api/auth/verify');

    expect(response).to.have.status(401);
    expect(response.body).to.have.property('message').that.equals('Acceso no autorizado');
  });
});