import axios from "axios";

export default ({
    namespaced: true,
    state: {
        token: '',
        loginState: '',
        userState: {
            id: 0,
            ism: '',
            familiya: '',
            kasblar_id: 0,
            login: '',
            token: ''
        }
    },
    getters: {
        userGetter (state) {
            return state.userState
        },
        tokenGetter (state) {
            return state.token
        },
        loginStateGetter (state) {
            return state.loginState
        }
    },
    mutations: {
        SET_USER (state, data) {
            state.userState = data
        },
        SET_TOKEN (state, token) {
            state.token = token
        },
        SET_LOGIN_STATE (state, login) {
            state.loginState = login
        }
    },
    actions: {
        async signIn ({ dispatch, commit }, credentials) {
            const cfg = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            try {
                let result = await axios.post('login', credentials, cfg);
                if (result.data.msg === '404 - user not found') {
                    throw new Error('404 - user not found');
                }
                commit('SET_LOGIN_STATE', credentials.login); // Save login state
                return dispatch('attempt', result.data.token);
            } catch (error) {
                // Handle error
                throw error; // Rethrow the error to be caught by the calling code
            }
        },

        async attempt ({ commit, state }, token) {
            if (token) {
                commit('SET_TOKEN', token);
            }
            if (!state.token) {
                return
            }
            try {
                let result = await axios.get(`https://zoyirbek.pro/api/odamlar.php?login=${state.loginState}&token=${state.token}`);
                commit('SET_USER', result.data.data);
            } catch (e) {
                commit('SET_TOKEN', '')
                commit('SET_USER', {
                    id: 0,
                    ism: '',
                    familiya: '',
                    kasblar_id: 0,
                    login: '',
                    token: ''
                })
            }
        },

        signOut ({ commit }) {
            commit('SET_TOKEN', '')
            commit('SET_USER', {
                id: 0,
                ism: '',
                familiya: '',
                kasblar_id: 0,
                login: '',
                token: ''
            })
            localStorage.clear()
        }
    }
})
