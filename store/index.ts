import { GetterTree, ActionTree, MutationTree } from 'vuex'

export const state = () => ({
  notification: {
    show: false,
    text: '',
  },
})
export type RootState = ReturnType<typeof state>
export const mutations: MutationTree<RootState> = {
  SET_NOTIFICATION(state, payload) {
    state.notification.show = payload.show
    state.notification.text = payload.text
  },
}

export const getters: GetterTree<RootState, RootState> = {
  notification: (state) => state.notification,
}
