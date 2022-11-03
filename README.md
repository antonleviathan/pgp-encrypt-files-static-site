# PGP Encrypt Files Static Site
This is a simple reference implementation for uploading, encrypting and downloading files, fully on the client side. The purpose is to allow safe transfer of information, especially in contexts of businesses having external parties send sensitive information to them. This project can be configured to use your PGP keys, and once the files are encrypted they can be sent safely almost virtually any channel.

The library used for pgp is [openpgp.js](https://github.com/openpgpjs/openpgpjs/), intentionally left in its readable, rather than compressed and uglified format to make verification easier. Similarly, the whole project is written in plain JavaScript, HTML and CSS to make it easier to audit.

You can also easily modify the content of the pages and add your own styling in the `style/main.css` file.

## Configuration
To start using this project, fork it, and modify the "config.js" file found in the root of the project.

The public keys you want to encrypt to should be placed in the `keyring/` directory, and the files should end with the `.asc` extension.

Within the `config.js` file, there are two constants: `groups` and `index`.

Groups refer to collections of keys that tie to a group. For example, if your customer success team has two individuals, Alice Smith and Bob Baker, you should name their keys "alice_smith.asc", and "bob_baker.asc", and place them in the `keyring/` directory.

Once you have done that, you can update the `groups` in the `config.js` file to look like this:
```
const groups = {
  sales: [
      "bob_baker",
      "alice_smith"
  ]
};
```

Having the "sales" group defined, will result in the build script creating a page "sales.html", that you will be able to visit at `yoursitedomain.com/sales.com`

The index page can also be configured similarly, so if you wanted files uploaded to the homepage to be encrypted to Alice, Bob and Joe Martens, you would add Joe's public key to the `keyring` directory, and name it `joe_martens.asc`, and your `index` value in the `config.js` file would look like this:
```
const index = [
  "bob_baker",
  "alice_smith",
  "joe_martens"
]
```

## Deployment
Once you have configured the project and added your styling, as well as modified the content to your liking, you can simply run the `build.js` script which will generate all your files and put them in the `build_` directory. The build directory is a self contained bundle of code you can easily deploy using any http hosting service, for example GitHub Pages or Netlify.
