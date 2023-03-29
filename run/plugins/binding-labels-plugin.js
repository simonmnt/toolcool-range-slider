import esbuild from 'esbuild';

const VERSION = '1.0.0';

const settings = {
  entryPoints: ['./src/plugins/binding-labels-plugin/index.ts'],
  bundle: true,
  sourcemap: 'external',
  minify: true,
  target: ['es6'],
  outfile: './dist/plugins/tcrs-binding-labels.min.js',
  banner: {
    js: `/* 
Tool Cool Range Slider - Binding Labels Plugin
Version: ${ VERSION }
Documentation: https://github.com/mzusin/toolcool-range-slider 
License: MIT License        
Author: Miriam Zusin                         
*/`,
  },
};

const args = process.argv.slice(2);
const watch = args.length > 1 && args[1].trim().toLowerCase() === 'watch';

if(watch){
  // ------------- watch ---------------
  settings.watch = {
    onRebuild(error, result) {

      if (error){
        // console.error(error);
      }
      else {
        console.log('Succeeded.');
      }
    },
  };
}

esbuild
  .build(settings)
  .then(result => {
    console.log(watch ? 'Watching...' : 'Done.');
  })
  .catch(() => process.exit(1));
