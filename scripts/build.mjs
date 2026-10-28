import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {Script} from 'node:vm';
import {build,transform} from 'esbuild';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFile(path.join(root,p),'utf8');
export async function generate(){
 const manifest=JSON.parse(await read('src/manifest.json'));
 if(new Set(manifest).size!==manifest.length||manifest.some(p=>!/^[a-z0-9/-]+\.js$/.test(p)||p.includes('..')))throw Error('Invalid source manifest');
 const core=await build({absWorkingDir:root,entryPoints:['src/core.js'],bundle:true,format:'iife',globalName:'URECore',write:false,target:'es2022',charset:'utf8',legalComments:'inline',minify:false});
 const source=(await Promise.all(manifest.map(p=>read('src/'+p)))).join('\n');
 // Keep the established browser-global API: unchanged Playwright tests exercise the same surface.
 const browser=await transform(source,{loader:'js',target:'es2022',charset:'utf8',legalComments:'inline',minify:false});
 const script=core.outputFiles[0].text+'\n'+browser.code;
 new Script(script);
 const template=await read('src/template.html'),css=await read('src/styles.css');
 for(const token of ['/*__STYLES__*/','/*__SCRIPT__*/'])if(template.split(token).length!==2)throw Error('Template requires one '+token);
 const html=template.replace('/*__STYLES__*/',()=>css).replace('/*__SCRIPT__*/',()=>script);
 if(/<script\b[^>]*\bsrc\s*=|<link\b[^>]*\brel=["']stylesheet/i.test(html)||/<\/script/i.test(script)||/<\/style/i.test(css))throw Error('Output must have inline assets with safe closing tags');
 return html;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const html=await generate();
 if(process.argv.includes('--check')){
  if(html!==await read('app/index.html'))throw Error('app/index.html is stale: run npm run build and commit it');
  if(html!==await generate())throw Error('Build is not deterministic');
  console.log('Committed HTML matches a deterministic offline build.');
 }else{
  await mkdir(path.join(root,'app'),{recursive:true});
  await writeFile(path.join(root,'app/index.html'),html);
  console.log('Built app/index.html ('+Buffer.byteLength(html)+' bytes), one offline HTML.');
 }
}
