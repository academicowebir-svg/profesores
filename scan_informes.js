const http = require('http');
const d = 'cedula=1400501076&password=Betoben1';

function req(opts) {
  return new Promise((resolve, reject) => {
    const r = http.request({ host: 'localhost', port: 3000, ...opts }, res => {
      let data = ''; res.on('data', c => data += c); res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    r.on('error', reject); r.end();
  });
}

(async () => {
  const loginRes = await req({ method: 'POST', path: '/login', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(d) } });
  // need to send body
  const loginRes2 = await new Promise((resolve, reject) => {
    const r = http.request({ host: 'localhost', port: 3000, path: '/login', method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(d), 'Cookie': loginRes.headers['set-cookie'] ? loginRes.headers['set-cookie'][0].split(';')[0] : '' } }, res => {
      let data=''; res.on('data',c=>data+=c); res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:data}));
    });
    r.on('error',reject); r.write(d); r.end();
  });
  const cookie = loginRes2.headers['set-cookie'] ? loginRes2.headers['set-cookie'][0].split(';')[0] : '';

  const materias = JSON.parse((await req({ method: 'GET', path: '/api/informes/materias', headers: { Cookie: cookie } })).body);
  console.log('materias:', materias.length);

  // Test trimestre 1 and 3 for each materia
  for (const m of materias) {
    for (const t of [1, 3]) {
      const path = t === 3
        ? `/api/informes/asignatura/${m.id}/trimestre/3`
        : `/api/informes/asignatura/${m.id}/trimestre/1`;
      const res = await req({ method: 'GET', path, headers: { Cookie: cookie } });
      let info = '';
      try {
        const j = JSON.parse(res.body);
        if (j.error) info = 'ERROR: ' + j.error;
        else {
          const se = j.resultados ? (j.resultados.sinExamen || j.resultados.sinNotas) : 'no-resultados';
          const names = (j.estudiantes_sin_examen || j.estudiantes_sin_notas || []).length;
          info = `sinExamen=${JSON.stringify(se)} names=${names}`;
        }
      } catch (e) { info = 'PARSE-ERROR'; }
      if (info.includes('sinExamen={\"n\":0') === false && !info.includes('names=0')) {
        console.log(`${m.nombre_materia} (${m.curso}) ${m.id} T${t}: ${info}`);
      }
    }
  }

  // Test final endpoint for one materia
  const target = materias[0];
  const finRes = await req({ method: 'GET', path: `/api/informes/final/${target.id}`, headers: { Cookie: cookie } });
  try {
    const j = JSON.parse(finRes.body);
    console.log('FINAL', target.nombre_materia, 'resultados.sinNotas:', JSON.stringify(j.resultados && j.resultados.sinNotas), 'names:', (j.estudiantes_sin_notas||[]).length);
  } catch (e) { console.log('FINAL parse error', finRes.status); }

  process.exit(0);
})();
