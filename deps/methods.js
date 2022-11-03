const downloadURL = (data, fileName) => {
  const a = document.createElement('a');
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  a.style = 'display: none';
  a.click();
  a.remove();
};

const download = (file, text) => {
  const blob = new Blob([text], {
    type: 'application/octet-stream'
  });
  url = window.URL.createObjectURL(blob);
  downloadURL(url, file);
}

const checkIfFileAPISupported = () => {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    console.log("File API supported.!");
    window.FileList;
  } else {
    console.log('The File APIs are not fully supported in this browser.');
  }
}

const encryptAndDownload = async () => {
  const fileInput = document.getElementById('file');
  const filePath = fileInput.value;
  const fileName = filePath.replace(/^.*[\\\/]/, '');

  const pubKeyInput = document.getElementById('pubKey');
  const data = pubKeyInput.files[0];
  const pubKeyData = await stringPromise(data);

  const encryptedFile = await encryptFileToManyKeys(data, [pubKeyData]);
  download(`${fileName}.gpg`, encryptedFile);
  document.getElementById("file").value = "";
}

const encryptToGroupAndDownload = async () => {
  const fileInput = document.getElementById('file');
  const filePath = fileInput.value;
  const data = fileInput.files[0];
  const fileName = filePath.replace(/^.*[\\\/]/, '');

  const publicKeys = await armoredPublicKeys();

  const encryptedFile = await encryptFileToManyKeys(data, publicKeys);
  download(`${fileName}.gpg`, encryptedFile);
  document.getElementById("file").value = "";
}

const arrayPromise = (blob) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    resolve(reader.result);
  };
  reader.readAsArrayBuffer(blob);
});

const encryptFileToManyKeys = async (data, armoredPublicKeys) => {
  const arrayBufferData = await arrayPromise(data)

  const publicKeys = await Promise.all(armoredPublicKeys.map(
    armoredKey => openpgp.readKey({ armoredKey }))
  );

  const encryptedFile = await openpgp.encrypt({
    message: await openpgp.createMessage({ binary: new Uint8Array(arrayBufferData) }),
    encryptionKeys: publicKeys,
    format: 'binary'
  })

  return encryptedFile;
};

const stringPromise = (blob) => new Promise(function (resolve) {
  const reader = new FileReader();
  reader.onloadend = function () {
    resolve(reader.result);
  };
  reader.readAsText(blob);
});

