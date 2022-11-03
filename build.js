const fs = require('fs');
const { groups, indexKeys } = require('./config')

const buildGroupPublicKeyBlocks = () => {
  const groupPublicKeyBlocks = {}
  const _groups = Object.keys(groups)

  _groups.forEach(group => {
    const groupMembers = groups[group];
    let groupKeysBlock = '';
    groupMembers.forEach(member => {
      const file = readFile(`./keyring/${member}.asc`)
      groupKeysBlock = groupKeysBlock + file + "\n"
    })
    groupPublicKeyBlocks[group] = groupKeysBlock
  })

  return groupPublicKeyBlocks;
}


const copyFile = (src, destination) => {
  fs.copyFile(src, destination, (err) => {
    if (err) {
      console.log("build.js:copyFile failed with error: ", err);
    }
    else {

    }
  });
}

const readFile = filePath => {
  const data = fs.readFileSync(filePath, 'utf8')
  return data;
}

const buildKeyBlockMethod = (keys) => {
  const openingMethodLines = `
        const armoredPublicKeys = async () => {
            const keys = [
    `

  const closingMethodLines = `
        ]
        return keys;
        }
    `

  const keyBlockMethod = openingMethodLines + "`" + keys + "`" + closingMethodLines;
  return keyBlockMethod;
}

const buildPageWithKeyBlock = (keys, pageName, templatePath = "./src/template.html") => {
  const fileName = `${pageName}.html`
  const keyBlockMethod = buildKeyBlockMethod(keys)
  console.log('kbm', keyBlockMethod)
  const templateFile = readFile(templatePath);
  const groupFile = templateFile + "\n" + "<script>" + "\n" + keyBlockMethod + "\n" + "</script>" + "\n"
  fs.writeFile(`./_build/${fileName}`, groupFile, (err) => {
    if (err)
      console.log("build.js:buildPageWithKeyBlock failed with error:", err);
    else {
      console.log("build.js:buildPageWithKeyBlock successfully wrote file: ", fileName)
    }
  });
}

const buildGroupFiles = () => {
  const groupPublicKeyBlocks = buildGroupPublicKeyBlocks()
  const _groups = Object.keys(groups)
  _groups.forEach(group => {
    const keys = groupPublicKeyBlocks[group];
    buildPageWithKeyBlock(keys, group)
  })
}

const buildScriptTagWithKeys = () => {
  // Build group pages by concatenating the template.html contents with
  // the key block of all keys that should be encrypted to on that page
  buildGroupFiles()

  // Build index page by concatenating the index.html contents with
  // the key block of keys defined in the config.js, under the index value
  let indexKeyBlock = ''
  indexKeys.forEach(key => {
    const file = readFile(`./keyring/${key}.asc`)
    indexKeyBlock = indexKeyBlock + file + "\n"
  })
  buildPageWithKeyBlock(indexKeyBlock, 'index')

  // Copy all dependencies and additional files that are required
  // by the build as well as the "individual.html"
  copyFile('./src/individual.html', './_build/individual.html')
  copyFile('./src/index.html', './_build/index.html')
  copyFile('./style/main.css', './_build/main.css')
  copyFile('./deps/methods.js', './_build/methods.js')
  copyFile('./deps/openpgp.js', './_build/openpgp.js')
}

const build = () => {
  fs.mkdir('./_build', { recursive: true }, (err) => {
    if (err) console.log('build.js:build failed with error: ', err)
  })

  buildGroupPublicKeyBlocks()
  buildScriptTagWithKeys()
}

build();
