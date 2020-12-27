import { createStore } from "vuex";
import actions from './actions'
import mutations from './mutations'
import { createSharedMutations } from 'vuex-electron'


const getters = {
  allItems: state => state.items,
  topLevelItems: state => state.items.filter(i => !i.encapsuler && !i.hasParent)
}

export default createStore({
  strict: true,
  state: {
    items: []
  },
  mutations,
  actions,
  getters,
  modules: {},
  plugins: [createSharedMutations()]
});
