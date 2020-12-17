

```bash
vue create magenda (vue3, router, vuex, eslint+prettier)
vue add element-plus (global import) - it will generate an error in the main.js, but we will replace it with the magenda version the plugins/element.js file can be deleted since it is not used
vue add electorn-builder

cd node_moduels/electron
node install.js
npm rebuild node-sass

```

Since VUEJS_DEVTOOLS does not support Vue3 yet, we need to install the beta version. In background.js replace

```
await installExtension(VUEJS_DEVTOOLS)
```
with
```
await installExtension({
  id: 'ljjemllljcmogpfapbkkighbhhppjdbg',
  electron: '>=1.2.1'
});
```
see here https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/776

Set the theme to Light in devtools if at the first launch the app background is dark
