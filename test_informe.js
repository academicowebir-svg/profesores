const http = require('http');
const d = 'cedula=1400501076&password=Betoben1';

function req(opts, body) {
  return new Promise((resolve, reject) => {
    const r = http.request({ host: 'localhost', port: 3000, ...opts, headers: { ...opts.headers } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    r.on('error', reject);
    if (body) r.write(body);
    r.end();
  });
}

(async () => {
  try {
    const loginRes = await req({ method: 'POST', path: '/login', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(d) } }, d);
    const cookie = loginRes.headers['set-cookie'] ? loginRes.headers['set-cookie'][0].split(';')[0] : '';
    console.log('Login:', loginRes.status, cookie.slice(0, 30) + '...');

    const materiasRes = await req({ method: 'GET', path: '/api/informes/materias', headers: { Cookie: cookie } });
    const materias = JSON.parse(materiasRes.body);
    console.log('materias count:', materias.length);
    const g = materias.find(m => m.nombre_materia === 'Matematica' || m.nombre_materia === 'Lenguaje' || m.nombre_materia === 'Matemática');
    const target = g || materias[0];
    console.log('target:', target.nombre_materia, 'grupo_id:', target.id, 'total_estudiantes:', target.total_estudiantes);

    const informeRes = await req({ method: 'GET', path: `/api/informes/asignatura/${target.id}/trimestre/1`, headers: { Cookie: cookie } });
    const informe = JSON.parse(informeRes.body);
    if (informe.error) { console.log('ERROR:', informe.error); return; }
    console.log('--- resultados ---');
    console.log('dominan:', JSON.stringify(informe.resultados.dominan));
    console.log('alcanzan:', JSON.stringify(informe.resultados.alcanzan));
    console.log('proximos:', JSON.stringify(informe.resultados.proximos));
    console.log('noAlcanzan:', JSON.stringify(informe.resultados.noAlcanzan));
    console.log('sinExamen:', JSON.stringify(informe.resultados.sinExamen));
    console.log('sinNotas (key):', JSON.stringify(informe.resultados.sinNotas));
    console.log('estudiantes_sin_examen:', JSON.stringify(informe.estudiantes_sin_examen));
    console.log('estudiantes_sin_notas:', JSON.stringify(informe.estudiantes_sin_notas));
    console.log('total_alumnos:', informe.total_alumnos);
    console.log('tipo de resultados:', typeof informe.resultados, Object.keys(informe.resultados));
  } catch (e) {
    console.log('ERR', e.message);
  }
  process.exit(0);
})();
