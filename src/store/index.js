import { createStore } from "vuex";
import actions from './actions'
import mutations from './mutations'
import { createSharedMutations } from 'vuex-electron'




const getters = {
  items: state => state.items
}

console.log(actions)

export default createStore({
  strict: true,
  state: {
    items: [],
    _itemRelsCache: {
      base: {}
    }
  },
  mutations,
  actions,
  getters,
  modules: {},
  plugins: [createSharedMutations()]
});
